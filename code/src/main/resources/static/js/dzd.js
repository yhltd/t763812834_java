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
        url: '/dzd/updateDzztStatus',
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
function generatePrintContent(rowData, detailData) {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1; // 获取当前月份
    var currentYear = currentDate.getFullYear();

    // 按照新规则计算金额
    var paidAmount = parseFloat(rowData.yifu) || 0;        // 已付金额
    var unpaidAmount = parseFloat(rowData.wf) || 0;        // 未付金额
    var currentPeriodAmount = calculateTotal(detailData);  // 本期金额 = 列表总价汇总
    var openingAmount = (paidAmount - unpaidAmount).toFixed(2); // 期初金额 = 已付 - 未付
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
        url: '/dzd/getDetailByDdh',
        contentType: 'application/json',
        data: JSON.stringify({ ddh: ddh }),
        dataType: 'json'
    }, false, '', function (res) {
        if (res.code === 200) {
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
        khmc: $('#khmc').val() || '',    // 乙方名称
        htbh: $('#htbh').val() || '',    // 合同编号
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
        url: '/dzd/distinctPage',
        contentType: 'application/json',
        data: JSON.stringify({
            pageNum: currentPage,
            pageSize: pageSize,
            khmc: searchParams.khmc || '',    // 乙方名称
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

// 填充表格 - 渲染订单明细字段（所有字段只读）
function fillTable(data) {
    console.log("返回数据", data)
    $('#ddmxTable').empty();

    var tableHeader = `
        <thead>
            <tr>
                <th width="60">序号</th>
                <th width="100">订单日期</th>
                <th width="160">订单号</th>
                <th width="180">客户名称</th>
                <th width="80">负责人</th>
                <th width="100">总价</th>
                <th width="80">已付</th>
                <th width="80">未付</th>
                <th width="100">开票时间</th>
                <th width="80">开票状态</th>
                <th width="100">对账状态</th>
                <th width="350">PDF文件</th>
                <th width="90">操作</th>
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

            // 判断是否有PDF文件
            var hasPdf = item.pdf_file_name && item.pdf_file_name !== '';

            tableBody += `
                <tr data-id="${item.id || index}" 
                    data-ddh="${item.ddh || ''}" 
                    data-lxr="${item.lxr || ''}">
                    <td>${serialNumber}</td>
                    <td>${item.ddrq || ''}</td>
                    <td>${item.ddh || ''}</td>
                    <td>${item.khmc || ''}</td>
                    <td>${item.fzr || ''}</td>
                    <td>${item.yfsj || ''}</td>
                    <td>${item.yifu || ''}</td>
                    <td>${weifu}</td>
                    <td>${item.kpsj || ''}</td>
                    <td>${item.sfkp || ''}</td>
                    <td>${item.dzzt || ''}</td>
                    <td class="pdf-upload-cell">
                        ${hasPdf ? `
                            <!-- 有PDF文件时的按钮 -->
                            <button class="btn btn-sm btn-success view-pdf-btn" 
                                    data-ddh="${item.ddh || ''}">
                                <i class="bi bi-file-earmark-pdf"></i> 查看PDF
                            </button>
                            <button class="btn btn-sm btn-danger delete-pdf-btn" 
                                    data-ddh="${item.ddh || ''}"
                                    style="margin-top: 2px;">
                                <i class="bi bi-trash"></i> 删除
                            </button>
                        ` : `
                            <!-- 没有PDF文件时的按钮 -->
                            <button class="btn btn-sm btn-warning upload-pdf-btn" 
                                    data-ddh="${item.ddh || ''}">
                                <i class="bi bi-cloud-upload"></i> 上传PDF
                            </button>
                        `}
                        <input type="file" class="pdf-file-input" data-ddh="${item.ddh || ''}" accept=".pdf" style="display: none;">
                    </td>
                    <td>
                        <button class="btn btn-sm btn-info detail-btn" 
                                data-ddh="${item.ddh || ''}">
                            <i class="bi bi-eye"></i> 详情
                        </button>
                    </td>
                </tr>
            `;
        });
    } else {
        tableBody += `
            <tr>
                <td colspan="13" style="text-align: center; color: #999;">暂无订单数据</td>
            </tr>
        `;
    }

    tableBody += '</tbody>';
    $('#ddmxTable').html(tableHeader + tableBody);
    addRowClickEvent();
    bindDetailButtonEvents();
    bindViewPdfEvents();      // 绑定查看PDF事件
    bindUploadPdfEvents();    // 绑定上传PDF事件
    bindDeletePdfEvents();    // 绑定删除PDF事件

    // 添加调试信息
    console.log('表格渲染完成，数据条数:', data ? data.length : 0);
    console.log('第一条数据样例:', data && data.length > 0 ? data[0] : '无数据');
}

// 绑定查看PDF事件
function bindViewPdfEvents() {
    console.log('绑定查看PDF事件...');

    $('.view-pdf-btn').off('click.view').on('click.view', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $btn = $(this);
        var ddh = $btn.data('ddh');

        console.log('查看PDF按钮点击，订单号:', ddh);

        if (!ddh) {
            swal('订单号不能为空');
            return;
        }

        viewPdfFile(ddh);
    });
}

// 绑定上传PDF事件
function bindUploadPdfEvents() {
    console.log('绑定上传PDF事件...');

    $('.upload-pdf-btn').off('click.upload').on('click.upload', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $btn = $(this);
        var ddh = $btn.data('ddh');
        var $fileInput = $btn.closest('td').find('.pdf-file-input');

        console.log('上传PDF按钮点击，订单号:', ddh, '找到文件输入框:', $fileInput.length);

        if (!ddh) {
            swal('订单号不能为空');
            return;
        }

        // 触发文件选择
        $fileInput.trigger('click');
    });

    // 文件选择变化事件
    $('.pdf-file-input').off('change.upload').on('change.upload', function(e) {
        console.log('文件选择框变化事件触发');

        var file = e.target.files[0];
        var ddh = $(this).data('ddh');

        console.log('选择的文件:', file ? file.name : '无文件', '订单号:', ddh);

        if (!file) {
            return;
        }

        // 验证文件类型
        if (file.type !== 'application/pdf') {
            swal('请选择PDF文件');
            $(this).val('');
            return;
        }

        // 验证文件大小（限制为10MB）
        if (file.size > 10 * 1024 * 1024) {
            swal('文件大小不能超过10MB');
            $(this).val('');
            return;
        }

        // 上传文件
        uploadPdfFile(ddh, file);

        // 清空文件输入，允许重复选择同一个文件
        $(this).val('');
    });
}

// 绑定删除PDF按钮事件
function bindDeletePdfEvents() {
    $('.delete-pdf-btn').off('click').on('click', function(e) {
        e.stopPropagation();

        var $btn = $(this);
        var ddh = $btn.data('ddh');

        if (!ddh) {
            swal('订单号不能为空');
            return;
        }

        // 确认删除操作
        if (!confirm('确定要删除订单 ' + ddh + ' 的PDF文件吗？此操作不可恢复！')) {
            return;
        }

        deletePdfFile(ddh, $btn);
    });
}

// 上传PDF文件
function uploadPdfFile(ddh, file) {
    if (!ddh || !file) {
        swal('参数错误');
        return;
    }

    showLoading();

    // 创建FormData对象
    var formData = new FormData();
    formData.append('ddh', ddh);
    formData.append('pdfFile', file);

    console.log('开始上传PDF文件，订单号:', ddh, '文件:', file.name, '大小:', file.size);

    // 使用原生 fetch 或修改 $ajax 调用方式
    fetch('/ddmx/uploadPdf', {
        method: 'POST',
        body: formData,
        // 不要设置 Content-Type，让浏览器自动设置
    })
        .then(response => response.json())
        .then(res => {
            hideLoading();
            if (res.code === 200) {
                console.log("PDF文件上传成功", res);
                swal('PDF文件上传成功！');
                // 上传成功后刷新数据
                getList(currentPage, pageSize, getSearchParams());
            } else {
                console.error("PDF文件上传失败:", res.message);
                swal("PDF文件上传失败: " + (res.message || '未知错误'));
            }
        })
        .catch(error => {
            hideLoading();
            console.error("上传请求失败:", error);
            swal("上传请求失败，请检查网络连接");
        });
}

// 查看PDF文件（在线预览）- 修正版
function viewPdfFile(ddh) {
    if (!ddh) {
        swal('订单号不能为空');
        return;
    }

    console.log('查看PDF文件，订单号:', ddh);

    // 方法1：直接打开新窗口（推荐）
    const url = `/ddmx/viewPdf?ddh=${encodeURIComponent(ddh)}`;
    window.open(url, '_blank');
}

// 删除PDF文件
function deletePdfFile(ddh, $btn) {
    if (!ddh) {
        swal('订单号不能为空');
        return;
    }

    showLoading();

    // 禁用按钮防止重复点击
    if ($btn) {
        $btn.prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> 删除中...');
    }

    $ajax({
        type: 'post',
        url: '/ddmx/deletePdf',
        contentType: 'application/json',
        data: JSON.stringify({
            ddh: ddh
        }),
        dataType: 'json'
    }, false, '', function (res) {
        hideLoading();

        if ($btn) {
            $btn.prop('disabled', false).html('<i class="bi bi-trash"></i> 删除');
        }

        if (res.code === 200) {
            console.log("PDF文件删除成功");
            swal('PDF文件删除成功！');

            // 删除成功后刷新数据
            getList(currentPage, pageSize, getSearchParams());
        } else {
            console.error("PDF文件删除失败:", res.message);
            swal("PDF文件删除失败: " + (res.message || '未知错误'));
        }
    }).fail(function(xhr, status, error) {
        hideLoading();

        if ($btn) {
            $btn.prop('disabled', false).html('<i class="bi bi-trash"></i> 删除');
        }

        console.error("删除请求失败:", error);
        swal("删除请求失败，请检查网络连接");
    });
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
        fillBasicInfo(rowData);
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
        url: '/dzd/getDetailByDdh',
        contentType: 'application/json',
        data: JSON.stringify({
            ddh: ddh
        }),
        dataType: 'json'
    }, false, '', function (res) {
        hideDetailLoading();
        if (res.code === 200) {
            console.log("返回的详细信息", res);
            fillDetailInfo(res.data);
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

// 填充基础信息
function fillBasicInfo(rowData) {
    if (rowData) {
        var basicInfoHtml = `
            <div class="row">
                <div class="col-md-4">
                    <label><strong>订单日期：</strong></label>
                    <span>${rowData.ddrq || ''}</span>
                </div>
                <div class="col-md-4">
                    <label><strong>订单号：</strong></label>
                    <span>${rowData.ddh || ''}</span>
                </div>
                <div class="col-md-4">
                    <label><strong>负责人：</strong></label>
                    <span>${rowData.fzr || ''}</span>
                </div>
                <div class="col-md-4">
                    <label><strong>客户名称：</strong></label>
                    <span>${rowData.khmc || ''}</span>
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
        serialNumber: selectedRow.find('td:eq(0)').text().trim(),
        ddrq: selectedRow.find('td:eq(1)').text().trim(),
        ddh: selectedRow.find('td:eq(2)').text().trim(),
        khmc: selectedRow.find('td:eq(3)').text().trim(),
        fzr: selectedRow.find('td:eq(4)').text().trim(),
        yfsj: selectedRow.find('td:eq(5)').text().trim(),
        yifu: selectedRow.find('td:eq(6)').text().trim(),
        wf: selectedRow.find('td:eq(7)').text().trim(),
        kpsj: selectedRow.find('td:eq(8)').text().trim(),
        sfkp: selectedRow.find('td:eq(9)').text().trim(),
        dzzt: selectedRow.find('td:eq(10)').text().trim()
    };

    // 从行的data属性中获取联系人信息
    var rowElement = selectedRow[0];
    if (rowElement && rowElement.dataset) {
        rowData.lxr = rowElement.dataset.lxr || '';
    }

    return rowData;
}

// 添加行点击事件
function addRowClickEvent() {
    $('#ddmxTable tbody tr').click(function() {
        $('#ddmxTable tbody tr').removeClass('selected-row');
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
        `)
        .appendTo('head');
}