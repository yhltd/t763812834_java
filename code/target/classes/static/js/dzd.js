var idd;
var currentPage = 1;
var pageSize = 20;
var totalCount = 0;
var totalPages = 0;
var currentId = '';

// 清空选择状态
var selectedDdhs = []; // 存储选择的订单号
var selectedRows = [];

// 新增：存储客户要求数据
var customerRequirements = {}; // 以khmc为key，yq为value的对象
var customerRequirementsList = []; // 完整的客户要求数据列表


// 在文件顶部添加导出配置变量
var exportColumnsConfig = {
    mainColumns: [],      // 用户选择的主表列
    detailColumns: ['品名', '规格型号', '单位', '数量', '单价', '发货时间'], // 详情表固定列
    allMainColumns: [
        { key: 'ddrq', name: '订单日期' },
        { key: 'ddh', name: '订单号' },
        { key: 'khmc', name: '客户名称' },
        { key: 'fzr', name: '负责人' },
        { key: 'yfsj', name: '总价' },
        { key: 'yifu', name: '已付' },
        { key: 'wf', name: '未付' },
        { key: 'kpsj', name: '开票时间' },
        { key: 'sfkp', name: '开票状态' },
        { key: 'dzzt', name: '对账状态' }
    ]
};

// 页面加载完成后初始化
$(document).ready(function() {
    console.log('页面加载完成，初始化订单明细页面...');
    addTableStyles();
    initDdmxPage();
    initToolbarEvents();
    initDetailModalEvents();
    getListBH();

    // 绑定生成对账单确认按钮事件
    $(document).on('click', '#confirmGenerateDzd', function() {
        var duizhangdanhao = $('#duizhangdanhao').val().trim();

        // 验证对账单号
        if (!duizhangdanhao) {
            alert('对账单号不能为空');
            $('#duizhangdanhao').focus();
            return;
        }

        // 确认操作
        if (!confirm(`确定要生成对账单吗？\n对账单号：${duizhangdanhao}\n将更新 ${selectedDdhs.length} 个订单`)) {
            return;
        }

        // 调用后端API
        updateDzdRecords(duizhangdanhao);
    });

    // 首先获取客户要求数据
    yaoqiu();

    // 设置定时检查，确保客户要求数据加载完成
    setTimeout(function() {
        if (Object.keys(customerRequirements).length === 0 && customerRequirementsList.length === 0) {
            console.log("客户要求数据获取失败或为空，尝试重新获取...");
            yaoqiu();
        }
    }, 1000);

    // 添加导出按钮
    $('#export-btn').off('click').on('click', function() {
        showExportModal();
    });

    // 初始化导出配置
    initExportConfig();

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

    // 绑定搜索输入框回车事件
    $('#ddh, #khmc, #fzr').off('keypress').on('keypress', function(e) {
        if (e.which === 13) {
            searchDdmx();
        }
    });

    // 设置默认日期范围（最近30天）
    setDefaultDateRange();
}

// 设置默认日期范围
function setDefaultDateRange() {
    // 将日期字段设置为空
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

    // 新增：导出Excel按钮
    // $('#export-excel-btn').off('click').on('click', function() {
    //     console.log('导出Excel按钮点击');
    //     var selectedRow = getSelectedRow();
    //     if (!selectedRow) {
    //         swal('请选择要导出的订单信息');
    //         return;
    //     }
    //
    //     // 首先更新对账状态
    //     updateDzztStatus(selectedRow.ddh, getCurrentDate(), function(success) {
    //         if (success) {
    //             // 获取详细信息并导出
    //             getDetailDataForPrint(selectedRow.ddh, function(detailData) {
    //                 if (detailData && detailData.length > 0) {
    //                     // 确保有联系人信息
    //                     if (!selectedRow.lxr && detailData[0]) {
    //                         selectedRow.lxr = detailData[0].lxr || '';
    //                     }
    //                     exportPrintDataToExcel(selectedRow, detailData);
    //                 } else {
    //                     swal('无法获取订单详细信息');
    //                 }
    //             });
    //         } else {
    //             swal('更新对账状态失败，无法导出');
    //         }
    //     });
    // });
    // 生成对账单按钮
    $('#export-excel-btn').off('click').on('click', function() {
        console.log('导出Excel按钮点击');

        // 检查是否有选中的行（单个订单）
        if (selectedDdhs.length === 0) {
            swal('请选择要导出的订单');
            return;
        }

        // 如果是单个订单，使用您原本的单个导出逻辑
        if (selectedDdhs.length === 1) {
            var ddh = selectedDdhs[0];
            var selectedRow = selectedRows.find(row => row.ddh === ddh);

            if (!selectedRow) {
                swal('请选择要导出的订单信息');
                return;
            }

            // 首先更新对账状态
            updateDzztStatus(selectedRow.ddh, getCurrentDate(), function(success) {
                if (success) {
                    // 获取详细信息并导出
                    getDetailDataForPrint(selectedRow.ddh, function(detailData) {
                        if (detailData && detailData.length > 0) {
                            // 确保有联系人信息
                            if (!selectedRow.lxr && detailData[0]) {
                                selectedRow.lxr = detailData[0].lxr || '';
                            }
                            exportPrintDataToExcel(selectedRow, detailData);
                        } else {
                            swal('无法获取订单详细信息');
                        }
                    });
                } else {
                    swal('更新对账状态失败，无法导出');
                }
            });
        }
        // 如果是多个订单，使用批量导出
        else {
            // 检查选中的订单是否属于同一个客户
            if (!checkSameCustomer()) {
                alert('选中的订单必须属于同一个客户才能批量导出');
                return;
            }

            // 直接执行批量导出
            batchExportToExcel();
        }
    });

    $('#shengcheng-btn').off('click').on('click', function() {
        console.log('生成对账单按钮点击');

        // 检查是否有选中的行
        if (selectedDdhs.length === 0) {
            alert('请先选择要生成对账单的订单');
            return;
        }

        // 检查选中的订单是否属于同一个客户
        if (!checkSameCustomer()) {
            alert('选中的订单必须属于同一个客户才能批量生成对账单');
            return;
        }

        // 显示弹窗前获取最新的对账单号
        $.ajax({
            type: 'post',
            url: '/hetong/list',
            contentType: 'application/json',
            dataType: 'json',
            success: function(res) {
                if (res.success && res.data && res.data.length > 0) {
                    // 提取第一个记录的 bianhao 字段
                    var firstRecord = res.data[0];
                    var bianhaoValue = firstRecord.bianhao || '';

                    // 获取当前日期
                    var currentDate = new Date();
                    var year = currentDate.getFullYear();
                    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                    var day = String(currentDate.getDate()).padStart(2, '0');
                    var dateStr = year + month + day;

                    // 构建对账单号：DZ + bianhao + 日期
                    var duizhangdanhao = 'DZ' + bianhaoValue + dateStr;

                    console.log('实时生成的对账单号:', duizhangdanhao);

                    // 设置输入框值
                    $('#duizhangdanhao').val(duizhangdanhao);

                    // 显示弹窗
                    $('#selectedCount').text(selectedDdhs.length);
                    $('#generateDzdModal').modal('show');
                } else {
                    alert("无法获取员工编号，请检查是否有对应员工编号")
                    console.log("无法获取对账单号，请重试");
                }
            },
            error: function(xhr, status, error) {
                console.error("获取对账单号失败:", error);
            }
        });
    });

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
            swal('请选择要打印的订单信息');
            return;
        }
        // 调用打印功能
        printDzd(selectedRow);
    });

    // 开票按钮
    $('#invoice-btn').off('click').on('click', function() {
        console.log('开票按钮点击');
        batchInvoice();
    });

    // 删除上传文件按钮
    $('#delete-btn').off('click').on('click', function() {
        console.log('删除上传文件按钮点击');
        deleteUploadedFile();
    });

    // 撤回对账按钮
    $('#withdraw-btn').off('click').on('click', function() {
        console.log('撤回对账按钮点击');
        var selectedRow = getSelectedRow();
        if (!selectedRow) {
            swal('请选择要撤回对账的订单信息');
            return;
        }
        // 调用撤回对账功能
        withdrawDzd(selectedRow);
    });

    // 导出按钮已经在ready函数中绑定
}

function printDzd(rowData) {
    if (!rowData || !rowData.ddh) {
        swal('无法获取订单信息');
        return;
    }

    // 首先更新对账状态为当前时间
    updateDzztStatus(rowData.ddh, getCurrentDate(), function(success) {
        if (success) {
            // 更新成功后获取详细信息并打印
            getDetailDataForPrint(rowData.ddh, function(detailData) {
                if (detailData && detailData.length > 0) {
                    // 确保有联系人信息，如果没有则从详情数据中获取
                    if (!rowData.lxr && detailData[0]) {
                        rowData.lxr = detailData[0].lxr || '';
                    }
                    generatePrintContent(rowData, detailData);
                    // 注意：这里不需要再调用刷新，因为updateDzztStatus中已经调用了
                } else {
                    swal('无法获取订单详细信息');
                }
            });
        } else {
            swal('更新对账状态失败，无法打印');
        }
    });
}

