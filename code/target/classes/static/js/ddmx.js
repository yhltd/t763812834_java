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

    // 绑定搜索输入框回车事件 - 使用正确的ID
    $('#ddh, #khmc, #fzr, #bm').off('keypress').on('keypress', function(e) {
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
            alert('请选择要打印的订单信息');
            return;
        }
        // 这里可以添加打印逻辑
        alert('打印功能待实现');
    });
}

function resetSearchAndRefresh() {
    // 重置搜索条件
    $('#khmc').val('');
    $('#fzr').val('');
    $('#lxr').val('');
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
    $('#ddh').val('');    // 订单号
    $('#khmc').val('');   // 客户名称
    $('#fzr').val('');    // 负责人
    $('#bm').val('');     // 部门
    setDefaultDateRange();

    // 重新查询
    currentPage = 1;
    getList(currentPage, pageSize, {});
}

// 获取搜索参数
function getSearchParams() {
    return {
        ddh: $('#ddh').val() || '',    // 订单号
        khmc: $('#khmc').val() || '',  // 客户名称
        fzr: $('#fzr').val() || '',    // 负责人
        bm: $('#bm').val() || '',      // 部门
        startDate: $('#startDate').val() || '',
        endDate: $('#endDate').val() || ''
    };
}

// 获取当前搜索关键词
function getCurrentKeyword() {
    return $('#ddh').val() || '';
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
        url: '/ddmx/distinctPage',
        contentType: 'application/json',
        data: JSON.stringify({
            pageNum: currentPage,
            pageSize: pageSize,
            ddh: searchParams.ddh || '',    // 订单号（后端需要但前端没有，传空）
            khmc: searchParams.khmc || '',  // 客户名称
            fzr: searchParams.fzr || '',    // 负责人
            bm: searchParams.bm || '',      // 部门（后端需要但前端没有，传空）
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
                alert("登录已过期，请重新登录");
                window.location.href = "/login.html";
            } else if (res.code === 403) {
                alert("权限不足，无法访问此功能");
            } else {
                alert("查询失败: " + (res.message || '未知错误'));
            }
        }
    });
}

// 显示加载中
function showLoading() {
    $('#ddmxTable').html('<tr><td colspan="22" style="text-align: center; padding: 20px;">加载中...</td></tr>');
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

// 计算应付金额
function calculateYingfu(yfsj, zk) {
    if (!yfsj) return '0';

    // 如果zk为空或null，直接返回yfsj
    if (!zk || zk === '' || zk === 'null') {
        return parseFloat(yfsj) || 0;
    }

    // 计算应付金额 = yfsj * zk
    var yfsjValue = parseFloat(yfsj) || 0;
    var zkValue = parseFloat(zk) || 0;
    return (yfsjValue * zkValue).toFixed(2);
}

// 计算未付金额
function calculateWeifu(yingfu, yifu) {
    var yingfuValue = parseFloat(yingfu) || 0;
    var yifuValue = parseFloat(yifu) || 0;
    return (yingfuValue - yifuValue).toFixed(2);
}

// 更新字段数据
function updateField(ddh, fieldName, fieldValue, callback) {
    showLoading();

    $ajax({
        type: 'post',
        url: '/ddmx/updateByDdh',
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
        } else {
            console.error(fieldName + "字段更新失败:", res.message);
            alert(fieldName + "字段更新失败: " + (res.message || '未知错误'));
            // 更新失败时恢复原值
            if (fieldName === 'sfkp') {
                var $select = $('.sfkp-select[data-ddh="' + ddh + '"]');
                $select.val($select.data('original-value'));
            }
        }
    });
}

