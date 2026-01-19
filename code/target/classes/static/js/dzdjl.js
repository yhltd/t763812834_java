var idd;
var currentPage = 1;
var pageSize = 20;
var totalCount = 0;
var totalPages = 0;
var currentId = '';

// 清空选择状态
var selectedDdhs = []; // 存储选择的订单号
var selectedRows = [];


// 新增：存储客户要求数据
var customerRequirements = {}; // 以khmc为key，yq为value的对象
var customerRequirementsList = []; // 完整的客户要求数据列表

// 在文件顶部添加导出配置变量
var exportColumnsConfig = {
    mainColumns: [],      // 用户选择的主表列
    detailColumns: ['品名', '规格型号', '单位', '数量', '单价', '发货时间'], // 详情表固定列
    allMainColumns: [
        { key: 'duizhangriqi', name: '订单日期' },
        { key: 'duizhangdanhao', name: '对账单号' },
        { key: 'ddh', name: '订单号' },
        { key: 'khmc', name: '客户名称' },
        { key: 'fzr', name: '负责人' },
        { key: 'yfsj', name: '总价' },
        { key: 'yifu', name: '已付' },
        { key: 'wf', name: '未付' },
        { key: 'kpsj', name: '开票时间' },
        { key: 'sfkp', name: '开票状态' },
        { key: 'dzzt', name: '对账状态' }
    ]
};

