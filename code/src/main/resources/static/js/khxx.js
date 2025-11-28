var idd;
var currentPage = 1;
var pageSize = 20;
var totalCount = 0;
var totalPages = 0;

// 页面加载完成后初始化
$(document).ready(function() {
    console.log('页面加载完成，初始化客户信息页面...');
    addTableStyles();
    initKhxxPage();
    initToolbarEvents();
    getList(currentPage, pageSize, getQueryParams());
    getXL();
});


// 获取最后一位ID
function getLastId() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/kehu/getLastId',
            type: 'POST',
            contentType: 'application/json',
            success: function(result) {
                if (result.success) {
                    // 将最后一位ID+1，拼接成HYX00格式
                    const nextId = parseInt(result.data || 0) + 1;
                    const customerCode = 'HYX00' + nextId;
                    resolve(customerCode);
                } else {
                    reject('获取最后ID失败: ' + result.message);
                }
            },
            error: function(xhr, status, error) {
                reject('请求失败: ' + error);
            }
        });
    });
}
// 获取下拉
function getXL() {
    $.ajax({
        type: 'post',
        url: '/hetong/xiala',
        contentType: 'application/json',
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                console.log("返回的下拉数据", res);

                // 使用返回的数据填充付款方式下拉框
                if (res.data && res.data.length > 0) {
                    // 获取付款方式下拉框
                    var fkfsSelect = $('select[name="fkfs"]');
                    if (fkfsSelect.length === 0) {
                        // 如果下拉框不存在，可能需要修改HTML结构
                        console.warn('付款方式下拉框未找到');
                        return;
                    }

                    // 清空现有选项（保留第一个空选项）
                    fkfsSelect.empty();
                    fkfsSelect.append('<option value="">请选择付款方式</option>');

                    // 填充付款方式选项
                    res.data.forEach(function(item) {
                        if (item.fukuanfangshi) {
                            fkfsSelect.append('<option value="' + item.fukuanfangshi + '">' + item.fukuanfangshi + '</option>');
                        }
                    });

                    console.log('付款方式下拉框填充完成');
                }
            } else {
                console.error("查询失败:", res.message);

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
        },
        error: function(xhr, status, error) {
            console.error("AJAX请求失败:", error);
            alert("请求失败，请检查网络连接");
        }
    });
}
// 初始化客户信息页面
function initKhxxPage() {
    console.log('初始化客户信息页面...');

    // 绑定搜索事件
    $('#select-btn').off('click').on('click', function() {
        searchKhxx();
    });

    // 绑定搜索输入框回车事件
    $('#khmc, #fzr, #lxr1').off('keypress').on('keypress', function(e) {
        if (e.which === 13) {
            searchKhxx();
        }
    });
}

// 获取查询参数
function getQueryParams() {
    return {
        khmc: $('#khmc').val() || '',
        fzr: $('#fzr').val() || '',
        jdrqStart: $('#jdrqStart').val() || '',
        jdrqEnd: $('#jdrqEnd').val() || '',
        lxr1: $('#lxr1').val() || ''
    };
}

// 重置查询条件
function resetSearch() {
    $('#khmc').val('');
    $('#fzr').val('');
    $('#jdrqStart').val('');
    $('#jdrqEnd').val('');
    $('#lxr1').val('');
    currentPage = 1;
    getList(currentPage, pageSize, getQueryParams());
}