// 填充表格 - 渲染订单明细字段
function fillTable(data) {
    console.log("返回数据", data)
    $('#ddmxTable').empty();

    var tableHeader = `
        <thead>
            <tr>
                <th width="100">订单日期</th>
                <th width="160">订单号</th>
                <th width="100">客户简称</th>
                <th width="80">负责人</th>
                <th width="80">部门</th>
                <th width="80">联系人</th>
                <th width="100">联系电话</th>
                <th width="80">提成点</th>
                <th width="180">客户名称</th>
                <th width="100">开票时间</th>
                <th width="100">应付时间</th>
                <th width="100">应付金额</th>
                <th width="80">已付</th>
                <th width="80">未付</th>
                <th width="120">开票状态</th>
                <th width="120">物流单号</th>
                <th width="80">折扣</th>
                <th width="160">操作</th>
                <th width="200">PDF文件</th>
            </tr>
        </thead>
    `;

    var tableBody = '<tbody>';

    if (data && data.length > 0) {
        data.forEach(function(item, index) {
            // 计算应付金额和未付金额
            var yingfu = calculateYingfu(item.yfsj, item.zk);
            var weifu = calculateWeifu(yingfu, item.yifu);

            // 判断是否有PDF文件
            var hasPdf = item.pdf_file_name && item.pdf_file_name !== '';

            console.log('订单号:', item.ddh, '是否有PDF:', hasPdf, 'PDF文件名:', item.pdf_file_name);

            tableBody += `
                <tr data-id="${item.id || index}" data-ddh="${item.ddh || ''}">
                    <td>${item.ddrq || ''}</td>
                    <td>${item.ddh || ''}</td>
                    <td>${item.khjc || ''}</td>
                    <td>${item.fzr || ''}</td>
                    <td>${item.bm || ''}</td>
                    <td>${item.lxr || ''}</td>
                    <td>${item.lxdh || ''}</td>
                    <td class="editable-tcd" data-field="tcd" data-ddh="${item.ddh || ''}">${item.tcd || ''}</td>
                    <td>${item.khmc || ''}</td>
                    <td class="kpsj-cell">${item.kpsj || ''}</td>
                    <td class="yfsj-cell">${item.yingfu || ''}</td>
                    <td>${yingfu}</td>
                    <td class="editable-yifu" data-field="yifu" data-ddh="${item.ddh || ''}" data-original="${item.yifu || '0'}">${item.yifu || ''}</td>
                    <td>${weifu}</td>
                    <td class="editable-sfkp" data-field="sfkp" data-ddh="${item.ddh || ''}">
                        <select class="sfkp-select">
                            <option value="未开票" ${item.sfkp === '未开票' ? 'selected' : ''}>未开票</option>
                            <option value="已开票" ${item.sfkp === '已开票' ? 'selected' : ''}>已开票</option>
                        </select>
                    </td>
                    <td class="editable-wldh" data-field="wldh" data-ddh="${item.ddh || ''}">${item.wldh || ''}</td>
                    <td class="editable-zk" data-field="zk" data-ddh="${item.ddh || ''}">${item.zk || ''}</td>
                    <td>
                        <button class="btn btn-sm btn-info detail-btn" 
                                data-ddh="${item.ddh || ''}">
                            <i class="bi bi-eye"></i> 详情
                        </button>
                        <button class="btn btn-sm btn-warning withdraw-btn" 
                                data-ddh="${item.ddh || ''}"
                                style="margin-top: 2px;">
                            <i class="bi bi-arrow-counterclockwise"></i> 撤回
                        </button>
                    </td>
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
                </tr>
            `;
        });
    } else {
        tableBody += `
            <tr>
                <td colspan="19" style="text-align: center; color: #999;">暂无订单数据</td>
            </tr>
        `;
    }

    tableBody += '</tbody>';
    $('#ddmxTable').html(tableHeader + tableBody);
    addRowClickEvent();
    bindDetailButtonEvents();
    bindEditableEvents();
    bindWithdrawButtonEvents();
    bindViewPdfEvents();      // 绑定查看PDF事件
    bindUploadPdfEvents();    // 绑定上传PDF事件
    bindDeletePdfEvents();    // 绑定删除PDF事件

    console.log('表格渲染完成，数据条数:', data ? data.length : 0);
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
            alert('订单号不能为空');
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
            alert('订单号不能为空');
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
            alert('请选择PDF文件');
            $(this).val('');
            return;
        }

        // 验证文件大小（限制为10MB）
        if (file.size > 10 * 1024 * 1024) {
            alert('文件大小不能超过10MB');
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
            alert('订单号不能为空');
            return;
        }

        // 确认删除操作
        if (!confirm('确定要删除订单 ' + ddh + ' 的PDF文件吗？此操作不可恢复！')) {
            return;
        }

        deletePdfFile(ddh, $btn);
    });
}

// 删除PDF文件
function deletePdfFile(ddh, $btn) {
    if (!ddh) {
        alert('订单号不能为空');
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
            alert('PDF文件删除成功！');

            // 删除成功后刷新数据
            getList(currentPage, pageSize, getSearchParams());
        } else {
            console.error("PDF文件删除失败:", res.message);
            alert("PDF文件删除失败: " + (res.message || '未知错误'));
        }
    }).fail(function(xhr, status, error) {
        hideLoading();

        if ($btn) {
            $btn.prop('disabled', false).html('<i class="bi bi-trash"></i> 删除');
        }

        console.error("删除请求失败:", error);
        alert("删除请求失败，请检查网络连接");
    });
}

