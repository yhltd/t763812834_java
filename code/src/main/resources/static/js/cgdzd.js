var idd;
var currentPage = 1;
var pageSize = 20;
var totalCount = 0;
var totalPages = 0;
var currentId = '';

// 页面加载完成后初始化
$(document).ready(function() {
    console.log('页面加载完成，初始化订单明细页面...');
    addTableStyles();
    initDdmxPage();
    initToolbarEvents();
    initDetailModalEvents();

    // 设置默认日期并获取数据
    setDefaultDateRange();
    getList(currentPage, pageSize, {});
});

function initDdmxPage() {
    console.log('初始化订单明细页面...');

    // 绑定搜索事件
    $('#select-btn').off('click').on('click', function() {
        searchDdmx();
    });

    // 绑定重置事件
    $('#reset-btn').off('click').on('click', function() {
        resetSearch();
    });

    // 绑定搜索输入框回车事件
    $('#ddh, #khmc, #fzr').off('keypress').on('keypress', function(e) {
        if (e.which === 13) {
            searchDdmx();
        }
    });

    // 设置默认日期范围（最近30天）
    setDefaultDateRange();
}

// 设置默认日期范围
function setDefaultDateRange() {
    // 清空日期输入框
    $('#startDate').val('');
    $('#endDate').val('');
}

// 格式化日期为 YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


// 根据订单号获取详细信息
function getDetailData(ddh) {
    if (!ddh) {
        console.error('订单号为空');
        return;
    }

    showDetailLoading();

    // 调用获取详细信息的接口，同时传递ddh和ddrq
    $ajax({
        type: 'post',
        url: '/cgdzd/getDetailByDdh',
        contentType: 'application/json',
        data: JSON.stringify({
            ddh: ddh,
        }),
        dataType: 'json'
    }, false, '', function (res) {
        hideDetailLoading();
        if (res.code === 200) {
            console.log("返回的详细信息", res);
            generateDetailForm(res.data);
        } else {
            console.error("获取详情失败:", res.message);
            $('#detailFormContainer').html(`
                <div class="alert alert-warning">
                    获取详细信息失败: ${res.message || '未知错误'}
                </div>
            `);
        }
    });
}

