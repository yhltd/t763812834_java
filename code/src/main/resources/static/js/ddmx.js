var idd;
var currentPage = 1;
var pageSize = 20;
var totalCount = 0;
var totalPages = 0;
var currentId = '';

var sortField = 'ddrq';      // 当前排序字段，默认按订单日期
var sortOrder = 'desc';      // 当前排序方向：asc-升序 desc-降序

// 在文件顶部添加变量
var exportColumnsConfig = {
    mainColumns: [],      // 用户选择的主表列
    detailColumns: ['品名', '规格型号', '单位', '数量', '单价', '发货时间', '生产工单', '备注', '总价'], // 详情表固定列
    allMainColumns: [
        { key: 'ddrq', name: '订单日期' },
        { key: 'ddh', name: '订单号' },
        { key: 'khjc', name: '客户简称' },
        { key: 'fzr', name: '负责人' },
        { key: 'bm', name: '部门' },
        { key: 'lxr', name: '联系人' },
        { key: 'lxdh', name: '联系电话' },
        { key: 'khmc', name: '客户名称' },
        { key: 'kpsj', name: '开票时间' },
        { key: 'yingfu', name: '付款时间' },
        { key: 'yfsj', name: '应付金额' },
        { key: 'yifu', name: '已付金额' },
        { key: 'weifu', name: '未付金额' },
        { key: 'sfkp', name: '开票状态' },
        { key: 'wldh', name: '物流单号' },
        { key: 'zk', name: '注释' },
        { key: 'fhsj', name: '发货时间' },
    ]
};



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

    // 检查日期选择器支持
    initDatePickerFallback();

    // 添加导出按钮
    $('#export-btn').off('click').on('click', function() {
        showExportModal();
    });

    // 初始化导出配置
    initExportConfig();

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

    // 绑定排序事件（在表格渲染后）
    $(document).on('click', '.sortable', function() {
        var field = $(this).data('field');
        handleSortClick(field);
    });

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

// function resetSearchAndRefresh() {
//     // 重置搜索条件
//     $('#khmc').val('');
//     $('#fzr').val('');
//     $('#lxr').val('');
//     $('#sfkp').val('');
//     setDefaultDateRange();
//
//     // 刷新数据
//     currentPage = 1;
//     getList(currentPage, pageSize, {});
// }
function resetSearchAndRefresh() {
    // 重置搜索条件
    $('#khmc').val('');
    $('#fzr').val('');
    $('#lxr').val('');
    $('#sfkp').val('');
    $('#startDate').val('');
    $('#endDate').val('');
    $('#yingfuStartDate').val('');  // 新增
    $('#yingfuEndDate').val('');    // 新增
    $('#weifuZero').prop('checked', false);  // 新增

    // 刷新数据
    currentPage = 1;
    getList(currentPage, pageSize, {});
}

// 初始化详情模态框事件
function initDetailModalEvents() {
    // 可以根据需要添加详情模态框的事件
}

// 重置搜索条件
// function resetSearch() {
//     $('#ddh').val('');    // 订单号
//     $('#khmc').val('');   // 客户名称
//     $('#fzr').val('');    // 负责人
//     $('#bm').val('');     // 部门
//     setDefaultDateRange();
//
//     // 重新查询
//     currentPage = 1;
//     getList(currentPage, pageSize, {});
// }
// 重置搜索条件
function resetSearch() {
    $('#ddh').val('');    // 订单号
    $('#khmc').val('');   // 客户名称
    $('#fzr').val('');    // 负责人
    $('#bm').val('');     // 部门
    $('#startDate').val('');  // 订单开始日期
    $('#endDate').val('');    // 订单结束日期
    $('#yingfuStartDate').val('');  // 新增：付款开始日期
    $('#yingfuEndDate').val('');    // 新增：付款结束日期
    $('#weifuZero').prop('checked', false);  // 新增：未付金额筛选

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
        endDate: $('#endDate').val() || '',
        yingfuStartDate: $('#yingfuStartDate').val() || '',  // 新增：yingfu开始日期
        yingfuEndDate: $('#yingfuEndDate').val() || '',      // 新增：yingfu结束日期
        weifuZero: $('#weifuZero').is(':checked') || false   // 新增：未付金额为0的筛选
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
            endDate: searchParams.endDate || '',
            yingfuStartDate: searchParams.yingfuStartDate || '',  // 新增
            yingfuEndDate: searchParams.yingfuEndDate || '',      // 新增
            weifuZero: searchParams.weifuZero || false,         // 新增
            sortField: sortField,           // 添加排序字段
            sortOrder: sortOrder            // 添加排序方向
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

    // // 如果zk为空或null，直接返回yfsj
    // if (!zk || zk === '' || zk === 'null') {
        return parseFloat(yfsj) || 0;
    // }

    // // 计算应付金额 = yfsj * zk
    // var yfsjValue = parseFloat(yfsj) || 0;
    // var zkValue = parseFloat(zk) || 0;
    // return (yfsjValue * zkValue).toFixed(2);
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
            </tr>
            <tr>
                <th class="sortable" data-field="ddrq">订单日期 ${getSortIcon('ddrq')}</th>
            <th class="sortable" data-field="ddh">订单号 ${getSortIcon('ddh')}</th>
            <th class="sortable" data-field="fzr">负责人 ${getSortIcon('fzr')}</th>
            <th class="sortable" data-field="bm">部门 ${getSortIcon('bm')}</th>
            <th class="sortable" data-field="lxr">联系人 ${getSortIcon('lxr')}</th>
            <th class="sortable" data-field="lxdh">联系电话 ${getSortIcon('lxdh')}</th>
            <th class="sortable" data-field="khmc">客户名称 ${getSortIcon('khmc')}</th>
            <th class="sortable" data-field="kpsj">开票时间 ${getSortIcon('kpsj')}</th>
            <th class="sortable" data-field="yingfu">付款时间 ${getSortIcon('yingfu')}</th>
            <th class="sortable" data-field="yfsj">应付金额 ${getSortIcon('yfsj')}</th>
            <th class="sortable" data-field="yifu">已付 ${getSortIcon('yifu')}</th>
            <th class="sortable" data-field="weifu">未付 ${getSortIcon('weifu')}</th>
            <th class="sortable" data-field="sfkp">开票状态 ${getSortIcon('sfkp')}</th>
            <th class="sortable" data-field="fahuozhuangtai">发货状态 ${getSortIcon('fahuozhuangtai')}</th>
            <th class="sortable" data-field="wldh">物流单号 ${getSortIcon('wldh')}</th>
            <th class="sortable" data-field="zk">注释 ${getSortIcon('zk')}</th>
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

            // 检查三个条件
            var isWeifuZero = parseFloat(weifu) === 0 || weifu === '0.00' || weifu === '0';
            var isSfkpInvoiced = item.sfkp === '已开票' || item.sfkp === '不开票';
            var isFahuozhuangtaiAllShipped = item.fahuozhuangtai === '全部已发货' || item.fahuozhuangtai === '全部发货';

            // 判断是否满足所有条件
            var isSpecialRow = isWeifuZero && isSfkpInvoiced && isFahuozhuangtaiAllShipped;

            // 为符合条件的行添加特殊类名
            var specialClass = isSpecialRow ? 'special-completed-row' : '';

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
    <tr data-id="${item.id || index}" data-ddh="${item.ddh || ''}" class="${specialClass}">
        <td>${item.ddrq || ''}</td>
        <td>${item.ddh || ''}</td>
        <td>${item.fzr || ''}</td>
        <td>${item.bm || ''}</td>
        <td>${item.lxr || ''}</td>
        <td>${item.lxdh || ''}</td>
        <td>${item.khmc || ''}</td>
        <td class="kpsj-cell">${item.kpsj || ''}</td>
        <td class="yfsj-cell">${item.yingfu || ''}</td>
        <td>${yingfu}</td>
        <td class="editable-yifu" data-field="yifu" data-ddh="${item.ddh || ''}">${item.yifu || ''}</td>
        <td>${weifu}</td>
        <td>${item.sfkp || ''}</td>
        <td>${item.fahuozhuangtai || ''}</td>
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
    bindSortEvents();

    // 确保每次渲染后都调整列宽
    setTimeout(function() {
        autoAdjustColumnWidths();
        adjustTableColumns();
    }, 100);
    console.log('表格渲染完成，数据条数:', data ? data.length : 0);
}