// 简化的批量导出Excel函数（保持您原来的结构）
function batchExportToExcel() {
    if (selectedDdhs.length === 0) return;

    // 确认导出
    if (!confirm(`确定要导出 ${selectedDdhs.length} 个订单吗？`)) {
        return;
    }

    swal({
        title: '正在导出...',
        text: `正在处理 ${selectedDdhs.length} 个订单`,
        icon: 'info',
        buttons: false,
        closeOnClickOutside: false
    });

    // 获取所有订单详情
    var promises = [];
    selectedDdhs.forEach(function(ddh) {
        var promise = new Promise(function(resolve) {
            getDetailDataForPrint(ddh, function(detailData) {
                if (detailData && detailData.length > 0) {
                    var mainData = selectedRows.find(row => row.ddh === ddh);

                    // 确保 mainData 存在
                    if (!mainData) {
                        mainData = {};
                    }

                    // 从 detailData 中提取联系人信息
                    // detailData 是一个数组，通常第一个元素包含完整信息
                    if (detailData[0]) {
                        // 将联系人信息合并到 mainData 中
                        mainData.lxr = detailData[0].lxr || '';
                        mainData.khmc = detailData[0].khmc || mainData.khmc || '';
                        mainData.ddh = ddh;
                    }

                    resolve({
                        ddh: ddh,
                        mainData: mainData,
                        detailData: detailData
                    });
                } else {
                    resolve(null);
                }
            });
        });
        promises.push(promise);
    });

    Promise.all(promises).then(function(allData) {
        swal.close();

        // 过滤有效数据
        var validData = allData.filter(item => item !== null);

        if (validData.length === 0) {
            swal('导出失败', '无法获取订单数据', 'error');
            return;
        }

        // 生成Excel文件名
        var fileName = '对账单_' + validData[0].mainData.khmc +
            '_' + formatDate(new Date()) +
            '_' + validData.length + '个订单.xlsx';

        // 创建Excel（每个订单一个工作表）
        var wb = XLSX.utils.book_new();

        // 为每个订单创建单独的工作表
        validData.forEach(function(order, index) {
            var sheetData = prepareSingleOrderData(order);
            var ws = XLSX.utils.aoa_to_sheet(sheetData);

            // 设置工作表名称
            var sheetName = '订单' + (index + 1);
            if (order.ddh && order.ddh.length < 25) {
                sheetName = order.ddh;
            }

            // 设置列宽
            ws['!cols'] = [
                { wch: 10 },   // A列：序号
                { wch: 20 },  // B列：产品名称
                { wch: 25 },  // C列：规格型号
                { wch: 8 },   // D列：单位
                { wch: 10 },  // E列：单价
                { wch: 8 },   // F列：数量
                { wch: 12 },  // G列：总价
                { wch: 15 },  // H列：发货时间
                { wch: 20 }   // I列：订单号
            ];

            // 设置行高
            var rowHeights = [];
            for (var i = 0; i < sheetData.length; i++) {
                if (i === 0) {
                    rowHeights[i] = { hpx: 40 };
                } else {
                    rowHeights[i] = { hpx: 20 };
                }
            }
            ws['!rows'] = rowHeights;

            ws['!merges'] = [
                // 标题行合并（A1:I1）
                { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
                // B3:C3合并（客户名称行）
                { s: { r: 2, c: 1 }, e: { r: 2, c: 2 } },
                // B15:C15合并（本期金额行）
                { s: { r: 14, c: 1 }, e: { r: 14, c: 2 } }
            ];

            XLSX.utils.book_append_sheet(wb, ws, sheetName);
        });

        // 导出文件
        XLSX.writeFile(wb, fileName);

        swal('导出成功', `已导出 ${validData.length} 个订单`, 'success');

    }).catch(function(error) {
        swal.close();
        console.error('导出失败:', error);
        swal('导出失败', error.message, 'error');
    });
}

// 创建批量Excel文件
function createBatchExcel(data, fileName) {
    try {
        var wb = XLSX.utils.book_new();

        // 只为每个订单创建单独的工作表（去掉汇总表）
        data.forEach(function(order, index) {
            createOrderSheet(wb, order, index);
        });

        // 导出文件
        XLSX.writeFile(wb, fileName);

        swal('导出成功', `已导出 ${data.length} 个订单`, 'success');

    } catch (error) {
        console.error('创建Excel失败:', error);
        swal('导出失败', error.message, 'error');
    }
}

// 创建单个订单的工作表
function createOrderSheet(wb, order, index) {
    var sheetData = prepareSingleOrderData(order);
    var ws = XLSX.utils.aoa_to_sheet(sheetData);

    // 设置工作表名称（截断超长名称）
    var sheetName = '订单' + (index + 1);
    if (order.ddh && order.ddh.length < 25) {
        sheetName = order.ddh;
    }

    XLSX.utils.book_append_sheet(wb, ws, sheetName);
}
// 准备单个订单的数据（复用现有逻辑，稍作调整）
// 修改 prepareSingleOrderData 函数，使其也符合模板格式
function prepareSingleOrderData(order) {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
    var currentYear = currentDate.getFullYear();
    var currentDay = String(currentDate.getDate()).padStart(2, '0');

    var mainData = order.mainData;
    var detailData = order.detailData;

    // 计算金额（按照您模板中的实际数据）
    var currentPeriodAmount = calculateTotal(detailData);
    var openingAmount = 0; // 固定期初金额
    var totalDebt = (parseFloat(openingAmount) + parseFloat(currentPeriodAmount)).toFixed(2);

    var excelData = [
        ['昆山翰元星传动科技有限公司' + currentMonth + '月对账单'],
        ['', '', '', '', '', '', '', '', ''],
        ['客户名称：', mainData.khmc || '', '', '', '', '', '', '', ''],
        ['联系人：', mainData.lxr || '', '', '', '', '', '', '', ''],
        ['期初金额：', '¥' + openingAmount, '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['序号', '产品名称', '规格型号', '单位', '单价', '数量', '总价', '发货时间', '订单号']
    ];

    // 添加明细
    detailData.forEach(function(item, idx) {
        excelData.push([
            idx + 1,
            item.pm || '',
            item.ggxh || '',
            item.dw || '',
            item.dj || '',
            item.sl || '',
            parseFloat(item.zj || 0).toFixed(2),
            item.fhsj || '',
            mainData.ddh || ''
        ]);
    });

    excelData.push(['', '', '', '', '', '', '', '', '']);
    excelData.push(['本期金额：', '¥' + currentPeriodAmount, '', '', '', '', '', '', '']);
    excelData.push(['欠款总额：', '¥' + totalDebt, '', '', '', '', '', '', '']);
    excelData.push(['', '', '', '', '', '', '', '', '']);
    excelData.push(['', '', '', '', '', '', '', '', '']);
    excelData.push(['贵公司确认（签字、盖章）：', '昆山翰元星传动科技有限公司', '', '', '', '', '', '', '']);
    excelData.push(['日期：', '日期：' + currentYear + '/' + currentMonth + '/' + currentDay, '', '', '', '', '', '', '']);

    return excelData;
}

// 撤回对账功能
function withdrawDzd(rowData) {
    if (!rowData || !rowData.ddh) {
        swal('无法获取订单信息');
        return;
    }

    if (!confirm('确定要撤回该订单的对账状态吗？')) {
        return;
    }

    // 更新对账状态为"未对账"
    updateDzztStatus(rowData.ddh, '未对账', function(success) {
        if (success) {
            alert('撤回对账成功');
        } else {
            alert('撤回对账失败');
        }
    });
}

// 更新对账状态
function forceRefresh() {
    console.log('强制刷新数据');
    // 重置到第一页，避免分页问题
    currentPage = 1;
    // 使用空参数重新加载
    getList(currentPage, pageSize, {});
}

// 修改更新对账状态函数，使用强制刷新
function updateDzztStatus(ddh, dzztValue, callback) {
    console.log('开始更新对账状态，订单号:', ddh, '状态:', dzztValue);

    $ajax({
        type: 'post',
        url: '/dzd/updateDzztStatus',
        contentType: 'application/json',
        data: JSON.stringify({
            ddh: ddh,
            dzzt: dzztValue
        }),
        dataType: 'json'
    }, false, '', function (res) {
        if (res.code === 200) {
            console.log("更新对账状态成功:", res);
            // 使用强制刷新确保数据一致性
            forceRefresh();
            if (callback) callback(true);
        } else if(res.code == 403){
            swal("权限不足，无法访问此功能！")
        }else {
            console.error("更新对账状态失败:", res.message);
            if (callback) callback(false);
        }
    });
}

// 获取当前日期（年月日格式）
function getCurrentDate() {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
    var day = String(currentDate.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

// 生成打印内容
function generatePrintContent(rowData, detailData) {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1; // 获取当前月份
    var currentYear = currentDate.getFullYear();

    // 按照新规则计算金额
    var paidAmount = parseFloat(rowData.yifu) || 0;        // 已付金额
    var unpaidAmount = parseFloat(rowData.wf) || 0;        // 未付金额
    var currentPeriodAmount = calculateTotal(detailData);  // 本期金额 = 列表总价汇总
    var openingAmount = 0; // 期初金额 = 已付 - 未付
    var totalDebt = (parseFloat(openingAmount) + parseFloat(currentPeriodAmount)).toFixed(2); // 欠款总额 = 期初金额 + 本期金额

    var printContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>对账单 - ${rowData.ddh}</title>
    <style>
        @media print {
            body { margin: 0; padding: 20px; font-family: 'SimSun', serif; }
            .no-print { display: none !important; }
            .page-break { page-break-after: always; }
        }
        body { 
            margin: 0; 
            padding: 20px; 
            font-family: 'SimSun', serif; 
            font-size: 14px;
            line-height: 1.5;
        }
        .header { 
            text-align: center; 
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .document-title {
            font-size: 20px;
            font-weight: bold;
            margin: 15px 0;
        }
        .client-info {
            margin: 15px 0;
            text-align: left;
        }
        .client-info div {
            margin: 5px 0;
        }
        .table-container {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .table-container th,
        .table-container td {
            border: 1px solid #000;
            padding: 8px 12px;
            text-align: center;
            font-size: 12px;
        }
        .table-container th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        .summary {
            margin: 20px 0;
            padding: 15px;
            border: 1px solid #000;
        }
        .summary-item {
            margin: 8px 0;
            display: flex;
            justify-content: space-between;
        }
        .footer {
            margin-top: 30px;
            text-align: right;
        }
        .company-stamp {
            margin-top: 50px;
            text-align: right;
        }
        .note {
            margin-top: 20px;
            font-style: italic;
            color: #666;
        }
        .page-info {
            text-align: center;
            margin: 10px 0;
            font-size: 12px;
        }
        .separator {
            border-top: 1px dashed #000;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">昆山翰元星传动科技有限公司${currentMonth}月对账单</div>
    </div>

    <div class="client-info">
        <div><strong>客户名称：</strong>${rowData.khmc || ''}</div>
        <div><strong>联系人：</strong>${rowData.lxr || ''}</div>
        <div><strong>期初金额：</strong>¥${openingAmount}</div>
    </div>

    <table class="table-container">
        <thead>
            <tr>
                <th width="60">序号</th>
                <th width="140">产品名称</th>
                <th width="120">规格型号</th>
                <th width="60">单位</th>
                <th width="80">单价</th>
                <th width="60">数量</th>
                <th width="80">总价</th>
                <th width="120">发货时间</th>
                <th width="120">订单号</th>
            </tr>
        </thead>
        <tbody>
    `;

    // 添加明细行
    detailData.forEach(function(item, index) {
        printContent += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.pm || ''}</td>
                <td>${item.ggxh || ''}</td>
                <td>${item.dw || ''}</td>
                <td>${item.dj || ''}</td>
                <td>${item.sl || ''}</td>
                <td>${item.zj || ''}</td>
                <td>${item.fhsj || ''}</td>
                <td>${rowData.ddh || ''}</td>
            </tr>
        `;
    });

    printContent += `
        </tbody>
    </table>
   
    <div class="summary">
        <div class="summary-item">
            <span><strong>本期金额：</strong></span>
            <span>¥${currentPeriodAmount}</span>
        </div>
        <div class="summary-item">
            <span><strong>欠款总额：</strong></span>
            <span>¥${totalDebt}</span>
        </div>
    </div>

    <div class="note">
        *如果确认无误请签字盖章后回传*
    </div>
    
    <div class="footer">
        <div style="display: flex;justify-content: space-between">
        <div>贵公司确认（签字、盖章）：</div>
        <div>昆山翰元星传动科技有限公司</div>
        </div>
        
        <div style="display: flex;justify-content: space-between">
        <div>日期：</div>
        <div>日期：${currentYear}/${currentMonth}/${currentDate.getDate()}</div>
        </div>
    </div>

    <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
            立即打印
        </button>
        <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; background-color: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
            关闭
        </button>
    </div>
</body>
</html>`;

    // 打开新窗口显示打印内容
    var printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();

    // 自动触发打印
    setTimeout(function() {
        printWindow.print();
    }, 500);
}

// 计算总金额（本期金额）
function calculateTotal(detailData) {
    if (!detailData || detailData.length === 0) return '0.00';

    var total = 0;
    detailData.forEach(function(item) {
        var zj = parseFloat(item.zj) || 0;
        total += zj;
    });

    return total.toFixed(2);
}

// 获取详细信息用于打印
function getDetailDataForPrint(ddh, callback) {
    $ajax({
        type: 'post',
        url: '/dzd/getDetailByDdh',
        contentType: 'application/json',
        data: JSON.stringify({ ddh: ddh }),
        dataType: 'json'
    }, false, '', function (res) {
        if (res.code === 200) {
            callback(res.data);
        } else if(res.code == 403){
            swal("权限不足，无法访问此功能！")
        }else {
            console.error("获取详情失败:", res.message);
            callback(null);
        }
    });
}

function resetSearchAndRefresh() {
    // 重置搜索条件
    $('#ddh').val('');
    $('#khmc').val('');
    $('#fzr').val('');
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
    $('#ddh').val('');
    $('#khmc').val('');
    $('#fzr').val('');
    $('#sfkp').val('');
    setDefaultDateRange();

    // 重新查询
    currentPage = 1;
    getList(currentPage, pageSize, {});
}

// 获取搜索参数
function getSearchParams() {
    return {
        khmc: $('#khmc').val() || '',    // 乙方名称
        htbh: $('#htbh').val() || '',    // 合同编号
        fzr: $('#fzr').val() || '',    // 合同编号
        startDate: $('#startDate').val() || '',
        endDate: $('#endDate').val() || ''
    };
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
        url: '/dzd/distinctPage',
        contentType: 'application/json',
        data: JSON.stringify({
            pageNum: currentPage,
            pageSize: pageSize,
            khmc: searchParams.khmc || '',    // 乙方名称
            fzr: searchParams.fzr || '',
            ddh: searchParams.htbh || '',    // 合同编号
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

            // 刷新后更新开票按钮状态
            updateInvoiceButtonState();
        } else if(res.code == 403){
            swal("权限不足，无法访问此功能！")
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
    $('#ddmxTable').html('<tr><td colspan="13" style="text-align: center; padding: 20px;">加载中...</td></tr>');
}

// 隐藏加载中
function hideLoading() {
    // 加载完成后的处理
}
//---- 0128
function cleanSearchParams(params) {
    var cleaned = {};

    // 清理每个参数
    cleaned.ddh = params.htbh ? params.htbh.trim() : '';
    cleaned.khmc = params.khmc ? params.khmc.trim() : '';
    cleaned.fzr = params.fzr ? params.fzr.trim() : '';
    cleaned.startDate = params.startDate ? params.startDate.trim() : '';
    cleaned.endDate = params.endDate ? params.endDate.trim() : '';

    console.log('清理前参数:', params);
    console.log('清理后参数:', cleaned);

    return cleaned;
}

// 搜索功能
function searchDdmx() {
    var searchParams = getSearchParams();

    // 清理参数
    var cleanedParams = cleanSearchParams(searchParams);

    // 如果负责人名称不为空，添加特殊处理
    if (cleanedParams.fzr) {
        console.log('负责人搜索特殊处理:', cleanedParams.fzr);
    }

    currentPage = 1;
    getList(currentPage, pageSize, cleanedParams);
}

// 计算未付金额
function calculateWeifu(yfsj, yifu) {
    var yfsjValue = parseFloat(yfsj) || 0;
    var yifuValue = parseFloat(yifu) || 0;
    return (yfsjValue - yifuValue).toFixed(2);
}

// 修改表格渲染
// 在 fillTable 函数中，确保联系人信息正确存储在行中
function fillTable(data) {
    console.log("返回数据", data)
    $('#ddmxTable').empty();

    var tableHeader = `
        <thead>
            <tr>
                <th width="40"><input type="checkbox" id="selectAllRows"></th>
                <th width="60">序号</th>
                <th width="100">订单日期</th>
                <th width="160">订单号</th>
                <th width="180">客户名称</th>
                <th width="80">负责人</th>
                <th width="100">总价</th>
                <th width="80">已付</th>
                <th width="80">未付</th>
                <th width="90">操作</th>
            </tr>
        </thead>
    `;

    var tableBody = '<tbody>';

    if (data && data.length > 0) {
        data.forEach(function(item, index) {
            // 计算未付金额
            var weifu = calculateWeifu(item.yfsj, item.yifu);

            // 计算当前页的序号（考虑分页）
            var serialNumber = (currentPage - 1) * pageSize + index + 1;

            // 使用订单号作为唯一标识
            var ddh = item.ddh || '';

            // 检查当前行是否已被选中
            var isChecked = selectedDdhs.includes(ddh) ? 'checked' : '';

            // 确保有联系人信息
            var lxr = item.lxr || '';

            tableBody += `
                <tr data-ddh="${ddh}" 
                    data-lxr="${lxr}"
                    class="${isChecked ? 'selected-row' : ''}">
                    <td><input type="checkbox" class="row-checkbox" data-ddh="${ddh}" ${isChecked}></td>
                    <td>${serialNumber}</td>
                    <td>${item.ddrq || ''}</td>
                    <td>${ddh}</td>
                    <td>${item.khmc || ''}</td>
                    <td>${item.fzr || ''}</td>
                    <td>${item.yfsj || ''}</td>
                    <td>${item.yifu || ''}</td>
                    <td>${weifu}</td>
                    <td>
                        <button class="btn btn-sm btn-info detail-btn" 
                                data-ddh="${ddh}">
                            <i class="bi bi-eye"></i> 详情
                        </button>
                    </td>
                </tr>
            `;
        });
    } else {
        tableBody += `
            <tr>
                <td colspan="14" style="text-align: center; color: #999;">暂无订单数据</td>
            </tr>
        `;
    }

    tableBody += '</tbody>';
    $('#ddmxTable').html(tableHeader + tableBody);

    // 绑定新的事件
    addRowClickEvent();
    bindCheckboxEvents();
    bindDetailButtonEvents();
    bindViewFileEvents();

    console.log('表格渲染完成，选中订单号:', selectedDdhs);
}

function bindViewFileEvents() {
    console.log('绑定查看文件事件...');

    // 使用事件委托，避免动态生成元素的问题
    $('#ddmxTable').off('click.view', '.view-file-btn').on('click.view', '.view-file-btn', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $btn = $(this);
        var filePath = $btn.data('filepath');
        var fileName = $btn.data('filename') || '文件';

        console.log('查看文件按钮点击，文件路径:', filePath);
        console.log('文件名:', fileName);

        if (!filePath) {
            alert('错误：文件路径为空，无法查看文件');
            return;
        }

        // 显示加载中
        var originalText = $btn.html();
        $btn.prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> 打开中...');

        // 在新窗口/标签页中打开文件
        try {
            // 直接在新窗口打开文件URL
            window.open(filePath, '_blank');

            console.log('文件已在新窗口打开:', filePath);

            // 恢复按钮状态
            setTimeout(function() {
                $btn.prop('disabled', false).html(originalText);
            }, 1000);

        } catch (error) {
            console.error('打开文件失败:', error);

            // 备用方案：使用iframe预览
            try {
                var previewWindow = window.open('', '_blank');
                previewWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>文件预览 - ${fileName}</title>
                        <style>
                            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                            .container { max-width: 100%; height: 90vh; }
                            iframe { width: 100%; height: 100%; border: none; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <iframe src="${filePath}" title="${fileName}"></iframe>
                        </div>
                    </body>
                    </html>
                `);
                previewWindow.document.close();
            } catch (fallbackError) {
                alert('无法打开文件，请检查文件路径是否正确或文件是否存在。\n文件路径：' + filePath);
            }

            // 恢复按钮状态
            $btn.prop('disabled', false).html(originalText);
        }
    });
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
            swal('订单号不能为空');
            return;
        }

        // 触发文件选择
        $fileInput.trigger('click');
    });
}

// 上传PDF文件
function uploadPdfFile(ddh, file) {
    if (!ddh || !file) {
        swal('参数错误');
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
                swal('PDF文件上传成功！');
                // 上传成功后刷新数据
                getList(currentPage, pageSize, getSearchParams());
            }else if(res.code == 403){
                swal("权限不足，无法访问此功能！")
            } else {
                console.error("PDF文件上传失败:", res.message);
                swal("PDF文件上传失败: " + (res.message || '未知错误'));
            }
        })
        .catch(error => {
            hideLoading();
            console.error("上传请求失败:", error);
            swal("上传请求失败，请检查网络连接");
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
        } else if(res.code == 403){
            swal("权限不足，无法访问此功能！")
        }else {
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

// 绑定详情按钮事件
function bindDetailButtonEvents() {
    $('.detail-btn').off('click').on('click', function(e) {
        e.stopPropagation();

        // 先选中当前行
        $('#ddmxTable tbody tr').removeClass('selected-row');
        $(this).closest('tr').addClass('selected-row');

        // 获取当前行的订单号
        var $row = $(this).closest('tr');
        var ddh = $(this).data('ddh');

        showDetailModal(ddh);
    });
}

// 显示详情模态框
function showDetailModal(ddh) {
    currentId = ddh;

    // 获取选中行的数据
    var rowData = getSelectedRow();
    if (rowData) {
        // 确保客户要求数据已加载
        if (Object.keys(customerRequirements).length === 0 && customerRequirementsList.length === 0) {
            console.log("客户要求数据为空，重新获取...");
            yaoqiu(); // 重新获取客户要求数据
        }

        // 延迟一点填充基础信息，确保客户要求数据已加载
        setTimeout(function() {
            fillBasicInfo(rowData);
        }, 300);
    }

    // 根据订单号获取详细信息
    getDetailData(ddh);

    $('#detailModal').modal('show');
}

// 根据订单号获取详细信息
function getDetailData(ddh) {
    if (!ddh) {
        console.error('订单号为空');
        return;
    }

    showDetailLoading();

    // 调用获取详细信息的接口
    $ajax({
        type: 'post',
        url: '/dzd/getDetailByDdh',
        contentType: 'application/json',
        data: JSON.stringify({
            ddh: ddh
        }),
        dataType: 'json'
    }, false, '', function (res) {
        hideDetailLoading();
        if (res.code === 200) {
            console.log("返回的详细信息", res);
            fillDetailInfo(res.data);
        }else if(res.code == 403){
            swal("权限不足，无法访问此功能！")
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


// 填充基础信息 - 优化版本（可选）
function fillBasicInfo(rowData) {
    if (rowData) {
        // 获取客户要求
        var customerReq = getCustomerRequirement(rowData.khmc);
        console.log("客户名称:", rowData.khmc, "对应的客户要求:", customerReq);

        var basicInfoHtml = `
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group" style="display: flex">
                        <label class="font-weight-bold">订单日期：</label>
                        <div>${rowData.ddrq || ''}</div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group" style="display: flex">
                        <label class="font-weight-bold">订单号：</label>
                        <div>${rowData.ddh || ''}</div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group" style="display: flex">
                        <label class="font-weight-bold">负责人：</label>
                        <div>${rowData.fzr || ''}</div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group" style="display: flex">
                        <label class="font-weight-bold">客户名称：</label>
                        <div>${rowData.khmc || ''}</div>
                    </div>
                </div>
        `;

        // 如果有客户要求，显示客户要求
        if (customerReq && customerReq.trim() !== '') {
            basicInfoHtml += `
                <div class="col-md-12">
                    <div class="form-group" style="display: flex">
                        <label class="font-weight-bold" style="color: black;">客户要求：</label>
                        <div class="customer-requirement">
                            ${customerReq}
                        </div>
                    </div>
                </div>
            `;
        } else {
            basicInfoHtml += `
                <div class="col-md-12">
                    <div class="form-group" style="display: flex">
                        <label class="font-weight-bold">客户要求：</label>
                        <div class="text-muted">暂无客户要求信息</div>
                    </div>
                </div>
            `;
        }

        basicInfoHtml += `</div>`;
        $('#basicInfo').html(basicInfoHtml);
    }
}

function getSelectedRows() {
    return selectedRows;
}


// 获取选中行数据
function getSelectedRow() {
    var selectedRow = $('.selected-row');
    if (selectedRow.length === 0) {
        return null;
    }

    var rowData = {
        serialNumber: selectedRow.find('td:eq(1)').text().trim(),
        ddrq: selectedRow.find('td:eq(2)').text().trim(),
        ddh: selectedRow.find('td:eq(3)').text().trim(),
        khmc: selectedRow.find('td:eq(4)').text().trim(),
        fzr: selectedRow.find('td:eq(5)').text().trim(),
        yfsj: selectedRow.find('td:eq(6)').text().trim(),
        yifu: selectedRow.find('td:eq(7)').text().trim(),
        wf: selectedRow.find('td:eq(8)').text().trim(),
        kpsj: selectedRow.find('td:eq(9)').text().trim(),
        sfkp: selectedRow.find('td:eq(10)').text().trim(),
        dzzt: selectedRow.find('td:eq(11)').text().trim(),
        pdf_file_name: selectedRow.find('.view-file-btn').data('filepath') || ''
    };

    // 从行的data属性中获取联系人信息
    var rowElement = selectedRow[0];
    if (rowElement && rowElement.dataset) {
        rowData.lxr = rowElement.dataset.lxr || '';
        console.log('从行data属性获取联系人信息:', rowData.lxr);
    } else {
        console.log('行元素或dataset为空');
    }

    // 检查联系人信息是否存在
    if (!rowData.lxr || rowData.lxr === '') {
        console.log('联系人信息为空，尝试从详情数据获取');
    }

    return rowData;
}

// 添加行点击事件
function addRowClickEvent() {
    $('#ddmxTable tbody tr').click(function(e) {
        // 如果点击的是复选框，不执行行选中逻辑
        if ($(e.target).is('input[type="checkbox"]') || $(e.target).closest('input[type="checkbox"]').length) {
            return;
        }

        var $row = $(this);
        var $checkbox = $row.find('.row-checkbox');
        var isChecked = !$checkbox.prop('checked');

        // 切换复选框状态
        $checkbox.prop('checked', isChecked).trigger('change');
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

// 在 addTableStyles 函数中添加样式
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
            .pending-shipment {
                background-color: #409EFF !important;
                color: white !important;
                font-weight: bold;
            }
            
            /* 复选框列样式 */
            .row-checkbox {
                margin: 0;
                cursor: pointer;
            }
            
            /* 开票按钮样式 */
            #invoice-btn {
                margin-right: 10px;
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
             /* 客户要求样式 */
            .customer-requirement {
                border-radius: 4px;
                padding: 10px;
                font-size: 14px;
                padding: 3px;
            }
            .customer-requirement-label {
                font-weight: bold;
                margin-bottom: 5px;
                color: #856404;
            }
        `)
        .appendTo('head');
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

    // 提交上传 - 统一绑定事件
    $("#add-submit-btn").off('click').on('click', function () {
        console.log('提交上传按钮被点击'); // 添加调试信息

        // 获取表单数据
        var formData = new FormData();
        var fileInput = document.getElementById('fileInput1');

        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];
            var originalName = file.name;
            var orderNumber = $('#add-orderNumber').val();

            // 验证订单号是否为空
            if (!orderNumber) {
                alert("请先输入订单号！");
                return;
            }

            var fileExtension = originalName.split('.').pop().toLowerCase();
            var newFileName = orderNumber + "-10." + fileExtension; // 使用新变量名

            console.log('上传信息:', {
                orderNumber: orderNumber,
                originalName: originalName,
                newFileName: newFileName,
                fileExtension: fileExtension
            });

            // 根据截图中的参数格式设置FormData
            formData.append('file', file);  // 文件字段

            // 添加其他必要的参数（根据截图）
            formData.append('initialPreview', '[]');
            formData.append('initialPreviewConfig', '[]');
            formData.append('initialPreviewThumbTags', '[]');
            formData.append('file', newFileName);  // 文件名参数（与截图一致）
            formData.append('name', newFileName);  // 名称参数
            formData.append('path', '/t763812834_java_sharepic/');  // 路径参数
            formData.append('kongjian', '3');  // 空间参数
            formData.append('fileType', fileExtension);  // 文件类型参数
            formData.append('orderNumber', orderNumber);  // 订单号参数

            // 显示加载状态
            $('#add-submit-btn').prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> 上传中...');

            // 发送上传请求
            $.ajax({
                url: "https://yhocn.cn:9097/file/upload",
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    console.log('上传响应:', res);
                    if (res.code === 200) {
                        alert("上传成功！");
                        $('#add-modal').modal('hide');
                        clearForm();

                        // 上传成功后更新订单明细表的pdf_file_name字段
                        updatePdfFileName(orderNumber, fileExtension);

                    } else {
                        alert("上传失败：" + (res.msg || '未知错误'));
                    }

                    // 恢复按钮状态
                    $('#add-submit-btn').prop('disabled', false).html('上传');
                },
                error: function (xhr, status, error) {
                    console.error('上传请求失败:', error);
                    alert("上传失败！请检查网络连接");

                    // 恢复按钮状态
                    $('#add-submit-btn').prop('disabled', false).html('上传');
                }
            });
        } else {
            alert("请选择要上传的文件！");
        }
    });

    // 关闭按钮
    $('#add-close-btn').click(function () {
        $('#add-modal').modal('hide');
        clearForm();
    });

    // 清空表单
    function clearForm() {
        $('#add-orderNumber').val('');
        // 使用文件上传组件的方法清空
        if ($.fn.fileinput && $('#fileInput1').data('fileinput')) {
            $('#fileInput1').fileinput('clear');
        } else {
            $('#fileInput1').val('');
        }
    }
});

// 更新PDF文件名
function updatePdfFileName(ddh, pdfFileName) {
    showLoading();

    var fullFilePath = "http://yhocn.cn:9088/t763812834_java_sharepic/" + ddh + "-10." + pdfFileName;

    console.log('更新PDF文件名:', {
        ddh: ddh,
        pdfFileName: fullFilePath
    });

    $ajax({
        type: 'post',
        url: '/ddmx/updatePdfFileName',
        contentType: 'application/json',
        data: JSON.stringify({
            ddh: ddh,
            pdfFileName: fullFilePath
        }),
        dataType: 'json'
    }, false, '', function (res) {
        hideLoading();
        if (res.code === 200) {
            console.log("PDF文件名更新成功");
            // 刷新数据
            getList(currentPage, pageSize, getSearchParams());
        } else if(res.code == 403){
            swal("权限不足，无法访问此功能！");
        } else {
            console.error("PDF文件名更新失败:", res.message);
            alert("PDF文件名更新失败: " + (res.message || '未知错误'));
        }
    });
}

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

// ========== 新增导出Excel功能 ==========

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
                                        <input type="text" class="form-control" id="exportFileName" value="对账单_${formatDate(new Date())}">
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
            fileName = `对账单_${formatDate(new Date())}`;
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

// // 导出到Excel
// function exportToExcel(fileName) {
//     // 显示导出进度
//     swal({
//         title: '正在导出...',
//         text: '正在获取数据并生成Excel文件，请稍候...',
//         icon: 'info',
//         buttons: false,
//         closeOnClickOutside: false,
//         closeOnEsc: false
//     });
//
//     // 获取用户选择的字段
//     var selectedColumns = exportColumnsConfig.mainColumns;
//
//     // 如果没有选择任何字段，使用所有字段
//     if (selectedColumns.length === 0) {
//         selectedColumns = exportColumnsConfig.allMainColumns.map(col => col.key);
//     }
//
//     console.log('=== 导出配置信息 ===');
//     console.log('用户选择的主表列:', selectedColumns);
//     console.log('固定的详情列:', exportColumnsConfig.detailColumns);
//
//     // 获取字段显示名称的映射
//     var selectedColumnNames = {};
//     exportColumnsConfig.allMainColumns.forEach(col => {
//         if (selectedColumns.includes(col.key)) {
//             selectedColumnNames[col.key] = col.name;
//         }
//     });
//     console.log('字段名称映射:', selectedColumnNames);
//
//     // 获取当前搜索条件
//     var searchParams = getSearchParams();
//
//     // 调用后端接口获取全部数据
//     $ajax({
//         type: 'post',
//         url: '/dzd/daochuexcel',
//         contentType: 'application/json',
//         data: JSON.stringify({
//             pageNum: 1,
//             pageSize: 99999999,
//             // 传递搜索条件
//             khmc: searchParams.khmc || '',
//             ddh: searchParams.htbh || '',
//             startDate: searchParams.startDate || '',
//             endDate: searchParams.endDate || ''
//         }),
//         dataType: 'json'
//     }, false, '', function (res) {
//         swal.close();
//
//         console.log('=== 导出接口响应 ===');
//         console.log('响应码:', res.code);
//         console.log('响应数据:', res.data);
//
//         if (res.code === 200 && res.data) {
//             // 根据返回的数据结构处理数据并导出
//             processExportData(res.data, selectedColumns, selectedColumnNames, fileName);
//         } else {
//             console.error('导出失败:', res.message);
//             swal('导出失败', res.message || '数据获取失败', 'error');
//         }
//     });
// }
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
    console.log('固定的详情列:', exportColumnsConfig.detailColumns);

    // 获取字段显示名称的映射
    var selectedColumnNames = {};
    exportColumnsConfig.allMainColumns.forEach(col => {
        if (selectedColumns.includes(col.key)) {
            selectedColumnNames[col.key] = col.name;
        }
    });
    console.log('字段名称映射:', selectedColumnNames);

    // 获取当前搜索条件
    var searchParams = getSearchParams();

    // 调用后端接口获取全部数据
    $ajax({
        type: 'post',
        url: '/dzd/daochuexcel',
        contentType: 'application/json',
        data: JSON.stringify({
            pageNum: 1,
            pageSize: 99999999,
            // 传递搜索条件
            khmc: searchParams.khmc || '',
            ddh: searchParams.htbh || '',
            fzr: searchParams.fzr || '',
            startDate: searchParams.startDate || '',
            endDate: searchParams.endDate || '',
            // 添加开票状态过滤条件，只导出未开票的数据
            sfkp: '未开票', // 添加这个参数，后端可以过滤
            startDate: searchParams.startDate || '',
            endDate: searchParams.endDate || ''
        }),
        dataType: 'json'
    }, false, '', function (res) {
        swal.close();

        console.log('=== 导出接口响应 ===');
        console.log('响应码:', res.code);
        console.log('响应数据:', res.data);

        if (res.code === 200 && res.data) {
            // 根据返回的数据结构处理数据并导出
            processExportData(res.data, selectedColumns, selectedColumnNames, fileName);
        } else if(res.code == 403){
            swal("权限不足，无法访问此功能！");
        } else {
            console.error('导出失败:', res.message);
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

        console.log('=== 数据调试信息 ===');
        console.log('处理数据条数:', dataList.length);
        if (dataList.length > 0) {
            console.log('第一条完整数据:', JSON.stringify(dataList[0], null, 2));

            // 检查数据字段
            var sample = dataList[0];
            console.log('数据包含的字段:', Object.keys(sample).sort());

            // 检查详情字段是否存在
            var detailFields = ['pm', 'ggxh', 'dw', 'sl', 'dj', 'fhsj', 'zj'];
            detailFields.forEach(function(field) {
                console.log(`字段 ${field}: ${sample[field] || '空'}`);
            });
        }

        // 处理每条数据
        dataList.forEach(function(item, index) {
            var exportRow = createExportRowForDzd(item, selectedColumns, columnMapping);
            exportData.push(exportRow);
        });

        console.log('导出数据条数:', exportData.length);
        if (exportData.length > 0) {
            console.log('第一条导出数据:', exportData[0]);
        }

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

// 创建对账单导出行
function createExportRowForDzd(item, selectedColumns, columnMapping) {
    var row = {};

    // 1. 添加用户选择的主表列
    selectedColumns.forEach(function(colKey) {
        var displayName = columnMapping[colKey] || colKey;
        var value = '';

        // 根据字段名从数据中获取值
        switch(colKey) {
            case 'wf':
                // wf需要计算：总价 - 已付
                var totalValue = parseFloat(item.yfsj) || 0;
                var paidValue = parseFloat(item.yifu) || 0;
                value = (totalValue - paidValue).toFixed(2);
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
            default:
                // 尝试使用映射
                var fieldName = mapDetailColumnName(detailCol);
                value = item[fieldName] || '';
        }

        row[detailCol] = value;
    });

    return row;
}

// 映射详情列中文名到字段名 - 简化版
function mapDetailColumnName(chineseName) {
    // 更直接的映射关系
    var mapping = {
        '品名': 'pm',
        '规格型号': 'ggxh',
        '单位': 'dw',
        '数量': 'sl',
        '单价': 'dj',
        '发货时间': 'fhsj',
        '总价': 'zj'
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
    XLSX.utils.book_append_sheet(wb, ws, '对账单明细');

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

// 为对账单页面添加导出样式
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

// 在页面加载时添加导出样式
$(document).ready(function() {
    addExportModalStyles();
});


// 绑定复选框事件（使用订单号）
function bindCheckboxEvents() {
    // 全选/全不选
    $('#selectAllRows').off('change').on('change', function() {
        var isChecked = $(this).prop('checked');
        $('.row-checkbox').prop('checked', isChecked);

        if (isChecked) {
            // 选中当前页所有行
            $('#ddmxTable tbody tr').each(function() {
                var $row = $(this);
                var ddh = $row.data('ddh'); // 获取订单号
                var rowData = getRowData($row);

                if (ddh && !selectedDdhs.includes(ddh)) {
                    selectedDdhs.push(ddh);
                    selectedRows.push(rowData);
                    $row.addClass('selected-row');
                }
            });
        } else {
            // 取消选中当前页所有行
            $('#ddmxTable tbody tr').each(function() {
                var $row = $(this);
                var ddh = $row.data('ddh'); // 获取订单号
                var index = selectedDdhs.indexOf(ddh);

                if (index > -1) {
                    selectedDdhs.splice(index, 1);
                    selectedRows.splice(index, 1);
                    $row.removeClass('selected-row');
                }
            });
        }

        updateInvoiceButtonState();
        console.log('全选操作，当前选中订单号:', selectedDdhs);
    });

    // 单个复选框选择
    $('.row-checkbox').off('change').on('change', function(e) {
        e.stopPropagation(); // 阻止事件冒泡

        var $checkbox = $(this);
        var isChecked = $checkbox.prop('checked');
        var ddh = $checkbox.data('ddh'); // 改为获取订单号
        var $row = $checkbox.closest('tr');
        var rowData = getRowData($row);

        console.log('复选框选择 - 订单号:', ddh, '状态:', isChecked);

        if (isChecked) {
            // 获取行数据中的客户名称
            var khmc = $row.find('td:eq(4)').text().trim(); // 第5列是客户名称

            // 添加到选中列表
            if (ddh && !selectedDdhs.includes(ddh)) {
                selectedDdhs.push(ddh);
                selectedRows.push({
                    ddh: ddh,
                    khmc: khmc
                });
                $row.addClass('selected-row');
            }
        } else {
            // 从选中列表移除
            var index = selectedDdhs.indexOf(ddh);
            if (index > -1) {
                selectedDdhs.splice(index, 1);
                selectedRows.splice(index, 1);
                $row.removeClass('selected-row');
            }
        }

        // 更新全选复选框状态
        updateSelectAllCheckboxState();
        updateInvoiceButtonState();

        console.log('单个选择，当前选中订单号:', selectedDdhs);
    });
}

// 获取行数据
function getRowData($row) {
    // 获取订单号
    var ddh = $row.data('ddh') ||
        $row.find('.row-checkbox').data('ddh') ||
        $row.find('td:eq(2)').text().trim(); // 从订单号列获取

    console.log('getRowData - 获取订单号:', {
        'data-ddh': $row.data('ddh'),
        'checkbox-data-ddh': $row.find('.row-checkbox').data('ddh'),
        '文本订单号': $row.find('td:eq(2)').text().trim(),
        '最终订单号': ddh
    });

    return {
        ddh: ddh, // 返回订单号
        khmc: $row.find('td:eq(3)').text().trim(),
        sfkp: $row.find('td:eq(10)').text().trim(),
        ddrq: $row.find('td:eq(2)').text().trim(),
        fzr: $row.find('td:eq(4)').text().trim(),
        yfsj: $row.find('td:eq(5)').text().trim(),
        yifu: $row.find('td:eq(6)').text().trim(),
        wf: $row.find('td:eq(7)').text().trim(),
        kpsj: $row.find('td:eq(9)').text().trim(),
        dzzt: $row.find('td:eq(11)').text().trim()
    };
}

// 更新全选复选框状态
function updateSelectAllCheckboxState() {
    var totalCheckboxes = $('#ddmxTable tbody tr .row-checkbox').length;
    var checkedCheckboxes = $('#ddmxTable tbody tr .row-checkbox:checked').length;
    var allChecked = totalCheckboxes > 0 && totalCheckboxes === checkedCheckboxes;
    $('#selectAllRows').prop('checked', allChecked);
}

// 更新开票按钮状态
function updateInvoiceButtonState() {
    if (selectedDdhs.length > 0) {
        $('#invoice-btn').prop('disabled', false);
    } else {
        $('#invoice-btn').prop('disabled', true);
    }
}

// 批量开票功能
function batchInvoice() {
    if (selectedDdhs.length === 0) {
        swal('请先选择要开票的订单');
        return;
    }

    // 检查选中的订单是否都满足开票条件
    var canInvoice = true;
    var errorMessages = [];

    selectedRows.forEach(function(row, index) {
        if (row.sfkp === '已开票') {
            canInvoice = false;
            errorMessages.push(`订单 ${row.ddh} 已经开票`);
        }
    });

    if (!canInvoice) {
        swal({
            title: '开票失败',
            text: '以下订单已经开票，无法重复开票：\n' + errorMessages.join('\n'),
            icon: 'warning',
            buttons: {
                confirm: '确定'
            }
        });
        return;
    }

     performBatchInvoice();
}

// 执行批量开票
function performBatchInvoice() {
    showLoading();

    // 获取当前时间
    var currentTime = formatDateTime(new Date());

    // 直接使用订单号数组
    var ddhsToSend = selectedDdhs.filter(function(ddh) {
        return ddh !== undefined && ddh !== null && ddh !== '';
    });

    if (ddhsToSend.length === 0) {
        hideLoading();
        swal({
            title: '开票失败',
            text: '未获取到有效的订单号',
            icon: 'error',
            buttons: {
                confirm: '确定'
            }
        });
        return;
    }

    // 准备开票数据 - 使用订单号
    var invoiceData = {
        ddhs: ddhsToSend,  // 订单号数组
        kpsj: currentTime,  // 开票时间
        sfkp: '已开票'      // 开票状态
    };

    console.log('提交开票数据:', invoiceData);
    console.log('原始选中的订单号:', selectedDdhs);
    console.log('处理后的订单号:', ddhsToSend);

    // 调用开票接口 - 注意：后端接口需要支持订单号数组
    $ajax({
        type: 'post',
        url: '/dzd/batchUpdateInvoiceStatusByDdh',
        contentType: 'application/json',
        data: JSON.stringify(invoiceData),
        dataType: 'json'
    }, false, '', function (res) {
        hideLoading();
        if (res.code === 200) {
            console.log("批量开票成功:", res);
            swal({
                title: '开票成功',
                text: `成功为 ${ddhsToSend.length} 个订单更新开票状态`,
                icon: 'success',
                buttons: {
                    confirm: '确定'
                }
            });

            // 清空选择状态
            selectedDdhs = [];
            selectedRows = [];

            // 刷新数据
            forceRefresh();
        } else if(res.code == 403){
            swal("权限不足，无法访问此功能！");
        } else {
            console.error("批量开票失败:", res.message);
            swal({
                title: '开票失败',
                text: res.message || '未知错误',
                icon: 'error',
                buttons: {
                    confirm: '确定'
                }
            });
        }
    }).fail(function(xhr, status, error) {
        hideLoading();
        console.error("开票请求失败:", error);
        swal({
            title: '开票失败',
            text: '请求失败，请检查网络连接',
            icon: 'error',
            buttons: {
                confirm: '确定'
            }
        });
    });
}


function yaoqiu() {
    console.log("开始获取客户要求数据");

    $ajax({
        type: 'post',
        url: '/kehu/getyaoqiu',
        contentType: 'application/json',
        data: JSON.stringify({}),
        dataType: 'json'
    }, false, '', function (res) {
        if (res.code === 200) {
            console.log("成功获取客户要求数据:", res.data);

            // 清空之前的数据
            customerRequirements = {};
            customerRequirementsList = res.data || [];

            // 将数据转换为以khmc为key的对象，方便快速查找
            if (customerRequirementsList && customerRequirementsList.length > 0) {
                customerRequirementsList.forEach(function(item) {
                    if (item.khmc && item.yq) {
                        customerRequirements[item.khmc.trim()] = item.yq;
                    }
                });
            }

            console.log("客户要求数据已保存，共", customerRequirementsList.length, "条记录");
            console.log("转换后的客户要求对象:", customerRequirements);

        } else if(res.code == 403){
            swal("权限不足，无法访问此功能！");
        } else {
            console.error("获取客户要求失败:", res.message);
            // swal("获取客户要求失败: " + (res.message || '未知错误'));
        }
    });
    // 删除 .fail() 部分
}

// 新增：根据客户名称获取客户要求
function getCustomerRequirement(customerName) {
    if (!customerName) return '';

    // 先尝试从转换后的对象中查找（精确匹配）
    var requirement = customerRequirements[customerName.trim()];
    if (requirement) {
        return requirement;
    }

    // 如果精确匹配没找到，尝试模糊匹配
    var found = customerRequirementsList.find(function(item) {
        return item.khmc && item.khmc.includes(customerName.trim());
    });

    return found ? found.yq : '';
}


// 检查选中的订单是否属于同一个客户
function checkSameCustomer() {
    if (selectedRows.length === 0) return false;

    // 获取第一个订单的客户名称
    var firstCustomer = selectedRows[0].khmc || '';

    // 检查所有选中的订单客户名称是否一致
    for (var i = 1; i < selectedRows.length; i++) {
        var currentCustomer = selectedRows[i].khmc || '';
        if (currentCustomer !== firstCustomer) {
            return false;
        }
    }

    return true;
}

// 调用后端API更新对账记录
function updateDzdRecords(duizhangdanhao) {
    showLoading();

    // 获取当前日期（YYYY-MM-DD格式）
    var currentDate = new Date();
    var duizhangriqi = currentDate.getFullYear() + '-' +
        String(currentDate.getMonth() + 1).padStart(2, '0') + '-' +
        String(currentDate.getDate()).padStart(2, '0');

    // 准备请求数据 - 传递数组格式的ddh
    var requestData = {
        ddh: selectedDdhs,  // 数组格式
        duizhangdanhao: duizhangdanhao,
        sfkp: '未开票',     // 默认值
        duizhangriqi: duizhangriqi  // 当前日期
    };

    console.log('提交对账数据:', requestData);

    // 调用后端API
    $ajax({
        type: 'post',
        url: '/dzd/updatedzdjl',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        dataType: 'json'
    }, false, '', function (res) {
        hideLoading();
        if (res.code === 200) {
            alert(`成功为 ${selectedDdhs.length} 个订单生成对账单`);

            // 关闭弹窗
            $('#generateDzdModal').modal('hide');

            // 清空选择状态
            selectedDdhs = [];
            selectedRows = [];
            $('#selectAllRows').prop('checked', false);

            // 刷新数据
            forceRefresh();
        } else if (res.code == 403) {
            alert("权限不足，无法访问此功能！");
        } else {
            alert('更新对账记录失败: ' + (res.message || '未知错误'));
        }
    }).fail(function(xhr, status, error) {
        hideLoading();
        alert('请求失败，请检查网络连接');
    });
}


function getListBH() {
    $.ajax({
        type: 'post',
        url: '/hetong/list',
        contentType: 'application/json',
        dataType: 'json',
        success: function(res) {
            if (res.success && res.data && res.data.length > 0) {
                console.log("返回的客户信息", res);

                // 提取第一个记录的 bianhao 字段
                var firstRecord = res.data[0];
                var bianhaoValue = firstRecord.bianhao || '';

                // 获取当前日期
                var currentDate = new Date();
                var year = currentDate.getFullYear();
                var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                var day = String(currentDate.getDate()).padStart(2, '0');
                var dateStr = year + month + day;

                // 构建对账单号：DZ + bianhao + 日期
                var duizhangdanhao = 'DZ' + bianhaoValue + dateStr;

                console.log('生成的对账单号:', duizhangdanhao);

                // 设置为模态框中输入框的默认值
                $('#duizhangdanhao').val(duizhangdanhao);

            } else {
                console.error("查询失败:", res.message);

                // 处理权限错误
                if (res.code === 401) {
                    alert("登录已过期，请重新登录");
                    window.location.href = "/login.html";
                } else if (res.code === 403) {
                    alert("权限不足，无法访问此功能");
                } else {
                    console.log("查询失败: " + (res.message || '没有获取到数据'));
                }
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX请求失败:", error);
            console.log("请求失败，请检查网络连接");
        }
    });
}



// 新增：导出打印数据到Excel功能
// 新增：导出打印数据到Excel功能（带边框）
// function exportPrintDataToExcel(rowData, detailData) {
//     if (!rowData || !detailData || detailData.length === 0) {
//         swal('无法获取要导出的数据');
//         return;
//     }
//
//     try {
//         // 计算金额
//         var paidAmount = parseFloat(rowData.yifu) || 0;
//         var unpaidAmount = parseFloat(rowData.wf) || 0;
//         var currentPeriodAmount = calculateTotal(detailData);
//         var openingAmount = 0;
//         var totalDebt = (parseFloat(openingAmount) + parseFloat(currentPeriodAmount)).toFixed(2);
//
//         var currentDate = new Date();
//         var currentMonth = currentDate.getMonth() + 1;
//         var currentYear = currentDate.getFullYear();
//
//         // 准备Excel数据
//         var excelData = [
//             // 标题行
//             ['昆山翰元星传动科技有限公司' + currentMonth + '月对账单'],
//             [], // 空行
//
//             // 客户信息
//             ['客户名称：', rowData.khmc || ''],
//             ['联系人：', rowData.lxr || ''],
//             ['期初金额：', '¥' + openingAmount],
//             [], // 空行
//
//             // 表头
//             ['序号', '产品名称', '规格型号', '单位', '单价', '数量', '总价', '发货时间', '订单号'],
//         ];
//
//         // 添加明细数据
//         detailData.forEach(function(item, index) {
//             excelData.push([
//                 index + 1,
//                 item.pm || '',
//                 item.ggxh || '',
//                 item.dw || '',
//                 item.dj || '',
//                 item.sl || '',
//                 item.zj || '',
//                 item.fhsj || '',
//                 rowData.ddh || ''
//             ]);
//         });
//
//         // 添加空行
//         excelData.push([]);
//
//         // 添加汇总信息
//         excelData.push(['本期金额：', '¥' + currentPeriodAmount]);
//         excelData.push(['欠款总额：', '¥' + totalDebt]);
//
//         // 添加空行
//         excelData.push([]);
//         excelData.push([]);
//
//         // 添加页脚信息
//         excelData.push(['贵公司确认（签字、盖章）：', '昆山翰元星传动科技有限公司']);
//         excelData.push(['日期：', '日期：' + currentYear + '/' + currentMonth + '/' + currentDate.getDate()]);
//
//         // 生成Excel文件名
//         var fileName = '对账单_' + rowData.khmc + '_' + rowData.ddh + '_' +
//             currentYear + currentMonth + currentDate.getDate() + '.xlsx';
//
//         // 创建并导出Excel（带边框）
//         exportExcelFileWithBorder(excelData, fileName, detailData.length);
//
//     } catch (error) {
//         console.error('导出Excel失败:', error);
//         swal('导出失败', '生成Excel文件时发生错误：' + error.message, 'error');
//     }
// }
// 修改 exportPrintDataToExcel 函数，按照您提供的Excel模板格式
// 修改 exportPrintDataToExcel 函数，完全按照您提供的Excel模板格式
function exportPrintDataToExcel(rowData, detailData) {
    if (!rowData || !detailData || detailData.length === 0) {
        swal('无法获取要导出的数据');
        return;
    }

    try {
        var currentDate = new Date();
        var currentMonth = currentDate.getMonth() + 1;
        var currentYear = currentDate.getFullYear();
        var currentDay = String(currentDate.getDate()).padStart(2, '0');

        // 计算金额（按照您模板中的实际数据）
        var currentPeriodAmount = calculateTotal(detailData); // 本期金额 = 明细总价汇总
        var openingAmount = 0; // 根据您的模板，期初金额固定为6800
        var totalDebt = (parseFloat(openingAmount) + parseFloat(currentPeriodAmount)).toFixed(2); // 欠款总额 = 期初 + 本期

        // 准备Excel数据（完全按照您提供的Excel模板格式）
        var excelData = [
            // 第1行：标题
            ['昆山翰元星传动科技有限公司' + currentMonth + '月对账单'],
            // 第2行：空行
            ['', '', '', '', '', '', '', '', ''],
            // 第3行：客户名称（A列标签，B列值）
            ['客户名称：', rowData.khmc || '', '', '', '', '', '', '', ''],
            // 第4行：联系人（A列标签，B列值）
            ['联系人：', rowData.lxr || '', '', '', '', '', '', '', ''],
            // 第5行：期初金额（A列标签，B列值）
            ['期初金额：', '¥' + openingAmount, '', '', '', '', '', '', ''],
            // 第6行：空行
            ['', '', '', '', '', '', '', '', ''],
            // 第7行：表头（A-I列）
            ['序号', '产品名称', '规格型号', '单位', '单价', '数量', '总价', '发货时间', '订单号']
        ];

        // 添加明细数据（从第8行开始）
        detailData.forEach(function(item, index) {
            excelData.push([
                index + 1,
                item.pm || '',
                item.ggxh || '',
                item.dw || '',
                item.dj || '',
                item.sl || '',
                parseFloat(item.zj || 0).toFixed(2), // 保留两位小数
                item.fhsj || '',
                rowData.ddh || ''
            ]);
        });

        // 明细数据后的空行（第17行）
        excelData.push(['', '', '', '', '', '', '', '', '']);

        // 第18行：本期金额（A列标签，B列值）
        excelData.push(['本期金额：', '¥' + currentPeriodAmount, '', '', '', '', '', '', '']);

        // 第19行：欠款总额（A列标签，B列值）
        excelData.push(['欠款总额：', '¥' + totalDebt, '', '', '', '', '', '', '']);

        // 第20行：空行
        excelData.push(['', '', '', '', '', '', '', '', '']);
        // 第21行：空行
        excelData.push(['', '', '', '', '', '', '', '', '']);

        // 第22行：签字盖章（A列是"贵公司确认（签字、盖章）："，I列是公司名称）
        excelData.push(['贵公司确认（签字、盖章）：', '昆山翰元星传动科技有限公司', '', '', '', '', '', '', '']);

        // 第23行：日期（A列是"日期："，B列是实际日期）
        excelData.push(['日期：', '日期：' + currentYear + '/' + currentMonth + '/' + currentDay, '', '', '', '', '', '', '']);

        // 生成文件名（按照您示例中的格式）
        var fileName = '对账单_' + (rowData.khmc || '客户') +
            '_' + (rowData.ddh || '订单号') +
            '_' + currentYear +
            String(currentMonth).padStart(2, '0') +
            currentDay + '.xlsx';

        // 创建并导出Excel
        createExcelWithExactTemplate(excelData, fileName, detailData.length);

    } catch (error) {
        console.error('导出Excel失败:', error);
        swal('导出失败', '生成Excel文件时发生错误：' + error.message, 'error');
    }
}

// 创建完全符合模板格式的Excel
function createExcelWithExactTemplate(data, fileName, detailRowsCount) {
    try {
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.aoa_to_sheet(data);

        ws['!cols'] = [
            { wch: 10 },   // A列：序号（6个字符宽，足够显示序号）
            { wch: 20 },  // B列：产品名称（20个字符宽，足够显示产品名）
            { wch: 25 },  // C列：规格型号（25个字符宽，规格型号可能较长）
            { wch: 8 },   // D列：单位（8个字符宽）
            { wch: 10 },  // E列：单价（10个字符宽，包含¥符号）
            { wch: 8 },   // F列：数量（8个字符宽）
            { wch: 12 },  // G列：总价（12个字符宽，包含¥符号和两位小数）
            { wch: 15 },  // H列：发货时间（15个字符宽，YYYY-MM-DD格式）
            { wch: 20 }   // I列：订单号（20个字符宽，订单号可能较长）
        ];

        // 设置行高：第一行40，其他行20
        var rowHeights = [];

        // 遍历所有行，设置行高
        for (var i = 0; i < data.length; i++) {
            if (i === 0) {
                // 第一行：标题行，高度40
                rowHeights[i] = { hpx: 40 };
            } else {
                // 其他所有行：高度20
                rowHeights[i] = { hpx: 20 };
            }
        }

        // 应用行高设置
        ws['!rows'] = rowHeights;
        // 设置标题行合并（A1:I1）
        ws['!merges'] = [
            // 标题行合并（A1:I1）
            { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
            // B3:C3合并
            { s: { r: b3c3StartRow, c: 1 }, e: { r: b3c3StartRow, c: 2 } },
            // B15:C15合并
            { s: { r: b15c15StartRow, c: 1 }, e: { r: b15c15StartRow, c: 2 } }
        ];

        XLSX.utils.book_append_sheet(wb, ws, '对账单');
        XLSX.writeFile(wb, fileName);

        swal('导出成功', 'Excel文件已生成并开始下载', 'success');

    } catch (error) {
        console.error('Excel创建失败:', error);
        swal('导出失败', error.message, 'error');
    }
}
// 辅助函数：导出带边框的Excel文件
function exportExcelFileWithBorder(data, fileName, detailRowsCount) {
    // 确保SheetJS库已加载
    if (typeof XLSX === 'undefined') {
        swal({
            title: '正在加载Excel库...',
            text: '请稍候...',
            icon: 'info',
            buttons: false,
            closeOnClickOutside: false
        });

        loadSheetJS().then(function() {
            swal.close();
            createAndDownloadExcelWithBorder(data, fileName, detailRowsCount);
        }).catch(function(error) {
            swal('导出失败', '无法加载Excel库，请刷新页面重试', 'error');
        });
    } else {
        createAndDownloadExcelWithBorder(data, fileName, detailRowsCount);
    }
}

// 创建并下载带边框的Excel文件
function createAndDownloadExcelWithBorder(data, fileName, detailRowsCount) {
    try {
        // 创建工作簿
        var wb = XLSX.utils.book_new();

        // 创建工作表
        var ws = XLSX.utils.aoa_to_sheet(data);

        // 计算各个区域的范围
        var titleRow = 0; // 标题在第0行
        var infoStartRow = 2; // 客户信息从第2行开始
        var infoRows = 3; // 客户信息占3行
        var headerRow = infoStartRow + infoRows + 1; // 表头行
        var dataStartRow = headerRow + 1; // 数据开始行
        var dataEndRow = dataStartRow + detailRowsCount - 1; // 数据结束行
        var summaryStartRow = dataEndRow + 2; // 汇总信息开始行
        var summaryRows = 2; // 汇总信息占2行
        var footerStartRow = summaryStartRow + summaryRows + 2; // 页脚开始行

        // 定义边框样式
        var borderStyle = {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
        };

        var thickBorderStyle = {
            top: { style: "medium", color: { rgb: "000000" } },
            bottom: { style: "medium", color: { rgb: "000000" } },
            left: { style: "medium", color: { rgb: "000000" } },
            right: { style: "medium", color: { rgb: "000000" } }
        };

        // 设置单元格样式
        var cellRefs = [];

        // 1. 标题行样式（合并单元格并居中）
        var titleRange = XLSX.utils.encode_range(
            { r: titleRow, c: 0 },
            { r: titleRow, c: 8 }
        );
        ws['!merges'] = [{ s: { r: titleRow, c: 0 }, e: { r: titleRow, c: 8 } }];

        // 设置标题单元格样式
        var titleCell = XLSX.utils.encode_cell({ r: titleRow, c: 0 });
        if (!ws[titleCell]) ws[titleCell] = { t: 's', v: data[titleRow][0] };
        ws[titleCell].s = {
            font: { bold: true, sz: 16 },
            alignment: { horizontal: 'center', vertical: 'center' }
        };

        // 2. 表头行样式（第5行，索引4）
        for (var col = 0; col < 9; col++) {
            var headerCell = XLSX.utils.encode_cell({ r: headerRow, c: col });
            if (!ws[headerCell]) ws[headerCell] = { t: 's', v: data[headerRow][col] };
            ws[headerCell].s = {
                font: { bold: true, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "4F81BD" } },
                alignment: { horizontal: 'center', vertical: 'center' },
                border: thickBorderStyle
            };
            cellRefs.push(headerCell);
        }

        // 3. 数据区域样式（带边框）
        for (var row = dataStartRow; row <= dataEndRow; row++) {
            for (var col = 0; col < 9; col++) {
                var cell = XLSX.utils.encode_cell({ r: row, c: col });
                if (!ws[cell]) ws[cell] = { t: 's', v: data[row][col] || '' };
                ws[cell].s = {
                    alignment: { horizontal: 'center', vertical: 'center' },
                    border: borderStyle
                };

                // 数值列右对齐（单价、数量、总价）
                if (col === 4 || col === 5 || col === 6) {
                    ws[cell].s.alignment = { horizontal: 'right', vertical: 'center' };
                }

                cellRefs.push(cell);
            }
        }

        // 4. 汇总信息样式
        for (var i = 0; i < summaryRows; i++) {
            var summaryRow = summaryStartRow + i;
            for (var col = 0; col < 2; col++) {
                var cell = XLSX.utils.encode_cell({ r: summaryRow, c: col });
                if (!ws[cell]) ws[cell] = { t: 's', v: data[summaryRow][col] };
                ws[cell].s = {
                    font: { bold: true },
                    border: borderStyle
                };
                if (col === 0) {
                    ws[cell].s.alignment = { horizontal: 'right', vertical: 'center' };
                } else {
                    ws[cell].s.alignment = { horizontal: 'left', vertical: 'center' };
                }
                cellRefs.push(cell);
            }
        }

        // 5. 页脚信息样式
        for (var i = 0; i < 2; i++) {
            var footerRow = footerStartRow + i;
            for (var col = 0; col < 2; col++) {
                var cell = XLSX.utils.encode_cell({ r: footerRow, c: col });
                if (!ws[cell]) ws[cell] = { t: 's', v: data[footerRow][col] };
                if (col === 0) {
                    ws[cell].s = {
                        font: { bold: true },
                        alignment: { horizontal: 'right', vertical: 'center' }
                    };
                } else {
                    ws[cell].s = {
                        alignment: { horizontal: 'left', vertical: 'center' }
                    };
                }
                cellRefs.push(cell);
            }
        }

        // 设置列宽
        var colWidths = [
            { wch: 8 },   // 序号列
            { wch: 20 },  // 产品名称
            { wch: 21 },  // 规格型号
            { wch: 8 },   // 单位
            { wch: 12 },  // 单价
            { wch: 8 },   // 数量
            { wch: 12 },  // 总价
            { wch: 15 },  // 发货时间
            { wch: 23 }   // 订单号
        ];
        ws['!cols'] = colWidths;

        // 设置行高（标题行更高）
        ws['!rows'] = [];
        for (var i = 0; i < data.length; i++) {
            if (i === titleRow) {
                ws['!rows'][i] = { hpx: 40 }; // 标题行高度
            } else if (i === headerRow) {
                ws['!rows'][i] = { hpx: 25 }; // 表头行高度
            } else {
                ws['!rows'][i] = { hpx: 20 }; // 普通行高度
            }
        }

        // 添加到工作簿
        XLSX.utils.book_append_sheet(wb, ws, '对账单');

        // 导出文件
        XLSX.writeFile(wb, fileName);

        swal('导出成功', 'Excel文件已生成并开始下载', 'success');

    } catch (error) {
        console.error('Excel创建失败:', error);
        swal('导出失败', '创建Excel文件失败：' + error.message, 'error');
    }
}

// 辅助函数：导出Excel文件
function exportExcelFile(data, fileName) {
    // 确保SheetJS库已加载
    if (typeof XLSX === 'undefined') {
        swal({
            title: '正在加载Excel库...',
            text: '请稍候...',
            icon: 'info',
            buttons: false,
            closeOnClickOutside: false
        });

        loadSheetJS().then(function() {
            swal.close();
            createAndDownloadExcel(data, fileName);
        }).catch(function(error) {
            swal('导出失败', '无法加载Excel库，请刷新页面重试', 'error');
        });
    } else {
        createAndDownloadExcel(data, fileName);
    }
}

// 创建并下载Excel文件
function createAndDownloadExcel(data, fileName) {
    try {
        // 创建工作簿
        var wb = XLSX.utils.book_new();

        // 创建工作表
        var ws = XLSX.utils.aoa_to_sheet(data);

        // 设置列宽（可根据内容调整）
        var colWidths = [
            { wch: 8 },   // 序号列
            { wch: 20 },  // 产品名称
            { wch: 21 },  // 规格型号
            { wch: 8 },   // 单位
            { wch: 12 },  // 单价
            { wch: 8 },   // 数量
            { wch: 12 },  // 总价
            { wch: 15 },  // 发货时间
            { wch: 23 }   // 订单号
        ];
        ws['!cols'] = colWidths;

        // 设置第一行合并（标题行）
        ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } } // 合并第一行的所有列
        ];

        // 添加到工作簿
        XLSX.utils.book_append_sheet(wb, ws, '对账单');

        // 导出文件
        XLSX.writeFile(wb, fileName);

        swal('导出成功', 'Excel文件已生成并开始下载', 'success');

    } catch (error) {
        console.error('Excel创建失败:', error);
        swal('导出失败', '创建Excel文件失败：' + error.message, 'error');
    }
}