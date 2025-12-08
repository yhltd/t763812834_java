var idd;
var currentPage = 1;
var pageSize = 20;
var totalCount = 0;
var totalPages = 0;
var currentId = '';


// 新增：统计变量
var totalYingfuAmount = 0;  // 应付金额合计
var totalYifuAmount = 0;    // 已付金额合计
var totalWeifuAmount = 0;   // 未付金额合计
var totalOrderCount = 0;    // 订单数量

// 页面加载完成后初始化
$(document).ready(function() {
    console.log('页面加载完成，初始化订单明细页面...');
    addTableStyles();
    initDdmxPage();
    initToolbarEvents();
    initDetailModalEvents();

    // 确保统计区域可见
    $('#statisticsContainer').show();
    // 初始化统计值为0
    updateStatistics();

    // 设置默认日期并获取数据
    setDefaultDateRange();
    getList(currentPage, pageSize, {});


    // 添加按钮点击事件 - 使用更可靠的事件委托
    $(document).on('click', '#add-btn', function(e) {
        e.preventDefault();
        console.log('上传文件按钮被点击 - 使用委托绑定');

        // 获取选中的行
        var selectedRow = getSelectedRow();

        console.log('选中的行数据:', selectedRow);

        if (!selectedRow || !selectedRow.ddh) {
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
        var orderNumber = selectedRow.ddh;

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

    // 延迟执行表格列宽调整
    setTimeout(function() {
        adjustTableColumns();
    }, 300);

    // if (window.performance && window.performance.memory) {
    //     setInterval(() => {
    //         const memory = window.performance.memory;
    //         console.log('内存使用情况:', {
    //             usedJSHeapSize: formatFileSize(memory.usedJSHeapSize),
    //             totalJSHeapSize: formatFileSize(memory.totalJSHeapSize),
    //             jsHeapSizeLimit: formatFileSize(memory.jsHeapSizeLimit)
    //         });
    //     }, 30000); // 每30秒记录一次
    // }

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

    // 删除上传文件按钮
    $('#delete-btn').off('click').on('click', function() {
        console.log('删除上传文件按钮点击');
        deleteUploadedFile();
    });

    // 打印按钮
    $('#print-btn').off('click').on('click', function() {
        console.log('打印按钮点击');
        var selectedRow = getSelectedRow();
        if (!selectedRow) {
            swal('请选择要打印的订单信息');
            return;
        }
        // 这里可以添加打印逻辑
        swal('打印功能待实现');
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

// 填充表格 - 渲染订单明细字段
function fillTable(data) {
    console.log("返回数据", data);
    $('#ddmxTable').empty();

    // 重置统计变量
    totalYingfuAmount = 0;
    totalYifuAmount = 0;
    totalWeifuAmount = 0;
    totalOrderCount = 0;

    var tableHeader = `
        <thead>
           <tr style="color: #eb6464; font-size: 10px">
                <th>双击表格内特殊颜色单元格进行输入</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
            </tr>
            <tr>
                <th>订单日期</th>
                <th>订单号</th>
                <th>客户简称</th>
                <th>负责人</th>
                <th>部门</th>
                <th>联系人</th>
                <th>联系电话</th>
                <th>提成点</th>
                <th>客户名称</th>
                <th>开票时间</th>
                <th>应付时间</th>
                <th>应付金额</th>
                <th>已付</th>
                <th>未付</th>
                <th>开票状态</th>
                <th>物流单号</th>
                <th>折扣</th>
                <th>操作</th>
                <th>PDF文件</th>
            </tr>
        </thead>
    `;

    var tableBody = '<tbody>';

    if (data && data.length > 0) {
        data.forEach(function(item, index) {
            // 计算应付金额和未付金额
            var yingfu = calculateYingfu(item.yfsj, item.zk);
            var weifu = calculateWeifu(yingfu, item.yifu);

            // 累计统计值
            totalYingfuAmount += parseFloat(yingfu) || 0;
            totalYifuAmount += parseFloat(item.yifu) || 0;
            totalWeifuAmount += parseFloat(weifu) || 0;
            totalOrderCount++;

            // 判断是否有PDF文件
            var hasPdf = item.pdf_file_name && item.pdf_file_name !== '';

            // 获取文件扩展名，用于显示不同的图标
            var fileExt = '';
            var fileIcon = '';
            if (hasPdf) {
                fileExt = item.pdf_file_name.split('.').pop().toLowerCase();
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
            <div class="pdf-btn-container">
                ${hasPdf ? `
                    <!-- 有PDF文件时的按钮 - 垂直排列 -->
                    <div>
                        <button class="btn btn-sm btn-success view-file-btn" 
                                data-filepath="${item.pdf_file_name || ''}"
                                data-filename="${item.ddh || ''}-10.${fileExt}"
                                title="查看文件：${item.pdf_file_name || ''}">
                            <i class="bi ${fileIcon}"></i> 查看文件
                        </button>
                    </div>

                ` : `
                    <!-- 没有PDF文件时的按钮 -->
                    <div>

                    </div>
                `}
                <input type="file" class="pdf-file-input" data-ddh="${item.ddh || ''}" accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx" style="display: none;">
            </div>
        </td>
    </tr>
`;
        });

        // 更新统计显示
        updateStatistics();
        $('#statisticsContainer').show();
    } else {
        tableBody += `
            <tr>
                <td colspan="19" style="text-align: center; color: #999;">暂无订单数据</td>
            </tr>
        `;
        // 没有数据时显示0值
        updateStatistics();
        $('#statisticsContainer').show();
    }

    tableBody += '</tbody>';
    $('#ddmxTable').html(tableHeader + tableBody);
    // 添加自动调整列宽的功能
    autoAdjustColumnWidths();
    addRowClickEvent();
    bindDetailButtonEvents();
    bindEditableEvents();
    bindWithdrawButtonEvents();
    bindViewFileEvents();      // 绑定查看文件事件（新增）
    // bindDeletePdfEvents();    // 绑定删除PDF事件

    // <div>
    //     <button className="btn btn-sm btn-danger delete-pdf-btn"
    //             data-ddh="${item.ddh || ''}"
    //             title="删除PDF文件">
    //         <i className="bi bi-trash"></i> 删除
    //     </button>
    // </div>
    // <button className="btn btn-sm btn-warning upload-pdf-btn"
    //         data-ddh="${item.ddh || ''}"
    //         title="上传PDF文件">
    //     <i className="bi bi-cloud-upload"></i> 上传文件
    // </button>

    // 确保每次渲染后都调整列宽
    setTimeout(function() {
        autoAdjustColumnWidths();
        adjustTableColumns();
    }, 100);
    console.log('表格渲染完成，数据条数:', data ? data.length : 0);
}

// 绑定查看文件事件
function bindViewFileEvents() {
    console.log('绑定查看文件事件...');

    $('.view-file-btn').off('click.view').on('click.view', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $btn = $(this);
        var filePath = $btn.data('filepath');
        var fileName = $btn.data('filename') || 'file';

        console.log('查看文件按钮点击，文件路径:', filePath);
        console.log('文件名:', fileName);

        if (!filePath) {
            swal('错误', '文件路径为空，无法查看文件', 'error');
            return;
        }

        // 显示加载中
        $btn.prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> 打开中...');

        try {
            // 检查URL是否有效
            if (isValidUrl(filePath)) {
                // 在新窗口/标签页中打开文件
                window.open(filePath, '_blank');

                console.log('文件已在新窗口打开:', filePath);

                // 恢复按钮状态
                setTimeout(function() {
                    $btn.prop('disabled', false).html('<i class="bi bi-file-earmark"></i> 查看文件');
                }, 1000);
            } else {
                throw new Error('文件路径格式不正确');
            }
        } catch (error) {
            console.error('打开文件失败:', error);
            swal('打开失败', '无法打开文件: ' + error.message, 'error');

            // 恢复按钮状态
            $btn.prop('disabled', false).html('<i class="bi bi-file-earmark"></i> 查看文件');
        }
    });
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

// 更新统计显示函数
function updateStatistics() {
    $('#totalYingfuAmount').text(totalYingfuAmount.toFixed(2));
    $('#totalYifuAmount').text(totalYifuAmount.toFixed(2));
    $('#totalWeifuAmount').text(totalWeifuAmount.toFixed(2));
    $('#totalOrderCount').text(totalOrderCount);
}

// 自动调整列宽函数
function autoAdjustColumnWidths() {
    const table = document.getElementById('ddmxTable');
    if (!table) return;

    // 设置表格为自动布局
    table.style.tableLayout = 'auto';  // 改为auto
    table.style.width = '100%';

    // 对于PDF列，设置更灵活的宽度
    const pdfCells = table.querySelectorAll('td.pdf-upload-cell');
    pdfCells.forEach(cell => {
        const hasPdf = cell.querySelector('.view-file-btn') !== null;

        if (hasPdf) {
            // 有PDF文件时，根据按钮宽度自适应
            cell.style.width = 'auto';
            cell.style.minWidth = '150px';
            cell.style.maxWidth = '250px';
        } else {
            // 没有PDF文件时，使用最小宽度
            cell.style.width = 'auto';
            cell.style.minWidth = '120px';
            cell.style.maxWidth = '120px';
        }
        cell.style.overflow = 'visible';
    });

    // 操作列保持固定宽度
    const actionCells = table.querySelectorAll('td:nth-child(18)');
    actionCells.forEach(cell => {
        cell.style.width = '160px';
        cell.style.minWidth = '160px';
        cell.style.maxWidth = '160px';
        cell.style.textAlign = 'center';
    });

    // 调整表格容器
    const tableContainer = table.closest('.table-div');
    if (tableContainer) {
        tableContainer.style.overflowX = 'auto';
    }
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

        // 显示加载中
        $btn.prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> 加载中...');

        // 使用优化下载
        optimizedDownloadPdf(ddh, $btn.data('filename'))
            .then(() => {
                console.log('PDF查看成功');
            })
            .catch(error => {
                console.error('PDF查看失败:', error);
                swal('查看失败', error.message, 'error');
            })
            .finally(() => {
                $btn.prop('disabled', false).html('<i class="bi bi-file-earmark-pdf"></i> 查看PDF');
            });
    });
}

// 辅助函数
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

// 在 bindUploadPdfEvents 函数中修改
// function bindUploadPdfEvents() {
//     console.log('绑定上传PDF事件...');
//
//     $('.upload-pdf-btn').off('click.upload').on('click.upload', function(e) {
//         e.preventDefault();
//         e.stopPropagation();
//
//         var $btn = $(this);
//         var ddh = $btn.data('ddh');
//         var $fileInput = $btn.closest('td').find('.pdf-file-input');
//
//         console.log('上传PDF按钮点击，订单号:', ddh);
//
//         if (!ddh) {
//             swal('订单号不能为空');
//             return;
//         }
//
//         // 触发文件选择
//         $fileInput.trigger('click');
//     });
//
//     // 文件选择变化事件
//     $('.pdf-file-input').off('change.upload').on('change.upload', function(e) {
//         console.log('文件选择框变化事件触发');
//
//         var file = e.target.files[0];
//         var ddh = $(this).data('ddh');
//         var $btn = $(this).closest('td').find('.upload-pdf-btn');
//
//         console.log('选择的文件:', file ? file.name : '无文件', '订单号:', ddh,
//             '大小:', file ? formatFileSize(file.size) : '0');
//
//         if (!file) {
//             return;
//         }
//
//         // 验证文件类型
//         if (file.type !== 'application/pdf') {
//             swal('请选择PDF文件');
//             $(this).val('');
//             return;
//         }
//
//         // 验证文件大小（增加到100MB）
//         if (file.size > 100 * 1024 * 1024) {
//             swal('文件大小不能超过100MB');
//             $(this).val('');
//             return;
//         }
//
//         // 显示上传进度
//         $btn.prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> 上传中...');
//
//         // 显示进度条
//         const progressHtml = `
//         <div class="progress mt-2" style="height: 20px;">
//             <div class="progress-bar progress-bar-striped progress-bar-animated"
//                  role="progressbar" style="width: 0%;"
//                  aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
//                 0%
//             </div>
//         </div>
//     `;
//         $btn.after(progressHtml);
//         const $progressBar = $btn.next('.progress').find('.progress-bar');
//
//         // 根据文件大小选择不同的上传方式
//         const uploadFunction = file.size > 10 * 1024 * 1024
//             ? uploadLargePdfFile  // 超过10MB使用大文件上传
//             : uploadPdfFile;      // 小文件使用普通上传
//
//         uploadFunction(ddh, file, (percent) => {
//             $progressBar.css('width', percent + '%').text(percent + '%');
//         })
//             .then(result => {
//                 console.log("PDF文件上传成功", result);
//                 swal({
//                     title: '上传成功！',
//                     text: '文件大小: ' + formatFileSize(file.size) +
//                         '\n处理时间: ' + (result.data?.costTime || result.totalCostTime),
//                     icon: 'success'
//                 });
//
//                 // 上传成功后刷新数据
//                 getList(currentPage, pageSize, getSearchParams());
//             })
//             .catch(error => {
//                 console.error("PDF文件上传失败:", error);
//                 swal("上传失败", error.message, "error");
//             })
//             .finally(() => {
//                 // 清理状态
//                 $btn.prop('disabled', false).html('<i class="bi bi-cloud-upload"></i> 上传PDF');
//                 $progressBar.parent().remove();
//                 $(this).val('');
//             });
//     });
// }

// 新增大文件上传函数
function uploadLargePdfFile(ddh, file, onProgress) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('ddh', ddh);
        formData.append('pdfFile', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/ddmx/uploadLargePdf'); // 使用大文件上传接口

        // 进度监听
        if (onProgress) {
            xhr.upload.addEventListener('progress', function(e) {
                if (e.lengthComputable) {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    onProgress(percent);
                }
            });
        }

        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.code === 200) {
                        resolve(response);
                    } else {
                        reject(new Error(response.message || '上传失败'));
                    }
                } catch (e) {
                    reject(new Error('响应解析失败'));
                }
            } else {
                reject(new Error('上传失败，状态码: ' + xhr.status));
            }
        };

        xhr.onerror = function() {
            reject(new Error('网络错误'));
        };

        xhr.onabort = function() {
            reject(new Error('上传被取消'));
        };

        // 设置超时时间（300秒）
        xhr.timeout = 300000;
        xhr.ontimeout = function() {
            reject(new Error('上传超时'));
        };

        xhr.send(formData);
    });
}

function optimizedDownloadPdf(ddh, fileName) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/ddmx/downloadPdf', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'blob';

        xhr.onload = function() {
            if (this.status === 200 || this.status === 206) { // 支持206部分内容
                const blob = new Blob([this.response], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = fileName || 'document.pdf';
                document.body.appendChild(a);
                a.click();

                // 清理
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    resolve();
                }, 100);
            } else {
                reject(new Error('下载失败，状态码: ' + this.status));
            }
        };

        xhr.onerror = reject;
        xhr.send(JSON.stringify({ ddh: ddh }));
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
        } else if(res.code === 403){
            swal("权限不足！ ");
        }
        else {
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

// 绑定撤回按钮事件
function bindWithdrawButtonEvents() {
    $('.withdraw-btn').off('click').on('click', function(e) {
        e.stopPropagation();

        var $btn = $(this);
        var ddh = $btn.data('ddh');

        if (!ddh) {
            swal('订单号不能为空');
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
            swal('订单撤回成功！');

            // 刷新数据
            getList(currentPage, pageSize, getSearchParams());
        }else if(res.code === 403){
            swal("权限不足！ ");
        } else {
            console.error("订单撤回失败:", res.message);
            swal("订单撤回失败: " + (res.message || '未知错误'));

            // 恢复按钮状态
            $btn.prop('disabled', false).html('<i class="bi bi-arrow-counterclockwise"></i> 撤回');
        }
    }).fail(function(xhr, status, error) {
        hideLoading();
        console.error("撤回请求失败:", error);
        swal("撤回请求失败，请检查网络连接");

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
            swal('请选择PDF文件进行上传');
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
        }
    });
}

// 绑定可编辑字段事件
function bindEditableEvents() {
    // 通用的输入框创建函数
    function createEditableInput($cell, originalValue, type) {
        // 获取单元格的实际宽度
        var cellWidth = $cell.width();

        var input = $('<input>')
            .addClass('form-control input-sm editable-input')
            .val(originalValue)
            .css({
                'width': '100%',
                'height': '100%',
                'min-width': '100%',
                'max-width': '100%',
                'border': '2px solid #409EFF',
                'padding': '4px 6px',
                'box-sizing': 'border-box',
                'position': 'absolute',
                'top': '0',
                'left': '0',
                'z-index': '1000',
                'font-size': 'inherit',
                'line-height': 'normal'
            });

        if (type === 'number') {
            input.attr('type', 'number').attr('step', '0.01');
        }

        // 设置单元格为相对定位，以便输入框绝对定位
        $cell.css('position', 'relative').html(input);

        return input;
    }

    // 提成点编辑
    $('.editable-tcd').off('dblclick').on('dblclick', function() {
        var $cell = $(this);
        var originalValue = $cell.text().trim();
        var ddh = $cell.data('ddh');

        var input = createEditableInput($cell, originalValue, 'text');
        input.focus().select();

        setupInputEvents(input, $cell, originalValue, ddh, 'tcd');
    });

    // 物流单号编辑
    $('.editable-wldh').off('dblclick').on('dblclick', function() {
        var $cell = $(this);
        var originalValue = $cell.text().trim();
        var ddh = $cell.data('ddh');

        var input = createEditableInput($cell, originalValue, 'text');
        input.focus().select();

        setupInputEvents(input, $cell, originalValue, ddh, 'wldh');
    });

    // 折扣编辑
    $('.editable-zk').off('dblclick').on('dblclick', function() {
        var $cell = $(this);
        var originalValue = $cell.text().trim();
        var ddh = $cell.data('ddh');

        var input = createEditableInput($cell, originalValue, 'number');
        input.focus().select();

        setupInputEvents(input, $cell, originalValue, ddh, 'zk');
    });

    // 已付金额编辑（累加模式）
    $('.editable-yifu').off('dblclick').on('dblclick', function() {
        var $cell = $(this);
        var originalValue = parseFloat($cell.data('original')) || 0;
        var currentDisplay = $cell.text().trim();
        var ddh = $cell.data('ddh');

        var input = createEditableInput($cell, '', 'number');
        input.attr('placeholder', '输入累加金额');
        input.css('border-color', '#28a745');
        input.focus();

        input.blur(function() {
            var addValue = parseFloat(input.val()) || 0;
            if (addValue > 0) {
                var newValue = (originalValue + addValue).toFixed(2);
                $cell.text(newValue);
                $cell.data('original', newValue);

                updateField(ddh, 'yifu', newValue, function() {
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

    // 开票状态下拉选择（保持不变）
    $('.sfkp-select').off('change').on('change', function() {
        // 保持你原来的代码不变
        var $select = $(this);
        var newValue = $select.val();
        var ddh = $select.closest('td').data('ddh');
        var $kpsjCell = $select.closest('tr').find('.kpsj-cell');
        var $row = $select.closest('tr');

        $select.data('original-value', $select.val());

        if (newValue === '已开票') {
            var currentTime = formatDateTime(new Date());
            $kpsjCell.text(currentTime);

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
                    updateYingfuWeifuDisplay($row);
                } else if(res.code === 403){
                    swal("权限不足！ ");
                }else {
                    console.error("开票状态更新失败:", res.message);
                    swal("开票状态更新失败: " + (res.message || '未知错误'));
                    $select.val('未开票');
                    $kpsjCell.text('');
                }
            });
        } else {
            $kpsjCell.text('');
            updateField(ddh, 'sfkp', newValue, function() {
                updateYingfuWeifuDisplay($row);
            });
        }
    });

    // 通用的输入框事件设置函数
    function setupInputEvents(input, $cell, originalValue, ddh, field) {
        input.blur(function() {
            var newValue = input.val().trim();
            $cell.text(newValue);

            if (newValue !== originalValue) {
                updateField(ddh, field, newValue, function() {
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

        // ESC键取消编辑
        input.keydown(function(e) {
            if (e.keyCode === 27) {
                $cell.text(originalValue);
            }
        });
    }
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

    // 重新计算统计（如果需要实时更新统计）
    recalculateStatistics();
}

// 重新计算统计
function recalculateStatistics() {
    totalYingfuAmount = 0;
    totalYifuAmount = 0;
    totalWeifuAmount = 0;
    totalOrderCount = 0;

    $('#ddmxTable tbody tr').each(function() {
        var yingfu = parseFloat($(this).find('td:eq(11)').text().trim()) || 0;
        var yifu = parseFloat($(this).find('td:eq(12)').text().trim()) || 0;
        var weifu = parseFloat($(this).find('td:eq(13)').text().trim()) || 0;

        totalYingfuAmount += yingfu;
        totalYifuAmount += yifu;
        totalWeifuAmount += weifu;
        totalOrderCount++;
    });

    updateStatistics();
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
        }else if(res.code === 403){
            swal("权限不足！ ");
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
        bz: selectedRow.find('td:eq(17)').text().trim(),
        pdf_file_name: selectedRow.find('.view-file-btn').data('filepath') || ''
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
                font-weight: bold;
            }
            .table-div {
                max-height: 600px;
                overflow-y: auto;
                overflow-x: auto;
                border: 1px solid #ddd;
            }
            select:disabled {
                opacity: 1;
                cursor: not-allowed;
            }
            .disabled-info {
                font-size: 12px;
                margin-top: 5px;
            }
            .pending-shipment {
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
                cursor: pointer !important;
                height: 28px !important;
                box-sizing: border-box !important;
            }
            
            .sfkp-select:focus {
                outline: none !important;
                box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2) !important;
            }
            
            .sfkp-select option {
                padding: 6px 8px !important;
                font-size: 12px !important;
            }
            
            /* 表格整体布局 - 固定布局 */
            #ddmxTable {
                table-layout: fixed;
                width: 100%;
                min-width: 1800px;
            }
            
            /* PDF列 - 增加宽度确保两个按钮能完整显示 */
            #ddmxTable th:nth-child(19),
            #ddmxTable td:nth-child(19) {
                width: auto !important;  /* 改为auto */
                min-width: 120px !important;  /* 设置最小宽度 */
                max-width: 250px !important;  /* 保留最大宽度 */
                padding: 4px !important;
                text-align: center !important;
                overflow: visible !important;
                white-space: nowrap !important;  /* 防止换行 */
            }

            
            /* 操作列 */
            #ddmxTable th:nth-child(18),
            #ddmxTable td:nth-child(18) {
                width: 160px !important;
                min-width: 160px !important;
                max-width: 160px !important;
                padding: 4px !important;
                text-align: center !important;
            }
            
            /* 开票状态列 */
            #ddmxTable th:nth-child(15),
            #ddmxTable td:nth-child(15) {
                width: 120px !important;
                min-width: 120px !important;
                max-width: 120px !important;
            }
            
            /* 单元格通用样式 */
            #ddmxTable td {
                padding: 6px 4px !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                vertical-align: middle !important;
            }
            
            /* PDF单元格特殊处理 */
            .pdf-upload-cell {
                white-space: normal !important;
                overflow: visible !important;
                line-height: 1.4 !important;
                width: auto !important;  /* 添加这行 */
            }
            
            /* PDF按钮容器 - 优化垂直布局 */
            .pdf-btn-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                min-height: 70px;
                justify-content: center;
                width: fit-content !important;  /* 添加这行 */
                margin: 0 auto !important;  /* 居中 */
            }
            
            /* PDF按钮样式 - 垂直排列 */
            .view-pdf-btn, .upload-pdf-btn, .delete-pdf-btn {
                width: 100px !important;
                min-width: 100px !important;
                max-width: 100px !important;
                margin: 2px !important;
                padding: 6px 8px !important;
                font-size: 12px !important;
                line-height: 1.2 !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                display: block !important;
            }
            
            /* 操作按钮样式 */
            .detail-btn, .withdraw-btn {
                width: 70px !important;
                min-width: 70px !important;
                max-width: 70px !important;
                margin: 2px !important;
                padding: 4px 6px !important;
                font-size: 12px !important;
                line-height: 1.2 !important;
                display: inline-block !important;
            }
            
            /* PDF按钮颜色 */
            .view-pdf-btn {
                background-color: #28a745 !important;
                border-color: #28a745 !important;
                color: white !important;
            }
            .upload-pdf-btn {
                background-color: #ffc107 !important;
                border-color: #ffc107 !important;
                color: #212529 !important;
            }
            .delete-pdf-btn {
                background-color: #dc3545 !important;
                border-color: #dc3545 !important;
                color: white !important;
            }
            
            /* 可编辑字段样式 */
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
            
            /* 按钮悬停效果 */
            .view-pdf-btn:hover {
                background-color: #218838 !important;
                border-color: #1e7e34 !important;
            }
            .upload-pdf-btn:hover {
                background-color: #e0a800 !important;
                border-color: #d39e00 !important;
            }
            .delete-pdf-btn:hover {
                background-color: #c82333 !important;
                border-color: #bd2130 !important;
            }
            
            /* 新增：统计区域样式 */
            .statistics-container {
                border-radius: 8px;
                padding: 10px 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                height: 80px;
                margin-bottom: 15px;
            }
            .statistics-container .card {
                height: 100%;
                border: none;
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
            
            /* 表格标题行样式 */
            #ddmxTable th {
                font-weight: bold;
                text-align: center;
                padding: 10px 4px !important;
                position: sticky;
                top: 0;
                z-index: 10;
            }
            
            /* 表格容器滚动条样式 */
            .table-div::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            
            .table-div::-webkit-scrollbar-track {
                background: #f1f1f1;
            }
            
            .table-div::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 4px;
            }
            
            .table-div::-webkit-scrollbar-thumb:hover {
                background: #555;
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

// 上传PDF文件
// 原有小文件上传函数（保持兼容）
function uploadPdfFile(ddh, file, onProgress) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('ddh', ddh);
        formData.append('pdfFile', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/ddmx/uploadPdf'); // 使用原上传接口

        // 进度监听
        if (onProgress) {
            xhr.upload.addEventListener('progress', function(e) {
                if (e.lengthComputable) {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    onProgress(percent);
                }
            });
        }

        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.code === 200) {
                        resolve(response);
                    } else {
                        reject(new Error(response.message || '上传失败'));
                    }
                } catch (e) {
                    reject(new Error('响应解析失败'));
                }
            } else {
                reject(new Error('上传失败，状态码: ' + xhr.status));
            }
        };

        xhr.onerror = function() {
            reject(new Error('网络错误'));
        };

        xhr.send(formData);
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
        swal('订单号不能为空');
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
                    swal('PDF下载失败');
                }
            }
        } else if(res.code === 403){
            swal("权限不足！ ");
        }else {
            console.error("PDF文件下载失败:", res.message);
            swal("PDF文件下载失败: " + (res.message || '未知错误'));
        }
    });
}