// 初始化工具栏事件
function initToolbarEvents() {
    console.log('初始化工具栏事件...');

    // 刷新按钮 - 调用重置功能
    $('#refresh-btn').off('click').on('click', function() {
        console.log('刷新数据');
        resetSearch();
    });

    // 新增按钮
    $('#add-btn').off('click').on('click', function() {
        console.log('打开新增模态框');
        showKhxxModal('add');
    });

    // 修改按钮
    $('#update-btn').off('click').on('click', function() {
        console.log('修改按钮点击');
        var selectedRow = getSelectedRow();
        if (!selectedRow) {
            alert('请选择要修改的客户信息');
            return;
        }
        showKhxxModal('edit', selectedRow);
    });

    // 删除按钮
    $('#delete-btn').off('click').on('click', function() {
        console.log('删除按钮点击');
        var selectedRow = getSelectedRow();
        if (!selectedRow) {
            alert('请选择要删除的客户信息');
            return;
        }

        if (confirm('确定要删除客户 "' + selectedRow.khmc + '" 吗？')) {
            deleteKhxx(selectedRow.id, selectedRow.version);
        }
    });

    // 导出按钮
    $('#export-btn').off('click').on('click', function() {
        console.log('导出Excel');
        showExportModal();
    });

    // 保存按钮
    $('#saveKhxxBtn').off('click').on('click', function() {
        saveKhxx();
    });
}