// 生成详细信息表单 - 修改后的函数
function generateDetailForm(data) {
    var formHtml = '';

    if (data && data.length > 0) {
        console.log('=== 调试信息 ===');
        console.log('当前行号: 105');
        console.log('data对象:', data);
        console.log('data.pp值:', data[0].pp);
        console.log('data.pp类型:', typeof data[0].pp);
        console.log('data是否存在:', !!data);
        console.log('=== 调试结束 ===');

        // 方法1: 先尝试JSON标准化
        const normalizedData = JSON.parse(JSON.stringify(data[0]));
        console.log('标准化后的数据:', normalizedData);

        // 安全地分割字符串为数组 - 添加空值检查
        var ppArray = normalizedData.pp ? normalizedData.pp.split(',') : [];
        var cpxhArray = normalizedData.cpxh ? normalizedData.cpxh.split(',') : [];
        var slArray = normalizedData.sl ? normalizedData.sl.split(',') : [];
        var djArray = normalizedData.dj ? normalizedData.dj.split(',') : [];
        var bzArray = normalizedData.bz ? normalizedData.bz.split(',') : [];

        console.log('分割后的数组:', {
            pp: ppArray,
            cpxh: cpxhArray,
            sl: slArray,
            dj: djArray,
            bz: bzArray
        });

        // 确保所有数组长度一致
        var maxLength = Math.max(
            ppArray.length,
            cpxhArray.length,
            slArray.length,
            djArray.length,
            bzArray.length
        );

        // 如果没有数据，显示提示
        if (maxLength === 0) {
            formHtml = '<p class="text-muted">暂无产品详细信息</p>';
            $('#detailFormContainer').html(formHtml);
            return;
        }

        formHtml = `
            <div class="table-responsive">
                <table class="table table-bordered table-striped detail-table">
                    <thead>
                        <tr>
                            <th width="60">序号</th>
                            <th width="150">产品名称</th>
                            <th width="120">产品型号</th>
                            <th width="100">订购数量</th>
                            <th width="100">单价</th>
                            <th width="100">小计</th>
                            <th>备注</th>
                        </tr>
                    </thead>
                    <tbody>`;

        var totalAmount = 0;

        for (var i = 0; i < maxLength; i++) {
            // 安全地获取每个值，提供默认值
            var pp = ppArray[i] || '';
            var cpxh = cpxhArray[i] || '';

            // 安全地转换为数字，如果转换失败则使用0
            var sl = 0;
            try {
                sl = slArray[i] ? parseFloat(slArray[i]) : 0;
                if (isNaN(sl)) sl = 0;
            } catch (e) {
                sl = 0;
            }

            var dj = 0;
            try {
                dj = djArray[i] ? parseFloat(djArray[i]) : 0;
                if (isNaN(dj)) dj = 0;
            } catch (e) {
                dj = 0;
            }

            var bz = bzArray[i] || '';
            var subtotal = sl * dj;
            totalAmount += subtotal;

            formHtml += `
                        <tr>
                            <td style="text-align: center;">${i + 1}</td>
                            <td>${pp}</td>
                            <td>${cpxh}</td>
                            <td style="text-align: right;">${sl}</td>
                            <td style="text-align: right;">${dj.toFixed(2)}</td>
                            <td style="text-align: right; font-weight: bold;">${subtotal.toFixed(2)}</td>
                            <td>${bz}</td>
                        </tr>`;
        }

        formHtml += `
                        <tr>
                            <td colspan="5" style="text-align: right; font-weight: bold;">合计金额：</td>
                            <td style="text-align: right; font-weight: bold; color: #ff6b35;">${totalAmount.toFixed(2)}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>`;

        // 添加表格样式
        if (!$('#detail-table-styles').length) {
            $('<style id="detail-table-styles">')
                .prop('type', 'text/css')
                .html(`
                    .detail-table {
                        font-size: 14px;
                        margin-top: 15px;
                    }
                    .detail-table th {
                        background-color: #409EFF;
                        color: white;
                        text-align: center;
                        font-weight: bold;
                        padding: 10px 8px;
                    }
                    .detail-table td {
                        padding: 8px;
                        vertical-align: middle;
                    }
                    .detail-table tbody tr:hover {
                        background-color: #f5f5f5;
                    }
                `)
                .appendTo('head');
        }
    } else {
        formHtml = '<p class="text-muted">暂无产品详细信息</p>';
    }

    $('#detailFormContainer').html(formHtml);
}

// 填充详细信息
function fillDetailInfo(detailData) {
    var detailHtml = '';

    if (detailData && detailData.length > 0) {
        detailHtml = `
            <div class="table-responsive">
                <table class="table table-bordered table-striped table-sm detail-info-table">
                    <thead class="thead-light">
                        <tr>
                            <th width="120">品名</th>
                            <th width="120">规格型号</th>
                            <th width="60">单位</th>
                            <th width="80">数量</th>
                            <th width="100">单价</th>
                            <th width="100">发货时间</th>
                            <th width="100">总价</th>
                        </tr>
                    </thead>
                    <tbody>`;

        detailData.forEach(function(item) {

            // 判断发货时间是否为"待发货"，设置样式
            var fhsjClass = (item.fhsj === '待发货' || !item.fhsj) ? 'pending-shipment' : '';
            detailHtml += `
                <tr>
                    <td>${item.pm || ''}</td>
                    <td>${item.ggxh || ''}</td>
                    <td>${item.dw || ''}</td>
                    <td>${item.sl || ''}</td>
                    <td>${item.dj || ''}</td>
                    <td class="${fhsjClass}">${item.fhsj || ''}</td>
                    <td>${item.zj || ''}</td>
                </tr>
            `;
        });

        detailHtml += `
                    </tbody>
                </table>
            </div>
            <div class="mt-3">
                <strong>总计: </strong>
                <span class="text-primary">${calculateTotal(detailData)}</span>
            </div>`;
    } else {
        detailHtml = `
            <div class="alert alert-info">
                暂无详细信息
            </div>`;
    }

    $('#detailFormContainer').html(detailHtml);
    addDetailTableStyles();
}