// 调整表格列宽辅助函数
function adjustTableColumns() {
    const table = $('#ddmxTable');
    if (!table.length) return;

    // 确保PDF列有足够的宽度
    const pdfCells = table.find('td.pdf-upload-cell');
    pdfCells.css({
        'width': '250px',
        'min-width': '250px',
        'max-width': '250px',
        'overflow': 'visible'
    });

    // 确保表格容器有水平滚动条
    const tableContainer = $('.table-div');
    if (tableContainer.length) {
        tableContainer.css('overflow-x', 'auto');
    }

    console.log('PDF列宽度已调整');
}

// 在 bindUploadPdfEvents 函数中优化
function optimizedUploadPdf(ddh, file, onProgress) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('ddh', ddh);
        formData.append('pdfFile', file);

        // 添加禁用压缩的参数
        formData.append('compress', 'false');

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/ddmx/uploadPdf');

        // 进度监听
        if (onProgress) {
            xhr.upload.addEventListener('progress', function(e) {
                if (e.lengthComputable) {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    onProgress(percent);
                }
            });
        }

        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.code === 200) {
                    resolve(response);
                } else {
                    reject(new Error(response.message || '上传失败'));
                }
            } else {
                reject(new Error('上传失败，状态码: ' + xhr.status));
            }
        };

        xhr.onerror = function() {
            reject(new Error('网络错误'));
        };

        xhr.send(formData);
    });
}

