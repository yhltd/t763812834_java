var idd;
var currentPage = 1;
var pageSize = 20;
var totalCount = 0;
var totalPages = 0;
var currentId = ''; // 存储当前详情弹窗的合同编号

// 页面加载完成后初始化
$(document).ready(function() {
    console.log('页面加载完成，初始化客户信息页面...');
    addTableStyles();
    initKhxxPage();
    initToolbarEvents();
    initDetailModalEvents();
    getList(currentPage, pageSize, '');
});

// 初始化客户信息页面
function initKhxxPage() {
    console.log('初始化客户信息页面...');

    // 绑定搜索事件
    $('#select-btn').off('click').on('click', function() {
        searchKhxx();
    });

    // 绑定搜索输入框回车事件
    $('#gsm').off('keypress').on('keypress', function(e) {
        if (e.which === 13) {
            searchKhxx();
        }
    });
}

// 初始化工具栏事件
function initToolbarEvents() {
    console.log('初始化工具栏事件...');

    // 刷新按钮
    $('#refresh-btn').off('click').on('click', function() {
        console.log('刷新数据');
        getList(currentPage, pageSize, '');
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
}

// 初始化详情模态框事件
function initDetailModalEvents() {



}

// 更新状态


// 获取当前搜索关键词
function getCurrentKeyword() {
    return $('#gsm').val() || '';
}

// 获取数据列表
function getList(page, size, keyword) {
    currentPage = page || currentPage;
    pageSize = size || pageSize;
    keyword = keyword || "";

    showLoading();

    $ajax({
        type: 'post',
        url: '/cgmx/list',
        contentType: 'application/json',
        data: JSON.stringify({
            pageNum: currentPage,
            pageSize: pageSize,
            keyword: keyword
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
    $('#cgmxTable').html('<tr><td colspan="10" style="text-align: center; padding: 20px;">加载中...</td></tr>');
}

// 隐藏加载中
function hideLoading() {
    // 加载完成后的处理
}

// 搜索功能
function searchKhxx() {
    var keyword = $('#gsm').val() || '';
    currentPage = 1;

    console.log('搜索关键词:', keyword);

    if (keyword) {
        // 如果有搜索条件，调用查询接口
        $ajax({
            type: 'post',
            url: '/cgmx/queryList',
            contentType: 'application/json',
            data: JSON.stringify({
                keyword: keyword,
                pageNum: currentPage,
                pageSize: pageSize
            }),
            dataType: 'json'
        }, false, '查询中...', function (res) {
            console.log('查询响应:', res);
            if (res.success) {
                fillTable(res.data.list || res.data);
                totalCount = res.data.total || (res.data.list ? res.data.list.length : 0);
                totalPages = res.data.pages || 1;
                updatePagination();
                showNotification("查询成功，找到 " + totalCount + " 条记录", "success");
            } else {
                // 如果查询接口不存在，回退到前端过滤
                console.log('查询接口失败，尝试前端过滤');
                fallbackSearch(keyword);
            }
        }, function(error) {
            console.error('查询失败:', error);
            // 查询失败时回退到前端过滤
            fallbackSearch(keyword);
        });
    } else {
        // 如果没有搜索条件，获取所有数据
        getList(currentPage, pageSize, '');
    }
}

// 填充表格
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
                    <td>${item.kprq || ''}</td>
                    <td>${item.qkje || ''}</td>
                    <td>${item.yfje || ''}</td>
                  
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
    $('#cgmxTable tbody tr').each(function() {
        if ($(this).data('id') === id) {
            rowData = {
                khcm: $(this).find('td:eq(0)').text().trim(),
                ddrq: $(this).find('td:eq(1)').text().trim(),
                hj: $(this).find('td:eq(2)').text().trim(),
                htbh: $(this).find('td:eq(3)').text().trim(),
                zbz: $(this).find('td:eq(7)').text().trim(),
                kprq: $(this).find('td:eq(4)').text().trim(),
                qkje: $(this).find('td:eq(5)').text().trim(),
                yfje: $(this).find('td:eq(6)').text().trim(),
            };
            return false;
        }
    });

    if (rowData) {
        var basicInfoHtml = `
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
                <span>${rowData.htbh}</span>
            </div>
              <div class="col-md-4">
                <label><strong>开票日期：</strong></label>
                <span>${rowData.kprq}</span>
            </div>
             <div class="col-md-4">
                <label><strong>欠款金额：</strong></label>
                <span>${rowData.qkje}</span>
            </div>
             <div class="col-md-4">
                <label><strong>已付金额：</strong></label>
                <span>${rowData.yfje}</span>
            </div>
             <div class="col-md-4">
                <label><strong>备注：</strong></label>
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
        url: '/cgmx/detail',
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
        'khcm': '乙方公司',
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
        'zbz': '备注'
    };
    return labels[field] || field;
}

// 保存函数
function saveKhxx() {
    var formData = {
        khcm: $('input[name="khcm"]').val(),
        ddrq: $('input[name="ddrq"]').val(),
        hj: $('input[name="hj"]').val(),
        htbh: $('input[name="htbh"]').val(),
        kprq: $('input[name="kprq"]').val(),
        qkje: $('input[name="qkje"]').val(),
        yfje: $('input[name="yfje"]').val(),
        zbz: $('textarea[name="zbz"]').val()
    };

    if (!formData.khcm || formData.khcm.trim() === '') {
        swal('乙方公司不能为空');
        return;
    }

    var editId = $('#editId').val();
    var url = '/cgmx/update';

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
        ddrq: selectedRow.find('td:eq(1)').text().trim(),
        hj: selectedRow.find('td:eq(2)').text().trim(),
        htbh: selectedRow.find('td:eq(3)').text().trim(),
        zbz: selectedRow.find('td:eq(7)').text().trim(),
        kprq: selectedRow.find('td:eq(4)').text().trim(),
        qkje: selectedRow.find('td:eq(5)').text().trim(),
        yfje: selectedRow.find('td:eq(6)').text().trim()
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
        $('input[name="ddrq"]').val(data.ddrq || '');
        $('input[name="hj"]').val(data.hj || '');
        $('input[name="htbh"]').val(data.htbh || '');
        $('input[name="kprq"]').val(data.kprq || '');
        $('input[name="qkje"]').val(data.qkje || '');
        $('input[name="yfje"]').val(data.yfje || '');
        $('textarea[name="zbz"]').val(data.zbz || '');
    }

    $('#khxxModal').modal('show');
}

// 删除函数
function deleteKhxx(id) {
    $.ajax({
        url: '/cgmx/delete',
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
    $('#cgmxTable tbody tr').click(function() {
        $('#cgmxTable tbody tr').removeClass('selected-row');
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
        `)
        .appendTo('head');
}