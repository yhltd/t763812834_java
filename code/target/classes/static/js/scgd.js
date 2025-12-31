var idd;
var currentPage = 1;
var pageSize = 20;
var totalCount = 0;
var totalPages = 0;
var currentId = ''; // 存储当前详情弹窗的合同编号

$(document).ready(function() {
    console.log('页面加载完成，初始化客户信息页面...');
    addTableStyles();
    initKhxxPage();
    initToolbarEvents();
    initDetailModalEvents();

    // 修改：页面加载时设置默认日期并获取数据
    setDefaultDateRange();

    // 确保统计区域可见
    $('#statisticsContainer').show();
    // 初始化统计值为0
    updateStatistics(0, 0, 0, 0);

    getList(currentPage, pageSize, {});
});

function initKhxxPage() {
    console.log('初始化客户信息页面...');

    // 绑定搜索事件
    $('#select-btn').off('click').on('click', function() {
        searchKhxx();
    });

    // 绑定重置事件
    $('#reset-btn').off('click').on('click', function() {
        resetSearch();
    });

    // 绑定搜索输入框回车事件
    $('#khcm, #lxr, #fzr').off('keypress').on('keypress', function(e) {
        if (e.which === 13) {
            searchKhxx();
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
    return `${year}/${month}/${day}`;
}

// 初始化工具栏事件
function initToolbarEvents() {
    console.log('初始化工具栏事件...');

    // 刷新按钮 - 修改为重置并刷新
    $('#refresh-btn').off('click').on('click', function() {
        resetSearchAndRefresh();
        getList(currentPage, pageSize, {});
    });

    //导出按钮
    $('#export-btn').off('click').on('click', function() {
        console.log('导出按钮点击');
        var selectedRow = getSelectedRow();
        if (!selectedRow) {
            swal('请选择要导出的数据');
            return;
        }
        exportToExcel(selectedRow.id);
    });

    // 修改按钮
    $('#update-btn').off('click').on('click', function() {
        console.log('修改按钮点击');
        var selectedRow = getSelectedRow();
        if (!selectedRow) {
            swal('请选择要修改的客户信息');
            return;
        }
        showKhxxModal('edit', selectedRow);
    });

    // 删除按钮
    $('#delete-btn').off('click').on('click', function() {
        console.log('删除按钮点击');
        var selectedRow = getSelectedRow();
        if (!selectedRow) {
            swal('请选择要删除的客户信息');
            return;
        }

        if (confirm('确定要删除客户 "' + selectedRow.khcm + '" 吗？')) {
            deleteKhxx(selectedRow.id);
        }
    });

    // 保存按钮
    $('#saveKhxxBtn').off('click').on('click', function() {
        saveKhxx();
    });

    // 新增：取消按钮事件绑定
    $('#cancelBtn').off('click').on('click', function() {
        console.log('取消按钮点击');
        $('#khxxModal').modal('hide');
    });

    // 新增：模态框隐藏时重置表单
    $('#khxxModal').on('hidden.bs.modal', function() {
        console.log('模态框关闭，重置表单');
        $('#khxx-form')[0].reset();
        $('#editId').val('');
        // 启用所有被禁用的字段
        $('select[name="kpzt"]').prop('disabled', false);
    });
}


function resetSearch() {
    $('#khcm').val('');
    $('#lxr').val('');
    $('#fzr').val('');
    $('#kpzt').val('');
    setDefaultDateRange();

    // 重新查询
    currentPage = 1;
    getList(currentPage, pageSize, {});
}


// 初始化详情模态框事件
function initDetailModalEvents() {
    // 驳回按钮
    $('#rejectBtn').off('click').on('click', function() {
        updateStatus('驳回');
    });

    // 下单按钮
    $('#approveBtn').off('click').on('click', function() {
        updateStatus('下单');
    });
}

// 重置搜索条件
function resetSearch() {
    $('#khcm').val('');
    $('#lxr').val('');
    $('#fzr').val('');
    $('#kpzt').val('');
    setDefaultDateRange();

    // 重新查询
    currentPage = 1;
    getList(currentPage, pageSize, {});
}

// 获取搜索参数
function getSearchParams() {
    var startDate = $('#startDate').val() || '';
    var endDate = $('#endDate').val() || '';

    // 如果日期是yyyy-MM-dd格式，转换为yyyy/MM/dd格式
    if (startDate && startDate.indexOf('-') !== -1) {
        startDate = startDate.replace(/-/g, '/');
    }
    if (endDate && endDate.indexOf('-') !== -1) {
        endDate = endDate.replace(/-/g, '/');
    }

    return {
        khcm: $('#khcm').val() || '',
        lxr: $('#lxr').val() || '',
        fzr: $('#fzr').val() || '',
        kpzt: $('#kpzt').val() || '',
        startDate: $('#startDate').val() || '',
        endDate: $('#endDate').val() || ''
    };
}

// 获取当前搜索关键词
function getCurrentKeyword() {
    return $('#khcm').val() || '';
}

// 更新状态
function updateStatus(status) {
    if (!currentId) {
        swal('没有找到对应内容');
        return;
    }

    if (confirm('确定要将合同状态设置为"' + status + '"吗？')) {
        $.ajax({
            url: '/shengchan/updateStatus',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: currentId,
                zt: status
            }),
            success: function(result) {
                if (result.success) {
                    $('#detailModal').modal('hide');
                    getList(currentPage, pageSize, ''); // 刷新列表
                } else {
                    swal('状态更新失败: ' + result.message);
                }
            },
            error: function(xhr, status, error) {
                swal('请求失败: ' + error);
            }
        });
    }
}

// 获取当前搜索关键词
function getCurrentKeyword() {
    return $('#gsm').val() || '';
}

// 获取数据列表
function getList(page, size, searchParams) {
    currentPage = page || currentPage;
    pageSize = size || pageSize;
    searchParams = searchParams || {};

    showLoading();

    $ajax({
        type: 'post',
        url: '/shengchan/list',
        contentType: 'application/json',
        data: JSON.stringify({
            pageNum: currentPage,
            pageSize: pageSize,
            khcm: searchParams.khcm || '',
            lxr: searchParams.lxr || '',
            fzr: searchParams.fzr || '',
            kpzt: searchParams.kpzt || '',
            startDate: searchParams.startDate || '',
            endDate: searchParams.endDate || ''
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
    $('#khzlTable').html('<tr><td colspan="10" style="text-align: center; padding: 20px;">加载中...</td></tr>');
}

// 隐藏加载中
function hideLoading() {
    // 加载完成后的处理
}

// 搜索功能
function searchKhxx() {
    var searchParams = getSearchParams();
    currentPage = 1;
    getList(currentPage, pageSize, searchParams);
}

// 填充表格
function fillTable(data) {
    $('#khzlTable').empty();

    var tableHeader = `
        <thead>
            <tr>
                <th width="280">客户名称</th>
                <th width="120">联系人</th>
                <th width="120">联系电话</th>
                <th width="120">订单日期</th>
                <th width="120">合计金额</th>
                <th width="120">负责人</th>
                <th width="150">合同编号</th>
                <th width="80">状态</th>
                <th width="120">购方要求</th>
                <th width="80">开票状态</th>
          
                <th width="90">操作</th>
            </tr>
        </thead>
    `;

    var tableBody = '<tbody>';

    // 初始化统计变量
    var totalAmount = 0;
    var uninvoicedCount = 0;
    var invoicedCount = 0;
    var noInvoiceCount = 0;

    if (data && data.length > 0) {
        data.forEach(function(item, index) {
            // 计算统计信息
            var amount = parseFloat(item.hj) || 0;
            totalAmount += amount;

            var invoiceStatus = item.kpzt || '';
            switch(invoiceStatus) {
                case '未开票':
                    uninvoicedCount++;
                    break;
                case '已开票':
                    invoicedCount++;
                    break;
                case '不开票':
                    noInvoiceCount++;
                    break;
            }

            tableBody += `
                <tr data-id="${item.id}">
                    <td>${item.khcm || ''}</td>
                    <td>${item.lxr || ''}</td>
                    <td>${item.lxdh || ''}</td>
                    <td>${item.ddrq || ''}</td>
                    <td>${item.hj || ''}</td>
                    <td>${item.fzr || ''}</td>
                    <td>${item.htbh || ''}</td>
                    <td>${item.zt || ''}</td>
                    <td>${item.yq || ''}</td>
                    <td>${item.kpzt || ''}</td>
                
                    <td>
                        <button class="btn btn-sm btn-info detail-btn" 
                                data-id="${item.id}" 
                                data-htbh="${item.htbh || ''}">
                            <i class="bi bi-eye"></i> 详情
                        </button>
                    </td>
                </tr>
            `;
        });

        // 更新统计显示
        updateStatistics(totalAmount, uninvoicedCount, invoicedCount, noInvoiceCount);
        $('#statisticsContainer').show();
    } else {
        tableBody += `
            <tr>
                <td colspan="12" style="text-align: center; color: #999;">暂无客户数据</td>
            </tr>
        `;
        // 没有数据时隐藏统计区域
        $('#statisticsContainer').hide();
    }

    tableBody += '</tbody>';
    $('#khzlTable').html(tableHeader + tableBody);
    addRowClickEvent();
    bindDetailButtonEvents();
}

// 新增：更新统计显示函数
function updateStatistics(totalAmount, uninvoicedCount, invoicedCount, noInvoiceCount) {
    $('#totalAmount').text(totalAmount.toFixed(2));
    $('#uninvoicedCount').text(uninvoicedCount);
    $('#invoicedCount').text(invoicedCount);
    $('#noInvoiceCount').text(noInvoiceCount);
}



// 绑定详情按钮事件
function bindDetailButtonEvents() {
    $('.detail-btn').off('click').on('click', function(e) {
        e.stopPropagation();
        var id = $(this).data('id');
        var htbh = $(this).data('htbh');
        showDetailModal(id, htbh); // 同时传递 id 和 htbh
    });
}

// 显示详情模态框
function showDetailModal(id) {
    currentId = id; // 存储当前ID
    fillBasicInfo(id);

    if (id) {
        getDetailInfo(id);
    }

    $('#detailModal').modal('show');
}

// 填充基础信息
function fillBasicInfo(id) {
    var rowData = null;
    $('#khzlTable tbody tr').each(function() {
        if ($(this).data('id') === id) {
            rowData = {
                khcm: $(this).find('td:eq(0)').text().trim(),
                lxr: $(this).find('td:eq(1)').text().trim(),
                lxdh: $(this).find('td:eq(2)').text().trim(),
                ddrq: $(this).find('td:eq(3)').text().trim(),
                hj: $(this).find('td:eq(4)').text().trim(),
                fzr: $(this).find('td:eq(5)').text().trim(),
                htbh: $(this).find('td:eq(6)').text().trim(),
                zt: $(this).find('td:eq(7)').text().trim(),
                zbz: $(this).find('td:eq(8)').text().trim()
            };
            return false;
        }
    });

    if (rowData) {
        var basicInfoHtml = `
            <div class="col-md-4">
                <label><strong>客户名称：</strong></label>
                <span>${rowData.khcm}</span>
            </div>
            <div class="col-md-4">
                <label><strong>联系人：</strong></label>
                <span>${rowData.lxr}</span>
            </div>
            <div class="col-md-4">
                <label><strong>联系电话：</strong></label>
                <span>${rowData.lxdh}</span>
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
                <label><strong>负责人：</strong></label>
                <span>${rowData.fzr}</span>
            </div>
            <div class="col-md-4">
                <label><strong>合同编号：</strong></label>
                <span>${rowData.htbh}</span>
            </div>
            <div class="col-md-4">
                <label><strong>状态：</strong></label>
                <span>${rowData.zt}</span>
            </div>
            <div class="col-md-12">
                <label><strong>购方要求：</strong></label>
                <span>${rowData.zbz}</span>
            </div>
        `;
        $('#basicInfo').html(basicInfoHtml);
    }
}

// 获取详细信息
function getDetailInfo(id) {
    if (!id) {
        $('#detailFormContainer').html('<p class="text-muted">暂无详细信息</p>');
        return;
    }

    $.ajax({
        url: '/shengchan/detail',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ id: id }),
        success: function(result) {
            if (result.success) {
                generateDetailForm(result.data);
            } else {
                $('#detailFormContainer').html('<p class="text-danger">获取详细信息失败: ' + result.message + '</p>');
            }
        },
        error: function(xhr, status, error) {
            $('#detailFormContainer').html('<p class="text-danger">请求失败: ' + error + '</p>');
        }
    });
}

// 生成详细信息表单 - 修改后的函数
function generateDetailForm(data) {
    var formHtml = '';

    if (data && data.pp && data.cpxh && data.sl && data.dj) {
        // 分割字符串为数组
        var ppArray = data.pp.split(',');
        var cpxhArray = data.cpxh.split(',');
        var slArray = data.sl.split(',');
        var djArray = data.dj.split(',');
        var bzArray = data.bz ? data.bz.split(',') : [];

        // 确保所有数组长度一致
        var maxLength = Math.max(ppArray.length, cpxhArray.length, slArray.length, djArray.length);

        formHtml = `
            <div class="table-responsive">
                <table class="table table-bordered table-striped detail-table">
                    <thead>
                        <tr>
                            <th width="60">序号</th>
                            <th width="150">产品名称</th>
                            <th width="120">产品型号</th>
                            <th width="100">订购数量</th>
                            <th width="100">含税单价</th>
                            <th width="100">小计</th>
                            <th>备注</th>
                        </tr>
                    </thead>
                    <tbody>`;

        var totalAmount = 0;

        for (var i = 0; i < maxLength; i++) {
            var pp = ppArray[i] || '';
            var cpxh = cpxhArray[i] || '';
            var sl = slArray[i] ? parseFloat(slArray[i]) : 0;
            var dj = djArray[i] ? parseFloat(djArray[i]) : 0;
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

// 获取字段标签
function getFieldLabel(field) {
    var labels = {
        'khcm': '客户名称',
        'lxr': '联系人',
        'lxdh': '联系电话',
        'ddrq': '订单日期',
        'pp': '产品名称',
        'cpxh': '产品型号',
        'sl': '订购数量',
        'dj': '含税单价',
        'hj': '合计金额',
        'fzr': '负责人',
        'htbh': '合同编号',
        'zt': '状态',
        'yq': '购方要求', // 新增
        'kpzt': '开票状态', // 新增

    };
    return labels[field] || field;
}

// 保存函数
function saveKhxx() {

    // 获取原始值
    const ddrqValue = $('input[name="ddrq"]').val(); // 格式: "2025-12-02"

// 转换为 2025/12/02 格式
    const formattedDdrq = ddrqValue.replace(/-/g, '/');
    var formData = {
        khcm: $('input[name="khcm"]').val(),
        lxr: $('input[name="lxr"]').val(),
        lxdh: $('input[name="lxdh"]').val(),
        ddrq: formattedDdrq,
        hj: $('input[name="hj"]').val(),
        fzr: $('input[name="fzr"]').val(),
        htbh: $('input[name="htbh"]').val(),
        zt: $('select[name="zt"]').val(),
        yq: $('input[name="yq"]').val(), // 新增购方要求
        kpzt: $('select[name="kpzt"]').val(), // 新增开票状态
        zbz: $('textarea[name="zbz"]').val()
    };

    // 如果开票状态下拉框被禁用，使用原始值
    if ($('select[name="kpzt"]').prop('disabled')) {
        var originalKpzt = $('#editId').data('originalKpzt');
        if (originalKpzt) {
            formData.kpzt = originalKpzt;
        }
    }

    if (!formData.khcm || formData.khcm.trim() === '') {
        swal('客户名称不能为空');
        return;
    }

    var editId = $('#editId').val();
    var url = '/shengchan/update';

    if (editId) {
        formData.id = parseInt(editId);
    }

    console.log('保存数据:', formData);

    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(result) {
            if (result.success) {
                swal('保存成功！');
                $('#khxxModal').modal('hide');
                getList(currentPage, pageSize, '');
            } else {
                swal('操作失败: ' + result.message);
            }
        },
        error: function(xhr, status, error) {
            swal('请求失败: ' + error);
        }
    });
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
        lxr: selectedRow.find('td:eq(1)').text().trim(),
        lxdh: selectedRow.find('td:eq(2)').text().trim(),
        ddrq: selectedRow.find('td:eq(3)').text().trim(),
        hj: selectedRow.find('td:eq(4)').text().trim(),
        fzr: selectedRow.find('td:eq(5)').text().trim(),
        htbh: selectedRow.find('td:eq(6)').text().trim(),
        zt: selectedRow.find('td:eq(7)').text().trim(),
        yq: selectedRow.find('td:eq(8)').text().trim(), // 新增购方要求
        kpzt: selectedRow.find('td:eq(9)').text().trim(), // 新增开票状态
        zbz: selectedRow.find('td:eq(10)').text().trim()
    };

    return rowData;
}

// 显示修改模态框
function showKhxxModal(type, data) {
    console.log('显示模态框:', type, data);

    $('#khxx-form')[0].reset();
    $('#editId').val('');

    if (data) {
        $('#editId').val(data.id);
        $('input[name="khcm"]').val(data.khcm || '');
        $('input[name="lxr"]').val(data.lxr || '');
        $('input[name="lxdh"]').val(data.lxdh || '');
        // 关键：转换日期格式从 "2025/12/20" 到 "2025-12-20"
        let ddrqValue = data.ddrq || '';
        if (ddrqValue && ddrqValue.includes('/')) {
            ddrqValue = ddrqValue.replace(/\//g, '-');
        }
        console.log('转换后的ddrq值:', ddrqValue);
        $('input[name="ddrq"]').val(ddrqValue);
        $('input[name="hj"]').val(data.hj || '');
        $('input[name="fzr"]').val(data.fzr || '');
        $('input[name="htbh"]').val(data.htbh || '');
        $('select[name="zt"]').val(data.zt || '待处理');
        $('input[name="yq"]').val(data.yq || ''); // 新增购方要求
        $('select[name="kpzt"]').val(data.kpzt || '未开票'); // 新增开票状态
        $('textarea[name="zbz"]').val(data.zbz || '');

        // 新增：如果开票状态为"不开票"，则禁用下拉框
        if (data.kpzt === '不开票') {
            $('select[name="kpzt"]').prop('disabled', true);
        } else {
            $('select[name="kpzt"]').prop('disabled', false);
        }
    }

    $('#khxxModal').modal('show');
}

// 删除函数
function deleteKhxx(id) {
    $.ajax({
        url: '/shengchan/delete',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ id: id }),
        success: function(result) {
            if (result.success) {
                swal('删除成功！');
                getList(currentPage, pageSize, '');
            } else {
                swal('删除失败: ' + result.message);
            }
        },
        error: function(xhr, status, error) {
            swal('删除请求失败: ' + error);
        }
    });
}

// 添加行点击事件
function addRowClickEvent() {
    $('#khzlTable tbody tr').click(function() {
        $('#khzlTable tbody tr').removeClass('selected-row');
        $(this).addClass('selected-row');
        var id = $(this).data('id');
        console.log('选中客户ID:', id);
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
            getList(currentPage, pageSize, getCurrentKeyword());
        }
    });

    $('.prev-page').click(function() {
        if (!$(this).prop('disabled')) {
            currentPage--;
            getList(currentPage, pageSize, getCurrentKeyword());
        }
    });

    $('.next-page').click(function() {
        if (!$(this).prop('disabled')) {
            currentPage++;
            getList(currentPage, pageSize, getCurrentKeyword());
        }
    });

    $('.last-page').click(function() {
        if (!$(this).prop('disabled')) {
            currentPage = totalPages;
            getList(currentPage, pageSize, getCurrentKeyword());
        }
    });

    $('.page-number').click(function() {
        var page = parseInt($(this).text());
        if (page !== currentPage) {
            currentPage = page;
            getList(currentPage, pageSize, getCurrentKeyword());
        }
    });

    $('.page-size-select').change(function() {
        pageSize = parseInt($(this).val());
        currentPage = 1;
        getList(currentPage, pageSize, getCurrentKeyword());
    });

    $('.jump-btn').click(function() {
        var targetPage = parseInt($('.page-jump-input').val());
        if (targetPage && targetPage >= 1 && targetPage <= totalPages) {
            currentPage = targetPage;
            getList(currentPage, pageSize, getCurrentKeyword());
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

// 在 addTableStyles 函数中修改统计区域样式
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
            /* 新增：禁用状态样式 */
            select:disabled {
                background-color: #e9ecef;
                opacity: 1;
                color: #6c757d;
                cursor: not-allowed;
            }
            .disabled-info {
                color: #dc3545;
                font-size: 12px;
                margin-top: 5px;
            }
            /* 修改：统计区域样式 - 调整高度为80px并均匀分布 */
            .statistics-container {
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 10px 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                height: 80px;
            }
            .statistics-container .card {
                height: 100%;
                border: none;
                background-color: transparent;
                margin: 0;
            }
            .statistics-container .card-body {
                padding: 0;
                height: 100%;
                display: flex;
                align-items: center;
            }
            .statistics-container .row {
                width: 100%;
                margin: 0;
                height: 100%;
            }
            .statistics-container .col-md-3 {
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .stat-item {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-right: 1px solid #dee2e6;
            }
            .statistics-container .col-md-3:last-child .stat-item {
                border-right: none;
            }
            .stat-item h5 {
                font-size: 13px;
                color: #6c757d;
                margin-bottom: 5px;
                font-weight: 600;
                text-align: center;
                white-space: nowrap;
            }
            .stat-item h3 {
                font-size: 22px;
                font-weight: bold;
                margin: 0;
                text-align: center;
            }
            /* 响应式调整 */
            @media (max-width: 768px) {
                .statistics-container {
                    height: auto;
                    min-height: 80px;
                }
                .statistics-container .row {
                    flex-wrap: wrap;
                }
                .statistics-container .col-md-3 {
                    width: 50%;
                    margin-bottom: 5px;
                }
                .stat-item {
                    height: 60px;
                    border-right: none;
                    border-bottom: 1px solid #dee2e6;
                }
                .statistics-container .col-md-3:nth-child(odd) .stat-item {
                    border-right: 1px solid #dee2e6;
                }
                .statistics-container .col-md-3:nth-child(-n+2) .stat-item {
                    border-bottom: none;
                }
                .stat-item h5 {
                    font-size: 12px;
                }
                .stat-item h3 {
                    font-size: 18px;
                }
            }
        `)
        .appendTo('head');
}

// 新增：导出Excel函数
function exportToExcel(id) {
    if (!id) {
        swal('请选择要导出的数据');
        return;
    }

    showLoading('正在生成Excel文件...');

    $.ajax({
        url: '/shengchan/excel',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ id: id }),
        success: function(result) {
            hideLoading();
            console.log('完整返回结果:', result); // 调试日志

            if (result.success && result.data && result.data.length > 0) {
                // 注意：result.data 是一个数组，需要取第一个元素
                var exportData = result.data[0];
                console.log('导出数据:', exportData); // 调试日志
                generateExcel(exportData);
            } else {
                swal('导出失败: ' + (result.message || '无数据'));
            }
        },
        error: function(xhr, status, error) {
            hideLoading();
            console.error('导出错误:', error, '状态:', status); // 调试日志
            swal('导出请求失败: ' + error);
        }
    });
}

//----------导出excel开始-------------
// 新增：生成Excel文件
function generateExcel(data) {
    console.log('生成Excel数据:', data); // 调试日志

    if (!data) {
        swal('没有数据可导出');
        return;
    }

    try {
        // 创建工作簿
        const wb = XLSX.utils.book_new();

        // 准备工作表数据
        const wsData = [];

        // 1. 添加标题行
        wsData.push(['销售订单详情']);
        wsData.push([]); // 空行

        // 2. 添加基础信息
        wsData.push(['基础信息']);
        wsData.push(['客户名称', data.khcm || '']);
        wsData.push(['联系人', data.lxr || '']);
        wsData.push(['联系电话', data.lxdh || '']);
        wsData.push(['订单日期', data.ddrq || '']);
        wsData.push(['合计金额', data.hj || '']);
        wsData.push(['负责人', data.fzr || '']);
        wsData.push(['合同编号', data.htbh || '']);
        wsData.push(['状态', data.zt || '']);
        wsData.push(['购方要求', data.yq || '']);
        wsData.push(['开票状态', data.kpzt || '']);
        wsData.push([]); // 空行

        // 3. 添加产品明细标题
        wsData.push(['产品明细']);
        wsData.push(['序号', '产品名称', '产品型号', '数量', '单价', '小计', '备注']);

        // 4. 解析并添加产品明细数据
        if (data.pp && data.cpxh && data.sl && data.dj) {
            console.log('解析产品数据...');
            console.log('pp:', data.pp);
            console.log('cpxh:', data.cpxh);
            console.log('sl:', data.sl);
            console.log('dj:', data.dj);
            console.log('bz:', data.bz);

            const ppArray = data.pp.split(',');
            const cpxhArray = data.cpxh.split(',');
            const slArray = data.sl.split(',');
            const djArray = data.dj.split(',');
            const bzArray = data.bz ? data.bz.split(',') : [];

            const maxLength = Math.max(
                ppArray.length,
                cpxhArray.length,
                slArray.length,
                djArray.length
            );

            console.log('最大长度:', maxLength);

            let totalAmount = 0;

            for (let i = 0; i < maxLength; i++) {
                const pp = ppArray[i] || '';
                const cpxh = cpxhArray[i] || '';
                const sl = slArray[i] ? parseFloat(slArray[i]) : 0;
                const dj = djArray[i] ? parseFloat(djArray[i]) : 0;
                const bz = bzArray[i] || '';
                const subtotal = sl * dj;
                totalAmount += subtotal;

                console.log(`第${i+1}行:`, { pp, cpxh, sl, dj, bz, subtotal });

                wsData.push([
                    i + 1,
                    pp,
                    cpxh,
                    sl,
                    dj.toFixed(2),
                    subtotal.toFixed(2),
                    bz
                ]);
            }

            // 5. 添加合计行
            wsData.push([]);
            wsData.push(['', '', '', '', '合计金额:', totalAmount.toFixed(2), '']);

            console.log('合计金额:', totalAmount);
        } else {
            console.warn('缺少产品数据');
            wsData.push(['', '无产品明细数据', '', '', '', '', '']);
        }

        // 创建工作表
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // 设置列宽
        const wscols = [
            { wch: 8 },  // 序号
            { wch: 15 }, // 产品名称
            { wch: 25 }, // 产品型号
            { wch: 10 }, // 数量
            { wch: 10 }, // 单价
            { wch: 10 }, // 小计
            { wch: 30 }  // 备注
        ];
        ws['!cols'] = wscols;

        // 合并标题单元格
        if (!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }); // 合并标题行

        // 设置样式（标题居中）
        const titleCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
        if (!ws[titleCell]) ws[titleCell] = {};
        ws[titleCell].s = {
            alignment: { horizontal: 'center' },
            font: { bold: true, sz: 14 }
        };

        // 添加到工作簿
        XLSX.utils.book_append_sheet(wb, ws, '销售订单详情');

        // 生成文件名
        const fileName = `销售订单_${data.htbh || '明细'}_${new Date().getTime()}.xlsx`;

        // 写入文件并下载
        XLSX.writeFile(wb, fileName);

        swal({
            title: '导出成功！',
            text: `文件 "${fileName}" 已下载`,
            icon: 'success',
            timer: 2000
        });

    } catch (error) {
        console.error('生成Excel时出错:', error);
        swal('生成Excel文件时出错: ' + error.message);
    }
}

// 新增：显示加载提示
function showLoading(message) {
    // 可以使用sweetalert或其他方式显示加载提示
    swal({
        title: message || '处理中...',
        text: '请稍候',
        icon: 'info',
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false
    });
}

// 新增：隐藏加载提示
function hideLoading() {
    swal.close();
}

//---------导出excel结束-------------------