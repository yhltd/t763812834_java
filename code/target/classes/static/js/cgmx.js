var idd;
var currentPage = 1;
var pageSize = 20;
var totalCount = 0;
var totalPages = 0;
var currentId = ''; // 存储当前详情弹窗的合同编号

// 新增：统计变量
var totalHjAmount = 0;  // 合计金额总计
var totalQkjeAmount = 0; // 欠款金额总计
var totalYfjeAmount = 0; // 已付金额总计

// 导出配置变量
var exportColumnsConfig = {
    mainColumns: [],      // 用户选择的主表列
    detailColumns: ['产品名称', '产品型号', '订购数量', '含税单价', '备注'], // 详情表固定列
    allMainColumns: [
        { key: 'khcm', name: '乙方公司' },
        { key: 'ddrq', name: '订单日期' },
        { key: 'hj', name: '合计金额' },
        { key: 'htbh', name: '合同编号' },
        { key: 'kprq', name: '开票日期' },
        { key: 'qkje', name: '欠款金额' },
        { key: 'yfje', name: '已付金额' },
        { key: 'zbz', name: '备注' }
    ]
};

// 初始化导出配置
function initExportConfig() {
    exportColumnsConfig.mainColumns = exportColumnsConfig.allMainColumns.map(col => col.key);
}
// 页面加载完成后初始化
$(document).ready(function() {
    console.log('页面加载完成，初始化客户信息页面...');
    addTableStyles();
    addExportModalStyles(); // 添加导出样式
    initKhxxPage();
    initToolbarEvents();
    initDetailModalEvents();

    // 初始化导出配置
    initExportConfig();

    // 确保统计区域可见并初始化
    $('#statisticsContainer').show();
    updateStatistics();

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
    $('#export-excel-btn').off('click').on('click', function() {
        showExportModal();
    });
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

// // 获取数据列表
// function getList(page, size, keyword) {
//     currentPage = page || currentPage;
//     pageSize = size || pageSize;
//     keyword = keyword || "";
//
//     showLoading();
//
//     $ajax({
//         type: 'post',
//         url: '/cgmx/list',
//         contentType: 'application/json',
//         data: JSON.stringify({
//             pageNum: currentPage,
//             pageSize: pageSize,
//             keyword: keyword
//         }),
//         dataType: 'json'
//     }, false, '', function (res) {
//         hideLoading();
//         if (res.success) {
//             console.log("返回的客户信息", res);
//             fillTable(res.data.list);
//             totalCount = res.data.total;
//             totalPages = res.data.pages;
//             updatePagination();
//         } else {
//             console.error("查询失败:", res.message);
//
//             // 处理权限错误
//             if (res.code === 401) {
//                 swal("登录已过期，请重新登录");
//                 window.location.href = "/login.html";
//             } else if (res.code === 403) {
//                 swal("权限不足，无法访问此功能");
//             } else {
//                 swal("查询失败: " + res.message);
//             }
//         }
//     });
// }
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

            // 新增：获取筛选后的全部数据统计
            getFilteredStatistics(keyword);
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

// // 搜索功能
// function searchKhxx() {
//     var keyword = $('#gsm').val() || '';
//     currentPage = 1;
//
//     console.log('搜索关键词:', keyword);
//
//     if (keyword) {
//         // 如果有搜索条件，调用查询接口
//         $ajax({
//             type: 'post',
//             url: '/cgmx/queryList',
//             contentType: 'application/json',
//             data: JSON.stringify({
//                 keyword: keyword,
//                 pageNum: currentPage,
//                 pageSize: pageSize
//             }),
//             dataType: 'json'
//         }, false, '查询中...', function (res) {
//             console.log('查询响应:', res);
//             if (res.success) {
//                 fillTable(res.data.list || res.data);
//                 totalCount = res.data.total || (res.data.list ? res.data.list.length : 0);
//                 totalPages = res.data.pages || 1;
//                 updatePagination();
//                 showNotification("查询成功，找到 " + totalCount + " 条记录", "success");
//             } else {
//                 // 如果查询接口不存在，回退到前端过滤
//                 console.log('查询接口失败，尝试前端过滤');
//                 fallbackSearch(keyword);
//             }
//         }, function(error) {
//             console.error('查询失败:', error);
//             // 查询失败时回退到前端过滤
//             fallbackSearch(keyword);
//         });
//     } else {
//         // 如果没有搜索条件，获取所有数据
//         getList(currentPage, pageSize, '');
//     }
// }
function searchKhxx() {
    var keyword = $('#gsm').val() || '';
    currentPage = 1;

    showLoading();

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
        hideLoading();
        if (res.success) {
            console.log('搜索响应:', res);
            fillTable(res.data.list || res.data);
            totalCount = res.data.total || (res.data.list ? res.data.list.length : 0);
            totalPages = res.data.pages || 1;
            updatePagination();

            // 重要：搜索后也要调用统计
            getFilteredStatistics(keyword);
        } else {
            // 如果查询接口失败，回退到前端过滤
            fallbackSearch(keyword);
        }
    }, function(error) {
        console.error('查询失败:', error);
        fallbackSearch(keyword);
    });
}
// // 填充表格
// function fillTable(data) {
//     $('#cgmxTable').empty();
//
//     // 重置统计变量
//     totalHjAmount = 0;
//     totalQkjeAmount = 0;
//     totalYfjeAmount = 0;
//
//     var tableHeader = `
//         <thead>
//             <tr>
//                 <th width="280">乙方公司</th>
//                 <th width="120">订单日期</th>
//                 <th width="120">合计金额</th>
//                 <th width="150">合同编号</th>
//                 <th width="150">开票日期</th>
//                 <th width="150">欠款金额</th>
//                 <th width="150">已付金额</th>
//                 <th width="200">备注</th>
//                 <th width="90">操作</th>
//             </tr>
//         </thead>
//     `;
//
//     var tableBody = '<tbody>';
//
//     if (data && data.length > 0) {
//         data.forEach(function(item, index) {
//             // 获取并转换金额值
//             var hjAmount = parseFloat(item.hj) || 0;
//             var qkjeAmount = parseFloat(item.qkje) || 0;
//             var yfjeAmount = parseFloat(item.yfje) || 0;
//
//             // 累计统计值
//             totalHjAmount += hjAmount;
//             totalQkjeAmount += qkjeAmount;
//             totalYfjeAmount += yfjeAmount;
//
//             tableBody += `
//                 <tr data-id="${item.id}">
//                     <td>${item.khcm || ''}</td>
//                     <td>${item.ddrq || ''}</td>
//                     <td>${formatAmount(item.hj)}</td>
//                     <td>${item.htbh || ''}</td>
//                     <td>${item.kprq || ''}</td>
//                     <td>${formatAmount(item.qkje)}</td>
//                     <td>${formatAmount(item.yfje)}</td>
//                     <td>${item.zbz || ''}</td>
//                     <td>
//                         <button class="btn btn-sm btn-info detail-btn"
//                                 data-id="${item.id}"
//                                 data-htbh="${item.htbh || ''}"> <!-- 确保传递 htbh -->
//                             <i class="bi bi-eye"></i> 详情
//                         </button>
//                     </td>
//                 </tr>
//             `;
//         });
//
//         // 更新统计显示
//         updateStatistics();
//         $('#statisticsContainer').show();
//     } else {
//         tableBody += `
//             <tr>
//                 <td colspan="10" style="text-align: center; color: #999;">暂无客户数据</td>
//             </tr>
//         `;
//         // 没有数据时也显示统计区域，但值为0
//         updateStatistics();
//         $('#statisticsContainer').show();
//     }
//
//     tableBody += '</tbody>';
//     $('#cgmxTable').html(tableHeader + tableBody);
//     addRowClickEvent();
//     bindDetailButtonEvents();
// }
// 填充表格
function fillTable(data) {
    $('#cgmxTable').empty();

    // 移除这里的统计计算逻辑
    // 统计现在由 calculateTotalStatistics 函数处理

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
            // 这里不再进行统计计算，只渲染表格数据
            tableBody += `
                <tr data-id="${item.id}">
                    <td>${item.khcm || ''}</td>
                    <td>${item.ddrq || ''}</td>
                    <td>${formatAmount(item.hj)}</td>
                    <td>${item.htbh || ''}</td>
                    <td>${item.kprq || ''}</td>
                    <td>${formatAmount(item.qkje)}</td>
                    <td>${formatAmount(item.yfje)}</td>
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

        // 统计显示已经由 calculateTotalStatistics 函数处理
        // 这里不再更新统计
        $('#statisticsContainer').show();
    } else {
        tableBody += `
            <tr>
                <td colspan="10" style="text-align: center; color: #999;">暂无客户数据</td>
            </tr>
        `;
        // 没有数据时显示0值
        updateStatistics();
        $('#statisticsContainer').show();
    }

    tableBody += '</tbody>';
    $('#cgmxTable').html(tableHeader + tableBody);
    addRowClickEvent();
    bindDetailButtonEvents();
}
// 添加格式化金额的函数
function formatAmount(value) {
    if (!value || value === '') return '0.00';

    var num = parseFloat(value);
    if (isNaN(num)) return '0.00';

    return num.toFixed(2);
}

// 更新统计显示函数
function updateStatistics() {
    // 确保元素存在
    if ($('#totalHjAmount').length > 0) {
        $('#totalHjAmount').text(totalHjAmount.toFixed(2));
        $('#totalQkjeAmount').text(totalQkjeAmount.toFixed(2));
        $('#totalYfjeAmount').text(totalYfjeAmount.toFixed(2));

        console.log('统计更新:', {
            totalHjAmount: totalHjAmount.toFixed(2),
            totalQkjeAmount: totalQkjeAmount.toFixed(2),
            totalYfjeAmount: totalYfjeAmount.toFixed(2)
        });
    } else {
        console.warn('统计元素不存在');
    }
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
//导出excel
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
                                        <input type="text" class="form-control" id="exportFileName" value="采购明细_${formatDate(new Date())}">
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
            fileName = `采购明细_${formatDate(new Date())}`;
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

// 导出到Excel
// 修改exportToExcel函数
function exportToExcel(fileName) {
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

    // 获取字段显示名称的映射
    var selectedColumnNames = {};
    exportColumnsConfig.allMainColumns.forEach(col => {
        if (selectedColumns.includes(col.key)) {
            selectedColumnNames[col.key] = col.name;
        }
    });

    // 获取当前搜索条件
    var keyword = getCurrentKeyword();

    // 使用现有的list接口，设置很大的pageSize获取所有数据
    $ajax({
        type: 'post',
        url: '/cgmx/list',
        contentType: 'application/json',
        data: JSON.stringify({
            pageNum: 1,
            pageSize: 99999999,
            keyword: keyword
        }),
        dataType: 'json'
    }, false, '', function (res) {
        swal.close();

        console.log('=== 导出接口响应 ===');
        console.log('响应码:', res.success ? 'success' : 'error');
        console.log('响应数据:', res.data);

        if (res.success && res.data && res.data.list) {
            // 使用list数据
            processExportData(res.data.list, selectedColumns, selectedColumnNames, fileName);
        } else if (res.success && res.data && Array.isArray(res.data)) {
            // 另一种可能的响应格式
            processExportData(res.data, selectedColumns, selectedColumnNames, fileName);
        } else {
            console.error('导出失败:', res.message);
            swal('导出失败', res.message || '数据获取失败', 'error');
        }
    });
}

// 处理导出数据
// 修改processExportData函数，传递selectedColumns和columnMapping参数
function processExportData(apiData, selectedColumns, columnMapping, fileName) {
    try {
        var exportData = [];

        console.log('=== 数据调试信息 ===');
        console.log('用户选择的列:', selectedColumns);
        console.log('列映射:', columnMapping);
        console.log('处理数据条数:', apiData.length);

        if (apiData.length > 0) {
            console.log('第一条数据:', apiData[0]);
        }

        // 处理每条数据
        apiData.forEach(function(item, index) {
            // 传递selectedColumns和columnMapping参数
            var detailData = getDetailForExport(item, selectedColumns, columnMapping);
            if (detailData) {
                exportData = exportData.concat(detailData);
            }
        });

        console.log('导出数据条数:', exportData.length);
        if (exportData.length > 0) {
            console.log('第一条导出数据字段:', Object.keys(exportData[0]));
            console.log('第一条导出数据值:', exportData[0]);

            // 导出到Excel
            exportDataToExcel(exportData, fileName);
        } else {
            swal('导出失败', '没有找到可导出的数据', 'warning');
        }

    } catch (error) {
        console.error('数据处理失败:', error);
        swal('导出失败', '数据处理过程中发生错误: ' + error.message, 'error');
    }
}


// 获取单条记录的详细信息用于导出
function getDetailForExport(item, selectedColumns, columnMapping) {
    try {
        var exportRows = [];

        // 解析产品信息
        var productNames = item.pp ? item.pp.split('|||') : [];
        var productModels = item.cpxh ? item.cpxh.split('|||') : [];
        var quantities = item.sl ? item.sl.split('|||') : [];
        var prices = item.dj ? item.dj.split('|||') : [];
        var remarks = item.bz ? item.bz.split('|||') : [];

        // 计算产品数量
        var productCount = Math.max(
            productNames.length,
            productModels.length,
            quantities.length,
            prices.length,
            remarks.length
        );

        // 如果没有产品信息，至少导出一条记录
        if (productCount === 0) {
            var row = {};

            // 只添加用户选择的主表列
            selectedColumns.forEach(function(colKey) {
                var displayName = columnMapping[colKey] || colKey;
                var value = '';

                // 根据字段名从数据中获取值
                switch(colKey) {
                    case 'hj':
                    case 'qkje':
                    case 'yfje':
                        // 金额字段格式化为两位小数
                        var amount = parseFloat(item[colKey]) || 0;
                        value = amount.toFixed(2);
                        break;
                    default:
                        // 其他字段直接获取
                        value = item[colKey] || '';
                }

                row[displayName] = value;
            });

            // 添加固定的详情列（即使为空）
            exportColumnsConfig.detailColumns.forEach(function(detailCol) {
                row[detailCol] = '';
            });

            exportRows.push(row);
            return exportRows;
        }

        // 为每个产品创建一行
        for (var i = 0; i < productCount; i++) {
            var row = {};

            // 1. 添加用户选择的主表列
            selectedColumns.forEach(function(colKey) {
                var displayName = columnMapping[colKey] || colKey;
                var value = '';

                // 根据字段名从数据中获取值
                switch(colKey) {
                    case 'hj':
                    case 'qkje':
                    case 'yfje':
                        // 金额字段格式化为两位小数
                        var amount = parseFloat(item[colKey]) || 0;
                        value = amount.toFixed(2);
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
                    case '产品名称':
                        value = productNames[i] || '';
                        break;
                    case '产品型号':
                        value = productModels[i] || '';
                        break;
                    case '订购数量':
                        value = quantities[i] || '';
                        break;
                    case '含税单价':
                        var price = parseFloat(prices[i]) || 0;
                        value = price.toFixed(2);
                        break;
                    case '备注':
                        value = remarks[i] || '';
                        break;
                    default:
                        // 尝试使用映射
                        var fieldName = mapDetailColumnName(detailCol);
                        value = item[fieldName] || '';
                }

                row[detailCol] = value;
            });

            exportRows.push(row);
        }

        return exportRows;

    } catch (error) {
        console.error('获取详情失败:', error, item);
        return null;
    }
}
// 创建采购明细导出行
function createExportRowForCgmx(item, selectedColumns, columnMapping) {
    try {
        var row = {};

        // 1. 添加用户选择的主表列
        selectedColumns.forEach(function(colKey) {
            var displayName = columnMapping[colKey] || colKey;
            var value = '';

            // 根据字段名从数据中获取值
            switch(colKey) {
                case 'hj':
                case 'qkje':
                case 'yfje':
                    // 金额字段格式化为两位小数
                    var amount = parseFloat(item[colKey]) || 0;
                    value = amount.toFixed(2);
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
                case '产品名称':
                    value = item.pp || '';
                    break;
                case '产品型号':
                    value = item.cpxh || '';
                    break;
                case '订购数量':
                    value = item.sl || '';
                    break;
                case '含税单价':
                    var price = parseFloat(item.dj) || 0;
                    value = price.toFixed(2);
                    break;
                case '备注':
                    value = item.bz || '';
                    break;
                default:
                    // 尝试使用映射
                    var fieldName = mapDetailColumnName(detailCol);
                    value = item[fieldName] || '';
            }

            row[detailCol] = value;
        });

        return row;
    } catch (error) {
        console.error('创建导出行失败:', error, item);
        return null;
    }
}

// 映射详情列中文名到字段名
function mapDetailColumnName(chineseName) {
    var mapping = {
        '产品名称': 'pp',
        '产品型号': 'cpxh',
        '订购数量': 'sl',
        '含税单价': 'dj',
        '备注': 'bz'
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

// 修改createExcelFile函数，添加调试信息
function createExcelFile(data, fileName) {
    try {
        // 先检查数据的列是否符合预期
        console.log('=== 创建Excel文件前的数据检查 ===');
        if (data.length > 0) {
            var firstRow = data[0];
            console.log('第一行数据列:', Object.keys(firstRow));
            console.log('第一行数据值:', firstRow);

            // 验证是否包含用户选择的列
            var expectedColumns = Object.keys(firstRow);
            console.log('预期导出的列:', expectedColumns);
        }

        // 创建工作簿
        var wb = XLSX.utils.book_new();

        // 准备工作表数据
        var wsData = [];

        // 添加表头
        if (data.length > 0) {
            var headers = Object.keys(data[0]);
            console.log('最终导出的表头:', headers);
            wsData.push(headers);
        }

        // 添加数据行
        data.forEach(function(row, index) {
            var rowData = [];
            if (data.length > 0) {
                var headers = Object.keys(data[0]);
                headers.forEach(function(header) {
                    rowData.push(row[header] || '');
                });
                wsData.push(rowData);

                // 只打印前3行数据用于调试
                if (index < 3) {
                    console.log(`第${index+1}行数据:`, row);
                }
            }
        });

        // 创建工作表
        var ws = XLSX.utils.aoa_to_sheet(wsData);

        // 设置列宽
        if (data.length > 0) {
            var colWidths = [];
            var headers = Object.keys(data[0]);
            headers.forEach(function(header) {
                colWidths.push({ wch: Math.max(header.length, 10) });
            });
            ws['!cols'] = colWidths;
        }

        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(wb, ws, '采购明细');

        // 导出Excel文件
        XLSX.writeFile(wb, fileName);

        swal('导出成功', `文件 ${fileName} 已生成并开始下载`, 'success');
    } catch (error) {
        console.error('创建Excel文件失败:', error);
        swal('导出失败', '创建Excel文件时发生错误: ' + error.message, 'error');
    }
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

// 添加导出样式
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
// 生成详细信息表单 - 修改后的函数
function generateDetailForm(data) {
    var formHtml = '';

    if (data && data.pp && data.cpxh && data.sl && data.dj) {
        // 分割字符串为数组
        var ppArray = data.pp.split('|||');
        var cpxhArray = data.cpxh.split('|||');
        var slArray = data.sl.split('|||');
        var djArray = data.dj.split('|||');
        var bzArray = data.bz ? data.bz.split('|||') : [];

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
                // 保存后会重新获取列表，fillTable中会自动更新统计
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
            
            /* 新增：统计区域样式 - 调整高度为80px并均匀分布 */
            .statistics-container {
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 10px 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                height: 80px;
                margin-bottom: 15px;
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
            .statistics-container .col-md-4 {
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
            .statistics-container .col-md-4:last-child .stat-item {
                border-right: none;
            }
            .stat-item h5 {
                font-size: 14px;
                color: #6c757d;
                margin-bottom: 5px;
                font-weight: 600;
                text-align: center;
                white-space: nowrap;
            }
            .stat-item h3 {
                font-size: 24px;
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
                .statistics-container .col-md-4 {
                    width: 100%;
                    margin-bottom: 5px;
                }
                .stat-item {
                    height: 60px;
                    border-right: none;
                    border-bottom: 1px solid #dee2e6;
                }
                .statistics-container .col-md-4:last-child .stat-item {
                    border-bottom: none;
                }
                .stat-item h5 {
                    font-size: 13px;
                }
                .stat-item h3 {
                    font-size: 20px;
                }
            }
        `)
        .appendTo('head');
}