// 绑定撤回按钮事件
function bindWithdrawButtonEvents() {
    $('.withdraw-btn').off('click').on('click', function(e) {
        e.stopPropagation();

        var $btn = $(this);
        var ddh = $btn.data('ddh');

        if (!ddh) {
            alert('订单号不能为空');
            return;
        }

        // 确认撤回操作
        if (!confirm('确定要撤回订单 ' + ddh + ' 吗？')) {
            return;
        }

        withdrawOrder(ddh, $btn);
    });
}

// 执行撤回订单操作
function withdrawOrder(ddh, $btn) {
    showLoading();

    // 禁用按钮防止重复点击
    $btn.prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> 撤回中...');

    $ajax({
        type: 'post',
        url: '/ddmx/withdrawOrder',
        contentType: 'application/json',
        data: JSON.stringify({
            ddh: ddh
        }),
        dataType: 'json'
    }, false, '', function (res) {
        hideLoading();

        if (res.code === 200) {
            console.log("订单撤回成功");
            alert('订单撤回成功！');

            // 刷新数据
            getList(currentPage, pageSize, getSearchParams());
        } else {
            console.error("订单撤回失败:", res.message);
            alert("订单撤回失败: " + (res.message || '未知错误'));

            // 恢复按钮状态
            $btn.prop('disabled', false).html('<i class="bi bi-arrow-counterclockwise"></i> 撤回');
        }
    }).fail(function(xhr, status, error) {
        hideLoading();
        console.error("撤回请求失败:", error);
        alert("撤回请求失败，请检查网络连接");

        // 恢复按钮状态
        $btn.prop('disabled', false).html('<i class="bi bi-arrow-counterclockwise"></i> 撤回');
    });
}

// 绑定PDF上传事件
function bindPdfUploadEvents() {
    // 清除之前绑定的事件，避免重复绑定
    $('.pdf-btn').off('click');
    $('.pdf-file-input').off('change');

    // PDF按钮点击事件 - 只处理查看功能
    $('.pdf-btn').on('click', function(e) {
        e.stopPropagation();

        var $btn = $(this);
        var ddh = $btn.data('ddh');
        var hasPdf = $btn.data('has-pdf');

        console.log('PDF按钮点击，订单号:', ddh, '是否有PDF:', hasPdf);

        if (hasPdf) {
            // 如果已有PDF，查看文件
            viewPdfFile(ddh);
        } else {
            // 如果没有PDF，显示上传提示
            alert('请选择PDF文件进行上传');
            // 或者直接触发文件选择
            var $fileInput = $btn.closest('td').find('.pdf-file-input');
            $fileInput.trigger('click');
        }
    });

    // 添加上传按钮
    $('.upload-pdf-btn').off('click').on('click', function(e) {
        e.stopPropagation();
        var $btn = $(this);
        var ddh = $btn.data('ddh');
        var $fileInput = $btn.closest('td').find('.pdf-file-input');
        $fileInput.trigger('click');
    });

    // 文件选择变化事件
    $('.pdf-file-input').on('change', function(e) {
        var file = e.target.files[0];
        var ddh = $(this).data('ddh');

        console.log('文件选择变化，订单号:', ddh, '文件:', file ? file.name : '无文件');

        if (file) {
            // 验证文件类型
            if (file.type !== 'application/pdf') {
                alert('请选择PDF文件');
                $(this).val('');
                return;
            }

            // 验证文件大小（限制为10MB）
            if (file.size > 10 * 1024 * 1024) {
                alert('文件大小不能超过10MB');
                $(this).val('');
                return;
            }

            // 上传文件
            uploadPdfFile(ddh, file);

            // 清空文件输入，允许重复选择同一个文件
            $(this).val('');
        }
    });
}

