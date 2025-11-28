var idd;
let count = 1;

// 工具函数定义
function checkForm(formId) {
    var form = $(formId)[0];
    if (form.checkValidity() === false) {
        $(formId).addClass('was-validated');
        return false;
    }
    return true;
}

function formToJson(formId) {
    var formData = {};
    $(formId).serializeArray().forEach(function(item) {
        formData[item.name] = item.value;
    });
    return formData;
}

function setForm(data, formId) {
    $.each(data, function(key, value) {
        var input = $(formId).find('[name="' + key + '"]');
        if (input.length) {
            input.val(value);
        }
    });
}

function getTableSelection(tableId) {
    return $(tableId).bootstrapTable('getSelections');
}

// 创建统计栏
function createStatisticsBar() {
    // 移除已存在的统计栏
    $('#statistics-bar').remove();

    // 创建统计栏HTML
    var statisticsHtml = `
        <div id="statistics-bar" class="statistics-bar">
            <div class="statistics-item">
                <span class="statistics-label">总员工数：</span>
                <span class="statistics-value total-count">0</span>
            </div>
            <div class="statistics-item">
                <span class="statistics-label">已选中：</span>
                <span class="statistics-value selected-count">0</span>
            </div>
        </div>
    `;

    // 在表格上方插入统计栏
    $('.table-div').before(statisticsHtml);
}

// 更新统计信息
function updateStatistics() {
    var selectedCount = $('#ygxxTable').bootstrapTable('getSelections').length;
    var totalCount = $('#ygxxTable').bootstrapTable('getData').length;

    // 更新总记录数
    $('.total-count').text(totalCount || 0);

    // 更新选中数量
    $('.selected-count').text(selectedCount);

    // 如果有选中项，高亮显示
    if (selectedCount > 0) {
        $('.selected-count').addClass('highlight');
    } else {
        $('.selected-count').removeClass('highlight');
    }
}

// 添加统计栏样式
function addStatisticsStyles() {
    if ($('#statistics-styles').length) return;

    $('<style id="statistics-styles">')
        .prop('type', 'text/css')
        .html(`
            .statistics-bar {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 30px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
            }
            .statistics-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
            }
            .statistics-label {
                font-weight: 500;
                opacity: 0.9;
            }
            .statistics-value {
                font-weight: 600;
                font-size: 16px;
                background: rgba(255,255,255,0.2);
                padding: 4px 12px;
                border-radius: 20px;
                min-width: 40px;
                text-align: center;
                transition: all 0.3s ease;
            }
            .statistics-value.highlight {
                background: rgba(255,255,255,0.3);
                color: #ffeb3b;
                font-weight: 700;
                box-shadow: 0 0 10px rgba(255,235,59,0.5);
            }
            .total-count {
                background: rgba(76,175,80,0.3);
            }
            .selected-count {
                background: rgba(255,193,7,0.3);
            }
            @media (max-width: 768px) {
                .statistics-bar {
                    flex-direction: column;
                    gap: 10px;
                    align-items: flex-start;
                }
            }
        `)
        .appendTo('head');
}

// 设置表格数据的函数 - 确保正确销毁
function setTable(data) {
    console.log('设置表格数据:', data);

    // 为每条数据添加自动递增的序号
    const dataWithAutoXh = data.map((item, index) => {
        return {
            ...item,
            xh: (index + 1).toString() // 自动生成序号，从1开始
        };
    });

    console.log('添加自动序号后的数据:', dataWithAutoXh);

    // 完全销毁表格
    if ($('#ygxxTable').bootstrapTable) {
        $('#ygxxTable').bootstrapTable('destroy');
        console.log('表格已销毁');
    }

    // 清除表格容器内容
    $('#ygxxTable').empty();

    // 重新初始化表格
    $('#ygxxTable').bootstrapTable({
        data: data,
        sortStable: true,
        classes: '',
        idField: 'id',
        pagination: true,
        pageSize: 15,
        clickToSelect: true,
        locale: 'zh-CN',
        toolbar: '#table-toolbar',
        toolbarAlign: 'left',
        theadClasses: "thead-light",
        style: 'table-layout: fixed',
        columns: [
            {
                field: 'state',
                checkbox: true,
                align: 'center',
                width: 40
            },
            {
                field: 'xh',
                title: '序号',
                align: 'center',
                sortable: true,
                width: 80,
                formatter: function(value, row, index) {
                    // 这里也可以使用formatter来显示序号
                    return index + 1;
                }
            },
            {
                field: 'gh',
                title: '工号',
                align: 'center',
                sortable: true,
                width: 100,
            },
            {
                field: 'xm',
                title: '姓名',
                align: 'center',
                sortable: true,
                width: 100,
            },
            {
                field: 'zw',
                title: '职位',
                align: 'center',
                sortable: true,
                width: 120,
            },
            {
                field: 'bm',
                title: '部门',
                align: 'center',
                sortable: true,
                width: 100,
            },
            {
                field: 'lxfs',
                title: '联系方式',
                align: 'center',
                sortable: true,
                width: 120,
            },
            {
                field: 'bz',
                title: '备注',
                align: 'center',
                sortable: true,
                width: 100,
            }
        ],
        showColumns: false,
        uniqueId: 'id',
        onClickRow: function (row, $element, field) {
            if (field !== 'state') {
                $('#ygxxTable').bootstrapTable('checkBy', { field: 'id', values: [row.id] });
            }
        }
    });

    // 更新统计信息
    updateStatistics();
}