// 添加详情表格的自定义样式
function addDetailTableStyles() {
    if ($('#detail-table-styles').length) return;

    $('<style id="detail-table-styles">')
        .prop('type', 'text/css')
        .html(`
            .detail-info-table {
                font-size: 14px;
                width: 100%;
            }
            .detail-info-table th {
                background-color: #409EFF;
                color: white;
                font-weight: bold;
                text-align: center;
                padding: 10px 8px;
                white-space: nowrap;
            }
            .detail-info-table td {
                padding: 8px;
                vertical-align: middle;
                word-wrap: break-word;
                word-break: break-all;
            }
            .detail-info-table .scgd-cell {
                min-width: 200px;
                max-width: 200px;
                background-color: #f8f9fa;
                font-family: 'Courier New', monospace;
                font-weight: bold;
                color: #2196f3;
            }
            .detail-info-table .bz-cell {
                min-width: 250px;
                max-width: 250px;
                background-color: #fff3cd;
                color: #856404;
            }
            .detail-info-table tbody tr:hover {
                background-color: #e6f7ff;
            }
            .detail-info-table tbody tr:hover .scgd-cell {
                background-color: #e3f2fd;
            }
            .detail-info-table tbody tr:hover .bz-cell {
                background-color: #ffeaa7;
            }
            .table-responsive {
                overflow-x: auto;
                border: 1px solid #dee2e6;
                border-radius: 4px;
            }
        `)
        .appendTo('head');
}

// 计算总价
function calculateTotal(detailData) {
    if (!detailData || detailData.length === 0) return '0';

    var total = 0;
    detailData.forEach(function(item) {
        var zj = parseFloat(item.zj) || 0;
        total += zj;
    });

    return total.toFixed(2);
}

// 显示详情加载中
function showDetailLoading() {
    $('#detailFormContainer').html(`
        <div class="text-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">加载中...</span>
            </div>
            <p>加载详细信息中...</p>
        </div>
    `);
}

// 隐藏详情加载中
function hideDetailLoading() {
    // 加载完成后的处理
}


// 初始化工具栏事件
function initToolbarEvents() {
    console.log('初始化工具栏事件...');

    // 刷新按钮
    $('#refresh-btn').off('click').on('click', function() {
        console.log('刷新数据');
        resetSearchAndRefresh();
    });

    // 打印按钮
    $('#print-btn').off('click').on('click', function() {
        console.log('打印按钮点击');
        var selectedRow = getSelectedRow();
        if (!selectedRow) {
            swal('请选择要打印的订单信息');
            return;
        }
        // 调用打印功能
        printDzd(selectedRow);
    });

    // 撤回对账按钮
    $('#withdraw-btn').off('click').on('click', function() {
        console.log('撤回对账按钮点击');
        var selectedRow = getSelectedRow();
        if (!selectedRow) {
            swal('请选择要撤回对账的订单信息');
            return;
        }
        // 调用撤回对账功能
        withdrawDzd(selectedRow);
    });
}

function printDzd(rowData) {
    if (!rowData || !rowData.ddh) {
        swal('无法获取订单信息');
        return;
    }

    // 首先更新对账状态为当前时间
    updateDzztStatus(rowData.ddh, getCurrentDate(), function(success) {
        if (success) {
            // 更新成功后获取详细信息并打印
            getDetailDataForPrint(rowData.ddh, function(detailData) {
                if (detailData && detailData.length > 0) {
                    // 确保有联系人信息，如果没有则从详情数据中获取
                    if (!rowData.lxr && detailData[0]) {
                        rowData.lxr = detailData[0].lxr || '';
                    }
                    generatePrintContent(rowData, detailData);
                    // 注意：这里不需要再调用刷新，因为updateDzztStatus中已经调用了
                } else {
                    swal('无法获取订单详细信息');
                }
            });
        } else {
            swal('更新对账状态失败，无法打印');
        }
    });
}