// 绑定可编辑字段事件
function bindEditableEvents() {
    // 提成点编辑
    $('.editable-tcd').off('dblclick').on('dblclick', function() {
        var $cell = $(this);
        var originalValue = $cell.text().trim();
        var ddh = $cell.data('ddh');

        var input = $('<input type="text" class="form-control input-sm">')
            .val(originalValue)
            .css({
                'width': '100%',
                'height': '100%',
                'border': '1px solid #409EFF',
                'padding': '2px 4px'
            });

        $cell.html(input);
        input.focus();

        input.blur(function() {
            var newValue = input.val().trim();
            $cell.text(newValue);

            if (newValue !== originalValue) {
                updateField(ddh, 'tcd', newValue, function() {
                    // 更新成功后重新计算应付金额和未付金额
                    var $row = $cell.closest('tr');
                    updateYingfuWeifuDisplay($row);
                });
            }
        });

        input.keypress(function(e) {
            if (e.which === 13) {
                input.blur();
            }
        });
    });

    // 物流单号编辑
    $('.editable-wldh').off('dblclick').on('dblclick', function() {
        var $cell = $(this);
        var originalValue = $cell.text().trim();
        var ddh = $cell.data('ddh');

        var input = $('<input type="text" class="form-control input-sm">')
            .val(originalValue)
            .css({
                'width': '100%',
                'height': '100%',
                'border': '1px solid #409EFF',
                'padding': '2px 4px'
            });

        $cell.html(input);
        input.focus();

        input.blur(function() {
            var newValue = input.val().trim();
            $cell.text(newValue);

            if (newValue !== originalValue) {
                updateField(ddh, 'wldh', newValue, function() {
                    // 更新成功后重新计算应付金额和未付金额
                    var $row = $cell.closest('tr');
                    updateYingfuWeifuDisplay($row);
                });
            }
        });

        input.keypress(function(e) {
            if (e.which === 13) {
                input.blur();
            }
        });
    });

    // 折扣编辑
    $('.editable-zk').off('dblclick').on('dblclick', function() {
        var $cell = $(this);
        var originalValue = $cell.text().trim();
        var ddh = $cell.data('ddh');

        var input = $('<input type="number" step="0.01" class="form-control input-sm">')
            .val(originalValue)
            .css({
                'width': '100%',
                'height': '100%',
                'border': '1px solid #409EFF',
                'padding': '2px 4px'
            });

        $cell.html(input);
        input.focus();

        input.blur(function() {
            var newValue = input.val().trim();
            $cell.text(newValue);

            if (newValue !== originalValue) {
                updateField(ddh, 'zk', newValue, function() {
                    // 更新成功后重新计算应付金额和未付金额
                    var $row = $cell.closest('tr');
                    updateYingfuWeifuDisplay($row);
                });
            }
        });

        input.keypress(function(e) {
            if (e.which === 13) {
                input.blur();
            }
        });
    });

    // 已付金额编辑（累加模式）
    $('.editable-yifu').off('dblclick').on('dblclick', function() {
        var $cell = $(this);
        var originalValue = parseFloat($cell.data('original')) || 0;
        var currentDisplay = $cell.text().trim();
        var ddh = $cell.data('ddh');

        var input = $('<input type="number" step="0.01" class="form-control input-sm">')
            .attr('placeholder', '输入累加金额')
            .css({
                'width': '100%',
                'height': '100%',
                'border': '1px solid #28a745',
                'padding': '2px 4px'
            });

        $cell.html(input);
        input.focus();

        input.blur(function() {
            var addValue = parseFloat(input.val()) || 0;
            if (addValue > 0) {
                var newValue = (originalValue + addValue).toFixed(2);
                $cell.text(newValue);
                $cell.data('original', newValue);

                updateField(ddh, 'yifu', newValue, function() {
                    // 更新成功后重新计算未付金额
                    var $row = $cell.closest('tr');
                    updateYingfuWeifuDisplay($row);
                });
            } else {
                $cell.text(currentDisplay);
            }
        });

        input.keypress(function(e) {
            if (e.which === 13) {
                input.blur();
            }
        });
    });

    // 开票状态下拉选择
    $('.sfkp-select').off('change').on('change', function() {
        var $select = $(this);
        var newValue = $select.val();
        var ddh = $select.closest('td').data('ddh');
        var $kpsjCell = $select.closest('tr').find('.kpsj-cell');
        var $row = $select.closest('tr');

        // 保存原始值以便恢复
        $select.data('original-value', $select.val());

        if (newValue === '已开票') {
            // 自动设置开票时间为当前时间
            var currentTime = formatDateTime(new Date());
            $kpsjCell.text(currentTime);

            // 使用批量更新接口，同时更新开票状态和开票时间
            $ajax({
                type: 'post',
                url: '/ddmx/updateMultipleByDdh',
                contentType: 'application/json',
                data: JSON.stringify({
                    ddh: ddh,
                    sfkp: newValue,
                    kpsj: currentTime
                }),
                dataType: 'json'
            }, false, '', function (res) {
                if (res.code === 200) {
                    console.log("开票状态和开票时间更新成功");
                    // 更新应付金额和未付金额的显示
                    updateYingfuWeifuDisplay($row);
                } else {
                    console.error("开票状态更新失败:", res.message);
                    alert("开票状态更新失败: " + (res.message || '未知错误'));
                    $select.val('未开票');
                    $kpsjCell.text('');
                }
            });
        } else {
            // 清除开票时间
            $kpsjCell.text('');

            updateField(ddh, 'sfkp', newValue, function() {
                // 更新成功后更新显示
                updateYingfuWeifuDisplay($row);
            });
        }
    });
}