// 获取筛选后的统计信息
function getFilteredStatistics(keyword) {
    // 发送一个获取全部数据（不分页）的请求来统计
    $ajax({
        type: 'post',
        url: '/cgmx/list',
        contentType: 'application/json',
        data: JSON.stringify({
            pageNum: 1, // 第一页
            pageSize: 999999, // 很大的数字，获取所有数据
            keyword: keyword || ''
        }),
        dataType: 'json'
    }, false, '', function (res) {
        if (res.success && res.data && res.data.list) {
            // 计算全部筛选数据的统计
            calculateTotalStatistics(res.data.list);
        } else {
            // 如果失败，使用当前页数据统计
            console.log('获取全部数据失败，使用当前页统计');
        }
    });
}

// 计算全部数据的统计
function calculateTotalStatistics(dataList) {
    // 重置统计变量
    totalHjAmount = 0;
    totalQkjeAmount = 0;
    totalYfjeAmount = 0;

    dataList.forEach(function(item) {
        // 获取并转换金额值
        var hjAmount = parseFloat(item.hj) || 0;
        var qkjeAmount = parseFloat(item.qkje) || 0;
        var yfjeAmount = parseFloat(item.yfje) || 0;

        // 累计统计值
        totalHjAmount += hjAmount;
        totalQkjeAmount += qkjeAmount;
        totalYfjeAmount += yfjeAmount;
    });

    // 更新统计显示
    updateStatistics();
}