// 添加上传前的文件检查
function checkFileBeforeUpload(file) {
    // 检查文件类型
    if (file.type !== 'application/pdf') {
        throw new Error('请选择PDF文件');
    }

    // 检查文件名
    if (file.name.length > 200) {
        throw new Error('文件名过长，请缩短文件名');
    }

    return true;
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



    // 提交上传
    $("#add-submit-btn").click(function () {
        // 获取表单数据
        var formData = new FormData();
        var fileInput = document.getElementById('fileInput1');

        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];
            var originalName = file.name; // 正确定义 originalName 变量
            var orderNumber = $('#add-orderNumber').val();
            var fileExtension = originalName.split('.').pop().toLowerCase();
            var originalName = orderNumber+"-10."+fileExtension;
            // 根据截图中的参数格式设置FormData
            formData.append('file', file);  // 文件字段

            // 添加其他必要的参数（根据截图）
            formData.append('initialPreview', '[]');
            formData.append('initialPreviewConfig', '[]');
            formData.append('initialPreviewThumbTags', '[]');
            formData.append('file', originalName);  // 文件名参数（与截图一致）
            formData.append('name', originalName);  // 名称参数
            formData.append('path', '/t763812834_java_sharepic/');  // 路径参数
            formData.append('kongjian', '3');  // 空间参数
            formData.append('fileType', fileExtension);  // 文件类型参数
            formData.append('orderNumber', orderNumber);  // 订单号参数

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
                        clearForm();

                        // 上传成功后更新订单明细表的pdf_file_name字段
                        updatePdfFileName(orderNumber, fileExtension);

                    } else {
                        alert("上传失败：" + res.msg);
                    }
                },
                error: function () {
                    alert("上传失败！");
                }
            });
        } else {
            alert("请选择要上传的文件！");
        }
    });

    function updatePdfFileName(ddh, pdfFileName) {
        showLoading();

        pdfFileName="http://yhocn.cn:9088/t763812834_java_sharepic/"+ddh+"-10."+pdfFileName

        $ajax({
            type: 'post',
            url: '/ddmx/updatePdfFileName',
            contentType: 'application/json',
            data: JSON.stringify({
                ddh: ddh,
                pdfFileName: pdfFileName
            }),
            dataType: 'json'
        }, false, '', function (res) {
            hideLoading();
            if (res.code === 200) {
                console.log("PDF文件名更新成功");
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
        $('#fileInput1').fileinput('clear');
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


// 删除
function extractAndDeleteFromUrl(filePath, ddh) {
    const ddname = removeBaseUrl(filePath);
    imageUrl = "http://yhocn.cn:9088/t763812834_java_sharepic/" + ddname;

    console.log('开始处理URL:', imageUrl);

    // 解析URL
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

    // 支持 jpg, png, pdf 等多种格式
    // 匹配格式: 文件名-数字.扩展名
    const match = fileName.match(/^(.*)-(\d+)\.(jpg|jpeg|png|pdf|gif|bmp|webp|tiff)$/i);

    if (!match) {
        console.error('文件名格式不正确');
        alert('错误: 文件名格式不正确\n格式应为: 文件名-数字.扩展名\n例如: PS20251204001-1.jpg');
        return;
    }

    const orderNumber = match[1]; // 获取文件名部分
    const fileNumber = match[2];  // 获取数字部分
    const fileExt = match[3];     // 获取扩展名部分

    console.log('提取的orderNumber:', orderNumber);
    console.log('文件编号:', fileNumber);
    console.log('文件格式:', fileExt);

    // 调用删除接口
    deleteFiles(orderNumber, path);
}

// 删除函数 - 修复版本
async function deleteFiles(orderNumber, path) {
    try {
        const params = new URLSearchParams({
            order_number: orderNumber,
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

// 删除后更新字段
function clearFileRecord(ddh) {

    $ajax({
        type: 'post',
        url: '/ddmx/updatePdfFileName',
        contentType: 'application/json',
        data: JSON.stringify({
            ddh: ddh,
            pdfFileName: "",
        }),
        dataType: 'json'
    }, false, '', function (res) {
        hideLoading();
        if (res.code === 200) {
            console.log("PDF文件名更新成功");
            // 刷新数据
            getList(currentPage, pageSize, getSearchParams());
        } else {
            console.error("PDF文件名更新失败:", res.message);
            swal("PDF文件名更新失败: " + (res.message || '未知错误'));
        }
    });
}