// 页面加载完成后初始化
$(document).ready(function() {
    console.log('页面加载完成，初始化订单明细页面...');
    addTableStyles();
    initDdmxPage();
    initToolbarEvents();
    initDetailModalEvents();

    // 首先获取客户要求数据
    yaoqiu();

    // 设置定时检查，确保客户要求数据加载完成
    setTimeout(function() {
        if (Object.keys(customerRequirements).length === 0 && customerRequirementsList.length === 0) {
            console.log("客户要求数据获取失败或为空，尝试重新获取...");
            yaoqiu();
        }
    }, 1000);

    // 添加导出按钮
    $('#export-btn').off('click').on('click', function() {
        showExportModal();
    });

    // 初始化导出配置
    initExportConfig();

    $(document).on('click', '#add-btn', function(e) {
        e.preventDefault();
        console.log('上传文件按钮被点击 - 使用委托绑定');

        // 获取选中的行
        var selectedRow = getSelectedRow();

        if (!selectedRow || !selectedRow.duizhangdanhao) {
            swal({
                title: '未选择订单',
                text: '请先在表格中选中一行订单，然后再上传文件',
                icon: 'warning',
                buttons: {
                    confirm: '确定'
                }
            });
            return;
        }

        // 使用选中行的订单号
        var orderNumber = selectedRow.duizhangdanhao;

        console.log('使用选中订单号:', orderNumber);

        // 设置订单号
        $('#add-orderNumber').val(orderNumber);

        // 清空之前的文件选择
        try {
            var $fileInput = $('#fileInput1');
            if ($.fn.fileinput && $fileInput.data('fileinput')) {
                $fileInput.fileinput('clear');
            } else {
                $fileInput.val('');
            }
        } catch (error) {
            console.log('清空文件选择器失败:', error);
            $('#fileInput1').val('');
        }

        // 显示上传模态框
        $('#add-modal').modal('show');

        console.log('模态框已显示');
    });

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
    // 将日期字段设置为空
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

// 格式化日期时间为 YYYY-MM-DD HH:mm:ss
function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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

    // 开票按钮
    $('#invoice-btn').off('click').on('click', function() {
        console.log('开票按钮点击');
        batchInvoice();
    });

    // 删除上传文件按钮
    $('#delete-btn').off('click').on('click', function() {
        console.log('删除上传文件按钮点击');
        deleteUploadedFile();
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

    // 导出按钮已经在ready函数中绑定
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
    if (!rowData || !rowData.duizhangdanhao) {
        swal('无法获取订单信息');
        return;
    }

    if (!confirm('确定要撤回该订单的对账状态吗？')) {
        return;
    }

    // 更新对账状态为"未对账"
    updateDzztStatus(rowData.duizhangdanhao, '未开票', function(success) {
        if (success) {
            alert('撤回对账成功');
        } else {
            alert('撤回对账失败');
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
        url: '/dzdjl/updateDzztStatus',
        contentType: 'application/json',
        data: JSON.stringify({
            duizhangdanhao: ddh,
            sfkp: dzztValue,
        }),
        dataType: 'json'
    }, false, '', function (res) {
        if (res.code === 200) {
            console.log("更新对账状态成功:", res);
            // 使用强制刷新确保数据一致性
            forceRefresh();
            if (callback) callback(true);
        } else if(res.code == 403){
            swal("权限不足，无法访问此功能！")
        }else {
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
function generatePrintContent(rowData, detailData) {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1; // 获取当前月份
    var currentYear = currentDate.getFullYear();

    // 按照新规则计算金额
    var paidAmount = parseFloat(rowData.yifu) || 0;        // 已付金额
    var unpaidAmount = parseFloat(rowData.wf) || 0;        // 未付金额
    var currentPeriodAmount = calculateTotal(detailData);  // 本期金额 = 列表总价汇总
    var openingAmount = unpaidAmount // 期初金额 = 已付 - 未付
    var totalDebt = (parseFloat(openingAmount) + parseFloat(currentPeriodAmount)).toFixed(2); // 欠款总额 = 期初金额 + 本期金额

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
        .page-info {
            text-align: center;
            margin: 10px 0;
            font-size: 12px;
        }
        .separator {
            border-top: 1px dashed #000;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">昆山翰元星传动科技有限公司${currentMonth}月对账单</div>
    </div>

    <div class="client-info">
        <div><strong>客户名称：</strong>${rowData.khmc || ''}</div>
        <div><strong>联系人：</strong>${rowData.lxr || ''}</div>
        <div><strong>期初金额：</strong>¥${openingAmount}</div>
    </div>

    <table class="table-container">
        <thead>
            <tr>
                <th width="60">序号</th>
                <th width="140">产品名称</th>
                <th width="120">规格型号</th>
                <th width="60">单位</th>
                <th width="80">单价</th>
                <th width="60">数量</th>
                <th width="80">总价</th>
                <th width="120">发货时间</th>
                <th width="120">订单号</th>
            </tr>
        </thead>
        <tbody>
    `;

    // 添加明细行
    detailData.forEach(function(item, index) {
        printContent += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.pm || ''}</td>
                <td>${item.ggxh || ''}</td>
                <td>${item.dw || ''}</td>
                <td>${item.dj || ''}</td>
                <td>${item.sl || ''}</td>
                <td>${item.zj || ''}</td>
                <td>${item.fhsj || ''}</td>
                <td>${rowData.ddh || ''}</td>
            </tr>
        `;
    });

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

// 计算总金额（本期金额）
function calculateTotal(detailData) {
    if (!detailData || detailData.length === 0) return '0.00';

    var total = 0;
    detailData.forEach(function(item) {
        var zj = parseFloat(item.zj) || 0;
        total += zj;
    });

    return total.toFixed(2);
}

// 获取详细信息用于打印
function getDetailDataForPrint(ddh, callback) {
    $ajax({
        type: 'post',
        url: '/dzdjl/getDetailByDdh',
        contentType: 'application/json',
        data: JSON.stringify({ ddh: ddh }),
        dataType: 'json'
    }, false, '', function (res) {
        if (res.code === 200) {
            callback(res.data);
        } else if(res.code == 403){
            swal("权限不足，无法访问此功能！")
        }else {
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
        khmc: $('#khmc').val() || '',    // 乙方名称
        htbh: $('#htbh').val() || '',    // 合同编号
        fzr: $('#fzr').val() || '',    // 合同编号
        startDate: $('#startDate').val() || '',
        endDate: $('#endDate').val() || ''
    };
}

// 获取数据列表
function getList(page, size, searchParams) {
    currentPage = page || currentPage;
    pageSize = size || pageSize;
    searchParams = searchParams || {};

    showLoading();

    // 调用订单明细接口
    $ajax({
        type: 'post',
        url: '/dzdjl/distinctPage',
        contentType: 'application/json',
        data: JSON.stringify({
            pageNum: currentPage,
            pageSize: pageSize,
            khmc: searchParams.khmc || '',    // 乙方名称
            fzr: searchParams.fzr || '',
            ddh: searchParams.htbh || '',    // 合同编号
            startDate: searchParams.startDate || '',
            endDate: searchParams.endDate || ''
        }),
        dataType: 'json'
    }, false, '', function (res) {
        hideLoading();
        if (res.code === 200) {
            console.log("返回的订单明细信息", res);
            fillTable(res.data.records);
            totalCount = res.data.total;
            totalPages = res.data.pages;
            updatePagination();

            // 刷新后更新开票按钮状态
            updateInvoiceButtonState();
        } else if(res.code == 403){
            swal("权限不足，无法访问此功能！")
        } else {
            console.error("查询失败:", res.message);
            if (res.code === 401) {
                swal("登录已过期，请重新登录");
                window.location.href = "/login.html";
            } else if (res.code === 403) {
                swal("权限不足，无法访问此功能");
            } else {
                swal("查询失败: " + (res.message || '未知错误'));
            }
        }
    });
}

// 显示加载中
function showLoading() {
    $('#ddmxTable').html('<tr><td colspan="13" style="text-align: center; padding: 20px;">加载中...</td></tr>');
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

// 修改表格渲染
function fillTable(data) {
    console.log("返回数据", data);
    $('#ddmxTable').empty();

    var tableHeader = `
        <thead>
            <tr>
                <th width="40"><input type="checkbox" id="selectAllRows"></th>
                <th width="60">序号</th>
                <th width="100">对账日期</th>
                <th width="160">对账单号</th>
                <th width="180">客户名称</th>
                <th width="80">负责人</th>
                <th width="100">总价</th>
                <th width="80">已付</th>
                <th width="80">未付</th>
                <th width="100">开票时间</th>
                <th width="80">开票状态</th>
                <th width="90">操作</th>
                <th width="120">PDF文件</th>  <!-- 新增扫描件列 -->
            </tr>
        </thead>
    `;

    var tableBody = '<tbody>';

    if (data && data.length > 0) {
        data.forEach(function(item, index) {
            // 计算未付金额
            var weifu = calculateWeifu(item.yfsj, item.yifu);

            // 计算当前页的序号（考虑分页）
            var serialNumber = (currentPage - 1) * pageSize + index + 1;

            // 使用对账单号作为唯一标识
            var ddh = item.duizhangdanhao || '';

            // 检查当前行是否已被选中
            var isChecked = selectedDdhs.includes(ddh) ? 'checked' : '';

            // 判断是否有扫描件文件 - 使用 dzscwj 字段
            var hasScanFile = item.dzscwj && item.dzscwj !== '';

            // 获取文件扩展名，用于显示不同的图标
            var fileExt = '';
            var fileIcon = '';
            if (hasScanFile) {
                // 获取文件扩展名
                // 如果多个文件用逗号分隔，取第一个
                var filePath = item.dzscwj.split(',')[0].trim();
                fileExt = filePath.split('.').pop().toLowerCase();
                switch(fileExt) {
                    case 'pdf':
                        fileIcon = 'bi-file-earmark-pdf';
                        break;
                    case 'jpg':
                    case 'jpeg':
                    case 'png':
                    case 'gif':
                        fileIcon = 'bi-file-earmark-image';
                        break;
                    case 'doc':
                    case 'docx':
                        fileIcon = 'bi-file-earmark-word';
                        break;
                    case 'xls':
                    case 'xlsx':
                        fileIcon = 'bi-file-earmark-excel';
                        break;
                    default:
                        fileIcon = 'bi-file-earmark';
                }
            }

            tableBody += `
                <tr data-ddh="${ddh}" 
                    data-lxr="${item.lxr || ''}"
                    class="${isChecked ? 'selected-row' : ''}">
                    <td><input type="checkbox" class="row-checkbox" data-ddh="${ddh}" ${isChecked}></td>
                    <td>${serialNumber}</td>
                    <td>${item.duizhangriqi || ''}</td>
                    <td>${ddh}</td>
                    <td>${item.khmc || ''}</td>
                    <td>${item.fzr || ''}</td>
                    <td>${item.yfsj || ''}</td>
                    <td>${item.yifu || ''}</td>
                    <td>${weifu}</td>
                    <td>${item.kpsj || ''}</td>
                    <td>${item.sfkp || ''}</td>
                    <td>
                        <button class="btn btn-sm btn-info detail-btn" 
                                data-ddh="${ddh}">
                            <i class="bi bi-eye"></i> 详情
                        </button>
                    </td>
                    <td class="scan-upload-cell">
                        <div class="scan-btn-container">
                            ${hasScanFile ? `
                                <!-- 有扫描件文件时的按钮 -->
                                <div>
                                    <button class="btn btn-sm btn-success view-scan-btn" 
                                            data-filepath="${item.dzscwj || ''}"
                                            data-filename="${ddh || ''}"
                                            title="查看文件：${item.dzscwj || ''}">
                                        <i class="bi ${fileIcon}"></i> 查看文件
                                    </button>
                                </div>
                            ` : `
                                <!-- 没有扫描件文件时的按钮 -->
                                <div>

                                </div>
                            `}
                            <input type="file" class="scan-file-input" data-ddh="${ddh}" accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx" style="display: none;">
                        </div>
                    </td>
                </tr>
            `;
        });
    } else {
        tableBody += `
            <tr>
                <td colspan="14" style="text-align: center; color: #999;">暂无订单数据</td>
            </tr>
        `;
    }

    tableBody += '</tbody>';
    $('#ddmxTable').html(tableHeader + tableBody);

    // 绑定新的事件
    addRowClickEvent();
    bindCheckboxEvents();
    bindDetailButtonEvents();
    bindViewFileEvents();

    console.log('表格渲染完成，选中订单号:', selectedDdhs);
}


function bindViewFileEvents() {
    console.log('绑定查看文件事件...');

    // 解绑旧的事件
    $(document).off('click', '.view-scan-btn');

    // 绑定新的事件
    $(document).on('click', '.view-scan-btn', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $btn = $(this);
        var filePath = $btn.data('filepath');
        var fileName = $btn.data('filename') || 'file';
        var ddh = $btn.closest('tr').find('td:eq(3)').text().trim(); // 获取订单号

        console.log('查看文件按钮点击，文件路径:', filePath);
        console.log('文件名:', fileName);
        console.log('订单号:', ddh);

        if (!filePath) {
            swal('错误', '文件路径为空，无法查看文件', 'error');
            return;
        }

        // 显示文件查看弹窗
        showFileViewModal(ddh, filePath);
    });
}

// 显示文件查看弹窗
function showFileViewModal(ddh, filePath) {
    // 解析文件路径（可能是逗号分隔的多个文件）
    var fileUrls = filePath.split(',');
    var cleanFileUrls = [];

    // 清理URL，去除空格
    fileUrls.forEach(function(url) {
        if (url && url.trim() !== '') {
            cleanFileUrls.push(url.trim());
        }
    });

    console.log('解析后的文件URL:', cleanFileUrls);

    // 生成弹窗内容
    var modalHtml = `
        <div class="modal fade" id="fileViewModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-files"></i> 
                            文件列表 - 订单号: ${ddh}
                        </h5>
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle"></i> 
                            共找到 ${cleanFileUrls.length} 个文件，点击"查看"在新窗口打开，点击"删除"可删除单个文件
                        </div>
                        
                        <div class="file-list-container" style="max-height: 400px; overflow-y: auto;">
    `;

    // 为每个文件生成条目
    cleanFileUrls.forEach(function(url, index) {
        var fileName = url.substring(url.lastIndexOf('/') + 1);
        var fileExt = fileName.split('.').pop().toLowerCase();

        // 根据文件类型设置图标
        var fileIcon = '';
        switch(fileExt) {
            case 'pdf':
                fileIcon = 'bi-file-earmark-pdf text-danger';
                break;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                fileIcon = 'bi-file-earmark-image text-success';
                break;
            case 'doc':
            case 'docx':
                fileIcon = 'bi-file-earmark-word text-primary';
                break;
            case 'xls':
            case 'xlsx':
                fileIcon = 'bi-file-earmark-excel text-success';
                break;
            default:
                fileIcon = 'bi-file-earmark text-secondary';
        }

        modalHtml += `
            <div class="file-item card mb-2">
                <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <i class="bi ${fileIcon} mr-3" style="font-size: 24px;"></i>
                            <div>
                                <h6 class="mb-1">${fileName}</h6>
                                <small class="text-muted">${url}</small>
                            </div>
                        </div>
                        <div class="btn-group">
                            <a href="${url}" target="_blank" 
                               class="btn btn-sm btn-primary mr-1" 
                               title="在新窗口打开">
                                <i class="bi bi-eye"></i> 查看
                            </a>
                            <button class="btn btn-sm btn-danger delete-single-file" 
                                    data-url="${url}" 
                                    data-index="${index}"
                                    data-ddh="${ddh}"
                                    title="删除此文件">
                                <i class="bi bi-trash"></i> 删除
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    modalHtml += `
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="d-flex justify-content-between w-100">
                            <div>
                                <!-- 这里不再显示"删除全部"按钮 -->
                            </div>
                            <div>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                    <i class="bi bi-x-circle"></i> 关闭
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 移除可能已存在的弹窗
    $('#fileViewModal').remove();

    // 添加弹窗到页面
    $('body').append(modalHtml);

    // 显示弹窗
    $('#fileViewModal').modal('show');

    // 绑定删除单个文件事件
    bindSingleFileDeleteEvents();
}

// 绑定单个文件删除事件
function bindSingleFileDeleteEvents() {
    $('.delete-single-file').off('click').on('click', function() {
        var $btn = $(this);
        var fileUrl = $btn.data('url');
        var ddh = $btn.data('ddh');
        var index = $btn.data('index');

        console.log('删除单个文件:', fileUrl, '订单号:', ddh, '索引:', index);

        if (!confirm(`确定要删除此文件吗？\n${fileUrl}`)) {
            return;
        }

        // 显示加载中
        $btn.prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> 删除中...');

        deleteSingleFile(ddh, fileUrl, $btn);
    });
}

// 删除单个文件 - 使用原来的删除逻辑
function deleteSingleFile(ddh, fileUrl, $btn) {
    // 从URL中提取文件名
    var fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);

    console.log('开始删除单个文件:', fileName, '订单号:', ddh);
    console.log('完整文件URL:', fileUrl);

    // 显示加载中
    $btn.prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> 删除中...');

    try {
        // 调用原来的 extractAndDeleteFromUrl 函数
        extractAndDeleteFromUrl(fileUrl, ddh);

        // 同时需要从数据库中删除该文件记录
        removeFileFromDatabase(ddh, fileUrl);

        // 显示成功消息
        swal({
            title: '删除成功',
            text: `文件已成功删除`,
            icon: 'success',
            button: '确定'
        });

        // 从当前弹窗中移除该文件项
        var $fileItem = $btn.closest('.file-item');
        $fileItem.fadeOut(300, function() {
            $(this).remove();

            // 如果所有文件都删除了，关闭弹窗
            if ($('.file-item').length === 0) {
                $('#fileViewModal').modal('hide');
                // 刷新表格数据
                getList(currentPage, pageSize, getSearchParams());
            } else {
                // 如果还有文件，需要更新数据库中的文件列表
                updateRemainingFiles(ddh);
            }
        });
    } catch (error) {
        console.error('文件删除失败:', error);
        swal('删除失败', '文件删除过程中发生错误: ' + error.message, 'error');
        $btn.prop('disabled', false).html('<i class="bi bi-trash"></i> 删除');
    }
}

// 从数据库中删除单个文件记录
function removeFileFromDatabase(ddh, fileUrl) {
    console.log('从数据库中删除文件记录，订单号:', ddh, '文件URL:', fileUrl);

    // 先获取当前的文件列表
    $ajax({
        type: 'post',
        url: '/dzdjl/getCurrentPdfFileName',
        contentType: 'application/json',
        data: JSON.stringify({
            duizhangdanhao: ddh
        }),
        dataType: 'json'
    }, false, '', function (res) {
        if (res.code === 200) {
            var currentFiles = res.data || '';
            console.log('当前数据库中的文件列表:', currentFiles);

            // 如果当前有多个文件，需要移除被删除的那个
            if (currentFiles && currentFiles.includes(',')) {
                var fileList = currentFiles.split(',');
                var newFileList = [];

                for (var i = 0; i < fileList.length; i++) {
                    var file = fileList[i].trim();
                    // 如果这个文件不是要删除的那个，保留
                    if (file !== fileUrl.trim()) {
                        newFileList.push(file);
                    }
                }

                var newFiles = newFileList.join(',');
                console.log('删除后的新文件列表:', newFiles);

                // 更新数据库
                updatePdfFileNameInDatabase(ddh, newFiles);
            } else {
                // 如果只有一个文件，清空数据库
                console.log('只有一个文件，清空数据库记录');
                updatePdfFileNameInDatabase(ddh, '');
            }
        } else {
            console.error('获取当前文件列表失败:', res.message);
        }
    });
}

// 更新数据库中的文件列表
function updatePdfFileNameInDatabase(ddh, newFiles) {
    console.log('更新数据库中的文件列表，订单号:', ddh, '新文件列表:', newFiles);

    $ajax({
        type: 'post',
        url: '/dzdjl/updatePdfFileName',
        contentType: 'application/json',
        data: JSON.stringify({
            duizhangdanhao: ddh,
            dzscwj: newFiles
        }),
        dataType: 'json'
    }, false, '', function (res) {
        if (res.code === 200) {
            console.log('数据库文件列表更新成功');
        } else {
            console.error('数据库文件列表更新失败:', res.message);
        }
    });
}

// 更新剩余的文件列表（用于在弹窗中删除文件后）
function updateRemainingFiles(ddh) {
    var remainingFiles = [];
    $('.file-item').each(function() {
        var url = $(this).find('.delete-single-file').data('url');
        if (url) {
            remainingFiles.push(url.trim());
        }
    });

    var newFileList = remainingFiles.join(',');
    console.log('更新剩余文件列表:', newFileList);

    updatePdfFileNameInDatabase(ddh, newFileList);
}


// 验证URL是否有效
function isValidUrl(string) {
    try {
        // 尝试创建URL对象
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
// 查看PDF文件（在线预览）- 修正版
function viewPdfFile(ddh) {
    if (!ddh) {
        swal('订单号不能为空');
        return;
    }

    console.log('查看PDF文件，订单号:', ddh);

    // 方法1：直接打开新窗口（推荐）
    const url = `/dzdjl/viewPdf?ddh=${encodeURIComponent(ddh)}`;
    window.open(url, '_blank');
}


// 绑定详情按钮事件
function bindDetailButtonEvents() {
    $('.detail-btn').off('click').on('click', function(e) {
        e.stopPropagation();

        // 先选中当前行
        $('#ddmxTable tbody tr').removeClass('selected-row');
        $(this).closest('tr').addClass('selected-row');

        // 获取当前行的订单号
        var $row = $(this).closest('tr');
        var ddh = $(this).data('ddh');

        showDetailModal(ddh);
    });
}

// 显示详情模态框
function showDetailModal(ddh) {
    currentId = ddh;

    // 获取选中行的数据
    var rowData = getSelectedRow();
    if (rowData) {
        // 确保客户要求数据已加载
        if (Object.keys(customerRequirements).length === 0 && customerRequirementsList.length === 0) {
            console.log("客户要求数据为空，重新获取...");
            yaoqiu(); // 重新获取客户要求数据
        }

        // 延迟一点填充基础信息，确保客户要求数据已加载
        setTimeout(function() {
            fillBasicInfo(rowData);
        }, 300);
    }

    // 根据订单号获取详细信息
    getDetailData(ddh);

    $('#detailModal').modal('show');
}
// 根据订单号获取详细信息
function getDetailData(ddh) {
    if (!ddh) {
        console.error('订单号为空');
        return;
    }

    showDetailLoading();

    // 调用获取详细信息的接口
    $ajax({
        type: 'post',
        url: '/dzdjl/getDetailByDdh',
        contentType: 'application/json',
        data: JSON.stringify({
            duizhangdanhao: ddh
        }),
        dataType: 'json'
    }, false, '', function (res) {
        hideDetailLoading();
        if (res.code === 200) {
            console.log("返回的详细信息", res);
            fillDetailInfo(res.data);
        }else if(res.code == 403){
            swal("权限不足，无法访问此功能！")
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

// 填充详细信息
function fillDetailInfo(detailData) {
    var detailHtml = '';

    if (detailData && detailData.length > 0) {
        detailHtml = `
            <div class="table-responsive">
                <table class="table table-bordered table-striped table-sm detail-info-table">
                    <thead class="thead-light">
                        <tr>
                            <th width="120">订单号</th>
                            <th width="120">品名</th>
                            <th width="120">规格型号</th>
                            <th width="60">单位</th>
                            <th width="80">数量</th>
                            <th width="100">单价</th>
                            <th width="100">发货时间</th>
                        </tr>
                    </thead>
                    <tbody>`;

        detailData.forEach(function(item) {
            // 判断发货时间是否为"待发货"，设置样式
            var fhsjClass = (item.fhsj === '待发货' || !item.fhsj) ? 'pending-shipment' : '';
            detailHtml += `
                <tr>
                    <td>${item.ddh || ''}</td>
                    <td>${item.pm || ''}</td>
                    <td>${item.ggxh || ''}</td>
                    <td>${item.dw || ''}</td>
                    <td>${item.sl || ''}</td>
                    <td>${item.dj || ''}</td>
                    <td class="${fhsjClass}">${item.fhsj || ''}</td>
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

// 填充基础信息 - 优化版本（可选）
function fillBasicInfo(rowData) {
    if (rowData) {
        // 获取客户要求
        var customerReq = getCustomerRequirement(rowData.khmc);
        console.log("客户名称:", rowData.khmc, "对应的客户要求:", customerReq);

        var basicInfoHtml = `
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group" style="display: flex" >
                        <label class="font-weight-bold">订单日期：</label>
                        <div>${rowData.ddrq || ''}</div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group" style="display: flex" >
                        <label class="font-weight-bold">订单号：</label>
                        <div>${rowData.ddh || ''}</div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group" style="display: flex" >
                        <label class="font-weight-bold">负责人：</label>
                        <div>${rowData.fzr || ''}</div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group" style="display: flex">
                        <label class="font-weight-bold">客户名称：</label>
                        <div>${rowData.khmc || ''}</div>
                    </div>
                </div>
        `;

        // 如果有客户要求，显示客户要求
        if (customerReq && customerReq.trim() !== '') {
            basicInfoHtml += `
                <div class="col-md-12">
                    <div class="form-group" style="display: flex">
                        <label class="font-weight-bold" style="color: black;">客户要求：</label>
                        <div class="customer-requirement">
                            ${customerReq}
                        </div>
                    </div>
                </div>
            `;
        } else {
            basicInfoHtml += `
                <div class="col-md-12">
                    <div class="form-group" style="display: flex">
                        <label class="font-weight-bold">客户要求：</label>
                        <div class="text-muted">暂无客户要求信息</div>
                    </div>
                </div>
            `;
        }

        basicInfoHtml += `</div>`;
        $('#basicInfo').html(basicInfoHtml);
    }
}

function getSelectedRows() {
    return selectedRows;
}


// 获取选中行数据
// 获取选中行数据
function getSelectedRow() {
    var selectedRow = $('.selected-row');
    if (selectedRow.length === 0) {
        console.log('没有找到选中的行');
        return null;
    }

    console.log('找到选中的行:', selectedRow.length, '行');
    console.log('行内容:', selectedRow.find('td').map(function() {
        return $(this).text().trim();
    }).get());

    var rowData = {
        serialNumber: selectedRow.find('td:eq(1)').text().trim(),
        ddrq: selectedRow.find('td:eq(2)').text().trim(),
        duizhangdanhao: selectedRow.find('td:eq(3)').text().trim(), // 从第4列获取对账单号
        khmc: selectedRow.find('td:eq(4)').text().trim(),
        fzr: selectedRow.find('td:eq(5)').text().trim(),
        yfsj: selectedRow.find('td:eq(6)').text().trim(),
        yifu: selectedRow.find('td:eq(7)').text().trim(),
        wf: selectedRow.find('td:eq(8)').text().trim(),
        kpsj: selectedRow.find('td:eq(9)').text().trim(),
        sfkp: selectedRow.find('td:eq(10)').text().trim(),
        dzzt: selectedRow.find('td:eq(11)').text().trim(),
        pdf_file_name: selectedRow.find('.view-file-btn').data('filepath') || ''
    };

    // 从行的data属性中获取联系人信息
    var rowElement = selectedRow[0];
    if (rowElement && rowElement.dataset) {
        rowData.lxr = rowElement.dataset.lxr || '';
    }

    console.log('获取到的行数据:', rowData);
    return rowData;
}

// 添加行点击事件
function addRowClickEvent() {
    $('#ddmxTable tbody tr').off('click').on('click', function(e) {
        // 如果点击的是复选框、按钮或按钮内的元素，不执行行选中逻辑
        if ($(e.target).is('input[type="checkbox"]') ||
            $(e.target).closest('input[type="checkbox"]').length ||
            $(e.target).is('.file-action-btn, .detail-btn, .view-scan-btn') ||
            $(e.target).closest('.file-action-btn, .detail-btn, .view-scan-btn').length) {
            return;
        }

        var $row = $(this);
        var $checkbox = $row.find('.row-checkbox');
        var isChecked = !$checkbox.prop('checked');

        // 先清除其他行的选中状态
        $('#ddmxTable tbody tr').removeClass('selected-row');

        // 添加当前行的选中状态
        $row.addClass('selected-row');

        // 切换复选框状态
        $checkbox.prop('checked', isChecked).trigger('change');

        console.log('行被点击，添加 selected-row 类，对账单号:', $row.find('td:eq(3)').text().trim());
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

// 在 addTableStyles 函数中添加样式
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
            
            /* 复选框列样式 */
            .row-checkbox {
                margin: 0;
                cursor: pointer;
            }
            
            /* 开票按钮样式 */
            #invoice-btn {
                margin-right: 10px;
            }
            
            /* PDF按钮样式 */
            .pdf-upload-cell {
                text-align: center;
            }
            .view-pdf-btn, .upload-pdf-btn, .delete-pdf-btn {
                min-width: 80px;
                margin: 2px;
            }
            .view-pdf-btn {
                background-color: #28a745;
                border-color: #28a745;
                color: white;
            }
            .upload-pdf-btn {
                background-color: #ffc107;
                border-color: #ffc107;
                color: #212529;
            }
            .delete-pdf-btn {
                background-color: #dc3545;
                border-color: #dc3545;
                color: white;
            }
            
            /* 新按钮悬停效果 */
            .view-pdf-btn:hover {
                background-color: #218838;
                border-color: #1e7e34;
            }
            .upload-pdf-btn:hover {
                background-color: #e0a800;
                border-color: #d39e00;
            }
            .delete-pdf-btn:hover {
                background-color: #c82333;
                border-color: #bd2130;
            }
             /* 客户要求样式 */
            .customer-requirement {
                border-radius: 4px;
                padding: 10px;
                font-size: 14px;
                padding: 3px;
            }
            .customer-requirement-label {
                font-weight: bold;
                margin-bottom: 5px;
                color: #856404;
            }
        `)
        .appendTo('head');
}

// 文件上传核心功能
$(function () {
    // 初始化文件上传组件
    initFileInput("fileInput1", "10");

    // 初始化文件上传函数
    function initFileInput(ctrlName, fileSuffix) {
        var control = $('#' + ctrlName);
        control.fileinput({
            language: 'zh',
            uploadUrl: "https://yhocn.cn:9097/file/upload",
            // 添加PDF支持
            allowedFileExtensions: ['jpg', 'gif', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'xls', 'xlsx'],
            uploadAsync: false,
            showUpload: true,
            showRemove: true,
            showPreview: true,
            showCaption: false,
            browseClass: "btn btn-primary",
            maxFileCount: 1,
            enctype: 'multipart/form-data',
            validateInitialCount: true,
            msgFilesTooMany: "只能上传一个文件！",
            // 配置PDF预览
            initialPreviewConfig: {
                type: 'object',
                // PDF预览配置
                pdfRendererUrl: 'https://mozilla.github.io/pdf.js/web/viewer.html'
            },
            // 文件类型图标
            fileActionSettings: {
                showUpload: true,
                showRemove: true,
                showZoom: false,
                showDrag: false
            },
            uploadExtraData: function () {
                var orderNumber = $("#add-orderNumber").val();
                var fileInput = document.getElementById('fileInput1');
                var fileName = "default";
                var fileExt = "jpg";

                if (fileInput.files.length > 0) {
                    var file = fileInput.files[0];
                    var originalName = file.name;
                    var originalExt = originalName.split('.').pop().toLowerCase();

                    // 保持原始文件名
                    fileName = originalName;
                    fileExt = originalExt;
                }

                console.log("上传额外数据:", {
                    file: fileName,
                    name: fileName,
                    path: "/t763812834_java_sharepic/",
                    kongjian: 3,
                    fileType: fileExt,
                    orderNumber: orderNumber
                });

                return {
                    file: fileName,  // 文件名
                    name: fileName,  // 名称
                    path: "/t763812834_java_sharepic/",  // 路径
                    kongjian: 3,  // 空间
                    fileType: fileExt,  // 文件类型
                    orderNumber: orderNumber  // 订单号
                };
            }
        }).on("fileuploaded", function (event, data) {
            // 上传成功回调
            console.log('文件上传成功:', data.response);
            if (data.response && data.response.code === 200) {
                var fileName = data.response.data.fileName || '';
                var fileExt = fileName.split('.').pop().toLowerCase();

                // 根据文件类型显示不同的成功消息
                var fileTypeText = '';
                switch(fileExt) {
                    case 'pdf':
                        fileTypeText = 'PDF文件';
                        break;
                    case 'doc':
                    case 'docx':
                        fileTypeText = 'Word文档';
                        break;
                    case 'xls':
                    case 'xlsx':
                        fileTypeText = 'Excel文件';
                        break;
                    case 'jpg':
                    case 'jpeg':
                    case 'png':
                    case 'gif':
                        fileTypeText = '图片';
                        break;
                    default:
                        fileTypeText = '文件';
                }

                alert(fileTypeText + "上传成功！");

                // 可以在这里更新表格数据
                // $('#psdTable').bootstrapTable('refresh');
            }
        }).on("fileuploaderror", function (event, data) {
            // 上传失败回调
            console.log('文件上传失败:', data);
            var errorMsg = "文件上传失败！";
            if (data.response && data.response.msg) {
                errorMsg += " 原因：" + data.response.msg;
            }
            alert(errorMsg);
        }).on('filepreupload', function(event, data, previewId, index) {
            // 文件上传前验证
            var file = data.files[index];
            if (file) {
                var maxSize = 10 * 1024 * 1024; // 10MB
                if (file.size > maxSize) {
                    alert("文件大小不能超过10MB！");
                    return false;
                }
            }
        }).on('fileloaded', function(event, file, previewId, index, reader) {
            // 文件加载后显示预览
            console.log('文件已加载:', file.name);

            // 更新订单号输入框（如果文件包含订单信息）
            var fileName = file.name;
            // 尝试从文件名中提取订单号模式
            var orderNumberPattern = /PS\d{8}\d{3}/;
            var match = fileName.match(orderNumberPattern);
            if (match) {
                $('#add-orderNumber').val(match[0]);
            }
        });
    }

    $("#add-submit-btn").click(function () {
        // 获取表单数据
        var formData = new FormData();
        var fileInput = document.getElementById('fileInput1');

        // 获取手动输入的文件名称
        var manualFileName = $('#add-fileName').val().trim();
        var orderNumber = $('#add-orderNumber').val();

        if (!manualFileName) {
            alert("请输入文件名称！");
            return;
        }

        if (!orderNumber) {
            alert("订单号不能为空！");
            return;
        }

        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];
            var originalName = file.name;
            var fileExtension = originalName.split('.').pop().toLowerCase();

            // 重要修改：使用手动输入的文件名来构建存储文件名
            // 格式：手动文件名.扩展名（而不是原来的 订单号-10.扩展名）
            var storedFileName = manualFileName;

            // 如果用户输入的文件名没有扩展名，则添加上传文件的扩展名
            if (storedFileName.lastIndexOf('.') === -1) {
                storedFileName = storedFileName + '.' + fileExtension;
            }

            // 清理文件名中的非法字符（可选）
            storedFileName = storedFileName.replace(/[\\/:*?"<>|]/g, '_');

            console.log('原始文件名:', originalName);
            console.log('手动输入的文件名:', manualFileName);
            console.log('最终存储文件名:', storedFileName);

            formData.append('file', file);
            formData.append('initialPreview', '[]');
            formData.append('initialPreviewConfig', '[]');
            formData.append('initialPreviewThumbTags', '[]');
            formData.append('file', storedFileName);  // 修改：使用手动文件名
            formData.append('name', storedFileName);   // 修改：使用手动文件名
            formData.append('path', '/t763812834_java_sharepic/');
            formData.append('kongjian', '3');
            formData.append('fileType', fileExtension);
            formData.append('orderNumber', orderNumber);

            // 添加原始文件名信息（可选，用于调试）
            formData.append('originalFileName', originalName);
            formData.append('customFileName', manualFileName);

            // 发送上传请求
            $.ajax({
                url: "https://yhocn.cn:9097/file/upload",
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    if (res.code === 200) {
                        alert("上传成功！");
                        $('#add-modal').modal('hide');

                        // 重要修改：使用手动文件名构建的完整URL
                        var fullUrl = "http://yhocn.cn:9088/t763812834_java_sharepic/" + storedFileName;

                        updatePdfFileName(orderNumber, fullUrl);

                        clearForm();

                    } else {
                        alert("上传失败：" + res.msg);
                    }
                },
                error: function (xhr, status, error) {
                    console.error('上传请求失败:', error);
                    alert("上传失败！请检查网络连接。");
                }
            });
        } else {
            alert("请选择要上传的文件！");
        }
    });

    function updatePdfFileName(ddh, pdfFileName) {
        showLoading();

        console.log('开始更新PDF文件名，订单号:', ddh, '新文件名:', pdfFileName);

        // 先查询当前已有的文件名
        $ajax({
            type: 'post',
            url: '/dzdjl/getCurrentPdfFileName',
            contentType: 'application/json',
            data: JSON.stringify({
                duizhangdanhao: ddh
            }),
            dataType: 'json'
        }, false, '', function (res) {
            if (res.code === 200) {
                var currentFileName = res.data || '';
                console.log('当前已有的文件名:', currentFileName);

                // 构建最终的文件名
                var finalFileName = '';

                if (currentFileName && currentFileName.trim() !== '') {
                    // 检查是否已包含相同的文件名（避免重复）
                    var fileList = currentFileName.split(',');
                    var alreadyExists = false;

                    for (var i = 0; i < fileList.length; i++) {
                        if (fileList[i].trim() === pdfFileName.trim()) {
                            alreadyExists = true;
                            break;
                        }
                    }

                    if (alreadyExists) {
                        // 如果已存在，使用原值
                        finalFileName = currentFileName;
                        console.log('文件名已存在，不重复添加');
                    } else {
                        // 如果不存在，用逗号分隔追加
                        finalFileName = currentFileName + ',' + pdfFileName;
                        console.log('追加新文件名，最终值:', finalFileName);
                    }
                } else {
                    // 如果没有现有值，直接使用新值
                    finalFileName = pdfFileName;
                    console.log('无现有文件名，直接设置');
                }

                // 执行更新
                performUpdatePdfFileName(ddh, finalFileName);

            } else {
                hideLoading();
                console.error("查询当前文件名失败:", res.message);
                swal("查询当前文件名失败: " + (res.message || '未知错误'));
            }
        });
    }

    // 新增：执行更新操作的函数
    function performUpdatePdfFileName(ddh, finalFileName) {
        $ajax({
            type: 'post',
            url: '/dzdjl/updatePdfFileName',
            contentType: 'application/json',
            data: JSON.stringify({
                duizhangdanhao: ddh,
                dzscwj: finalFileName
            }),
            dataType: 'json'
        }, false, '', function (res) {
            hideLoading();
            if (res.code === 200) {
                console.log("PDF文件名更新成功，最终值:", finalFileName);
                // 刷新数据
                getList(currentPage, pageSize, getSearchParams());
            } else {
                console.error("PDF文件名更新失败:", res.message);
                swal("PDF文件名更新失败: " + (res.message || '未知错误'));
            }
        });
    }

    // 关闭按钮
    $('#add-close-btn').click(function () {
        $('#add-modal').modal('hide');
        clearForm();
    });

    // 清空表单
    function clearForm() {
        $('#add-orderNumber').val('');
        // 使用文件上传组件的方法清空
        if ($.fn.fileinput && $('#fileInput1').data('fileinput')) {
            $('#fileInput1').fileinput('clear');
        } else {
            $('#fileInput1').val('');
        }
    }
});


// 清空文件输入值（辅助函数）
function clearFileValue(input) {
    input.value = '';
}

// 简单的表单转JSON函数
function formToJson(formSelector) {
    var form = document.querySelector(formSelector);
    var formData = new FormData(form);
    var json = {};

    formData.forEach(function(value, key){
        json[key] = value;
    });

    return json;
}

// 删除函数 - 适配新文件名格式
function extractAndDeleteFromUrl(filePath, ddh) {
    console.log('开始处理URL:', filePath);

    // 解析URL
    let imageUrl;
    try {
        // 如果传入的是完整URL，直接使用
        if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
            imageUrl = filePath;
        } else {
            // 否则构建完整URL
            const ddname = removeBaseUrl(filePath);
            imageUrl = "http://yhocn.cn:9088/t763812834_java_sharepic/" + ddname;
        }

        console.log('完整URL:', imageUrl);

        const url = new URL(imageUrl);

        // 获取路径部分
        const fullPath = url.pathname;

        console.log('完整路径:', fullPath);

        // 分离路径和文件名
        const lastSlashIndex = fullPath.lastIndexOf('/');
        const path = fullPath.substring(0, lastSlashIndex + 1);
        const fileName = fullPath.substring(lastSlashIndex + 1);

        console.log('路径:', path);
        console.log('文件名:', fileName);

        // 新的文件名格式：直接使用文件名（不包含 -数字 后缀）
        // 例如: 合同.pdf、发票.jpg 等
        const fileExt = fileName.split('.').pop().toLowerCase();

        // 验证文件扩展名
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'gif', 'bmp', 'webp', 'tiff', 'doc', 'docx', 'xls', 'xlsx'];

        if (!allowedExtensions.includes(fileExt)) {
            console.error('不支持的文件格式:', fileExt);
            alert(`错误: 不支持的文件格式 ${fileExt}\n支持的文件格式: ${allowedExtensions.join(', ')}`);
            return;
        }

        console.log('文件扩展名:', fileExt);
        console.log('使用订单号作为文件名标识:', ddh);

        // 调用删除接口
        deleteFiles(ddh, path, fileName);

    } catch (error) {
        console.error('URL处理错误:', error);
        alert('URL格式错误: ' + error.message);
    }
}

// 删除函数 - 修复版本
async function deleteFiles(ddh, path,orderNumber) {
    consloe.log("删除传参数orderNumber",orderNumber)
    consloe.log("删除传参数path",path)

    try {

        let cleanOrderNumber = orderNumber;

        if (orderNumber.includes('.')) {
            // 方法A：只取第一个点之前的内容
            cleanOrderNumber = orderNumber.split('.')[0];  // "ceshiceshi.pdf" → "ceshiceshi"

            // 方法B：取最后一个点之前的所有内容（适合多个点的情况）
            // cleanOrderNumber = orderNumber.substring(0, orderNumber.lastIndexOf('.'));

            console.log('清理订单号:', orderNumber, '→', cleanOrderNumber);
        }

        const params = new URLSearchParams({
            order_number: cleanOrderNumber,
            path: path
        });



        // 尝试两种可能的端口
        const endpoints = [
            'https://yhocn.cn:9097/file/delete'  // 和上传同端口
        ];

        let success = false;
        let errorMessage = '所有接口都不可用';
        let result;

        // 尝试所有可能的端点
        for (const baseUrl of endpoints) {
            const url = `${baseUrl}?${params.toString()}`;
            console.log('尝试请求URL:', url);

            try {
                // 先尝试POST
                let response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                console.log('响应状态:', response.status);

                if (response.ok) {
                    result = await response.json();
                    success = true;
                    break;
                } else {
                    // 尝试GET
                    const getResponse = await fetch(url, {
                        method: 'GET'
                    });

                    if (getResponse.ok) {
                        result = await getResponse.json();
                        console.log('GET删除成功:', result);
                        success = true;
                        break;
                    } else {
                        errorMessage = `服务器返回错误: ${getResponse.status} ${getResponse.statusText}`;
                    }
                }
            } catch (error) {
                console.log(`${baseUrl} 请求失败:`, error.message);
                errorMessage = `网络请求失败: ${error.message}`;
            }
        }

        if (success) {
            swal({
                title: "删除成功！",
                text: `订单 ${orderNumber} 的文件已成功删除`,
                icon: "success",
                button: "确定"
            });
        } else {
            swal({
                title: "删除失败",
                text: errorMessage,
                icon: "error",
                button: "确定"
            });
        }

        return { success, result };

    } catch (error) {
        console.error('删除操作异常:', error);
        swal({
            title: "删除失败",
            text: `系统异常: ${error.message}`,
            icon: "error",
            button: "确定"
        });
        return { success: false, error: error.message };
    }
}

function removeBaseUrl(fullUrl) {
    const baseUrl = 'http://yhocn.cn:9088/t763812834_java_sharepic/';
    if (fullUrl.startsWith(baseUrl)) {
        return fullUrl.substring(baseUrl.length);
    }
    return fullUrl; // 如果不匹配，返回原字符串
}

// 删除后更新字段 - 支持删除单个文件
function clearFileRecord(ddh, fileUrlToRemove) {
    // 如果传入了要删除的文件URL，则只删除该文件
    if (fileUrlToRemove) {
        console.log('删除单个文件记录:', fileUrlToRemove, '订单号:', ddh);

        // 先获取当前文件列表
        $ajax({
            type: 'post',
            url: '/dzdjl/getCurrentPdfFileName',
            contentType: 'application/json',
            data: JSON.stringify({
                duizhangdanhao: ddh
            }),
            dataType: 'json'
        }, false, '', function (res) {
            if (res.code === 200) {
                var currentFiles = res.data || '';
                console.log('当前文件列表:', currentFiles);

                if (currentFiles && currentFiles.trim() !== '') {
                    // 从文件列表中移除指定的文件
                    var fileList = currentFiles.split(',');
                    var newFileList = [];

                    for (var i = 0; i < fileList.length; i++) {
                        var file = fileList[i].trim();
                        if (file !== fileUrlToRemove.trim() && file !== '') {
                            newFileList.push(file);
                        }
                    }

                    var newFiles = newFileList.join(',');
                    console.log('删除后新的文件列表:', newFiles);

                    // 更新数据库
                    updateField(ddh, 'dzscwj', newFiles, function() {
                        // 刷新数据
                        getList(currentPage, pageSize, getSearchParams());
                    });
                }
            }
        });
    } else {
        // 如果没有指定文件，清空所有文件（保持向后兼容）
        updateField(ddh, 'dzscwj', '', function() {
            // 刷新数据
            getList(currentPage, pageSize, getSearchParams());
        });
    }
}

// 更新字段数据
function updateField(ddh, fieldName, fieldValue, callback) {
    showLoading();

    $ajax({
        type: 'post',
        url: '/dzdjl/updateByDdh',
        contentType: 'application/json',
        data: JSON.stringify({
            ddh: ddh,
            fieldName: fieldName,
            fieldValue: fieldValue
        }),
        dataType: 'json'
    }, false, '', function (res) {
        hideLoading();
        if (res.code === 200) {
            getList();
            if (callback && typeof callback === 'function') {
                callback();
            }
            // 如果是文件相关操作，刷新数据
            if (fieldName.includes('pdf') || fieldName.includes('file')) {
                getList(currentPage, pageSize, getSearchParams());
            }
        }else if(res.code === 403){
            swal("权限不足！ ");
        } else {
            console.error(fieldName + "字段更新失败:", res.message);
            swal(fieldName + "字段更新失败: " + (res.message || '未知错误'));
            // 更新失败时恢复原值
            if (fieldName === 'sfkp') {
                var $select = $('.sfkp-select[data-ddh="' + ddh + '"]');
                $select.val($select.data('original-value'));
            }
        }
    });
}


// 删除上传文件函数
function deleteUploadedFile() {
    console.log('执行删除上传文件操作...');

    // 获取选中的行
    var selectedRow = getSelectedRow();

    if (!selectedRow) {
        alert('未选择订单\n请先在表格中选中一行订单，然后再删除文件');
        return;
    }

    // 获取订单号和文件路径
    var ddh = selectedRow.ddh;
    var filePath = selectedRow.pdf_file_name;

    if (!ddh) {
        alert('订单号为空\n选中行的订单号为空，无法删除文件');
        return;
    }

    // 使用原生 confirm 对话框
    var willDelete = confirm(`确定要删除订单 ${ddh} 的上传文件吗？`);

    if (willDelete) {
        console.log('用户确认删除，开始执行删除操作...');

        // 显示加载中
        $('#delete-btn').prop('disabled', true).html('<i class="bi bi-hourglass-split icon"></i> 删除中...');

        try {
            // 调用提取和删除函数
            extractAndDeleteFromUrl(filePath, ddh);

            // 同时需要清空数据库中的文件记录
            clearFileRecord(ddh);

            // 显示成功消息
            alert(`删除成功！\n订单 ${ddh} 的文件已删除`);
        } catch (error) {
        } finally {
            $('#delete-btn').prop('disabled', false).html('<i class="bi bi-trash icon"></i> 删除上传文件');
        }
    } else {
        console.log('用户取消删除操作');
    }
}

// ========== 新增导出Excel功能 ==========

// 初始化导出配置（默认选择所有列）
function initExportConfig() {
    exportColumnsConfig.mainColumns = exportColumnsConfig.allMainColumns.map(col => col.key);
}

// 显示导出模态框
function showExportModal() {
    var modalHtml = `
        <div class="modal fade" id="exportModal" tabindex="-1" role="dialog" aria-labelledby="exportModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-md" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exportModalLabel">导出Excel设置</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="alert alert-info">
                                    <i class="bi bi-info-circle"></i> 导出的Excel将包含您选择的主表字段，并固定拼接详情表字段。
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-12">
                                <h6><i class="bi bi-list-check"></i> 主表字段选择</h6>
                                <div class="export-columns-container" style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
                                    <div class="form-check mb-2">
                                        <input type="checkbox" class="form-check-input" id="selectAllColumns">
                                        <label class="form-check-label" for="selectAllColumns">
                                            <strong>全选/全不选</strong>
                                        </label>
                                    </div>
                                    <div id="mainColumnsList">
                                        <!-- 主表列复选框将在这里动态生成 -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="exportFileName">导出文件名：</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="exportFileName" value="对账单_${formatDate(new Date())}">
                                        <div class="input-group-append">
                                            <span class="input-group-text">.xlsx</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-success" id="confirmExport">
                            <i class="bi bi-file-earmark-excel"></i> 导出Excel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 如果模态框已存在，先移除
    $('#exportModal').remove();

    // 添加到页面
    $('body').append(modalHtml);

    // 显示模态框
    $('#exportModal').modal('show');

    // 渲染主表列复选框
    renderMainColumnsList();

    // 绑定事件
    bindExportModalEvents();
}

// 渲染主表列复选框
function renderMainColumnsList() {
    var columnsHtml = '';
    exportColumnsConfig.allMainColumns.forEach(function(column) {
        var isChecked = exportColumnsConfig.mainColumns.includes(column.key) ? 'checked' : '';
        columnsHtml += `
            <div class="form-check mb-2">
                <input type="checkbox" class="form-check-input main-column-checkbox" 
                       id="col_${column.key}" value="${column.key}" ${isChecked}>
                <label class="form-check-label" for="col_${column.key}">
                    ${column.name}
                </label>
            </div>
        `;
    });

    $('#mainColumnsList').html(columnsHtml);

    // 更新全选复选框状态
    updateSelectAllCheckbox();
}

// 绑定导出模态框事件
function bindExportModalEvents() {
    // 全选/全不选
    $('#selectAllColumns').off('change').on('change', function() {
        var isChecked = $(this).prop('checked');
        $('.main-column-checkbox').prop('checked', isChecked);

        if (isChecked) {
            exportColumnsConfig.mainColumns = exportColumnsConfig.allMainColumns.map(col => col.key);
        } else {
            exportColumnsConfig.mainColumns = [];
        }
    });

    // 单个复选框变化
    $('.main-column-checkbox').off('change').on('change', function() {
        var columnKey = $(this).val();

        if ($(this).prop('checked')) {
            if (!exportColumnsConfig.mainColumns.includes(columnKey)) {
                exportColumnsConfig.mainColumns.push(columnKey);
            }
        } else {
            var index = exportColumnsConfig.mainColumns.indexOf(columnKey);
            if (index > -1) {
                exportColumnsConfig.mainColumns.splice(index, 1);
            }
        }

        // 更新全选复选框状态
        updateSelectAllCheckbox();
    });

    // 确认导出
    $('#confirmExport').off('click').on('click', function() {
        var fileName = $('#exportFileName').val().trim();
        if (!fileName) {
            fileName = `对账单_${formatDate(new Date())}`;
        }

        // 确保文件名有.xlsx扩展名
        if (!fileName.endsWith('.xlsx')) {
            fileName += '.xlsx';
        }

        $('#exportModal').modal('hide');
        exportToExcel(fileName);
    });
}

// 更新全选复选框状态
function updateSelectAllCheckbox() {
    var allChecked = $('.main-column-checkbox').length ===
        $('.main-column-checkbox:checked').length;
    $('#selectAllColumns').prop('checked', allChecked);
}

function exportToExcel(fileName) {
    // 检查是否选择了行
    var selectedRow = getSelectedRow();

    if (!selectedRow || !selectedRow.duizhangdanhao) {
        swal({
            title: '请选择订单',
            text: '请先在表格中选择一行订单，然后再导出Excel',
            icon: 'warning',
            buttons: {
                confirm: '确定'
            }
        });
        return;
    }

    // 显示导出进度
    swal({
        title: '正在导出...',
        text: '正在获取数据并生成Excel文件，请稍候...',
        icon: 'info',
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false
    });

    // 获取用户选择的字段
    var selectedColumns = exportColumnsConfig.mainColumns;

    // 如果没有选择任何字段，使用所有字段
    if (selectedColumns.length === 0) {
        selectedColumns = exportColumnsConfig.allMainColumns.map(col => col.key);
    }

    console.log('=== 导出配置信息 ===');
    console.log('用户选择的主表列:', selectedColumns);
    console.log('固定的详情列:', exportColumnsConfig.detailColumns);
    console.log('选中的订单号:', selectedRow.duizhangdanhao);

    // 获取字段显示名称的映射
    var selectedColumnNames = {};
    exportColumnsConfig.allMainColumns.forEach(col => {
        if (selectedColumns.includes(col.key)) {
            selectedColumnNames[col.key] = col.name;
        }
    });
    console.log('字段名称映射:', selectedColumnNames);

    // 获取当前搜索条件（包括选中的订单号）
    var searchParams = getSearchParams();

    // 调用后端接口获取数据，将选中的订单号作为查询条件
    $ajax({
        type: 'post',
        url: '/dzdjl/daochuexcel',
        contentType: 'application/json',
        data: JSON.stringify({
            pageNum: 1,
            pageSize: 99999999,
            // 传递搜索条件
            khmc: searchParams.khmc || '',
            ddh: searchParams.htbh || '',
            startDate: searchParams.startDate || '',
            endDate: searchParams.endDate || '',
            // 新增：传递选中的订单号作为查询条件
            duizhangdanhao: selectedRow.duizhangdanhao || ''
        }),
        dataType: 'json'
    }, false, '', function (res) {
        swal.close();

        console.log('=== 导出接口响应 ===');
        console.log('响应码:', res.code);
        console.log('响应数据:', res.data);

        if (res.code === 200 && res.data) {
            // 根据返回的数据结构处理数据并导出
            processExportData(res.data, selectedColumns, selectedColumnNames, fileName);
        } else {
            console.error('导出失败:', res.message);
            swal('导出失败', res.message || '数据获取失败', 'error');
        }
    });
}

// 处理导出数据
function processExportData(apiData, selectedColumns, columnMapping, fileName) {
    try {
        var exportData = [];

        // 判断数据结构 - 根据实际返回的数据结构处理
        var dataList = [];

        if (Array.isArray(apiData)) {
            // 如果返回的是数组
            dataList = apiData;
        } else if (apiData.records && Array.isArray(apiData.records)) {
            // 如果返回的是分页格式
            dataList = apiData.records;
        } else if (apiData.list && Array.isArray(apiData.list)) {
            // 如果返回的是list格式
            dataList = apiData.list;
        } else {
            console.log('API返回数据:', apiData);
            throw new Error('数据格式不正确，请检查数据结构');
        }

        console.log('=== 数据调试信息 ===');
        console.log('处理数据条数:', dataList.length);
        if (dataList.length > 0) {
            console.log('第一条完整数据:', JSON.stringify(dataList[0], null, 2));

            // 检查数据字段
            var sample = dataList[0];
            console.log('数据包含的字段:', Object.keys(sample).sort());

            // 检查详情字段是否存在
            var detailFields = ['pm', 'ggxh', 'dw', 'sl', 'dj', 'fhsj', 'zj'];
            detailFields.forEach(function(field) {
                console.log(`字段 ${field}: ${sample[field] || '空'}`);
            });
        }

        // 处理每条数据
        dataList.forEach(function(item, index) {
            var exportRow = createExportRowForDzd(item, selectedColumns, columnMapping);
            exportData.push(exportRow);
        });

        console.log('导出数据条数:', exportData.length);
        if (exportData.length > 0) {
            console.log('第一条导出数据:', exportData[0]);
        }

        // 导出到Excel
        if (exportData.length > 0) {
            exportDataToExcel(exportData, fileName);
        } else {
            swal('导出失败', '没有找到可导出的数据', 'warning');
        }

    } catch (error) {
        console.error('数据处理失败:', error);
        swal('导出失败', '数据处理过程中发生错误: ' + error.message, 'error');
    }
}

// 创建对账单导出行
function createExportRowForDzd(item, selectedColumns, columnMapping) {
    var row = {};

    // 1. 添加用户选择的主表列
    selectedColumns.forEach(function(colKey) {
        var displayName = columnMapping[colKey] || colKey;
        var value = '';

        // 根据字段名从数据中获取值
        switch(colKey) {
            case 'wf':
                // wf需要计算：总价 - 已付
                var totalValue = parseFloat(item.yfsj) || 0;
                var paidValue = parseFloat(item.yifu) || 0;
                value = (totalValue - paidValue).toFixed(2);
                break;
            default:
                // 其他字段直接获取
                value = item[colKey] || '';
        }

        row[displayName] = value;
    });

    // 2. 添加固定的详情列
    exportColumnsConfig.detailColumns.forEach(function(detailCol) {
        var value = '';

        // 根据中文列名获取对应的字段值
        switch(detailCol) {
            case '品名':
                value = item.pm || '';
                break;
            case '规格型号':
                value = item.ggxh || '';
                break;
            case '单位':
                value = item.dw || '';
                break;
            case '数量':
                value = item.sl || '';
                break;
            case '单价':
                value = item.dj || '';
                break;
            case '发货时间':
                value = item.fhsj || '';
                break;
            default:
                // 尝试使用映射
                var fieldName = mapDetailColumnName(detailCol);
                value = item[fieldName] || '';
        }

        row[detailCol] = value;
    });

    return row;
}

// 映射详情列中文名到字段名 - 简化版
function mapDetailColumnName(chineseName) {
    // 更直接的映射关系
    var mapping = {
        '品名': 'pm',
        '规格型号': 'ggxh',
        '单位': 'dw',
        '数量': 'sl',
        '单价': 'dj',
        '发货时间': 'fhsj',
        '总价': 'zj'
    };

    return mapping[chineseName];
}

// 使用SheetJS导出Excel
function exportDataToExcel(data, fileName) {
    try {
        // 检查是否加载了SheetJS库
        if (typeof XLSX === 'undefined') {
            // 动态加载SheetJS库
            loadSheetJS().then(function() {
                createExcelFile(data, fileName);
            }).catch(function(error) {
                console.error('加载SheetJS库失败:', error);
                swal('导出失败', '请检查网络连接或联系管理员', 'error');
            });
        } else {
            createExcelFile(data, fileName);
        }
    } catch (error) {
        console.error('Excel导出失败:', error);
        swal('导出失败', '生成Excel文件时发生错误', 'error');
    }
}

// 创建Excel文件
function createExcelFile(data, fileName) {
    // 创建工作簿
    var wb = XLSX.utils.book_new();

    // 准备工作表数据
    var wsData = [];

    // 添加表头
    if (data.length > 0) {
        var headers = Object.keys(data[0]);
        wsData.push(headers);
    }

    // 添加数据行
    data.forEach(function(row) {
        var rowData = [];
        var headers = Object.keys(data[0]);
        headers.forEach(function(header) {
            rowData.push(row[header] || '');
        });
        wsData.push(rowData);
    });

    // 创建工作表
    var ws = XLSX.utils.aoa_to_sheet(wsData);

    // 设置列宽
    var colWidths = [];
    var headers = Object.keys(data[0] || {});
    headers.forEach(function(header) {
        colWidths.push({ wch: Math.max(header.length, 10) });
    });
    ws['!cols'] = colWidths;

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '对账单明细');

    // 导出Excel文件
    XLSX.writeFile(wb, fileName);

    swal('导出成功', `文件 ${fileName} 已生成并开始下载`, 'success');
}

// 动态加载SheetJS库
function loadSheetJS() {
    return new Promise(function(resolve, reject) {
        if (typeof XLSX !== 'undefined') {
            resolve();
            return;
        }

        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// 为对账单页面添加导出样式
function addExportModalStyles() {
    if ($('#export-modal-styles').length) return;

    $('<style id="export-modal-styles">')
        .prop('type', 'text/css')
        .html(`
            .export-columns-container {
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                padding: 15px;
            }
            .export-columns-container .form-check {
                margin-bottom: 8px;
            }
            .export-columns-container .form-check-input {
                margin-top: 0.3rem;
            }
            .export-columns-container .form-check-label {
                padding-left: 5px;
                cursor: pointer;
            }
            #exportFileName {
                font-weight: bold;
            }
            .input-group-text {
                background-color: #e9ecef;
                font-weight: bold;
            }
        `)
        .appendTo('head');
}

// 在页面加载时添加导出样式
$(document).ready(function() {
    addExportModalStyles();
});


// 绑定复选框事件（使用订单号）
function bindCheckboxEvents() {
    // 全选/全不选
    $('#selectAllRows').off('change').on('change', function() {
        var isChecked = $(this).prop('checked');
        $('.row-checkbox').prop('checked', isChecked);

        if (isChecked) {
            // 选中当前页所有行
            $('#ddmxTable tbody tr').each(function() {
                var $row = $(this);
                var ddh = $row.data('ddh'); // 获取订单号
                var rowData = getRowData($row);

                if (ddh && !selectedDdhs.includes(ddh)) {
                    selectedDdhs.push(ddh);
                    selectedRows.push(rowData);
                    $row.addClass('selected-row'); // 添加选中样式
                }
            });
        } else {
            // 取消选中当前页所有行
            $('#ddmxTable tbody tr').each(function() {
                var $row = $(this);
                var ddh = $row.data('ddh'); // 获取订单号
                var index = selectedDdhs.indexOf(ddh);

                if (index > -1) {
                    selectedDdhs.splice(index, 1);
                    selectedRows.splice(index, 1);
                    $row.removeClass('selected-row'); // 移除选中样式
                }
            });
        }

        updateInvoiceButtonState();
        console.log('全选操作，当前选中订单号:', selectedDdhs);
    });

    // 单个复选框选择
    $('.row-checkbox').off('change').on('change', function(e) {
        e.stopPropagation(); // 阻止事件冒泡

        var $checkbox = $(this);
        var isChecked = $checkbox.prop('checked');
        var ddh = $checkbox.data('ddh'); // 改为获取订单号
        var $row = $checkbox.closest('tr');
        var rowData = getRowData($row);

        console.log('复选框选择 - 订单号:', ddh, '状态:', isChecked);

        if (isChecked) {
            // 添加到选中列表
            if (ddh && !selectedDdhs.includes(ddh)) {
                selectedDdhs.push(ddh);
                selectedRows.push(rowData);
                $row.addClass('selected-row'); // 添加选中样式
            }
        } else {
            // 从选中列表移除
            var index = selectedDdhs.indexOf(ddh);
            if (index > -1) {
                selectedDdhs.splice(index, 1);
                selectedRows.splice(index, 1);
                $row.removeClass('selected-row'); // 移除选中样式
            }
        }

        // 更新全选复选框状态
        updateSelectAllCheckboxState();
        updateInvoiceButtonState();

        console.log('单个选择，当前选中订单号:', selectedDdhs);
    });
}

// 获取行数据
function getRowData($row) {
    // 获取订单号
    var ddh = $row.data('ddh') ||
        $row.find('.row-checkbox').data('ddh') ||
        $row.find('td:eq(2)').text().trim(); // 从订单号列获取

    console.log('getRowData - 获取订单号:', {
        'data-ddh': $row.data('ddh'),
        'checkbox-data-ddh': $row.find('.row-checkbox').data('ddh'),
        '文本订单号': $row.find('td:eq(2)').text().trim(),
        '最终订单号': ddh
    });

    return {
        ddh: ddh, // 返回订单号
        khmc: $row.find('td:eq(3)').text().trim(),
        sfkp: $row.find('td:eq(10)').text().trim(),
        ddrq: $row.find('td:eq(2)').text().trim(),
        fzr: $row.find('td:eq(4)').text().trim(),
        yfsj: $row.find('td:eq(5)').text().trim(),
        yifu: $row.find('td:eq(6)').text().trim(),
        wf: $row.find('td:eq(7)').text().trim(),
        kpsj: $row.find('td:eq(9)').text().trim(),
        dzzt: $row.find('td:eq(11)').text().trim()
    };
}

// 更新全选复选框状态
function updateSelectAllCheckboxState() {
    var totalCheckboxes = $('#ddmxTable tbody tr .row-checkbox').length;
    var checkedCheckboxes = $('#ddmxTable tbody tr .row-checkbox:checked').length;
    var allChecked = totalCheckboxes > 0 && totalCheckboxes === checkedCheckboxes;
    $('#selectAllRows').prop('checked', allChecked);
}

// 更新开票按钮状态
function updateInvoiceButtonState() {
    if (selectedDdhs.length > 0) {
        $('#invoice-btn').prop('disabled', false);
    } else {
        $('#invoice-btn').prop('disabled', true);
    }
}

// 批量开票功能
function batchInvoice() {
    if (selectedDdhs.length === 0) {
        swal('请先选择要开票的订单');
        return;
    }

    // 检查选中的订单是否都满足开票条件
    var canInvoice = true;
    var errorMessages = [];

    selectedRows.forEach(function(row, index) {
        if (row.sfkp === '已开票') {
            canInvoice = false;
            errorMessages.push(`订单 ${row.ddh} 已经开票`);
        }
    });

    if (!canInvoice) {
        swal({
            title: '开票失败',
            text: '以下订单已经开票，无法重复开票：\n' + errorMessages.join('\n'),
            icon: 'warning',
            buttons: {
                confirm: '确定'
            }
        });
        return;
    }

    performBatchInvoice();
}

// 执行批量开票
function performBatchInvoice() {
    showLoading();

    // 获取当前时间
    var currentTime = formatDateTime(new Date());

    // 直接使用订单号数组
    var ddhsToSend = selectedDdhs.filter(function(ddh) {
        return ddh !== undefined && ddh !== null && ddh !== '';
    });

    if (ddhsToSend.length === 0) {
        hideLoading();
        swal({
            title: '开票失败',
            text: '未获取到有效的订单号',
            icon: 'error',
            buttons: {
                confirm: '确定'
            }
        });
        return;
    }

    // 准备开票数据 - 使用订单号
    var invoiceData = {
        ddhs: ddhsToSend,  // 订单号数组
        kpsj: currentTime,  // 开票时间
        sfkp: '已开票'      // 开票状态
    };

    console.log('提交开票数据:', invoiceData);
    console.log('原始选中的订单号:', selectedDdhs);
    console.log('处理后的订单号:', ddhsToSend);

    // 调用开票接口 - 注意：后端接口需要支持订单号数组
    $ajax({
        type: 'post',
        url: '/dzdjl/batchUpdateInvoiceStatusByDdh',
        contentType: 'application/json',
        data: JSON.stringify(invoiceData),
        dataType: 'json'
    }, false, '', function (res) {
        hideLoading();
        if (res.code === 200) {
            console.log("批量开票成功:", res);
            swal({
                title: '开票成功',
                text: `成功为 ${ddhsToSend.length} 个订单更新开票状态`,
                icon: 'success',
                buttons: {
                    confirm: '确定'
                }
            });

            // 清空选择状态
            selectedDdhs = [];
            selectedRows = [];

            // 刷新数据
            forceRefresh();
        } else if(res.code == 403){
            swal("权限不足，无法访问此功能！");
        } else {
            console.error("批量开票失败:", res.message);
            swal({
                title: '开票失败',
                text: res.message || '未知错误',
                icon: 'error',
                buttons: {
                    confirm: '确定'
                }
            });
        }
    }).fail(function(xhr, status, error) {
        hideLoading();
        console.error("开票请求失败:", error);
        swal({
            title: '开票失败',
            text: '请求失败，请检查网络连接',
            icon: 'error',
            buttons: {
                confirm: '确定'
            }
        });
    });
}


function yaoqiu() {
    console.log("开始获取客户要求数据");

    $ajax({
        type: 'post',
        url: '/kehu/getyaoqiu',
        contentType: 'application/json',
        data: JSON.stringify({}),
        dataType: 'json'
    }, false, '', function (res) {
        if (res.code === 200) {
            console.log("成功获取客户要求数据:", res.data);

            // 清空之前的数据
            customerRequirements = {};
            customerRequirementsList = res.data || [];

            // 将数据转换为以khmc为key的对象，方便快速查找
            if (customerRequirementsList && customerRequirementsList.length > 0) {
                customerRequirementsList.forEach(function(item) {
                    if (item.khmc && item.yq) {
                        customerRequirements[item.khmc.trim()] = item.yq;
                    }
                });
            }

            console.log("客户要求数据已保存，共", customerRequirementsList.length, "条记录");
            console.log("转换后的客户要求对象:", customerRequirements);

        } else if(res.code == 403){
            swal("权限不足，无法访问此功能！");
        } else {
            console.error("获取客户要求失败:", res.message);
            // swal("获取客户要求失败: " + (res.message || '未知错误'));
        }
    });

}


// 新增：根据客户名称获取客户要求
function getCustomerRequirement(customerName) {
    if (!customerName) return '';

    // 先尝试从转换后的对象中查找（精确匹配）
    var requirement = customerRequirements[customerName.trim()];
    if (requirement) {
        return requirement;
    }

    // 如果精确匹配没找到，尝试模糊匹配
    var found = customerRequirementsList.find(function(item) {
        return item.khmc && item.khmc.includes(customerName.trim());
    });

    return found ? found.yq : '';
}