// 撤回对账功能
function withdrawDzd(rowData) {
    if (!rowData || !rowData.ddh) {
        swal('无法获取订单信息');
        return;
    }

    if (!confirm('确定要撤回该订单的对账状态吗？')) {
        return;
    }

    // 更新对账状态为"未对账"
    updateDzztStatus(rowData.ddh, '未对账', function(success) {
        if (success) {
            swal('撤回对账成功');
        } else {
            swal('撤回对账失败');
        }
    });
}

// 更新对账状态
function forceRefresh() {
    console.log('强制刷新数据');
    // 重置到第一页，避免分页问题
    currentPage = 1;
    // 使用空参数重新加载
    getList(currentPage, pageSize, {});
}

// 修改更新对账状态函数，使用强制刷新
function updateDzztStatus(ddh, dzztValue, callback) {
    console.log('开始更新对账状态，订单号:', ddh, '状态:', dzztValue);

    $ajax({
        type: 'post',
        url: '/cgdzd/updateDzztStatus',
        contentType: 'application/json',
        data: JSON.stringify({
            ddh: ddh,
            dzzt: dzztValue
        }),
        dataType: 'json'
    }, false, '', function (res) {
        if (res.code === 200) {
            console.log("更新对账状态成功:", res);
            // 使用强制刷新确保数据一致性
            forceRefresh();
            if (callback) callback(true);
        } else {
            console.error("更新对账状态失败:", res.message);
            if (callback) callback(false);
        }
    });
}

