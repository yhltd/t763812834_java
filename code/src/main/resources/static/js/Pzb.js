(function() {
    'use strict';

    // 确保 wn 变量存在并指向 jQuery
    if (typeof window.wn === 'undefined') {
        window.wn = window.$ || window.jQuery;
    }

    // 添加缺失的 unescapeHTML 函数
    if (window.wn && typeof window.wn.unescapeHTML === 'undefined') {
        window.wn.unescapeHTML = function(str) {
            if (str == null || str === '') {
                return '';
            }
            try {
                var temp = document.createElement('div');
                temp.innerHTML = str;
                return temp.textContent || temp.innerText || '';
            } catch (e) {
                return String(str)
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .replace(/&#x27;/g, "'")
                    .replace(/&#x2F;/g, '/')
                    .replace(/&#96;/g, '`');
            }
        };
    }

    // 同时为 jQuery 添加这个函数
    if (window.$ && typeof window.$.unescapeHTML === 'undefined') {
        window.$.unescapeHTML = window.wn.unescapeHTML;
    }
    if (window.jQuery && typeof window.jQuery.unescapeHTML === 'undefined') {
        window.jQuery.unescapeHTML = window.wn.unescapeHTML;
    }

    console.log('unescapeHTML 函数修复完成');
})();

var currentPage = 1;
var pageSize = 20;
var totalCount = 0;
var totalPages = 0;
var currentEditingCell = null;

// 页面加载完成后初始化
$(document).ready(function() {
    console.log('页面加载完成，初始化配置表页面...');
    addTableStyles();
    addPaginationStyles();
    initPzbPage();
    initToolbarEvents();
    getList();
});

function initPzbPage() {
    console.log('初始化配置表页面...');

    // 绑定搜索事件
    $('#select-btn').off('click').on('click', function() {
        searchPzb();
    });

    // 绑定搜索输入框回车事件
    $('#gsm').off('keypress').on('keypress', function(e) {
        if (e.which === 13) {
            searchPzb();
        }
    });
}

// 初始化工具栏事件
function initToolbarEvents() {
    console.log('初始化工具栏事件...');

    // 刷新按钮
    $('#refresh-btn').off('click').on('click', function() {
        console.log('刷新数据');
        resetSearchAndRefresh();
    });

    // 新增按钮
    $("#add-btn").click(function () {
        if (confirm("确认要新增一行数据吗？")) {
            $ajax({
                type: 'post',
                url: '/pzb/add'
            }, false, '新增中...', function (res) {
                console.log('新增响应:', res);
                if (res.code == 200) {
                    showNotification("新增成功", "success");
                    getList();
                } else {
                    swal("新增失败", res.msg, "error");
                }
            });
        }
    });

    // 删除按钮
    $('#delete-btn').click(function () {
        let rows = getTableSelection("#qhdTable");
        if (rows.length == 0) {
            swal('请选择要删除的数据！', "", "info");
            return;
        }

        let itemNames = rows.map(row => row.chanpinmingcheng || row.fuzeren || "未知项目").join(', ');

        swal({
            title: "确认删除",
            text: "确定要删除配置项：" + itemNames + " 吗？此操作不可恢复！",
            icon: "warning",
            buttons: {
                cancel: {
                    text: "取消",
                    value: null,
                    visible: true
                },
                confirm: {
                    text: "确认删除",
                    value: true,
                    className: "btn-danger"
                }
            },
            dangerMode: true,
        }, function(willDelete) {
            if (willDelete) {
                let idList = rows.map(row => row.id).filter(id => id);

                if (idList.length === 0) {
                    swal("删除失败", "没有找到有效的配置项ID", "error");
                    return;
                }

                $ajax({
                    type: 'post',
                    url: '/pzb/delete',
                    data: JSON.stringify({
                        idList: idList
                    }),
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8'
                }, false, '删除中...', function (res) {
                    if (res.code == 200) {
                        showNotification("删除成功，共删除 " + rows.length + " 个配置项", "success");
                        getList();
                    } else {
                        swal("删除失败", res.msg, "error");
                    }
                });
            }
        });
    });
}

function resetSearchAndRefresh() {
    // 重置搜索条件
    $('#gsm').val('');

    // 刷新数据
    currentPage = 1;
    getList();
}

// 获取搜索参数
function getSearchParams() {
    return {
        name: $('#gsm').val() || ''
    };
}

// 获取数据列表
function getList() {
    var searchParams = getSearchParams();

    showLoading();

    $ajax({
        type: 'post',
        url: '/pzb/getList',
    }, false, '加载中...', function (res) {
        hideLoading();
        console.log('获取数据响应:', res);
        if (res.code == 200) {
            setTable(res.data);
            totalCount = res.data.length;
            updatePagination();
        } else {
            // 处理权限错误
            if (res.code === 401) {
                alert("登录已过期，请重新登录");
                window.location.href = "/login.html";
            } else if (res.code === 403) {
                alert("权限不足，无法访问此功能");
            } else {
                alert("查询失败: " + res.message);
            }
        }
    }, function(error) {
        console.error('获取数据失败:', error);
        swal("获取数据失败", "网络错误或服务器异常", "error");
    });
}

// 搜索功能
function searchPzb() {
    var searchParams = getSearchParams();
    currentPage = 1;

    if (searchParams.name) {
        // 如果有搜索条件，调用查询接口
        $ajax({
            type: 'post',
            url: '/pzb/queryList',
            data: {
                name: searchParams.name
            }
        }, false, '查询中...', function (res) {
            console.log('查询响应:', res);
            if (res.code == 200) {
                setTable(res.data);
                showNotification("查询成功，找到 " + res.data.length + " 条记录", "success");
            } else {
                swal("查询失败", res.msg, "error");
            }
        });
    } else {
        // 如果没有搜索条件，获取所有数据
        getList();
    }
}

// 显示加载中
function showLoading() {
    $('#qhdTable').html('<tr><td colspan="10" style="text-align: center; padding: 20px;">加载中...</td></tr>');
}

// 隐藏加载中
function hideLoading() {
    // 加载完成后的处理
}

// 设置表格数据 - 仿照样式修改
function setTable(data) {
    console.log('设置表格数据，数据长度:', data ? data.length : 0);

    // 如果表格已经初始化，先销毁
    if ($('#qhdTable').data('bootstrap.table')) {
        $('#qhdTable').bootstrapTable('destroy');
        console.log('已销毁旧表格实例');
    }

    // 如果没有数据，显示空表格
    if (!data || data.length === 0) {
        console.log('没有数据，显示空表格');
        $('#qhdTable').html('<tr><td colspan="10" class="text-center">暂无数据</td></tr>');
        return;
    }

    // 使用原生表格而不是bootstrap-table，以便实现双击编辑
    var tableHtml = `
        <table class="gradient-table" style="width: 100%; table-layout: fixed;">
            <thead>
                <tr>
                    <th width="60"><input type="checkbox" id="selectAll"></th>
                    <th width="100">负责人</th>
                    <th width="120">电话</th>
                    <th width="150">产品名称</th>
                    <th width="120">付款方式</th>
                    <th width="120">编号</th>
                    <th width="100">部门</th>
                    <th width="80">单位</th>
                    <th width="100">职位</th>
                    <th width="100">采购乙方</th>
                </tr>
            </thead>
            <tbody>`;

    if (data && data.length > 0) {
        data.forEach(function(item, index) {
            tableHtml += `
                <tr data-id="${item.id}">
                    <td style="text-align: center;">
                        <input type="checkbox" class="row-checkbox" data-id="${item.id}">
                    </td>
                    <td class="editable-cell" data-field="fuzeren">${item.fuzeren || ''}</td>
                    <td class="editable-cell" data-field="dianhua">${item.dianhua || ''}</td>
                    <td class="editable-cell" data-field="chanpinmingcheng">${item.chanpinmingcheng || ''}</td>
                    <td class="editable-cell" data-field="fukuanfangshi">${item.fukuanfangshi || ''}</td>
                    <td class="editable-cell" data-field="bianhao">${item.bianhao || ''}</td>
                    <td class="editable-cell" data-field="bumen">${item.bumen || ''}</td>
                    <td class="editable-cell" data-field="danwei">${item.danwei || ''}</td>
                    <td class="editable-cell" data-field="zhiwei">${item.zhiwei || ''}</td>
                    <td class="editable-cell" data-field="cgyf">${item.cgyf || ''}</td>
                    
                </tr>`;
        });
    } else {
        tableHtml += `
            <tr>
                <td colspan="10" style="text-align: center; color: #999;">暂无配置数据</td>
            </tr>`;
    }

    tableHtml += '</tbody></table>';
    $('.table-div').html(tableHtml);

    // 绑定事件
    bindTableEvents();
    // 绑定全选事件
    bindSelectAllEvent();
}

// 绑定表格事件
function bindTableEvents() {
    // 绑定双击编辑事件
    bindDoubleClickEdit();

    // 绑定行点击事件
    $('.editable-table tbody tr').click(function(e) {
        if (!$(e.target).is('input[type="checkbox"]') && !$(e.target).is('input[type="text"]')) {
            $('.editable-table tbody tr').removeClass('selected-row');
            $(this).addClass('selected-row');
        }
    });
}

// 绑定双击编辑功能
function bindDoubleClickEdit() {
    $('.editable-cell').off('dblclick').on('dblclick', function() {
        if (currentEditingCell) return; // 防止同时编辑多个单元格

        var $cell = $(this);
        var field = $cell.data('field');
        var oldValue = $cell.text().trim();
        var rowId = $cell.closest('tr').data('id');

        console.log('开始编辑:', {field: field, oldValue: oldValue, rowId: rowId});

        // 创建输入框
        var $input = $('<input type="text" class="form-control form-control-sm cell-edit-input">')
            .val(oldValue)
            .css({
                width: '100%',
                height: '100%',
                border: '2px solid #007bff',
                borderRadius: '3px',
                padding: '0 5px',
                margin: '0',
                boxSizing: 'border-box',
                fontSize: '14px'
            });

        $cell.addClass('editing').html($input);
        $input.focus().select();

        // 保存编辑 - 修复空值处理
        function saveEdit() {
            var newValue = $input.val().trim();
            $cell.removeClass('editing').text(newValue || ''); // 允许显示空值
            currentEditingCell = null;

            // 只要值发生变化就保存，包括变为空值
            if (newValue !== oldValue) {
                updateCellValue(rowId, field, newValue, oldValue);
            }
        }

        // 绑定事件
        $input.on('blur', saveEdit);
        $input.on('keydown', function(e) {
            if (e.keyCode === 13) { // Enter
                saveEdit();
            } else if (e.keyCode === 27) { // Escape
                $cell.removeClass('editing').text(oldValue);
                currentEditingCell = null;
            }
        });

        currentEditingCell = $cell;
    });
}

// 更新单元格值
function updateCellValue(id, field, newValue, oldValue) {
    console.log('更新单元格:', {id: id, field: field, newValue: newValue, oldValue: oldValue});

    // 允许空值，但需要发送到后端
    $ajax({
        type: 'post',
        url: '/pzb/update',
        data: {
            column: field,
            id: id,
            value: newValue || ''  // 确保空值也能发送
        }
    }, false, '保存中...', function (res) {
        console.log('更新响应:', res);
        if (res.code == 200) {
            showNotification('修改成功', 'success');
            // 即使新值为空，也更新显示
            var $cell = $('.editable-cell[data-field="' + field + '"]').filter(function() {
                return $(this).closest('tr').data('id') === id;
            });
            $cell.text(newValue || ''); // 确保显示空值
        } else {
            showNotification('修改失败: ' + res.msg, 'error');
            // 恢复原值
            var $cell = $('.editable-cell[data-field="' + field + '"]').filter(function() {
                return $(this).closest('tr').data('id') === id;
            });
            $cell.text(oldValue);
        }
    }, function(error) {
        console.error('更新失败:', error);
        showNotification('修改失败: 网络错误', 'error');
        // 恢复原值
        var $cell = $('.editable-cell[data-field="' + field + '"]').filter(function() {
            return $(this).closest('tr').data('id') === id;
        });
        $cell.text(oldValue);
    });
}

// 绑定全选事件
function bindSelectAllEvent() {
    $('#selectAll').off('change').on('change', function() {
        var isChecked = $(this).prop('checked');
        $('.row-checkbox').prop('checked', isChecked);
    });
}

// 获取表格选中行
function getTableSelection() {
    var selectedRows = [];
    $('.row-checkbox:checked').each(function() {
        var rowId = $(this).data('id');
        var rowData = {};

        // 获取行数据
        var $row = $(this).closest('tr');
        $row.find('.editable-cell').each(function() {
            var field = $(this).data('field');
            var value = $(this).text().trim();
            rowData[field] = value;
        });

        rowData.id = rowId;
        selectedRows.push(rowData);
    });

    return selectedRows;
}

// 显示通知
function showNotification(message, type) {
    // 移除已有的通知
    $('.custom-notification').remove();

    const notification = document.createElement('div');
    notification.className = `custom-notification alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 200px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert">&times;</button>
    `;
    document.body.appendChild(notification);

    // 3秒后自动移除
    setTimeout(() => {
        $(notification).alert('close');
    }, 3000);
}

// 更新分页控件
function updatePagination() {
    $('#paginationContainer').remove();

    var paginationHtml = `
        <div id="paginationContainer" class="pagination-container">
            <div class="pagination-info">
                共 <span class="total-count">${totalCount}</span> 条记录
            </div>
        </div>`;

    $('.table-div').after(paginationHtml);
}

// 添加分页样式
function addPaginationStyles() {
    if ($('#pagination-styles').length) return;

    $('<style id="pagination-styles">')
        .prop('type', 'text/css')
        .html(`
            .pagination-container { 
                margin: 20px 0; 
                padding: 15px; 
                background: #f8f9fa; 
                border: 1px solid #e9ecef; 
                border-radius: 4px; 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                flex-wrap: wrap; 
            }
            .pagination-info { 
                color: #6c757d; 
                font-size: 14px; 
            }
        `)
        .appendTo('head');
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
            .editable-cell { 
                cursor: pointer; 
                position: relative; 
                transition: background-color 0.2s; 
            }
            .editable-cell:hover { 
                background-color: #f8f9fa !important; 
            }
            .editable-cell.editing { 
                background-color: #fff3cd !important; 
                padding: 0 !important; 
            }
            .cell-edit-input { 
                border: 2px solid #007bff !important; 
                outline: none !important; 
                box-shadow: 0 0 5px rgba(0, 123, 255, 0.5) !important; 
            }
            .custom-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                min-width: 200px;
            }
        `)
        .appendTo('head');
}