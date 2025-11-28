var idd;

function getList() {
    $('#name').val("");
    $ajax({
        type: 'get',
        url: '/user/getList',
    }, false, '', function (res) {
        if (res.code == 200) {
            setTable(res.data);
            $("#userTable").colResizable({
                liveDrag: true,
                gripInnerHtml: "<div class='grip'></div>",
                draggingClass: "dragging",
                resizeMode: 'fit'
            });
            // 获取最大ID用于后续操作
            if (res.data && res.data.length > 0) {
                idd = Math.max(...res.data.map(item => item.id));
            }
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
    })
}

// 权限检查函数
function checkPermission(callback) {
    callback(true);
}

// 创建统计栏
function createStatisticsBar() {
    // 移除已存在的统计栏
    $('#statistics-bar').remove();

    // 创建统计栏HTML
    var statisticsHtml = `
        <div id="statistics-bar" class="statistics-bar">
            <div class="statistics-item">
                <span class="statistics-label">总用户数：</span>
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
    var selectedCount = $('#userTable').bootstrapTable('getSelections').length;
    var totalCount = $('#userTable').bootstrapTable('getData').length;

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

$(function () {
    // 添加统计栏样式
    addStatisticsStyles();

    // 页面加载时初始化
    getList();

    // 创建统计栏
    createStatisticsBar();

    // 查询按钮点击事件
    $('#select-btn').click(function () {
        var name = $('#name').val();
        console.log('查询姓名参数:', name);

        $ajax({
            type: 'get',
            url: '/user/queryList',
            data: {
                name: name
            }
        }, true, '', function (res) {
            console.log('查询响应:', res);
            if (res.code == 200) {
                setTable(res.data);
                updateStatistics();
                swal("查询成功", "找到 " + res.data.length + " 条记录", "success");
            } else {
                swal("查询失败", res.msg, "error");
            }
        })
    });

    // 刷新按钮
    $("#refresh-btn").click(function () {
        getList();
        swal("刷新成功", "数据已更新", "success");
    });

    // 新增按钮
    $("#add-btn").click(function () {
        // 检查权限
        checkPermission(function(hasPermission) {
            if (hasPermission) {
                $('#add-modal').modal('show');
                $('#add-form')[0].reset();
                $('#add-form').removeClass('was-validated');
            } else {
                swal("权限不足", "您没有新增用户的权限", "warning");
            }
        });
    });

    // 新增弹窗关闭按钮
    $('#add-close-btn').click(function () {
        $('#add-modal').modal('hide');
    });

    // 新增提交按钮
    $("#add-submit-btn").click(function () {
        if (checkForm('#add-form')) {
            let params = formToJson("#add-form");

            // 验证必填字段
            if (!params.name || !params.username || !params.password || !params.power) {
                swal("请填写完整信息", "所有字段都是必填的", "warning");
                return;
            }

            // 修复：使用正确的数据格式
            $ajax({
                type: 'post',
                url: '/user/add',
                data: JSON.stringify({
                    addInfo: params
                }),
                dataType: 'json',
                contentType: 'application/json;charset=utf-8'
            }, false, '提交中...', function (res) {
                console.log('新增响应:', res); // 添加调试信息
                if (res.code == 200) {
                    swal("新增成功", "用户已成功添加", "success");
                    $('#add-form')[0].reset();
                    getList();
                    $('#add-modal').modal('hide');
                } else {
                    swal("新增失败", res.msg || "未知错误", "error");
                }
            }, function(xhr, status, error) {
                console.error('新增请求失败:', error);
                swal("新增失败", "网络错误或服务器异常", "error");
            });
        }
    });

    // 修改按钮
    $('#update-btn').click(function () {
        // 检查权限
        checkPermission(function(hasPermission) {
            if (!hasPermission) {
                swal("权限不足", "您没有修改用户的权限", "warning");
                return;
            }

            let rows = getTableSelection('#userTable');
            if (rows.length > 1 || rows.length == 0) {
                swal('请选择一条数据修改!', "", "info");
                return;
            }

            $('#update-modal').modal('show');
            setForm(rows[0], '#update-form');

            // 按照HTML表单顺序设置值：名称、账号、密码、权限
            $('#update-name').val(rows[0].name);        // 修复：去掉 .data
            $('#update-username').val(rows[0].username); // 修复：去掉 .data
            $('#update-password').val(rows[0].password); // 修复：去掉 .data
            $('#update-power').val(rows[0].power);      // 修复：去掉 .data

            $('#update-form').removeClass('was-validated');
        });
    });

    // 修改弹窗关闭按钮
    $('#update-close-btn').click(function () {
        $('#update-form')[0].reset();
        $('#update-modal').modal('hide');
    });

    // 修改提交按钮
    $('#update-submit-btn').click(function () {
        if (checkForm('#update-form')) {
            let params = formToJson('#update-form');

            // 验证必填字段
            if (!params.name || !params.username || !params.password || !params.power) {
                swal("请填写完整信息", "所有字段都是必填的", "warning");
                return;
            }

            // 确保有ID
            if (!params.id) {
                swal("数据错误", "未找到用户ID", "error");
                return;
            }

            swal({
                title: "确认修改",
                text: "确定要修改这个用户信息吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "确认修改",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: true
            }, function(isConfirm) {
                if (isConfirm) {
                    // 修复：使用正确的数据格式
                    $ajax({
                        type: 'post',
                        url: '/user/update',
                        data: JSON.stringify(params), // 直接发送params对象
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8'
                    }, false, '修改中...', function (res) {
                        console.log('修改响应:', res); // 添加调试信息
                        if (res.code == 200) {
                            swal("修改成功", "用户信息已更新", "success");
                            $('#update-modal').modal('hide');
                            getList();
                        } else {
                            swal("修改失败", res.msg || "未知错误", "error");
                        }
                    }, function(xhr, status, error) {
                        console.error('修改请求失败:', error);
                        swal("修改失败", "网络错误或服务器异常", "error");
                    });
                }
            });
        }
    });

    // 删除按钮
    $('#delete-btn').click(function () {
        // 检查权限
        checkPermission(function(hasPermission) {
            if (!hasPermission) {
                swal("权限不足", "您没有删除用户的权限", "warning");
                return;
            }

            let rows = getTableSelection("#userTable");
            console.log("选中的行数据:", rows);

            if (rows.length == 0) {
                swal('请选择要删除的数据！', "", "info");
                return;
            }

            let userNames = rows.map(row => row.name || "未知用户").join(', ');

            swal({
                title: "确认删除",
                text: "确定要删除用户：" + userNames + " 吗？此操作不可恢复！",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认删除",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: true
            }, function(isConfirm) {
                if (isConfirm) {
                    let idList = rows.map(row => row.id).filter(id => id);

                    if (idList.length === 0) {
                        swal("删除失败", "没有找到有效的用户ID", "error");
                        return;
                    }

                    // 修复：使用正确的ajax函数和数据格式
                    $ajax({
                        type: 'post',
                        url: '/user/delete',
                        data: JSON.stringify({
                            idList: idList
                        }),
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8'
                    }, false, '删除中...', function (res) {
                        console.log('删除响应:', res);
                        if (res.code == 200) {
                            swal("删除成功", "已成功删除 " + rows.length + " 个用户", "success");
                            getList();
                        } else {
                            swal("删除失败", res.msg || "未知错误", "error");
                        }
                    }, function(xhr, status, error) {
                        console.error('删除请求失败:', error);
                        swal("删除失败", "网络错误或服务器异常", "error");
                    });
                }
            });
        });
    });

    // 实时时间显示
    updateTime();
    setInterval(updateTime, 1000);

    // 绑定表格选择事件来更新统计信息
    $('#userTable').on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function () {
        setTimeout(function() {
            updateStatistics();
        }, 100);
    });
});

// 设置表格数据
function setTable(data) {
    if ($('#userTable').html != '') {
        $('#userTable').bootstrapTable('load', data);
    }

    $('#userTable').bootstrapTable({
        data: data,
        sortStable: true,
        classes: '',
        idField: 'id',
        pagination: true,
        pageSize: 15,
        pageList: [10, 15, 20, 50],
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
                valign: 'middle',
                width: 40
            },
            {
                field: 'power',
                title: '权限',
                align: 'center',
                sortable: true,
                width: 100,
                formatter: function(value) {
                    if (value === '超级管理员') {
                        return '<span class="badge badge-dark" style="font-size: 13px">超级管理员</span>';
                    } else if (value === '管理员') {
                        return '<span class="badge badge-danger" style="font-size: 13px">管理员</span>';
                    } else if (value === '业务员') {
                        return '<span class="badge badge-success" style="font-size: 13px">业务员</span>';
                    }
                }
            },

            {
                field: 'name',
                title: '名称',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'username',
                title: '账号',
                align: 'center',
                sortable: true,
                width: 120,
            }, {
                field: 'password',
                title: '密码',
                align: 'center',
                sortable: true,
                width: 120,
                formatter: function(value) {
                    // 直接显示密码明文
                    return value;
                }
            },
        ],
        // onClickRow: function (row, el) {
        //     let isSelect = $(el).hasClass('selected')
        //     if (isSelect) {
        //         $(el).removeClass('selected')
        //     } else {
        //         $(el).addClass('selected')
        //     }
        // }
    });

    // 初始化统计信息
    updateStatistics();
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

// 表单验证函数
function checkForm(formId) {
    var form = $(formId)[0];
    if (form.checkValidity() === false) {
        $(formId).addClass('was-validated');
        return false;
    }
    return true;
}

// 表单转JSON函数
function formToJson(formId) {
    var formData = {};
    $(formId).serializeArray().forEach(function(item) {
        formData[item.name] = item.value;
    });
    return formData;
}

// 设置表单数据
function setForm(data, formId) {
    $.each(data, function(key, value) {
        var input = $(formId).find('[name="' + key + '"]');
        if (input.length) {
            input.val(value);
        }
    });
}

// 获取表格选中行
function getTableSelection(tableId) {
    return $(tableId).bootstrapTable('getSelections');
}