// 获取当前日期（年月日格式）
function getCurrentDate() {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
    var day = String(currentDate.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}


// 生成打印内容
// 生成打印内容 - 修改版本，按照逗号分割显示
function generatePrintContent(rowData, detailData) {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
    var currentYear = currentDate.getFullYear();

    // 按照新规则计算金额
    var paidAmount = parseFloat(rowData.yfje) || 0;
    var unpaidAmount = parseFloat(rowData.qkje) || 0;
    var currentPeriodAmount = calculateTotalFromDetail(detailData);  // 使用新的计算函数
    var openingAmount = (paidAmount - unpaidAmount).toFixed(2);
    var totalDebt = (parseFloat(openingAmount) + parseFloat(currentPeriodAmount)).toFixed(2);

    var printContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>对账单 - ${rowData.ddh}</title>
    <style>
        @media print {
            body { margin: 0; padding: 20px; font-family: 'SimSun', serif; }
            .no-print { display: none !important; }
            .page-break { page-break-after: always; }
        }
        body { 
            margin: 0; 
            padding: 20px; 
            font-family: 'SimSun', serif; 
            font-size: 14px;
            line-height: 1.5;
        }
        .header { 
            text-align: center; 
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .document-title {
            font-size: 20px;
            font-weight: bold;
            margin: 15px 0;
        }
        .client-info {
            margin: 15px 0;
            text-align: left;
        }
        .client-info div {
            margin: 5px 0;
        }
        .table-container {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .table-container th,
        .table-container td {
            border: 1px solid #000;
            padding: 8px 12px;
            text-align: center;
            font-size: 12px;
        }
        .table-container th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        .summary {
            margin: 20px 0;
            padding: 15px;
            border: 1px solid #000;
        }
        .summary-item {
            margin: 8px 0;
            display: flex;
            justify-content: space-between;
        }
        .footer {
            margin-top: 30px;
            text-align: right;
        }
        .company-stamp {
            margin-top: 50px;
            text-align: right;
        }
        .note {
            margin-top: 20px;
            font-style: italic;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">昆山翰元星传动科技有限公司${currentMonth}月对账单</div>
    </div>

    <div class="client-info">
        <div><strong>客户名称：</strong>${rowData.khcm || ''}</div>
        <div><strong>期初金额：</strong>¥${openingAmount}</div>
    </div>

    <table class="table-container">
        <thead>
            <tr>
                <th width="60">序号</th>
                <th width="140">产品名称</th>
                <th width="120">产品型号</th>
                <th width="100">订购数量</th>
                <th width="100">单价</th>
                <th width="100">小计</th>
           
                <th width="120">合同编号</th>
            </tr>
        </thead>
        <tbody>
    `;

    // 按照逗号分割的方式显示数据
    if (detailData && detailData.length > 0) {
        var mainData = detailData[0]; // 获取主要数据对象

        // 安全地分割各个字段
        var ppArray = mainData.pp ? mainData.pp.split(',') : [];
        var cpxhArray = mainData.cpxh ? mainData.cpxh.split(',') : [];
        var slArray = mainData.sl ? mainData.sl.split(',') : [];
        var djArray = mainData.dj ? mainData.dj.split(',') : [];
        var bzArray = mainData.bz ? mainData.bz.split(',') : [];

        // 确保所有数组长度一致，取最大长度
        var maxLength = Math.max(
            ppArray.length,
            cpxhArray.length,
            slArray.length,
            djArray.length,
            bzArray.length
        );

        console.log('打印数据分割结果:', {
            pp: ppArray,
            cpxh: cpxhArray,
            sl: slArray,
            dj: djArray,
            bz: bzArray,
            maxLength: maxLength
        });

        var totalAmount = 0;

        // 按照分割后的数组生成表格行
        for (var i = 0; i < maxLength; i++) {
            var pp = ppArray[i] || '';
            var cpxh = cpxhArray[i] || '';

            // 安全转换为数字
            var sl = 0;
            try {
                sl = slArray[i] ? parseFloat(slArray[i]) : 0;
                if (isNaN(sl)) sl = 0;
            } catch (e) {
                sl = 0;
            }

            var dj = 0;
            try {
                dj = djArray[i] ? parseFloat(djArray[i]) : 0;
                if (isNaN(dj)) dj = 0;
            } catch (e) {
                dj = 0;
            }

            var bz = bzArray[i] || '';
            var subtotal = sl * dj;
            totalAmount += subtotal;

            printContent += `
            <tr>
                <td>${i + 1}</td>
                <td>${pp}</td>
                <td>${cpxh}</td>
                <td>${sl}</td>
                <td>${dj.toFixed(2)}</td>
                <td>${subtotal.toFixed(2)}</td>
         
                <td>${rowData.ddh || ''}</td>
            </tr>
            `;
        }

        // 更新本期金额为计算后的总金额
        currentPeriodAmount = totalAmount.toFixed(2);
        totalDebt = (parseFloat(openingAmount) + parseFloat(currentPeriodAmount)).toFixed(2);
    }

    printContent += `
        </tbody>
    </table>
   
    <div class="summary">
        <div class="summary-item">
            <span><strong>本期金额：</strong></span>
            <span>¥${currentPeriodAmount}</span>
        </div>
        <div class="summary-item">
            <span><strong>欠款总额：</strong></span>
            <span>¥${totalDebt}</span>
        </div>
    </div>

    <div class="note">
        *如果确认无误请签字盖章后回传*
    </div>
    
    <div class="footer">
        <div style="display: flex;justify-content: space-between">
            <div>贵公司确认（签字、盖章）：</div>
            <div>昆山翰元星传动科技有限公司</div>
        </div>
        
        <div style="display: flex;justify-content: space-between">
            <div>日期：</div>
            <div>日期：${currentYear}/${currentMonth}/${currentDate.getDate()}</div>
        </div>
    </div>

    <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
            立即打印
        </button>
        <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; background-color: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
            关闭
        </button>
    </div>
</body>
</html>`;

    // 打开新窗口显示打印内容
    var printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();

    // 自动触发打印
    setTimeout(function() {
        printWindow.print();
    }, 500);
}

// 新的计算函数 - 基于分割后的数据计算总金额
function calculateTotalFromDetail(detailData) {
    if (!detailData || detailData.length === 0) return '0.00';

    var mainData = detailData[0];

    // 安全地分割各个字段
    var slArray = mainData.sl ? mainData.sl.split(',') : [];
    var djArray = mainData.dj ? mainData.dj.split(',') : [];

    var total = 0;
    var maxLength = Math.max(slArray.length, djArray.length);

    for (var i = 0; i < maxLength; i++) {
        var sl = 0;
        try {
            sl = slArray[i] ? parseFloat(slArray[i]) : 0;
            if (isNaN(sl)) sl = 0;
        } catch (e) {
            sl = 0;
        }

        var dj = 0;
        try {
            dj = djArray[i] ? parseFloat(djArray[i]) : 0;
            if (isNaN(dj)) dj = 0;
        } catch (e) {
            dj = 0;
        }

        total += sl * dj;
    }

    return total.toFixed(2);
}


// 修改获取详细信息用于打印的函数，确保获取正确的数据结构
function getDetailDataForPrint(ddh, callback) {
    $ajax({
        type: 'post',
        url: '/cgdzd/getDetailByDdh',
        contentType: 'application/json',
        data: JSON.stringify({ ddh: ddh }),
        dataType: 'json'
    }, false, '', function (res) {
        if (res.code === 200) {
            console.log('打印用详情数据:', res.data);
            callback(res.data);
        } else {
            console.error("获取详情失败:", res.message);
            callback(null);
        }
    });
}

function resetSearchAndRefresh() {
    // 重置搜索条件
    $('#ddh').val('');
    $('#khmc').val('');
    $('#fzr').val('');
    $('#sfkp').val('');
    setDefaultDateRange();

    // 刷新数据
    currentPage = 1;
    getList(currentPage, pageSize, {});
}

// 初始化详情模态框事件
function initDetailModalEvents() {
    // 可以根据需要添加详情模态框的事件
}

// 重置搜索条件
function resetSearch() {
    $('#ddh').val('');
    $('#khmc').val('');
    $('#fzr').val('');
    $('#sfkp').val('');
    setDefaultDateRange();

    // 重新查询
    currentPage = 1;
    getList(currentPage, pageSize, {});
}

// 获取搜索参数
function getSearchParams() {
    return {
        ddh: $('#htbh').val() || '',
        khmc: $('#khcm').val() || '',
        startDate: $('#startDate').val() || '',
        endDate: $('#endDate').val() || ''
    };
}

// 获取数据列表
function getList(page, size, keyword) {
    currentPage = page || currentPage;
    pageSize = size || pageSize;
    keyword = keyword || {};
    showLoading();

    $ajax({
        type: 'post',
        url: '/cgdzd/distinctPage',
        contentType: 'application/json',
        data: JSON.stringify({
            pageNum: currentPage,
            pageSize: pageSize,
            ddh: keyword.ddh || '',
            khmc: keyword.khmc || '',
            startDate: keyword.startDate || '',
            endDate: keyword.endDate || ''
        }),
        dataType: 'json'
    }, false, '', function (res) {
        hideLoading();
        if (res.success) {
            console.log("返回的客户信息", res);
            fillTable(res.data.list);
            totalCount = res.data.total;
            totalPages = res.data.pages;
            updatePagination();
        } else {
            console.error("查询失败:", res.message);

            // 处理权限错误
            if (res.code === 401) {
                swal("登录已过期，请重新登录");
                window.location.href = "/login.html";
            } else if (res.code === 403) {
                swal("权限不足，无法访问此功能");
            } else {
                swal("查询失败: " + res.message);
            }
        }
    });
}

// 显示加载中
function showLoading() {
    $('#cgmxTable').html('<tr><td colspan="12" style="text-align: center; padding: 20px;">加载中...</td></tr>');
}

// 隐藏加载中
function hideLoading() {
    // 加载完成后的处理
}

// 搜索功能
function searchDdmx() {
    var searchParams = getSearchParams();
    currentPage = 1;
    getList(currentPage, pageSize, searchParams);
}

// 计算未付金额
function calculateWeifu(yfsj, yifu) {
    var yfsjValue = parseFloat(yfsj) || 0;
    var yifuValue = parseFloat(yifu) || 0;
    return (yfsjValue - yifuValue).toFixed(2);
}

// 填充表格 - 渲染订单明细字段（所有字段只读）
function fillTable(data) {
    $('#cgmxTable').empty();

    var tableHeader = `
        <thead>
            <tr>
                <th width="280">乙方公司</th>
         
                <th width="120">订单日期</th>
                <th width="120">合计金额</th>
              
                <th width="150">合同编号</th>
                <th width="150">开票日期</th>
                <th width="150">欠款金额</th>
                <th width="150">已付金额</th>
                <th width="150">对账状态</th>
                <th width="200">备注</th>
                <th width="90">操作</th>
            </tr>
        </thead>
    `;

    var tableBody = '<tbody>';

    if (data && data.length > 0) {
        data.forEach(function(item, index) {
            tableBody += `
                <tr data-id="${item.id}">
                    <td>${item.khcm || ''}</td>
                  
                    <td>${item.ddrq || ''}</td>
                    <td>${item.hj || ''}</td>
                  
                    <td>${item.htbh || ''}</td>
                    <td>${item.kprq || '未开票'}</td>
                    <td>${item.qkje || ''}</td>
                    <td>${item.yfje || ''}</td>
                   <td>${item.dzzt || '未对账'}</td>
                    <td>${item.zbz || ''}</td>
                    <td>
                        <button class="btn btn-sm btn-info detail-btn" 
                                data-id="${item.id}" 
                                data-htbh="${item.htbh || ''}"> <!-- 确保传递 htbh -->
                            <i class="bi bi-eye"></i> 详情
                        </button>
                    </td>
                </tr>
            `;
        });
    } else {
        tableBody += `
            <tr>
                <td colspan="10" style="text-align: center; color: #999;">暂无客户数据</td>
            </tr>
        `;
    }

    tableBody += '</tbody>';
    $('#cgmxTable').html(tableHeader + tableBody);
    addRowClickEvent();
    bindDetailButtonEvents();
}

// 绑定详情按钮事件
function bindDetailButtonEvents() {
    $('.detail-btn').off('click').on('click', function(e) {
        e.stopPropagation();

        // 先选中当前行
        $('#cgmxTable tbody tr').removeClass('selected-row');
        $(this).closest('tr').addClass('selected-row');

        // 获取当前行的订单号
        var $row = $(this).closest('tr');
        var ddh = $(this).data('htbh');
        if (typeof ddh === 'number') {
            ddh = ddh.toString();
        }
        showDetailModal(ddh);
    });
}

// 显示详情模态框
function showDetailModal(ddh) {
    currentId = ddh;

    // 获取选中行的数据
    var rowData = getSelectedRow();
    if (rowData) {
        fillBasicInfo(rowData);
    }

    // 根据订单号获取详细信息
    getDetailData(ddh);

    $('#detailModal').modal('show');
}






// 填充基础信息
function fillBasicInfo(rowData) {
    if (rowData) {
        var basicInfoHtml = `
            <div class="row">
                <div class="col-md-4">
                <label><strong>乙方公司：</strong></label>
                <span>${rowData.khcm}</span>
            </div>
            <div class="col-md-4">
                <label><strong>订单日期：</strong></label>
                <span>${rowData.ddrq}</span>
            </div>
            <div class="col-md-4">
                <label><strong>合计金额：</strong></label>
                <span>${rowData.hj}</span>
            </div>
          
            <div class="col-md-4">
                <label><strong>合同编号：</strong></label>
                <span>${rowData.ddh}</span>
            </div>
            </div>
        `;
        $('#basicInfo').html(basicInfoHtml);
    }
}

// 获取选中行数据
function getSelectedRow() {
    var selectedRow = $('.selected-row');
    if (selectedRow.length === 0) {
        return null;
    }

    var rowData = {
        id: selectedRow.data('id'),
        khcm: selectedRow.find('td:eq(0)').text().trim(),
        ddrq: selectedRow.find('td:eq(1)').text().trim(),
        hj: selectedRow.find('td:eq(2)').text().trim(),
        ddh: selectedRow.find('td:eq(3)').text().trim(),
        zbz: selectedRow.find('td:eq(7)').text().trim(),
        kprq: selectedRow.find('td:eq(4)').text().trim(),
        qkje: selectedRow.find('td:eq(5)').text().trim(),
        yfje: selectedRow.find('td:eq(6)').text().trim()
    };

    return rowData;
}

// 添加行点击事件
function addRowClickEvent() {
    $('#cgmxTable tbody tr').click(function() {
        $('#cgmxTable tbody tr').removeClass('selected-row');
        $(this).addClass('selected-row');
        var ddh = $(this).find('td:eq(2)').text().trim();
        console.log('选中订单号:', ddh);
    });
}

// 更新分页控件
function updatePagination() {
    $('#paginationContainer').remove();

    var paginationHtml = `
        <div id="paginationContainer" class="pagination-container">
            <div class="pagination-info">
                共 <span class="total-count">${totalCount}</span> 条记录，
                第 <span class="current-page">${currentPage}</span> 页 / 共 <span class="total-pages">${totalPages}</span> 页
            </div>
            <div class="pagination-controls">
                <button class="pagination-btn first-page" ${currentPage === 1 ? 'disabled' : ''}>首页</button>
                <button class="pagination-btn prev-page" ${currentPage === 1 ? 'disabled' : ''}>上一页</button>
                <div class="page-numbers">`;

    var startPage = Math.max(1, currentPage - 2);
    var endPage = Math.min(totalPages, currentPage + 2);

    for (var i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            paginationHtml += `<button class="page-number active">${i}</button>`;
        } else {
            paginationHtml += `<button class="page-number">${i}</button>`;
        }
    }

    paginationHtml += `
                </div>
                <button class="pagination-btn next-page" ${currentPage === totalPages ? 'disabled' : ''}>下一页</button>
                <button class="pagination-btn last-page" ${currentPage === totalPages ? 'disabled' : ''}>末页</button>
                <div class="page-size-selector">
                    <select class="page-size-select">
                        <option value="10" ${pageSize === 10 ? 'selected' : ''}>10条/页</option>
                        <option value="20" ${pageSize === 20 ? 'selected' : ''}>20条/页</option>
                        <option value="50" ${pageSize === 50 ? 'selected' : ''}>50条/页</option>
                        <option value="100" ${pageSize === 100 ? 'selected' : ''}>100条/页</option>
                    </select>
                </div>
                <div class="page-jump">
                    <input type="number" class="page-jump-input" min="1" max="${totalPages}" placeholder="页码">
                    <button class="pagination-btn jump-btn">跳转</button>
                </div>
            </div>
        </div>`;

    $('.table-div').after(paginationHtml);
    bindPaginationEvents();
}

// 绑定分页事件
function bindPaginationEvents() {
    $('.first-page').click(function() {
        if (!$(this).prop('disabled')) {
            currentPage = 1;
            getList(currentPage, pageSize, getSearchParams());
        }
    });

    $('.prev-page').click(function() {
        if (!$(this).prop('disabled')) {
            currentPage--;
            getList(currentPage, pageSize, getSearchParams());
        }
    });

    $('.next-page').click(function() {
        if (!$(this).prop('disabled')) {
            currentPage++;
            getList(currentPage, pageSize, getSearchParams());
        }
    });

    $('.last-page').click(function() {
        if (!$(this).prop('disabled')) {
            currentPage = totalPages;
            getList(currentPage, pageSize, getSearchParams());
        }
    });

    $('.page-number').click(function() {
        var page = parseInt($(this).text());
        if (page !== currentPage) {
            currentPage = page;
            getList(currentPage, pageSize, getSearchParams());
        }
    });

    $('.page-size-select').change(function() {
        pageSize = parseInt($(this).val());
        currentPage = 1;
        getList(currentPage, pageSize, getSearchParams());
    });

    $('.jump-btn').click(function() {
        var targetPage = parseInt($('.page-jump-input').val());
        if (targetPage && targetPage >= 1 && targetPage <= totalPages) {
            currentPage = targetPage;
            getList(currentPage, pageSize, getSearchParams());
        } else {
            swal('请输入有效的页码（1-' + totalPages + '）');
        }
    });

    $('.page-jump-input').keypress(function(e) {
        if (e.which === 13) {
            $('.jump-btn').click();
        }
    });
}

// 在CSS中添加选中行样式
function addTableStyles() {
    if ($('#table-styles').length) return;

    $('<style id="table-styles">')
        .prop('type', 'text/css')
        .html(`
            .selected-row {
                background-color: #b3d9ff !important;
                font-weight: bold;
            }
            .table-div {
                max-height: 600px;
                overflow-y: auto;
                border: 1px solid #ddd;
            }
            .pending-shipment {
                background-color: #409EFF !important;
                color: white !important;
                font-weight: bold;
            }
        `)
        .appendTo('head');
}