// 显示导出设置模态框
function showExportModal() {
    var defaultFileName = '客户资料_' + getCurrentDate();

    var modalHtml = `
        <div class="modal fade" id="exportModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">导出设置</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="export-form">
                            <div class="form-group">
                                <label for="export-filename">文件名</label>
                                <input type="text" class="form-control" id="export-filename" value="${defaultFileName}" placeholder="请输入文件名">
                                <small class="form-text text-muted">文件将保存到桌面，扩展名自动添加 .xlsx</small>
                            </div>
                            <div class="form-group">
                                <label for="export-date-format">日期格式</label>
                                <select class="form-control" id="export-date-format">
                                    <option value="YYYYMMDD">年月日 (20231201)</option>
                                    <option value="YYYY-MM-DD">年-月-日 (2023-12-01)</option>
                                    <option value="YYYY年MM月DD日">年月日中文 (2023年12月01日)</option>
                                    <option value="none">不添加日期</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" id="confirm-export-btn">开始导出</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 移除已存在的模态框
    $('#exportModal').remove();

    // 添加新模态框
    $('body').append(modalHtml);

    // 显示模态框
    $('#exportModal').modal('show');

    // 绑定确认导出事件
    $('#confirm-export-btn').off('click').on('click', function() {
        var filename = $('#export-filename').val().trim();
        var dateFormat = $('#export-date-format').val();

        if (!filename) {
            alert('请输入文件名');
            return;
        }

        // 添加日期后缀
        if (dateFormat !== 'none') {
            var dateSuffix = formatDate(new Date(), dateFormat);
            filename += '_' + dateSuffix;
        }

        // 确保文件名以.xlsx结尾
        if (!filename.toLowerCase().endsWith('.xlsx')) {
            filename += '.xlsx';
        }

        $('#exportModal').modal('hide');
        exportToExcel(filename);
    });
}

// 获取当前日期
function getCurrentDate() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');
    return year + month + day;
}

// 日期格式化函数
function formatDate(date, format) {
    var d = new Date(date);
    var year = d.getFullYear();
    var month = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');

    switch(format) {
        case 'YYYYMMDD':
            return year + month + day;
        case 'YYYY-MM-DD':
            return year + '-' + month + '-' + day;
        case 'YYYY年MM月DD日':
            return year + '年' + month + '月' + day + '日';
        default:
            return year + month + day;
    }
}

// 导出到Excel功能
function exportToExcel(filename) {
    console.log('开始导出Excel:', filename);

    showExportLoading();

    $ajax({
        type: 'post',
        url: '/kehu/list',
        contentType: 'application/json',
        data: JSON.stringify({
            pageNum: 1,
            pageSize: 100000,
            ...getQueryParams()
        }),
        dataType: 'json'
    }, false, '', function (res) {
        hideExportLoading();

        if (res.success && res.data && res.data.list && res.data.list.length > 0) {
            console.log('获取到数据，开始导出:', res.data.list.length, '条记录');
            createExcelFile(res.data.list, filename);
        } else {
            alert('没有数据可以导出');
        }
    });
}

// 创建Excel文件
function createExcelFile(data, filename) {
    try {
        // 检查 SheetJS 是否已加载
        if (typeof XLSX === 'undefined') {
            alert('导出功能初始化失败，请刷新页面重试');
            return;
        }

        // 准备Excel数据
        var excelData = data.map(function(item) {
            return {
                '客户编号': item.khbh || '',
                '客户简称': item.khjc || '',
                '客户名称': item.khmc || '',
                '建档日期': item.jdrq || '',
                '开行户': item.khh || '',
                '账号': item.zh || '',
                '税号': item.sh || '',
                '地址': item.dz || '',
                '购方代表人': item.lxr1 || '',
                '购方电话': item.lxdh1 || '',
                '购方要求': item.yq || '',
                '收货地址1': item.dz1 || '',
                '收货地址2': item.dz2 || '',
                '收货地址3': item.dz3 || '',
                '收货地址4': item.dz4 || '',
                '收货地址5': item.dz5 || '',
                '付款方式': item.fkfs || '',
                '负责人': item.fzr || '',
                '客户注意': item.khzy || ''
            };
        });

        // 创建工作簿
        var wb = XLSX.utils.book_new();

        // 创建工作表
        var ws = XLSX.utils.json_to_sheet(excelData);

        // 设置列宽
        var colWidths = [
            { wch: 12 }, // 客户编号
            { wch: 15 }, // 客户简称
            { wch: 20 }, // 客户名称
            { wch: 12 }, // 建档日期
            { wch: 15 }, // 开行户
            { wch: 15 }, // 账号
            { wch: 20 }, // 税号
            { wch: 25 }, // 地址
            { wch: 10 }, // 联系人
            { wch: 15 }, // 联系电话
            { wch: 20 }, // 购方要求
            { wch: 20 }, // 地址1
            { wch: 20 }, // 地址2
            { wch: 20 }, // 地址3
            { wch: 20 }, // 地址4
            { wch: 20 }, // 地址5
            { wch: 12 }, // 付款方式
            { wch: 10 }, // 负责人
            { wch: 20 }  // 客户注意
        ];
        ws['!cols'] = colWidths;

        // 添加工作表
        XLSX.utils.book_append_sheet(wb, ws, '客户资料');

        // 导出文件
        XLSX.writeFile(wb, filename);

        console.log('Excel文件导出成功:', filename);

        // 显示成功消息
        setTimeout(function() {
            alert(`导出成功！\n文件名：${filename}`);
        }, 500);

    } catch (error) {
        console.error('创建Excel文件错误:', error);
        alert('导出失败: ' + error.message);
    }
}

// 显示导出加载中
function showExportLoading() {
    $('#export-btn').prop('disabled', true).html('<i class="bi bi-hourglass-split icon"></i> 导出中...');

    // 添加加载提示
    if (!$('#export-loading').length) {
        $('body').append(`
            <div id="export-loading" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 5px; z-index: 9999;">
                <div style="text-align: center;">
                    <i class="bi bi-hourglass-split" style="font-size: 24px;"></i>
                    <div style="margin-top: 10px;">正在准备导出数据，请稍候...</div>
                </div>
            </div>
        `);
    }
}

// 隐藏导出加载中
function hideExportLoading() {
    $('#export-btn').prop('disabled', false).html('<i class="bi bi-file-earmark-excel icon"></i> 导出Excel');
    $('#export-loading').remove();
}

// 获取数据列表
function getList(page, size, queryParams) {
    currentPage = page || currentPage;
    pageSize = size || pageSize;
    queryParams = queryParams || getQueryParams();

    showLoading();

    $ajax({
        type: 'post',
        url: '/kehu/list',
        contentType: 'application/json',
        data: JSON.stringify({
            pageNum: currentPage,
            pageSize: pageSize,
            ...queryParams
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
                alert("登录已过期，请重新登录");
                window.location.href = "/login.html";
            } else if (res.code === 403) {
                alert("权限不足，无法访问此功能");
            } else {
                alert("查询失败: " + res.message);
            }
        }
    });
}

// 显示加载中
function showLoading() {
    $('#khzlTable').html('<tr><td colspan="19" style="text-align: center; padding: 20px;">加载中...</td></tr>');
}

// 隐藏加载中
function hideLoading() {
    // 加载完成后的处理
}

// 搜索功能
function searchKhxx() {
    var queryParams = getQueryParams();
    currentPage = 1;
    getList(currentPage, pageSize, queryParams);
}

// 填充表格
function fillTable(data) {
    $('#khzlTable').empty();

    var tableHeader = `
        <thead>
            <tr>
                <th width="100">客户编号</th>
                <th width="120">客户简称</th>
                <th width="200">客户名称</th>
                <th width="100">建档日期</th>
                <th width="120">开行户</th>
                <th width="120">账号</th>
                <th width="150">税号</th>
                <th width="200">地址</th>
                <th width="100">购方代表人</th>
                <th width="120">购方电话</th>
                <th width="150">购方要求</th>
                <th width="150">收货地址1</th>
                <th width="150">收货地址2</th>
                <th width="150">收货地址3</th>
                <th width="150">收货地址4</th>
                <th width="150">收货地址5</th>
                <th width="100">付款方式</th>
                <th width="100">负责人</th>
                <th width="150">客户注意</th>
            </tr>
        </thead>
    `;

    var tableBody = '<tbody>';

    if (data && data.length > 0) {
        data.forEach(function(item, index) {
            tableBody += `
                <tr data-id="${item.id}" data-version="${item.version || 0}">
                    <td>${item.khbh || ''}</td>
                    <td>${item.khjc || ''}</td>
                    <td>${item.khmc || ''}</td>
                    <td>${item.jdrq || ''}</td>
                    <td>${item.khh || ''}</td>
                    <td>${item.zh || ''}</td>
                    <td>${item.sh || ''}</td>
                    <td>${item.dz || ''}</td>
                    <td>${item.lxr1 || ''}</td>
                    <td>${item.lxdh1 || ''}</td>
                    <td>${item.yq || ''}</td>
                    <td>${item.dz1 || ''}</td>
                    <td>${item.dz2 || ''}</td>
                    <td>${item.dz3 || ''}</td>
                    <td>${item.dz4 || ''}</td>
                    <td>${item.dz5 || ''}</td>
                    <td>${item.fkfs || ''}</td>
                    <td>${item.fzr || ''}</td>
                    <td>${item.khzy || ''}</td>
                </tr>
            `;
        });
    } else {
        tableBody += `
            <tr>
                <td colspan="19" style="text-align: center; color: #999;">暂无客户数据</td>
            </tr>
        `;
    }

    tableBody += '</tbody>';
    $('#khzlTable').html(tableHeader + tableBody);
    addRowClickEvent();
}


// 添加行点击事件
function addRowClickEvent() {
    $('#khzlTable tbody tr').click(function() {
        $('#khzlTable tbody tr').removeClass('selected-row');
        $(this).addClass('selected-row');
        var id = $(this).data('id');
        var version = $(this).data('version');
        console.log('选中客户ID:', id, 'Version:', version);
    });
}

// 获取选中的行数据 - 修复版本号获取问题
function getSelectedRow() {
    var selectedRow = $('.selected-row');
    if (selectedRow.length === 0) {
        return null;
    }

    // 直接从data属性获取版本号，确保获取的是最新的
    var rowVersion = selectedRow.data('version');
    console.log('获取选中行版本号:', rowVersion);

    var rowData = {
        id: selectedRow.data('id'),
        version: rowVersion || 0,  // 确保使用正确的版本号
        khbh: selectedRow.find('td:eq(0)').text().trim(),
        khjc: selectedRow.find('td:eq(1)').text().trim(),
        khmc: selectedRow.find('td:eq(2)').text().trim(),
        jdrq: selectedRow.find('td:eq(3)').text().trim(),
        khh: selectedRow.find('td:eq(4)').text().trim(),
        zh: selectedRow.find('td:eq(5)').text().trim(),
        sh: selectedRow.find('td:eq(6)').text().trim(),
        dz: selectedRow.find('td:eq(7)').text().trim(),
        lxr1: selectedRow.find('td:eq(8)').text().trim(),
        lxdh1: selectedRow.find('td:eq(9)').text().trim(),
        yq: selectedRow.find('td:eq(10)').text().trim(),
        dz1: selectedRow.find('td:eq(11)').text().trim(),
        dz2: selectedRow.find('td:eq(12)').text().trim(),
        dz3: selectedRow.find('td:eq(13)').text().trim(),
        dz4: selectedRow.find('td:eq(14)').text().trim(),
        dz5: selectedRow.find('td:eq(15)').text().trim(),
        fkfs: selectedRow.find('td:eq(16)').text().trim(),
        fzr: selectedRow.find('td:eq(17)').text().trim(),
        khzy: selectedRow.find('td:eq(18)').text().trim()
    };

    console.log('选中行完整数据:', rowData);
    return rowData;
}

// 显示客户信息模态框 - 修复版本号设置问题
function showKhxxModal(type, data) {
    console.log('显示模态框:', type, data);

    $('#khxx-form')[0].reset();
    $('#editId').val('');
    $('#editVersion').remove();

    if (type === 'add') {
        $('#modalTitle').text('新增客户信息');

        // 自动生成客户编号
        getLastId().then(customerCode => {
            $('input[name="khbh"]').val(customerCode);
            console.log('自动生成客户编号:', customerCode);
        }).catch(error => {
            console.error('生成客户编号失败:', error);
            // 失败时使用默认值
            $('input[name="khbh"]').val('HYX001');
        });

    } else {
        $('#modalTitle').text('修改客户信息');
        if (data) {
            console.log('填充表单数据，版本号:', data.version);
            $('#editId').val(data.id);
            $('#khxx-form').append('<input type="hidden" name="version" id="editVersion" value="' + (data.version || 0) + '">');

            // 填充表单数据
            $('input[name="khbh"]').val(data.khbh || '');
            $('input[name="khjc"]').val(data.khjc || '');
            $('input[name="khmc"]').val(data.khmc || '');
            $('input[name="jdrq"]').val(data.jdrq || '');
            $('input[name="khh"]').val(data.khh || '');
            $('input[name="zh"]').val(data.zh || '');
            $('input[name="sh"]').val(data.sh || '');
            $('input[name="dz"]').val(data.dz || '');
            $('input[name="lxr1"]').val(data.lxr1 || '');
            $('input[name="lxdh1"]').val(data.lxdh1 || '');
            $('input[name="dz1"]').val(data.dz1 || '');
            $('input[name="dz2"]').val(data.dz2 || '');
            $('input[name="dz3"]').val(data.dz3 || '');
            $('input[name="dz4"]').val(data.dz4 || '');
            $('input[name="dz5"]').val(data.dz5 || '');
            $('select[name="fkfs"]').val(data.fkfs || ''); // 修改为下拉框
            $('input[name="fzr"]').val(data.fzr || '');
            $('textarea[name="yq"]').val(data.yq || '');
            $('textarea[name="khzy"]').val(data.khzy || '');
        }
    }

    // 确保付款方式下拉框已加载
    getXL();

    $('#khxxModal').modal('show');
}

// 保存客户信息 - 修复乐观锁问题
function saveKhxx() {
    var formData = {
        khbh: $('input[name="khbh"]').val(),
        khjc: $('input[name="khjc"]').val(),
        khmc: $('input[name="khmc"]').val(),
        jdrq: $('input[name="jdrq"]').val(),
        khh: $('input[name="khh"]').val(),
        zh: $('input[name="zh"]').val(),
        sh: $('input[name="sh"]').val(),
        dz: $('input[name="dz"]').val(),
        lxr1: $('input[name="lxr1"]').val(),
        lxdh1: $('input[name="lxdh1"]').val(),
        dz1: $('input[name="dz1"]').val(),
        dz2: $('input[name="dz2"]').val(),
        dz3: $('input[name="dz3"]').val(),
        dz4: $('input[name="dz4"]').val(),
        dz5: $('input[name="dz5"]').val(),
        fkfs: $('select[name="fkfs"]').val(),
        fzr: $('input[name="fzr"]').val(),
        yq: $('textarea[name="yq"]').val(),
        khzy: $('textarea[name="khzy"]').val()
    };

    if (!formData.khmc || formData.khmc.trim() === '') {
        alert('客户名称不能为空');
        return;
    }

    var editId = $('#editId').val();
    var version = $('#editVersion').val() || 0;
    var url = editId ? '/kehu/update' : '/kehu/add';

    // 修改操作必须包含正确的 version
    if (editId) {
        formData.id = parseInt(editId);
        formData.version = parseInt(version); // 使用从隐藏字段获取的版本号
        console.log('修改操作，ID:', formData.id, 'Version:', formData.version);
    }

    console.log('保存数据:', formData);

    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(result) {
            if (result.success) {
                alert(result.data || '操作成功');
                $('#khxxModal').modal('hide');

                // 保存成功后刷新列表，获取最新的 version 值
                getList(currentPage, pageSize, getQueryParams());

                // 清除选中状态
                $('#khzlTable tbody tr').removeClass('selected-row');
            } else {
                // 处理乐观锁冲突
                if (result.message && (result.message.includes('version') ||
                    result.message.includes('乐观锁') ||
                    result.message.includes('已被修改') ||
                    result.message.includes('数据不一致'))) {

                    if (confirm('数据已被其他用户修改，是否刷新页面获取最新数据？')) {
                        getList(currentPage, pageSize, getQueryParams());
                        $('#khxxModal').modal('hide');
                    }
                } else {
                    alert('操作失败: ' + result.message);
                }
            }
        },
        error: function(xhr, status, error) {
            alert('请求失败: ' + error);
        }
    });
}

// 删除客户信息 - 修复乐观锁问题
function deleteKhxx(id, version) {
    var deleteData = {
        id: parseInt(id),
        version: parseInt(version) || 0  // 使用传入的版本号
    };

    console.log('删除数据:', deleteData);

    $.ajax({
        url: '/kehu/delete',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(deleteData),
        success: function(result) {
            if (result.success) {
                alert(result.data || '删除成功');
                getList(currentPage, pageSize, getQueryParams());

                // 清除选中状态
                $('#khzlTable tbody tr').removeClass('selected-row');
            } else {
                // 处理乐观锁冲突
                if (result.message && (result.message.includes('version') ||
                    result.message.includes('乐观锁') ||
                    result.message.includes('已被修改'))) {

                    if (confirm('数据已被其他用户修改，是否刷新页面？')) {
                        getList(currentPage, pageSize, getQueryParams());
                    }
                } else {
                    alert('删除失败: ' + result.message);
                }
            }
        },
        error: function(xhr, status, error) {
            alert('删除请求失败: ' + error);
        }
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
            getList(currentPage, pageSize, getQueryParams());
        }
    });

    $('.prev-page').click(function() {
        if (!$(this).prop('disabled')) {
            currentPage--;
            getList(currentPage, pageSize, getQueryParams());
        }
    });

    $('.next-page').click(function() {
        if (!$(this).prop('disabled')) {
            currentPage++;
            getList(currentPage, pageSize, getQueryParams());
        }
    });

    $('.last-page').click(function() {
        if (!$(this).prop('disabled')) {
            currentPage = totalPages;
            getList(currentPage, pageSize, getQueryParams());
        }
    });

    $('.page-number').click(function() {
        var page = parseInt($(this).text());
        if (page !== currentPage) {
            currentPage = page;
            getList(currentPage, pageSize, getQueryParams());
        }
    });

    $('.page-size-select').change(function() {
        pageSize = parseInt($(this).val());
        currentPage = 1;
        getList(currentPage, pageSize, getQueryParams());
    });

    $('.jump-btn').click(function() {
        var targetPage = parseInt($('.page-jump-input').val());
        if (targetPage && targetPage >= 1 && targetPage <= totalPages) {
            currentPage = targetPage;
            getList(currentPage, pageSize, getQueryParams());
        } else {
            alert('请输入有效的页码（1-' + totalPages + '）');
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