// 绑定查看文件事件 - 修改为显示弹窗
function bindViewFileEvents() {
    console.log('绑定查看文件事件...');

    $('.view-file-btn').off('click.view').on('click.view', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $btn = $(this);
        var filePath = $btn.data('filepath');
        var fileName = $btn.data('filename') || 'file';
        var ddh = $btn.closest('tr').find('td:eq(1)').text().trim(); // 获取订单号

        console.log('查看文件按钮点击，文件路径:', filePath);
        console.log('文件名:', fileName);
        console.log('订单号:', ddh);

        if (!filePath) {
            swal('错误', '文件路径为空，无法查看文件', 'error');
            return;
        }

        // 显示文件查看弹窗
        showFileViewModal(ddh, filePath);
    });
}

// 显示文件查看弹窗
function showFileViewModal(ddh, filePath) {
    // 解析文件路径（可能是逗号分隔的多个文件）
    var fileUrls = filePath.split(',');
    var cleanFileUrls = [];

    // 清理URL，去除空格
    fileUrls.forEach(function(url) {
        if (url && url.trim() !== '') {
            cleanFileUrls.push(url.trim());
        }
    });

    console.log('解析后的文件URL:', cleanFileUrls);

    // 生成弹窗内容
    var modalHtml = `
        <div class="modal fade" id="fileViewModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-files"></i> 
                            文件列表 - 订单号: ${ddh}
                        </h5>
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle"></i> 
                            共找到 ${cleanFileUrls.length} 个文件，点击"查看"在新窗口打开，点击"删除"可删除单个文件
                        </div>
                        
                        <div class="file-list-container" style="max-height: 400px; overflow-y: auto;">
    `;

    // 为每个文件生成条目
    cleanFileUrls.forEach(function(url, index) {
        var fileName = url.substring(url.lastIndexOf('/') + 1);
        var fileExt = fileName.split('.').pop().toLowerCase();

        // 根据文件类型设置图标
        var fileIcon = '';
        switch(fileExt) {
            case 'pdf':
                fileIcon = 'bi-file-earmark-pdf text-danger';
                break;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                fileIcon = 'bi-file-earmark-image text-success';
                break;
            case 'doc':
            case 'docx':
                fileIcon = 'bi-file-earmark-word text-primary';
                break;
            case 'xls':
            case 'xlsx':
                fileIcon = 'bi-file-earmark-excel text-success';
                break;
            default:
                fileIcon = 'bi-file-earmark text-secondary';
        }

        modalHtml += `
            <div class="file-item card mb-2">
                <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <i class="bi ${fileIcon} mr-3" style="font-size: 24px;"></i>
                            <div>
                                <h6 class="mb-1">${fileName}</h6>
                                <small class="text-muted">${url}</small>
                            </div>
                        </div>
                        <div class="btn-group">
                            <a href="${url}" target="_blank" 
                               class="btn btn-sm btn-primary mr-1" 
                               title="在新窗口打开">
                                <i class="bi bi-eye"></i> 查看
                            </a>
                            <button class="btn btn-sm btn-danger delete-single-file" 
                                    data-url="${url}" 
                                    data-index="${index}"
                                    data-ddh="${ddh}"
                                    title="删除此文件">
                                <i class="bi bi-trash"></i> 删除
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    modalHtml += `
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="d-flex justify-content-between w-100">
                            <div>
                                <!-- 这里不再显示"删除全部"按钮 -->
                            </div>
                            <div>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                    <i class="bi bi-x-circle"></i> 关闭
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 移除可能已存在的弹窗
    $('#fileViewModal').remove();

    // 添加弹窗到页面
    $('body').append(modalHtml);

    // 显示弹窗
    $('#fileViewModal').modal('show');

    // 绑定删除单个文件事件
    bindSingleFileDeleteEvents();
}

// 绑定单个文件删除事件
function bindSingleFileDeleteEvents() {
    $('.delete-single-file').off('click').on('click', function() {
        var $btn = $(this);
        var fileUrl = $btn.data('url');
        var ddh = $btn.data('ddh');
        var index = $btn.data('index');

        console.log('删除单个文件:', fileUrl, '订单号:', ddh, '索引:', index);

        if (!confirm(`确定要删除此文件吗？\n${fileUrl}`)) {
            return;
        }

        // 显示加载中
        $btn.prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> 删除中...');

        deleteSingleFile(ddh, fileUrl, $btn);
    });
}

// 删除单个文件 - 使用原来的删除逻辑
function deleteSingleFile(ddh, fileUrl, $btn) {
    // 从URL中提取文件名
    var fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);

    console.log('开始删除单个文件:', fileName, '订单号:', ddh);
    console.log('完整文件URL:', fileUrl);

    // 显示加载中
    $btn.prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> 删除中...');

    try {
        // 调用原来的 extractAndDeleteFromUrl 函数
        extractAndDeleteFromUrl(fileUrl, ddh);

        // 同时需要从数据库中删除该文件记录
        removeFileFromDatabase(ddh, fileUrl);

        // 显示成功消息
        swal({
            title: '删除成功',
            text: `文件已成功删除`,
            icon: 'success',
            button: '确定'
        });

        // 从当前弹窗中移除该文件项
        var $fileItem = $btn.closest('.file-item');
        $fileItem.fadeOut(300, function() {
            $(this).remove();

            // 如果所有文件都删除了，关闭弹窗
            if ($('.file-item').length === 0) {
                $('#fileViewModal').modal('hide');
                // 刷新表格数据
                getList(currentPage, pageSize, getSearchParams());
            } else {
                // 如果还有文件，需要更新数据库中的文件列表
                updateRemainingFiles(ddh);
            }
        });
    } catch (error) {
        console.error('文件删除失败:', error);
        swal('删除失败', '文件删除过程中发生错误: ' + error.message, 'error');
        $btn.prop('disabled', false).html('<i class="bi bi-trash"></i> 删除');
    }
}

// 从数据库中删除单个文件记录
function removeFileFromDatabase(ddh, fileUrl) {
    console.log('从数据库中删除文件记录，订单号:', ddh, '文件URL:', fileUrl);

    // 先获取当前的文件列表
    $ajax({
        type: 'post',
        url: '/ddmx/getCurrentPdfFileName',
        contentType: 'application/json',
        data: JSON.stringify({
            ddh: ddh
        }),
        dataType: 'json'
    }, false, '', function (res) {
        if (res.code === 200) {
            var currentFiles = res.data || '';
            console.log('当前数据库中的文件列表:', currentFiles);

            // 如果当前有多个文件，需要移除被删除的那个
            if (currentFiles && currentFiles.includes(',')) {
                var fileList = currentFiles.split(',');
                var newFileList = [];

                for (var i = 0; i < fileList.length; i++) {
                    var file = fileList[i].trim();
                    // 如果这个文件不是要删除的那个，保留
                    if (file !== fileUrl.trim()) {
                        newFileList.push(file);
                    }
                }

                var newFiles = newFileList.join(',');
                console.log('删除后的新文件列表:', newFiles);

                // 更新数据库
                updatePdfFileNameInDatabase(ddh, newFiles);
            } else {
                // 如果只有一个文件，清空数据库
                console.log('只有一个文件，清空数据库记录');
                updatePdfFileNameInDatabase(ddh, '');
            }
        } else {
            console.error('获取当前文件列表失败:', res.message);
        }
    });
}

// 更新数据库中的文件列表
function updatePdfFileNameInDatabase(ddh, newFiles) {
    console.log('更新数据库中的文件列表，订单号:', ddh, '新文件列表:', newFiles);

    $ajax({
        type: 'post',
        url: '/ddmx/updatePdfFileName',
        contentType: 'application/json',
        data: JSON.stringify({
            ddh: ddh,
            pdfFileName: newFiles
        }),
        dataType: 'json'
    }, false, '', function (res) {
        if (res.code === 200) {
            console.log('数据库文件列表更新成功');
        } else {
            console.error('数据库文件列表更新失败:', res.message);
        }
    });
}

// 更新剩余的文件列表（用于在弹窗中删除文件后）
function updateRemainingFiles(ddh) {
    var remainingFiles = [];
    $('.file-item').each(function() {
        var url = $(this).find('.delete-single-file').data('url');
        if (url) {
            remainingFiles.push(url.trim());
        }
    });

    var newFileList = remainingFiles.join(',');
    console.log('更新剩余文件列表:', newFileList);

    updatePdfFileNameInDatabase(ddh, newFileList);
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
        } else if (type === 'text') {
            input.attr('type', 'text'); // 文本类型
        } else if (type === 'date') {
            // 使用原生HTML5日期选择器
            input.attr('type', 'date');
            input.attr('placeholder', '选择日期');
        }

        // 设置单元格为相对定位，以便输入框绝对定位
        $cell.css('position', 'relative').html(input);

        return input;
    }

    // 折扣格式验证函数
    function validateZkFormat(zkValue) {
        if (!zkValue || zkValue.trim() === '') {
            return true; // 空值也是允许的
        }

        // 允许的格式：数字、小数、分数
        var pattern = /^(\d+(\.\d+)?|0\.\d+)$/;

        if (pattern.test(zkValue)) {
            var num = parseFloat(zkValue);
            // 验证折扣范围（0-2表示0-200%）
            if (num >= 0 && num <= 2) {
                return true;
            }
        }

        return false;
    }

    // 日期格式验证函数
    function validateDateFormat(dateValue) {
        if (!dateValue || dateValue.trim() === '') {
            return true; // 空值也是允许的
        }

        // 验证日期格式：YYYY-MM-DD
        var pattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!pattern.test(dateValue)) {
            return false;
        }

        // 进一步验证日期是否有效
        var parts = dateValue.split('-');
        var year = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10);
        var day = parseInt(parts[2], 10);

        if (month < 1 || month > 12) return false;

        var date = new Date(year, month - 1, day);
        if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
            return false;
        }

        return true;
    }

    // 应付时间编辑 - 使用日期选择器
    $('.yfsj-cell').off('dblclick').on('dblclick', function() {
        var $cell = $(this);
        var originalValue = $cell.text().trim();
        var $row = $cell.closest('tr');
        var ddh = $row.find('td:eq(1)').text().trim(); // 从第二列获取订单号

        // 如果原始值是空字符串，使用今天的日期作为默认值
        var defaultValue = originalValue;
        if (!defaultValue) {
            defaultValue = getCurrentDate();
        }

        var input = createEditableInput($cell, defaultValue, 'date');

        // 设置最小和最大日期（可选）
        input.attr('min', '2000-01-01');
        input.attr('max', '2030-12-31');

        // 添加日期选择器图标
        $cell.append('<span class="datepicker-icon" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); pointer-events: none;">📅</span>');

        input.focus();

        // 触发日期选择器显示（对于不支持type="date"的浏览器）
        if (input[0].type === 'text') {
            input.trigger('click');
        }

        input.blur(function() {
            // 移除日期图标
            $cell.find('.datepicker-icon').remove();

            var newValue = input.val().trim();

            // 如果用户没有选择日期，恢复原值
            if (newValue === '') {
                $cell.text(originalValue);
                return;
            }

            // 验证日期格式
            if (!validateDateFormat(newValue)) {
                swal("日期格式错误", "请输入有效的日期格式（YYYY-MM-DD）", "error");
                $cell.text(originalValue);
                return;
            }

            $cell.text(newValue);

            if (newValue !== originalValue) {
                updateField(ddh, 'yingfu', newValue, function() {
                    // 更新应付金额显示
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
                $cell.find('.datepicker-icon').remove();
                $cell.text(originalValue);
            }
        });

        // 日期选择器change事件
        input.on('change', function() {
            setTimeout(function() {
                input.blur();
            }, 100);
        });
    });

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

    // 折扣编辑 - 改为文本类型
    // $('.editable-zk').off('dblclick').on('dblclick', function() {
    //     var $cell = $(this);
    //     var originalValue = $cell.text().trim();
    //     var ddh = $cell.data('ddh');
    //
    //     var input = createEditableInput($cell, originalValue, 'text');
    //     input.focus().select();
    //
    //     // 特殊处理折扣字段的验证
    //     input.blur(function() {
    //         var newValue = input.val().trim();
    //
    //         // 折扣字段验证
    //         if (!validateZkFormat(newValue) && newValue !== '') {
    //             swal("折扣格式错误", "请输入有效的折扣值（如：0.8、0.85、0.9、1等）", "error");
    //             $cell.text(originalValue);
    //             return;
    //         }
    //
    //         $cell.text(newValue);
    //
    //         if (newValue !== originalValue) {
    //             updateField(ddh, 'zk', newValue, function() {
    //                 var $row = $cell.closest('tr');
    //                 updateYingfuWeifuDisplay($row);
    //             });
    //         }
    //     });
    //
    //     input.keypress(function(e) {
    //         if (e.which === 13) {
    //             input.blur();
    //         }
    //     });
    //
    //     // ESC键取消编辑
    //     input.keydown(function(e) {
    //         if (e.keyCode === 27) {
    //             $cell.text(originalValue);
    //         }
    //     });
    // });


    $('.editable-zk').off('dblclick').on('dblclick', function() {
        var $cell = $(this);
        var originalValue = $cell.text().trim();
        var ddh = $cell.data('ddh');

        // 获取当前单元格的文本
        var cellText = $cell.text().trim();

        // 创建文本输入框
        var input = $('<input type="text" class="form-control form-control-sm cell-edit-input">')
            .val(cellText)
            .css({
                'width': '100%',
                'height': 'auto',
                'min-height': '40px',
                'max-height': '100px',
                'overflow-y': 'auto',
                'white-space': 'pre-wrap',
                'word-wrap': 'break-word',
                'position': 'absolute',
                'z-index': 1000,
                'top': 0,
                'left': 0
            });

        // 替换单元格内容
        $cell.css('position', 'relative').html(input);
        input.focus().select();

        // 保存函数
        function saveValue() {
            var newValue = input.val().trim();
            $cell.text(newValue);

            if (newValue !== originalValue) {
                // 字段名还是'zk'，但内容是备注信息
                updateField(ddh, 'zk', newValue, function() {
                    console.log('备注更新成功：', newValue);

                    // 如果需要更新其他显示字段，可以在这里处理
                    // 例如：更新行样式或其他相关字段
                    var $row = $cell.closest('tr');
                    if ($row.length) {
                        // 可以在这里添加一些视觉反馈
                        $row.addClass('row-updated');
                        setTimeout(function() {
                            $row.removeClass('row-updated');
                        }, 1000);
                    }
                });
            }
        }

        // 失去焦点保存
        input.blur(saveValue);

        // 回车键保存
        input.keypress(function(e) {
            if (e.which === 13) {
                e.preventDefault();
                input.blur();
            }
        });

        // ESC键取消编辑
        input.keydown(function(e) {
            if (e.keyCode === 27) {
                $cell.text(originalValue);
            }
        });

        // 点击其他地方也保存
        $(document).one('click', function(e) {
            if (!$(e.target).closest('.editable-bz').length) {
                if (input.is(':visible')) {
                    input.blur();
                }
            }
        });
    });

    // 已付金额编辑（改为直接输入，允许负数）
    $('.editable-yifu').off('dblclick').on('dblclick', function() {
        var $cell = $(this);
        var originalValue = parseFloat($cell.text().trim()) || 0;
        var ddh = $cell.data('ddh');

        var input = createEditableInput($cell, originalValue, 'number');
        input.attr('step', '0.01'); // 允许小数
        input.focus().select();

        input.blur(function() {
            var newValue = input.val().trim();

            // 如果输入为空，设置为0
            if (newValue === '') {
                newValue = '0';
            }

            var newNumValue = parseFloat(newValue);

            // 验证输入是否为有效数字
            if (isNaN(newNumValue)) {
                swal("输入错误", "请输入有效的数字", "error");
                $cell.text(originalValue.toFixed(2));
                return;
            }

            // 不再验证正负，允许负数
            // if (newNumValue < 0) {
            //     swal("输入错误", "已付金额不能为负数", "error");
            //     $cell.text(originalValue);
            //     return;
            // }

            $cell.text(newNumValue.toFixed(2));

            if (Math.abs(newNumValue - originalValue) > 0.01) { // 允许浮点数误差
                updateField(ddh, 'yifu', newNumValue.toFixed(2), function() {
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
                $cell.text(originalValue.toFixed(2));
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

    // 通用的输入框事件设置函数（用于其他字段）
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
    var $yingfuCell = $row.find('td:eq(11)'); // 应付金额列
    var $weifuCell = $row.find('td:eq(13)');  // 未付金额列
    var $yifuCell = $row.find('.editable-yifu'); // 已付金额列

    $yingfuCell.text(yingfu);
    $weifuCell.text(weifu);

    // 根据正负值设置样式
    var yifuNum = parseFloat(yifu) || 0;
    var weifuNum = parseFloat(weifu) || 0;

    // 已付金额负数样式
    if (yifuNum < 0) {
        $yifuCell.addClass('negative').css('color', '#dc3545');
    } else {
        $yifuCell.removeClass('negative').css('color', '');
    }

    // 未付金额负数样式
    if (weifuNum < 0) {
        $weifuCell.css('color', '#dc3545');
    } else {
        $weifuCell.css('color', '');
    }

    // 重新计算统计
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
             /* 排序表头样式 */
            .sortable {
                cursor: pointer;
                position: relative;
                user-select: none;
            }
            .sortable:hover {
                background-color: #f8f9fa;
            }
            .sortable i {
                margin-left: 4px;
                vertical-align: middle;
            }
            
            .selected-row {
                font-weight: bold;
            }
            
            /* 新增：特殊完成状态行样式 */
            .special-completed-row {
                background-color: #e0ffe0 !important; /* 浅绿色背景 */
                border-left: 4px solid #28a745 !important; /* 绿色左边框 */
            }
            .special-completed-row:hover {
                background-color: #c8ffc8 !important; /* 悬停时稍深的绿色 */
            }
            .special-completed-row.selected-row {
                background-color: #b3ffb3 !important; /* 选中时更深的绿色 */
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
            
            /* 应付时间可编辑单元格样式 */
            .yfsj-cell {
                cursor: pointer;
                background-color: #f0f9ff;
                position: relative;
            }
            .yfsj-cell:hover {
                background-color: #e6f7ff;
            }
            
            /* 日期选择器输入框样式 */
            .editable-input[type="date"] {
                font-family: inherit;
                cursor: pointer;
            }
            
            /* 日期选择器图标样式 */
            .datepicker-icon {
                color: #409EFF;
                font-size: 14px;
            }
            
            /* 已付金额单元格样式 - 负数显示红色 */
            .editable-yifu {
                cursor: pointer;
                background-color: #f0fff0;
            }
            .editable-yifu:hover {
                background-color: #e6f7ff;
            }
            .editable-yifu.negative {
                color: #dc3545;
                font-weight: bold;
            }
            
            /* 未付金额负数显示红色 */
            td:nth-child(13) {
                /* 未付金额列 */
            }
            td:nth-child(13):contains("-") {
                color: #dc3545;
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
            
            /* 应付时间可编辑单元格样式 */
            .yfsj-cell {
                cursor: pointer;
                background-color: #f0f9ff;
            }
            .yfsj-cell:hover {
                background-color: #e6f7ff;
            }
            
            /* 已付金额单元格样式 */
            .editable-yifu {
                cursor: pointer;
                background-color: #f0fff0;
            }
            .editable-yifu:hover {
                background-color: #e6f7ff;
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
    // $("#add-submit-btn").click(function () {
    //     // 获取表单数据
    //     var formData = new FormData();
    //     var fileInput = document.getElementById('fileInput1');
    //
    //     if (fileInput.files.length > 0) {
    //         var file = fileInput.files[0];
    //         var originalName = file.name;
    //         var orderNumber = $('#add-orderNumber').val();
    //         var fileExtension = originalName.split('.').pop().toLowerCase();
    //         var originalName = orderNumber+"-10."+fileExtension;
    //         // 根据截图中的参数格式设置FormData
    //         formData.append('file', file);  // 文件字段
    //
    //         // 添加其他必要的参数（根据截图）
    //         formData.append('initialPreview', '[]');
    //         formData.append('initialPreviewConfig', '[]');
    //         formData.append('initialPreviewThumbTags', '[]');
    //         formData.append('file', originalName);  // 文件名参数（与截图一致）
    //         formData.append('name', originalName);  // 名称参数
    //         formData.append('path', '/t763812834_java_sharepic/');  // 路径参数
    //         formData.append('kongjian', '3');  // 空间参数
    //         formData.append('fileType', fileExtension);  // 文件类型参数
    //         formData.append('orderNumber', orderNumber);  // 订单号参数
    //
    //         // 发送上传请求
    //         $.ajax({
    //             url: "https://yhocn.cn:9097/file/upload",
    //             type: 'POST',
    //             data: formData,
    //             processData: false,
    //             contentType: false,
    //             success: function (res) {
    //                 if (res.code === 200) {
    //                     alert("上传成功！");
    //                     $('#add-modal').modal('hide');
    //                     clearForm();
    //
    //                     updatePdfFileName(orderNumber, fileExtension);
    //
    //                 } else {
    //                     alert("上传失败：" + res.msg);
    //                 }
    //             },
    //             error: function () {
    //                 alert("上传失败！");
    //             }
    //         });
    //     } else {
    //         alert("请选择要上传的文件！");
    //     }
    // });

    $("#add-submit-btn").click(function () {
        // 获取表单数据
        var formData = new FormData();
        var fileInput = document.getElementById('fileInput1');

        // 获取手动输入的文件名称
        var manualFileName = $('#add-fileName').val().trim();
        var orderNumber = $('#add-orderNumber').val();

        if (!manualFileName) {
            alert("请输入文件名称！");
            return;
        }

        if (!orderNumber) {
            alert("订单号不能为空！");
            return;
        }

        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];
            var originalName = file.name;
            var fileExtension = originalName.split('.').pop().toLowerCase();

            // 重要修改：使用手动输入的文件名来构建存储文件名
            // 格式：手动文件名.扩展名（而不是原来的 订单号-10.扩展名）
            var storedFileName = manualFileName;

            // 如果用户输入的文件名没有扩展名，则添加上传文件的扩展名
            if (storedFileName.lastIndexOf('.') === -1) {
                storedFileName = storedFileName + '.' + fileExtension;
            }

            // 清理文件名中的非法字符（可选）
            storedFileName = storedFileName.replace(/[\\/:*?"<>|]/g, '_');

            console.log('原始文件名:', originalName);
            console.log('手动输入的文件名:', manualFileName);
            console.log('最终存储文件名:', storedFileName);

            formData.append('file', file);
            formData.append('initialPreview', '[]');
            formData.append('initialPreviewConfig', '[]');
            formData.append('initialPreviewThumbTags', '[]');
            formData.append('file', storedFileName);  // 修改：使用手动文件名
            formData.append('name', storedFileName);   // 修改：使用手动文件名
            formData.append('path', '/t763812834_java_sharepic/');
            formData.append('kongjian', '3');
            formData.append('fileType', fileExtension);
            formData.append('orderNumber', orderNumber);

            // 添加原始文件名信息（可选，用于调试）
            formData.append('originalFileName', originalName);
            formData.append('customFileName', manualFileName);

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

                        // 重要修改：使用手动文件名构建的完整URL
                        var fullUrl = "http://yhocn.cn:9088/t763812834_java_sharepic/" + storedFileName;

                        updatePdfFileName(orderNumber, fullUrl);

                        clearForm();

                    } else {
                        alert("上传失败：" + res.msg);
                    }
                },
                error: function (xhr, status, error) {
                    console.error('上传请求失败:', error);
                    alert("上传失败！请检查网络连接。");
                }
            });
        } else {
            alert("请选择要上传的文件！");
        }
    });

    // function updatePdfFileName(ddh, pdfFileName) {
    //     showLoading();
    //
    //     $ajax({
    //         type: 'post',
    //         url: '/ddmx/updatePdfFileName',
    //         contentType: 'application/json',
    //         data: JSON.stringify({
    //             ddh: ddh,
    //             pdfFileName: pdfFileName
    //         }),
    //         dataType: 'json'
    //     }, false, '', function (res) {
    //         hideLoading();
    //         if (res.code === 200) {
    //             console.log("PDF文件名更新成功");
    //             // 刷新数据
    //             getList(currentPage, pageSize, getSearchParams());
    //         } else {
    //             console.error("PDF文件名更新失败:", res.message);
    //             swal("PDF文件名更新失败: " + (res.message || '未知错误'));
    //         }
    //     });
    // }

    function updatePdfFileName(ddh, pdfFileName) {
        showLoading();

        console.log('开始更新PDF文件名，订单号:', ddh, '新文件名:', pdfFileName);

        // 先查询当前已有的文件名
        $ajax({
            type: 'post',
            url: '/ddmx/getCurrentPdfFileName',
            contentType: 'application/json',
            data: JSON.stringify({
                ddh: ddh
            }),
            dataType: 'json'
        }, false, '', function (res) {
            if (res.code === 200) {
                var currentFileName = res.data || '';
                console.log('当前已有的文件名:', currentFileName);

                // 构建最终的文件名
                var finalFileName = '';

                if (currentFileName && currentFileName.trim() !== '') {
                    // 检查是否已包含相同的文件名（避免重复）
                    var fileList = currentFileName.split(',');
                    var alreadyExists = false;

                    for (var i = 0; i < fileList.length; i++) {
                        if (fileList[i].trim() === pdfFileName.trim()) {
                            alreadyExists = true;
                            break;
                        }
                    }

                    if (alreadyExists) {
                        // 如果已存在，使用原值
                        finalFileName = currentFileName;
                        console.log('文件名已存在，不重复添加');
                    } else {
                        // 如果不存在，用逗号分隔追加
                        finalFileName = currentFileName + ',' + pdfFileName;
                        console.log('追加新文件名，最终值:', finalFileName);
                    }
                } else {
                    // 如果没有现有值，直接使用新值
                    finalFileName = pdfFileName;
                    console.log('无现有文件名，直接设置');
                }

                // 执行更新
                performUpdatePdfFileName(ddh, finalFileName);

            } else {
                hideLoading();
                console.error("查询当前文件名失败:", res.message);
                swal("查询当前文件名失败: " + (res.message || '未知错误'));
            }
        });
    }

    // 新增：执行更新操作的函数
    function performUpdatePdfFileName(ddh, finalFileName) {
        $ajax({
            type: 'post',
            url: '/ddmx/updatePdfFileName',
            contentType: 'application/json',
            data: JSON.stringify({
                ddh: ddh,
                pdfFileName: finalFileName
            }),
            dataType: 'json'
        }, false, '', function (res) {
            hideLoading();
            if (res.code === 200) {
                console.log("PDF文件名更新成功，最终值:", finalFileName);
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
// function extractAndDeleteFromUrl(filePath, ddh) {
//     const ddname = removeBaseUrl(filePath);
//     imageUrl = "http://yhocn.cn:9088/t763812834_java_sharepic/" + ddname;
//
//     console.log('开始处理URL:', imageUrl);
//
//     // 解析URL
//     const url = new URL(imageUrl);
//
//     // 获取路径部分
//     const fullPath = url.pathname;
//
//     console.log('完整路径:', fullPath);
//
//     // 分离路径和文件名
//     const lastSlashIndex = fullPath.lastIndexOf('/');
//     const path = fullPath.substring(0, lastSlashIndex + 1);
//     const fileName = fullPath.substring(lastSlashIndex + 1);
//
//     console.log('路径:', path);
//     console.log('文件名:', fileName);
//
//     // 支持 jpg, png, pdf 等多种格式
//     // 匹配格式: 文件名-数字.扩展名
//     const match = fileName.match(/^(.*)-(\d+)\.(jpg|jpeg|png|pdf|gif|bmp|webp|tiff)$/i);
//
//     if (!match) {
//         console.error('文件名格式不正确');
//         alert('错误: 文件名格式不正确\n格式应为: 文件名-数字.扩展名\n例如: PS20251204001-1.jpg');
//         return;
//     }
//
//     const orderNumber = match[1]; // 获取文件名部分
//     const fileNumber = match[2];  // 获取数字部分
//     const fileExt = match[3];     // 获取扩展名部分
//
//     console.log('提取的orderNumber:', orderNumber);
//     console.log('文件编号:', fileNumber);
//     console.log('文件格式:', fileExt);
//
//     // 调用删除接口
//     deleteFiles(orderNumber, path);
// }

// 删除函数 - 适配新文件名格式
function extractAndDeleteFromUrl(filePath, ddh) {
    console.log('开始处理URL:', filePath);

    // 解析URL
    let imageUrl;
    try {
        // 如果传入的是完整URL，直接使用
        if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
            imageUrl = filePath;
        } else {
            // 否则构建完整URL
            const ddname = removeBaseUrl(filePath);
            imageUrl = "http://yhocn.cn:9088/t763812834_java_sharepic/" + ddname;
        }

        console.log('完整URL:', imageUrl);

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

        // 新的文件名格式：直接使用文件名（不包含 -数字 后缀）
        // 例如: 合同.pdf、发票.jpg 等
        const fileExt = fileName.split('.').pop().toLowerCase();

        // 验证文件扩展名
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'gif', 'bmp', 'webp', 'tiff', 'doc', 'docx', 'xls', 'xlsx'];

        if (!allowedExtensions.includes(fileExt)) {
            console.error('不支持的文件格式:', fileExt);
            alert(`错误: 不支持的文件格式 ${fileExt}\n支持的文件格式: ${allowedExtensions.join(', ')}`);
            return;
        }

        console.log('文件扩展名:', fileExt);
        console.log('使用订单号作为文件名标识:', ddh);

        // 调用删除接口
        deleteFiles(ddh, path, fileName);

    } catch (error) {
        console.error('URL处理错误:', error);
        alert('URL格式错误: ' + error.message);
    }
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

// // 删除后更新字段
// function clearFileRecord(ddh) {
//
//     $ajax({
//         type: 'post',
//         url: '/ddmx/updatePdfFileName',
//         contentType: 'application/json',
//         data: JSON.stringify({
//             ddh: ddh,
//             pdfFileName: "",
//         }),
//         dataType: 'json'
//     }, false, '', function (res) {
//         hideLoading();
//         if (res.code === 200) {
//             console.log("PDF文件名更新成功");
//             // 刷新数据
//             getList(currentPage, pageSize, getSearchParams());
//         } else {
//             console.error("PDF文件名更新失败:", res.message);
//             swal("PDF文件名更新失败: " + (res.message || '未知错误'));
//         }
//     });
// }

// 删除后更新字段 - 支持删除单个文件
function clearFileRecord(ddh, fileUrlToRemove) {
    // 如果传入了要删除的文件URL，则只删除该文件
    if (fileUrlToRemove) {
        console.log('删除单个文件记录:', fileUrlToRemove, '订单号:', ddh);

        // 先获取当前文件列表
        $ajax({
            type: 'post',
            url: '/ddmx/getCurrentPdfFileName',
            contentType: 'application/json',
            data: JSON.stringify({
                ddh: ddh
            }),
            dataType: 'json'
        }, false, '', function (res) {
            if (res.code === 200) {
                var currentFiles = res.data || '';
                console.log('当前文件列表:', currentFiles);

                if (currentFiles && currentFiles.trim() !== '') {
                    // 从文件列表中移除指定的文件
                    var fileList = currentFiles.split(',');
                    var newFileList = [];

                    for (var i = 0; i < fileList.length; i++) {
                        var file = fileList[i].trim();
                        if (file !== fileUrlToRemove.trim() && file !== '') {
                            newFileList.push(file);
                        }
                    }

                    var newFiles = newFileList.join(',');
                    console.log('删除后新的文件列表:', newFiles);

                    // 更新数据库
                    updateField(ddh, 'pdf_file_name', newFiles, function() {
                        // 刷新数据
                        getList(currentPage, pageSize, getSearchParams());
                    });
                }
            }
        });
    } else {
        // 如果没有指定文件，清空所有文件（保持向后兼容）
        updateField(ddh, 'pdf_file_name', '', function() {
            // 刷新数据
            getList(currentPage, pageSize, getSearchParams());
        });
    }
}

// 检查浏览器是否支持input[type="date"]
function checkDateInputSupport() {
    var input = document.createElement('input');
    input.setAttribute('type', 'date');
    return input.type === 'date';
}

// 如果不支持，添加fallback日期选择器
function initDatePickerFallback() {
    if (!checkDateInputSupport()) {
        console.log('浏览器不支持原生日期选择器，使用文本输入');
        // 可以在这里集成第三方日期选择器库
        // 例如：$('.yfsj-cell input').datepicker();
    }
}

// 获取当前日期（YYYY-MM-DD格式）
function getCurrentDate() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}


// 初始化导出配置（默认选择所有列）
function initExportConfig() {
    exportColumnsConfig.mainColumns = exportColumnsConfig.allMainColumns.map(col => col.key);
}

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
                                        <input type="text" class="form-control" id="exportFileName" value="订单明细_${formatDate(new Date())}">
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
            fileName = `订单明细_${formatDate(new Date())}`;
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

    // 获取字段显示名称的映射
    var selectedColumnNames = {};
    exportColumnsConfig.allMainColumns.forEach(col => {
        if (selectedColumns.includes(col.key)) {
            selectedColumnNames[col.key] = col.name;
        }
    });

    // 获取当前搜索条件
    var searchParams = getSearchParams();

    // 调用后端接口获取全部数据
    $ajax({
        type: 'post',
        url: '/ddmx/daochuexcel',
        contentType: 'application/json',
        data: JSON.stringify({
            pageNum: 1,
            pageSize: 99999999,
            // 传递搜索条件
            ddh: searchParams.ddh || '',
            khmc: searchParams.khmc || '',
            fzr: searchParams.fzr || '',
            bm: searchParams.bm || '',
            startDate: searchParams.startDate || '',
            endDate: searchParams.endDate || ''
        }),
        dataType: 'json'
    }, false, '', function (res) {
        swal.close();

        if (res.code === 200 && res.data) {
            // 根据返回的数据结构处理数据并导出
            processExportData(res.data, selectedColumns, selectedColumnNames, fileName);
        } else {
            swal('导出失败', res.message || '数据获取失败', 'error');
        }
    });
}


// 处理导出数据
function processExportData(apiData, selectedColumns, columnMapping, fileName) {
    try {
        var exportData = [];

        // 判断数据结构 - 根据实际返回的数据结构处理
        var dataList = [];

        if (Array.isArray(apiData)) {
            // 如果返回的是数组
            dataList = apiData;
        } else if (apiData.records && Array.isArray(apiData.records)) {
            // 如果返回的是分页格式
            dataList = apiData.records;
        } else if (apiData.list && Array.isArray(apiData.list)) {
            // 如果返回的是list格式
            dataList = apiData.list;
        } else {
            console.log('API返回数据:', apiData);
            throw new Error('数据格式不正确，请检查数据结构');
        }

        console.log('处理数据条数:', dataList.length);
        console.log('第一条数据样例:', dataList[0]);

        // 处理每条数据
        dataList.forEach(function(item, index) {
            var exportRow = createExportRow(item, selectedColumns, columnMapping);
            exportData.push(exportRow);
        });

        console.log('导出数据条数:', exportData.length);
        console.log('导出数据样例:', exportData[0]);

        // 导出到Excel
        if (exportData.length > 0) {
            exportDataToExcel(exportData, fileName);
        } else {
            swal('导出失败', '没有找到可导出的数据', 'warning');
        }

    } catch (error) {
        console.error('数据处理失败:', error);
        swal('导出失败', '数据处理过程中发生错误: ' + error.message, 'error');
    }
}

// 创建导出行 - 修正字段映射
function createExportRow(item, selectedColumns, columnMapping) {
    var row = {};

    console.log('处理单条数据（原始）:', item);

    // 1. 添加用户选择的主表列
    selectedColumns.forEach(function(colKey) {
        var displayName = columnMapping[colKey] || colKey;
        var value = '';

        // 根据字段名从数据中获取值
        switch(colKey) {
            case 'yingfu':
                // yingfu对应"付款时间"
                value = item.yingfu || '';
                break;
            case 'yfsj':
                // yfsj对应"应付金额"
                value = item.yfsj || '';
                break;
            case 'weifu':
                // weifu需要计算：应付金额 - 已付金额
                var yingfuValue = parseFloat(item.yfsj) || 0;
                var yifuValue = parseFloat(item.yifu) || 0;
                value = (yingfuValue - yifuValue).toFixed(2);
                break;
            default:
                // 其他字段直接获取
                value = item[colKey] || '';
        }

        console.log(`主表列 ${displayName} (${colKey}): ${value}`);
        row[displayName] = value;
    });

    // 2. 添加固定的详情列
    exportColumnsConfig.detailColumns.forEach(function(detailCol) {
        var value = '';

        // 根据中文列名获取对应的字段值
        switch(detailCol) {
            case '品名':
                value = item.pm || '';
                break;
            case '规格型号':
                value = item.ggxh || '';
                break;
            case '单位':
                value = item.dw || '';
                break;
            case '数量':
                value = item.sl || '';
                break;
            case '单价':
                value = item.dj || '';
                break;
            case '发货时间':
                value = item.fhsj || '';
                break;
            case '生产工单':
                value = item.scgd || '';
                break;
            case '备注':
                value = item.bz || '';
                break;
            case '总价':
                value = item.zj || '';
                break;
            default:
                // 尝试使用映射
                var fieldName = mapDetailColumnName(detailCol);
                value = item[fieldName] || '';
        }

        console.log(`详情列 ${detailCol}: ${value}`);
        row[detailCol] = value;
    });

    console.log('处理后的行数据:', row);
    return row;
}

// 映射详情列中文名到字段名
function mapDetailColumnName(chineseName) {
    var mapping = {
        '品名': 'pm',
        '规格型号': 'ggxh',
        '单位': 'dw',
        '数量': 'sl',
        '单价': 'dj',
        '发货时间': 'fhsj',
        '生产工单': 'scgd',
        '备注': 'bz',
        '总价': 'zj'
    };

    return mapping[chineseName] || chineseName.toLowerCase();
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

// 创建Excel文件
function createExcelFile(data, fileName) {
    // 创建工作簿
    var wb = XLSX.utils.book_new();

    // 准备工作表数据
    var wsData = [];

    // 添加表头
    if (data.length > 0) {
        var headers = Object.keys(data[0]);
        wsData.push(headers);
    }

    // 添加数据行
    data.forEach(function(row) {
        var rowData = [];
        var headers = Object.keys(data[0]);
        headers.forEach(function(header) {
            rowData.push(row[header] || '');
        });
        wsData.push(rowData);
    });

    // 创建工作表
    var ws = XLSX.utils.aoa_to_sheet(wsData);

    // 设置列宽
    var colWidths = [];
    var headers = Object.keys(data[0] || {});
    headers.forEach(function(header) {
        colWidths.push({ wch: Math.max(header.length, 10) });
    });
    ws['!cols'] = colWidths;

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '订单明细');

    // 导出Excel文件
    XLSX.writeFile(wb, fileName);

    swal('导出成功', `文件 ${fileName} 已生成并开始下载`, 'success');
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


// 获取排序图标
function getSortIcon(field) {
    if (sortField !== field) {
        return '<i class="bi bi-arrow-down-up" style="opacity: 0.3; font-size: 10px;"></i>';
    }
    if (sortOrder === 'asc') {
        return '<i class="bi bi-arrow-up" style="color: #409EFF;"></i>';
    } else {
        return '<i class="bi bi-arrow-down" style="color: #409EFF;"></i>';
    }
}

// 处理排序点击
function handleSortClick(field) {
    // 如果点击的是当前排序字段，切换排序方向
    if (sortField === field) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        // 点击新字段，默认降序
        sortField = field;
        sortOrder = 'desc';
    }

    // 重置到第一页并重新加载数据
    currentPage = 1;
    getList(currentPage, pageSize, getSearchParams());
}

// 绑定排序事件
function bindSortEvents() {
    $('.sortable').off('click.sort').on('click.sort', function() {
        var field = $(this).data('field');
        handleSortClick(field);
    });
}