function getList() {
    $.ajax({
        type: 'post',
        url: '/ygxx/getList',
        success: function (res) {
            console.log('获取数据响应:', res);
            if (res.code == 200) {
                setTable(res.data);
                $("#ygxxTable").colResizable({
                    liveDrag: true,
                    gripInnerHtml: "<div class='grip'></div>",
                    draggingClass: "dragging",
                    resizeMode: 'fit'
                });
                // 更新统计信息
                updateStatistics();
            } else {
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
        },
        error: function(xhr, status, error) {
            console.error('获取列表失败:', error);
            swal("获取失败", "网络错误", "error");
        }
    });
}

// 更新时间显示
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    $('#now_time').text(timeString);
}

$(function () {
    // 添加统计栏样式
    addStatisticsStyles();

    // 创建统计栏
    createStatisticsBar();

    // 初始化页面
    getList();
    updateTime();

    // 设置定时更新时间
    setInterval(updateTime, 1000);

    // 绑定表格选择事件来更新统计信息
    $('#ygxxTable').on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function () {
        setTimeout(function() {
            updateStatistics();
        }, 100);
    });

    // 查询按钮
    $('#select-btn').click(function () {
        console.log('查询按钮被点击');
        var name = $('#gsm').val().trim();
        console.log('查询参数:', name);

        $.ajax({
            type: 'post',
            url: '/ygxx/queryList',
            data: JSON.stringify({
                name: name
            }),
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            success: function (res) {
                console.log('查询响应:', res);
                console.log('返回的数据详情:', res.data);

                if (res.code == 200) {
                    // 调用setTable更新表格
                    setTable(res.data);

                    // 添加延迟检查，确保表格已更新
                    setTimeout(function() {
                        var currentData = $('#ygxxTable').bootstrapTable('getData');
                        console.log('当前表格实际数据:', currentData);
                        console.log('当前表格数据条数:', currentData.length);
                        updateStatistics();
                    }, 100);

                    if (res.data.length > 0) {
                        swal("查询成功", "找到 " + res.data.length + " 条记录", "success");
                    } else {
                        swal("查询完成", "未找到匹配的记录", "info");
                    }
                } else {
                    swal("查询失败", res.msg, "error");
                }
            },
            error: function(xhr, status, error) {
                console.error('查询失败:', error);
                swal("查询失败", "网络错误", "error");
            }
        });
    });

    // 重置查询按钮
    $('#reset-btn').click(function () {
        console.log('重置查询按钮被点击');
        $('#gsm').val(''); // 清空查询条件
        getList(); // 重新加载所有数据
    });

    // 修改按钮
    $('#update-btn').click(function () {
        console.log('修改按钮被点击');
        let rows = getTableSelection('#ygxxTable');
        console.log('选中的行:', rows);

        if (rows.length > 1 || rows.length == 0) {
            swal('请选择一条数据修改!', "", "info");
            return;
        }

        // 显示修改弹窗
        $('#update-modal').modal('show');

        // 填充表单数据
        if (rows.length === 1) {
            let rowData = rows[0];
            console.log('填充表单数据:', rowData);

            // 填充表单字段
            $('#update-id').val(rowData.id || '');
            $('#update-gh').val(rowData.gh || '');
            $('#update-xm').val(rowData.xm || '');
            $('#update-zw').val(rowData.zw || '');
            $('#update-bm').val(rowData.bm || '');
            $('#update-lxfs').val(rowData.lxfs || '');
            $('#update-bz').val(rowData.bz || '');
        }
    });

    // 修改弹窗关闭按钮
    $('#update-close-btn').click(function () {
        $('#update-form')[0].reset();
        $('#update-modal').modal('hide');
    });

    // 修改提交按钮
    $('#update-submit-btn').click(function () {
        console.log('修改提交按钮被点击');

        // 表单验证
        let form = $('#update-form')[0];
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        swal({
            title: "确认修改",
            text: "确定要修改这条员工信息吗？",
            icon: "warning",
            buttons: {
                cancel: {
                    text: "取消",
                    value: null,
                    visible: true
                },
                confirm: {
                    text: "确认修改",
                    value: true,
                    className: "btn-primary"
                }
            }
        }, function(willUpdate) {
            if (willUpdate) {
                let params = formToJson('#update-form');
                console.log('修改参数:', params);

                // 显示加载状态
                $('#update-submit-btn').prop('disabled', true).html('<i class="bi bi-arrow-bar-up icon"></i> 提交中...');

                $.ajax({
                    type: 'post',
                    url: '/ygxx/update',
                    data: JSON.stringify({
                        updateInfo: params
                    }),
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    success: function (res) {
                        console.log('修改响应:', res);
                        if (res.code == 200) {
                            swal("修改成功", "员工信息已更新", "success");
                            $('#update-form')[0].reset();
                            $('#update-modal').modal('hide');
                            getList(); // 刷新列表
                        } else {
                            swal("修改失败", res.msg, "error");
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('修改失败:', error);
                        swal("修改失败", "网络错误", "error");
                    },
                    complete: function() {
                        // 恢复按钮状态
                        $('#update-submit-btn').prop('disabled', false).html('<i class="bi bi-arrow-bar-up icon"></i> 提交');
                    }
                });
            }
        });
    });

    // 新增按钮
    $('#add-btn').click(function () {
        console.log('新增按钮被点击');
        $('#add-modal').modal('show');
        $('#add-form')[0].reset();
    });

    // 新增关闭按钮
    $('#add-close-btn').click(function () {
        $('#add-modal').modal('hide');
    });

    // 新增提交
    $("#add-submit-btn").click(function () {
        console.log('新增提交按钮被点击');
        let params = formToJson("#add-form");
        console.log('新增参数:', params);

        if (checkForm('#add-form')) {
            $.ajax({
                type: 'post',
                url: '/ygxx/add',
                data: JSON.stringify({
                    addInfo: params
                }),
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    console.log('新增响应:', res);
                    if (res.code == 200) {
                        swal("新增成功", "员工信息已添加", "success");
                        $('#add-form')[0].reset();
                        getList();
                        $('#add-close-btn').click();
                    } else {
                        swal("新增失败", res.msg, "error");
                    }
                },
                error: function(xhr, status, error) {
                    console.error('新增失败:', error);
                    swal("新增失败", "网络错误", "error");
                }
            });
        }
    });

    // 刷新按钮
    $("#refresh-btn").click(function () {
        console.log('刷新按钮被点击');
        getList();
        swal("刷新成功", "数据已更新", "success");
    });

// 删除按钮
    $('#delete-btn').click(function () {
        console.log('删除按钮被点击');
        let rows = getTableSelection("#ygxxTable");
        console.log('选中的行数据:', rows);

        if (rows.length == 0) {
            swal('请选择要删除的数据！', "", "info");
            return;
        }

        let itemNames = rows.map(row => {
            return row.xm || row.gh || "未知员工";
        }).join(', ');

        swal({
            title: "确认删除",
            text: "确定要删除员工：" + itemNames + " 吗？此操作不可恢复！",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认删除",
            cancelButtonText: "取消",
            closeOnConfirm: false,
            closeOnCancel: true
        }, function(willDelete) {
            if (willDelete) {
                let idList = [];
                let validRows = 0;

                $.each(rows, function (index, row) {
                    console.log('处理行数据:', row);
                    // 确保从row对象中获取id字段
                    if (row && row.id) {
                        idList.push(row.id);
                        validRows++;
                    }
                });

                if (idList.length === 0) {
                    swal("删除失败", "没有找到有效的ID，请检查数据", "error");
                    return;
                }

                console.log('要删除的ID列表:', idList);
                console.log('有效记录数:', validRows);

                $.ajax({
                    type: 'post',
                    url: '/ygxx/delete',
                    data: JSON.stringify({
                        idList: idList
                    }),
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    success: function (res) {
                        console.log('删除响应:', res);
                        if (res.code == 200) {
                            swal("删除成功", "已成功删除 " + validRows + " 条记录", "success");
                            getList(); // 刷新表格
                        } else {
                            swal("删除失败", res.msg, "error");
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('删除请求失败:', error);
                        swal("删除失败", "网络错误或服务器异常", "error");
                    }
                });
            }
        });
    });
});