function updateYingfuWeifuDisplay($row) {
    var yfsj = $row.find('.yfsj-cell').text().trim();
    var zk = $row.find('.editable-zk').text().trim();
    var yifu = $row.find('.editable-yifu').text().trim();

    // 重新计算应付金额和未付金额
    var yingfu = calculateYingfu(yfsj, zk);
    var weifu = calculateWeifu(yingfu, yifu);

    // 更新显示
    $row.find('td:eq(11)').text(yingfu); // 应付金额列
    $row.find('td:eq(13)').text(weifu);  // 未付金额列
}

// 绑定详情按钮事件
function bindDetailButtonEvents() {
    $('.detail-btn').off('click').on('click', function(e) {
        e.stopPropagation();

        // 先选中当前行
        $('#ddmxTable tbody tr').removeClass('selected-row');
        $(this).closest('tr').addClass('selected-row');

        // 获取当前行的订单号和订单日期
        var $row = $(this).closest('tr');
        var ddh = $(this).data('ddh');
        var ddrq = $row.find('td:eq(0)').text().trim();

        showDetailModal(ddh, ddrq);
    });
}

// 显示详情模态框
function showDetailModal(ddh, ddrq) {
    currentId = ddh;

    // 获取选中行的数据
    var rowData = getSelectedRow();
    if (rowData) {
        fillBasicInfo(rowData);
    }

    // 根据订单号和订单日期获取详细信息
    getDetailData(ddh, ddrq);

    $('#detailModal').modal('show');
}

// 根据订单号获取详细信息
function getDetailData(ddh, ddrq) {
    if (!ddh || !ddrq) {
        console.error('订单号或订单日期为空');
        return;
    }

    showDetailLoading();

    // 调用获取详细信息的接口，同时传递ddh和ddrq
    $ajax({
        type: 'post',
        url: '/ddmx/getDetailByDdhAndDdrq',
        contentType: 'application/json',
        data: JSON.stringify({
            ddh: ddh,
            ddrq: ddrq
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
                            <th width="200">生产工单</th>
                            <th width="250">备注</th>
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
                    <td class="scgd-cell">${item.scgd || ''}</td>
                    <td class="bz-cell">${item.bz || ''}</td>
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
                    <label><strong>联系人：</strong></label>
                    <span>${rowData.lxr || ''}</span>
                </div>
                <div class="col-md-4">
                    <label><strong>联系电话：</strong></label>
                    <span>${rowData.lxdh || ''}</span>
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
        ddrq: selectedRow.find('td:eq(0)').text().trim(),
        ddh: selectedRow.find('td:eq(1)').text().trim(),
        khjc: selectedRow.find('td:eq(2)').text().trim(),
        fzr: selectedRow.find('td:eq(3)').text().trim(),
        bm: selectedRow.find('td:eq(4)').text().trim(),
        lxr: selectedRow.find('td:eq(5)').text().trim(),
        lxdh: selectedRow.find('td:eq(6)').text().trim(),
        tcd: selectedRow.find('td:eq(7)').text().trim(),
        khmc: selectedRow.find('td:eq(8)').text().trim(),
        kpsj: selectedRow.find('td:eq(9)').text().trim(),
        yingfu: selectedRow.find('td:eq(10)').text().trim(),
        yifu: selectedRow.find('td:eq(11)').text().trim(),
        wf: selectedRow.find('td:eq(12)').text().trim(),
        sfkp: selectedRow.find('td:eq(13)').text().trim(),
        wldh: selectedRow.find('td:eq(14)').text().trim(),
        zk: selectedRow.find('td:eq(15)').text().trim(),
        fhsj: selectedRow.find('td:eq(16)').text().trim(),
        bz: selectedRow.find('td:eq(17)').text().trim()
    };

    return rowData;
}


// 添加行点击事件
function addRowClickEvent() {
    $('#ddmxTable tbody tr').click(function() {
        $('#ddmxTable tbody tr').removeClass('selected-row');
        $(this).addClass('selected-row');
        var ddh = $(this).find('td:eq(1)').text().trim();
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
            .pending-shipment {
                background-color: #409EFF !important;
                color: white !important;
                font-weight: bold;
            }
            
            /* 开票状态下拉选择框样式 */
            .sfkp-select {
                width: 100% !important;
                min-width: 90px !important;
                max-width: 110px !important;
                border: 1px solid #ddd !important;
                border-radius: 3px !important;
                padding: 4px 6px !important;
                font-size: 12px !important;
                background-color: white !important;
                cursor: pointer !important;
                height: 28px !important;
                box-sizing: border-box !important;
            }
            
            .sfkp-select:focus {
                border-color: #409EFF !important;
                outline: none !important;
                box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2) !important;
            }
            
            .sfkp-select option {
                padding: 6px 8px !important;
                font-size: 12px !important;
            }
            
            /* 开票状态单元格样式 */
            .editable-sfkp {
                min-width: 120px !important;
                max-width: 120px !important;
                overflow: visible !important;
            }
            
            .editable-tcd, .editable-wldh, .editable-zk, .editable-yifu {
                cursor: pointer;
                background-color: #f0f8ff;
            }
            .editable-yifu {
                background-color: #f0fff0;
            }
            .editable-tcd:hover, .editable-wldh:hover, .editable-zk:hover, .editable-yifu:hover {
                background-color: #e6f7ff;
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
            
            /* 表格布局优化 */
            #ddmxTable {
                table-layout: fixed;
            }
            
            #ddmxTable th:nth-child(15),
            #ddmxTable td:nth-child(15) {
                width: 120px !important;
                min-width: 120px !important;
                max-width: 120px !important;
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

// 上传PDF文件
function uploadPdfFile(ddh, file) {
    if (!ddh || !file) {
        alert('参数错误');
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
                alert('PDF文件上传成功！');
                // 上传成功后刷新数据
                getList(currentPage, pageSize, getSearchParams());
            } else {
                console.error("PDF文件上传失败:", res.message);
                alert("PDF文件上传失败: " + (res.message || '未知错误'));
            }
        })
        .catch(error => {
            hideLoading();
            console.error("上传请求失败:", error);
            alert("上传请求失败，请检查网络连接");
        });
}

// 查看PDF文件（在线预览）- 修正版
function viewPdfFile(ddh) {
    if (!ddh) {
        alert('订单号不能为空');
        return;
    }

    console.log('查看PDF文件，订单号:', ddh);

    // 方法1：直接打开新窗口（推荐）
    const url = `/ddmx/viewPdf?ddh=${encodeURIComponent(ddh)}`;
    window.open(url, '_blank');

    // 方法2：或者使用表单提交（如果方法1不行）
    // var form = document.createElement('form');
    // form.method = 'POST';
    // form.action = '/ddmx/viewPdf';
    // form.target = '_blank';
    //
    // var input = document.createElement('input');
    // input.type = 'hidden';
    // input.name = 'ddh';
    // input.value = ddh;
    //
    // form.appendChild(input);
    // document.body.appendChild(form);
    // form.submit();
    // document.body.removeChild(form);
}

// 下载PDF文件
function downloadPdfFile(ddh) {
    if (!ddh) {
        alert('订单号不能为空');
        return;
    }

    showLoading();

    $ajax({
        type: 'post',
        url: '/ddmx/downloadPdf',
        contentType: 'application/json',
        data: JSON.stringify({
            ddh: ddh
        }),
        dataType: 'json'
    }, false, '', function (res) {
        hideLoading();
        if (res.code === 200 && res.data) {
            // 方法1：如果后端返回文件下载URL
            if (typeof res.data === 'string' && res.data.startsWith('http')) {
                window.open(res.data, '_blank');
            }
            // 方法2：如果后端返回文件流，创建下载
            else {
                try {
                    let blob;
                    if (typeof res.data === 'string') {
                        // base64解码
                        const binaryString = atob(res.data);
                        const bytes = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }
                        blob = new Blob([bytes], { type: 'application/pdf' });
                    } else {
                        blob = new Blob([res.data], { type: 'application/pdf' });
                    }

                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `订单_${ddh}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                } catch (error) {
                    console.error('PDF下载错误:', error);
                    alert('PDF下载失败');
                }
            }
        } else {
            console.error("PDF文件下载失败:", res.message);
            alert("PDF文件下载失败: " + (res.message || '未知错误'));
        }
    });
}
