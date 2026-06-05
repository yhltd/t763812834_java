var currentPage = 1;
var pageSize = 20;
var totalCount = 0;
var totalPages = 0;
var currentId = '';
var currentHtbh = '';
var departmentMap = {};
var selectedWorkOrders = []; // 存储选中的产品索引
var productWorkOrders = {}; // 存储每个产品的工单号
var productPrintCounts = {}; // 存储每个产品的打印次数
var employeeList = []; // 添加这个变量来存储员工信息
var currentDetailData = null;
var chanpindanwei = [];
var productHq = {};
var currentSortField = '';
var currentSortOrder = 'asc';


// ========== 新增：导出配置变量 ==========
var exportColumnsConfig = {
    mainColumns: [],      // 用户选择的主表列
    allMainColumns: [
        { key: 'khcm', name: '客户名称' },
        { key: 'lxr', name: '联系人' },
        { key: 'lxdh', name: '联系电话' },
        { key: 'ddrq', name: '订单日期' },
        { key: 'hj', name: '合计金额' },
        { key: 'fzr', name: '负责人' },
        { key: 'htbh', name: '合同编号' },
        { key: 'yq', name: '购方要求' },
        { key: 'kpzt', name: '开票状态' }
    ]
};

function showExportModal(){}
// 新增：导出配置变量
var exportColumnsConfig = {
    mainColumns: [],      // 用户选择的主表列
    allMainColumns: [
        { key: 'khcm', name: '客户名称' },
        { key: 'lxr', name: '联系人' },
        { key: 'lxdh', name: '联系电话' },
        { key: 'ddrq', name: '订单日期' },
        { key: 'hj', name: '合计金额' },
        { key: 'fzr', name: '负责人' },
        { key: 'htbh', name: '合同编号' },
        { key: 'yq', name: '购方要求' },
        { key: 'kpzt', name: '开票状态' }
    ]
};

// 初始化导出配置
function initExportConfig() {
    exportColumnsConfig.mainColumns = exportColumnsConfig.allMainColumns.map(col => col.key);
}

// 初始化导出配置
function initExportConfig() {
    exportColumnsConfig.mainColumns = exportColumnsConfig.allMainColumns.map(col => col.key);
}
function addExportModalStyles() {}
// 页面加载完成后初始化
$(document).ready(function() {
    console.log('页面加载完成，初始化客户信息页面...');
    //addTableStyles();
    // addExportModalStyles(); // Removed to fix ReferenceError: addExportModalStyles is not defined
    initKhxxPage();
    initToolbarEvents();
    initDetailModalEvents();
    getDW();
    getListDH();
    resetDailySequence();
    // 初始化导出配置
    initExportConfig();


    // 确保统计区域可见
    $('#statisticsContainer').show();
    // 初始化统计值为0
    updateStatistics(0, 0, 0, 0);

    // 设置默认日期范围并获取数据
    setDefaultDateRange();
    getList(currentPage, pageSize, {});
});


function getDW() {
    $.ajax({
        type: 'post',
        url: '/xiadan/danwei',
        contentType: 'application/json',
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                if (res.data && res.data.length > 0) {
                    chanpindanwei = res.data;
                    console.log("chanpindanwei 原始数据:", chanpindanwei);

                    // 验证和清理数据
                    validateAndCleanProductUnitData();

                    console.log("chanpindanwei 清理后数据:", chanpindanwei);

                    // 打印所有可用的产品名称和单位，方便调试
                    console.log("可用的产品单位对应关系:");
                    chanpindanwei.forEach(item => {
                        console.log(`产品: "${item.chanpinmingcheng}" -> 单位: "${item.danwei}"`);
                    });
                } else {
                    console.warn('返回的产品单位数据为空');
                    chanpindanwei = [];
                }
            } else {
                console.error('获取产品单位数据失败:', res.message);
                chanpindanwei = [];
            }
        },
        error: function(xhr, status, error) {
            console.error('请求产品单位数据失败:', error);
            chanpindanwei = [];
        }
    });
}

function debugProductUnit(productName) {
    console.log('=== 调试产品单位匹配 ===');
    console.log('查找产品:', productName);
    console.log('产品单位数据:', chanpindanwei);

    const found = chanpindanwei.find(item =>
        item && item.chanpinmingcheng && item.chanpinmingcheng.trim() === productName.trim()
    );

    console.log('匹配结果:', found);
    console.log('单位:', found ? found.danwei : '未找到');
    console.log('=== 调试结束 ===');

    return found ? found.danwei : null;
}

function initKhxxPage() {
    console.log('初始化客户信息页面...');

    // 绑定搜索事件
    $('#select-btn').off('click').on('click', function() {
        searchKhxx();
    });

    // 绑定搜索输入框回车事件
    $('#khcm, #lxr, #fzr').off('keypress').on('keypress', function(e) {
        if (e.which === 13) {
            searchKhxx();
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

// 格式化当前日期时间用于文件名
function formatCurrentDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');
    var hour = String(now.getHours()).padStart(2, '0');
    var minute = String(now.getMinutes()).padStart(2, '0');
    var second = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}_${hour}${minute}${second}`;
}

// 初始化工具栏事件
function initToolbarEvents() {
    console.log('初始化工具栏事件...');

    // 刷新按钮
    $('#refresh-btn').off('click').on('click', function() {
        console.log('刷新数据');
        resetSearchAndRefresh();
    });

    // 导出文档按钮 - 改为显示导出弹窗
    $('#export-btn').off('click').on('click', function() {
        console.log('点击导出按钮，显示导出设置弹窗');
        showExportModal();  // 调用显示弹窗函数
    });
}

function resetSearchAndRefresh() {
    // 重置搜索条件
    $('#khcm').val('');
    $('#lxr').val('');
    $('#fzr').val('');
    $('#kpzt').val('');
    setDefaultDateRange();

    // 刷新数据
    currentPage = 1;
    getList(currentPage, pageSize, {});
}

// 初始化详情模态框事件
function initDetailModalEvents() {
    // 打印按钮 - 修改为打印选中产品
    $('#detailPrintBtn').off('click').on('click', function() {
        if (selectedWorkOrders.length === 0) {
            swal('请至少选择一个产品进行打印');
            return;
        }

        var rowData = getSelectedRow();
        if (rowData) {
            // 批量打印选中的产品
            printSelectedProducts(rowData, selectedWorkOrders);
        } else {
            swal('无法获取打印数据');
        }
    });

    // 录库按钮事件
    $('#saveToOrderDetailBtn').off('click').on('click', function() {
        saveToOrderDetail();
    });

    // 驳回按钮事件
    $('#rejectBtn').off('click').on('click', function() {
        rejectOrder();
    });

    // 删除按钮事件 - 新增
    $('#deleteOrderBtn').off('click').on('click', function() {
        deleteCurrentOrder();
    });

    // 添加模态框关闭事件，关闭时刷新数据
    $('#detailModal').off('hidden.bs.modal').on('hidden.bs.modal', function() {
        console.log('详情模态框关闭，刷新数据...');
        // 刷新数据列表
        getList(currentPage, pageSize, getSearchParams());
    });
}

// 添加录库函数 - 保存到订单明细表
function saveToOrderDetail() {
    if (!currentId || !currentDetailData) {
        swal('无法获取订单数据');
        return;
    }

    if (!confirm('确定要将此订单数据保存到订单明细表吗？')) {
        return;
    }

    // 显示加载中
    $('#saveToOrderDetailBtn').prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> 录库中...');

    // 先检查合同号是否已存在
    checkContractNumberExists();
}

// 删除当前订单函数
function deleteCurrentOrder() {
    if (!currentId) {
        swal('无法获取订单ID');
        return;
    }

    var khcm = '';
    if (currentDetailData && currentDetailData.khcm) {
        khcm = currentDetailData.khcm;
    }

    var confirmMessage = '确定要删除客户 "' + (khcm || '该订单') + '" 的订单吗？';

    if (!confirm(confirmMessage)) {
        return;
    }

    // 显示加载中
    $('#deleteOrderBtn').prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> 删除中...');

    $.ajax({
        url: '/xiadan/deletezt',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            id: currentId
        }),
        success: function(result) {
            $('#deleteOrderBtn').prop('disabled', false).html('<i class="bi bi-trash"></i> 删除');

            if (result.success) {
                swal('订单删除成功');
                // 关闭模态框
                $('#detailModal').modal('hide');
                // 刷新数据列表
                getList(currentPage, pageSize, getSearchParams());
            } else {
                swal('删除失败: ' + result.message);
            }
        },
        error: function(xhr, status, error) {
            $('#deleteOrderBtn').prop('disabled', false).html('<i class="bi bi-trash"></i> 删除');
            swal('请求失败: ' + error);
        }
    });
}

// 检查合同号是否已存在
function checkContractNumberExists() {
    var contractNumber = currentDetailData.htbh || '';
    if (!contractNumber) {
        swal('合同编号为空，无法进行检查');
        $('#saveToOrderDetailBtn').prop('disabled', false).html('<i class="bi bi-save"></i> 录库');
        return;
    }

    $.ajax({
        url: '/xiadan/checkContractNumber',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            ddh: contractNumber
        }),
        success: function(result) {
            if (result.success) {
                if (result.exists) {
                    // 合同号已存在，不允许录库
                    swal('订单明细表中已存在合同编号为 "' + contractNumber + '" 的记录，不予录库');
                    $('#saveToOrderDetailBtn').prop('disabled', false).html('<i class="bi bi-save"></i> 录库');
                } else {
                    // 合同号不存在，继续录库操作
                    proceedWithSaveToOrderDetail();
                }
            } else {
                swal('检查合同号失败: ' + result.message);
                $('#saveToOrderDetailBtn').prop('disabled', false).html('<i class="bi bi-save"></i> 录库');
            }
        },
        error: function(xhr, status, error) {
            swal('检查合同号请求失败: ' + error);
            $('#saveToOrderDetailBtn').prop('disabled', false).html('<i class="bi bi-save"></i> 录库');
        }
    });
}

// 继续执行录库操作
function proceedWithSaveToOrderDetail() {
    // 验证产品单位数据是否已加载
    if (!chanpindanwei || chanpindanwei.length === 0) {
        swal('产品单位数据未加载，请稍后重试');
        $('#saveToOrderDetailBtn').prop('disabled', false).html('<i class="bi bi-save"></i> 录库');
        return;
    }

    // 获取产品列表
    var products = getProductListFromCurrentData();

    console.log('获取到的产品数据:', products);
    console.log('产品数量:', products.length);

    if (products.length === 0) {
        swal('未找到产品数据，请检查订单详情');
        $('#saveToOrderDetailBtn').prop('disabled', false).html('<i class="bi bi-save"></i> 录库');
        return;
    }

    // 获取部门信息 - 使用打印单部门获取数据的方式
    var department = getDepartmentForOrder();

    // 为每个产品构建保存数据
    var saveDataArray = [];
    var missingUnits = []; // 记录找不到单位的产品

    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        var productName = product.pp || product.cp || ''; // 产品名称

        if (!productName) {
            console.warn(`第 ${i + 1} 个产品没有名称`, product);
            continue; // 跳过没有名称的产品
        }

        var productUnit = getUnitByProduct(productName);

        console.log(`产品 ${i + 1}:`, productName, '单位:', productUnit);

        if (!productUnit) {
            missingUnits.push(productName);
            continue; // 继续处理其他产品，而不是立即返回
        }

        var saveData = {
            // 主键由数据库自增
            xh: (i + 1).toString(), // 序号
            ddrq: currentDetailData.ddrq || '', // 订单日期
            ddh: currentDetailData.htbh || currentDetailData.ddh || '', // 订单号
            khjc: currentDetailData.khcm || currentDetailData.khjc || '', // 客户简称
            ggxh: product.cpxh || product.ggxh || '', // 规格型号（使用产品型号）
            pm: productName, // 产品名称
            dw: productUnit, // 单位
            sl: product.sl || '', // 数量
            dj: product.dj || '', // 单价
            zj: product.je || product.zj || '', // 总价
            fzr: currentDetailData.fzr || '', // 负责人
            bm: department || currentDetailData.bm || '', // 部门 - 使用打印单部门获取方式
            lxr: currentDetailData.lxr || '', // 联系人
            lxdh: currentDetailData.lxdh || '', // 联系电话
            tcd: '', // 提成点 - 空缺
            khmc: currentDetailData.khcm || currentDetailData.khmc || '', // 客户名称
            kpsj: '', // 开票时间 - 空缺
            yingfu: '', // 应付 - 空缺
            yifu: '', // 已付 - 空缺
            wf: '', // 未付 - 空缺
            sfkp: currentDetailData.kpzt || '', // 开票状态
            scgd: product.scgd || productWorkOrders[i.toString()] || '', // 生产工单 - 空缺
            bz: product.bz || '', // 备注
            wldh: '', // 物流单号 - 空缺
            yfsj: currentDetailData.hj || '', // 已付款金额
            zk: '', // 折扣 - 空缺
            fhsj: '待发货' // 发货时间
        };

        saveDataArray.push(saveData);
    }

    // 检查是否有找不到单位的产品
    if (missingUnits.length > 0) {
        var missingList = missingUnits.join('、');
        if (saveDataArray.length === 0) {
            // 所有产品都找不到单位
            swal('以下产品未找到对应的单位：' + missingList + '\n请先添加这些产品的单位信息');
            $('#saveToOrderDetailBtn').prop('disabled', false).html('<i class="bi bi-save"></i> 录库');
            return;
        } else {
            // 部分产品找不到单位，询问是否继续
            if (!confirm('以下产品未找到对应的单位：' + missingList + '\n是否继续保存其他产品？')) {
                $('#saveToOrderDetailBtn').prop('disabled', false).html('<i class="bi bi-save"></i> 录库');
                return;
            }
        }
    }

    if (saveDataArray.length === 0) {
        swal('没有有效的数据可以保存');
        $('#saveToOrderDetailBtn').prop('disabled', false).html('<i class="bi bi-save"></i> 录库');
        return;
    }

    console.log('最终要保存的数据:', saveDataArray);

    // 一次性发送所有数据到后端
    $.ajax({
        url: '/xiadan/saveToOrderDetail',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(saveDataArray),
        success: function(result) {
            if (result.success) {
                // 录库成功，更新生产工单状态
                updateProductionOrderStatus();
            } else {
                $('#saveToOrderDetailBtn').prop('disabled', false).html('<i class="bi bi-save"></i> 录库');
                swal('录库失败: ' + result.message);
                console.error('后端返回错误:', result);
            }
        },
        error: function(xhr, status, error) {
            $('#saveToOrderDetailBtn').prop('disabled', false).html('<i class="bi bi-save"></i> 录库');
            swal('请求失败: ' + error);
            console.error('请求错误详情:', xhr.responseText);
        }
    });
}

// 更新生产工单状态
function updateProductionOrderStatus() {
    $.ajax({
        url: '/xiadan/updateProductionOrderStatus',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            id: currentId,
            zt: '已下单'
        }),
        success: function(result) {
            $('#saveToOrderDetailBtn').prop('disabled', false).html('<i class="bi bi-save"></i> 录库');

            if (result.success) {
                // 关闭模态框
                $('#detailModal').modal('hide');
                // 刷新数据列表
                getList(currentPage, pageSize, getSearchParams());
            } else {
                swal('录库成功，但下单明细数据清除失败: ' + result.message);
                // 即使状态更新失败，也关闭模态框和刷新数据
                $('#detailModal').modal('hide');
                getList(currentPage, pageSize, getSearchParams());
            }
        },
        error: function(xhr, status, error) {
            $('#saveToOrderDetailBtn').prop('disabled', false).html('<i class="bi bi-save"></i> 录库');
            swal('录库成功，但下单明细数据清除失败: ' + error);
            // 即使状态更新失败，也关闭模态框和刷新数据
            $('#detailModal').modal('hide');
            getList(currentPage, pageSize, getSearchParams());
        }
    });
}

function getDepartmentForOrder() {
    // 方式1: 从部门映射表中获取
    if (departmentMap && departmentMap[currentId]) {
        return departmentMap[currentId];
    }

    // 方式2: 从当前详情数据中获取
    if (currentDetailData && currentDetailData.bm) {
        return currentDetailData.bm;
    }

    // 方式3: 从选中的行数据中获取（模拟打印单的方式）
    var selectedRow = getSelectedRow();
    if (selectedRow && selectedRow.bm) {
        return selectedRow.bm;
    }

    // 方式4: 从表格中查找当前订单的部门信息
    var department = findDepartmentFromTable(currentId);
    if (department) {
        return department;
    }

    console.warn('未找到部门信息，使用默认值');
    return ''; // 返回空字符串
}

// 从表格中查找部门信息
function findDepartmentFromTable(orderId) {
    var department = '';
    $('#khzlTable tbody tr').each(function() {
        if ($(this).data('id') === orderId) {
            // 假设部门信息存储在某个隐藏字段或数据属性中
            var rowData = $(this).data();
            if (rowData && rowData.bm) {
                department = rowData.bm;
                return false; // 退出循环
            }
        }
    });
    return department;
}

// 根据你的数据结构获取产品列表
function getProductListFromCurrentData() {
    if (!currentDetailData) {
        console.warn('currentDetailData 为空');
        return [];
    }

    console.log('currentDetailData 结构:', currentDetailData);

    var products = [];

    // 检查是否有逗号分隔的产品数据
    if (currentDetailData.pp && currentDetailData.cpxh) {
        var ppArray = currentDetailData.pp.split('|||');
        var cpxhArray = currentDetailData.cpxh.split('|||');
        var slArray = currentDetailData.sl ? currentDetailData.sl.split('|||') : [];
        var djArray = currentDetailData.dj ? currentDetailData.dj.split('|||') : [];
        var scgdArray = currentDetailData.scgd ? currentDetailData.scgd.split('|||') : [];
        var bzArray = currentDetailData.bz ? currentDetailData.bz.split('|||') : [];
        var jeArray = []; // 计算金额

        // 计算每个产品的金额
        for (var i = 0; i < ppArray.length; i++) {
            var sl = slArray[i] ? parseFloat(slArray[i]) : 0;
            var dj = djArray[i] ? parseFloat(djArray[i]) : 0;
            var je = (sl * dj).toFixed(2);
            jeArray.push(je);
        }

        // 构建产品对象数组
        for (var i = 0; i < ppArray.length; i++) {
            var product = {
                pp: ppArray[i] || '', // 产品名称
                cpxh: cpxhArray[i] || '', // 产品型号
                sl: slArray[i] || '', // 数量
                dj: djArray[i] || '', // 单价
                je: jeArray[i] || '', // 金额
                ggxh: cpxhArray[i] || '', // 规格型号（使用产品型号）
                scgd: scgdArray[i] || '', // 生产工单
                bz: bzArray[i] || '' // 备注
            };
            products.push(product);
        }

        console.log('解析出的产品列表:', products);
        return products;
    }

    // 如果是以对象数组形式存在
    if (currentDetailData.products && Array.isArray(currentDetailData.products)) {
        return currentDetailData.products;
    } else if (currentDetailData.productList && Array.isArray(currentDetailData.productList)) {
        return currentDetailData.productList;
    } else if (currentDetailData.details && Array.isArray(currentDetailData.details)) {
        return currentDetailData.details;
    } else {
        // 如果产品数据是平铺在对象中的
        for (var i = 1; i <= 3; i++) {
            var productKey = 'product' + i;
            if (currentDetailData[productKey] && currentDetailData[productKey].pp) {
                products.push(currentDetailData[productKey]);
            }
        }

        if (products.length === 0) {
            console.warn('未找到产品数据，currentDetailData 结构:', currentDetailData);
        }

        return products;
    }
}


// 根据产品名称获取单位的函数
function getUnitByProduct(productName) {
    if (!chanpindanwei || chanpindanwei.length === 0) {
        console.warn('产品单位数据未加载');
        console.log('chanpindanwei:', chanpindanwei);
        return null;
    }

    console.log('查找产品单位:', productName);
    console.log('可用的产品单位数据:', chanpindanwei);

    // 在 chanpindanwei 数组中查找匹配的产品，添加空值检查
    const product = chanpindanwei.find(item => {
        // 检查 item 是否为 null 或 undefined
        if (!item) {
            console.warn('发现空的 item:', item);
            return false;
        }
        // 检查 item.chanpinmingcheng 是否存在
        if (!item.chanpinmingcheng) {
            console.warn('发现没有 chanpinmingcheng 的 item:', item);
            return false;
        }
        // 精确匹配产品名称
        return item.chanpinmingcheng.trim() === productName.trim();
    });

    console.log('找到的产品单位信息:', product);

    return product ? product.danwei : null;
}

function validateAndCleanProductUnitData() {
    if (!chanpindanwei || !Array.isArray(chanpindanwei)) {
        console.warn('产品单位数据无效');
        return;
    }

    // 过滤掉无效的数据
    const validData = chanpindanwei.filter(item => {
        return item &&
            item.chanpinmingcheng &&
            typeof item.chanpinmingcheng === 'string' &&
            item.chanpinmingcheng.trim() !== '' &&
            item.danwei && // 确保单位也存在
            typeof item.danwei === 'string' &&
            item.danwei.trim() !== '';
    });

    console.log('原始数据数量:', chanpindanwei.length);
    console.log('有效数据数量:', validData.length);
    console.log('过滤掉的数据数量:', chanpindanwei.length - validData.length);

    // 显示被过滤的数据
    const invalidData = chanpindanwei.filter(item => !validData.includes(item));
    if (invalidData.length > 0) {
        console.warn('被过滤的无效数据:', invalidData);
    }

    if (validData.length !== chanpindanwei.length) {
        console.warn('发现无效的产品单位数据，已自动过滤');
        chanpindanwei = validData;
    }
}


// 添加驳回订单函数
function rejectOrder() {
    if (!currentId) {
        swal('无法获取订单ID');
        return;
    }

    if (!confirm('确定要驳回此订单吗？')) {
        return;
    }

    // 显示加载中
    $('#rejectBtn').prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> 处理中...');

    $.ajax({
        url: '/xiadan/rejectOrder',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            id: currentId
        }),
        success: function(result) {
            $('#rejectBtn').prop('disabled', false).html('<i class="bi bi-x-circle"></i> 驳回');

            if (result.success) {
                swal('订单驳回成功');
                // 关闭模态框
                $('#detailModal').modal('hide');
                // 刷新数据列表
                getList(currentPage, pageSize, getSearchParams());
            } else {
                swal('驳回失败: ' + result.message);
            }
        },
        error: function(xhr, status, error) {
            $('#rejectBtn').prop('disabled', false).html('<i class="bi bi-x-circle"></i> 驳回');
            swal('请求失败: ' + error);
        }
    });
}

// 获取搜索参数
function getSearchParams() {
    return {
        khcm: $('#khcm').val() || '',
        lxr: $('#lxr').val() || '',
        fzr: $('#fzr').val() || '',
        kpzt: $('#kpzt').val() || '',
        startDate: $('#startDate').val() || '',
        endDate: $('#endDate').val() || ''
    };
}

// 获取数据列表
// function getList(page, size, searchParams) {
//     currentPage = page || currentPage;
//     pageSize = size || pageSize;
//     searchParams = searchParams || {};
//
//     showLoading();
//
//     $ajax({
//         type: 'post',
//         url: '/xiadan/list',
//         contentType: 'application/json',
//         data: JSON.stringify({
//             pageNum: currentPage,
//             pageSize: pageSize,
//             khcm: searchParams.khcm || '',
//             lxr: searchParams.lxr || '',
//             fzr: searchParams.fzr || '',
//             kpzt: searchParams.kpzt || '',
//             startDate: searchParams.startDate || '',
//             endDate: searchParams.endDate || ''
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
function getList(page, size, searchParams) {
    currentPage = page || currentPage;
    pageSize = size || pageSize;
    searchParams = searchParams || {};

    showLoading();

    $ajax({
        type: 'post',
        url: '/xiadan/list',
        contentType: 'application/json',
        data: JSON.stringify({
            pageNum: currentPage,
            pageSize: pageSize,
            khcm: searchParams.khcm || '',
            lxr: searchParams.lxr || '',
            fzr: searchParams.fzr || '',
            kpzt: searchParams.kpzt || '',
            startDate: searchParams.startDate || '',
            endDate: searchParams.endDate || ''
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
            getFilteredStatistics(searchParams);
        } else {
            console.error("查询失败:", res.message);
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
    $('#khzlTable').html('<tr><td colspan="11" style="text-align: center; padding: 20px;">加载中...</td></tr>');
}

// 隐藏加载中
function hideLoading() {
    // 加载完成后的处理
}

// 搜索功能
function searchKhxx() {
    var searchParams = getSearchParams();

    // 添加排序参数
    searchParams.sortField = currentSortField;
    searchParams.sortOrder = currentSortOrder;

    currentPage = 1;
    getList(currentPage, pageSize, searchParams);
}

// 填充表格
// function fillTable(data) {
//     $('#khzlTable').empty();
//
//     // 清空并重新填充部门映射表
//     departmentMap = {};
//
//     // 重置统计变量（使用全局变量）
//     window.totalAmount = 0;
//     window.uninvoicedCount = 0;
//     window.invoicedCount = 0;
//     window.noInvoiceCount = 0;
//
//     var tableHeader = `
//         <thead>
//             <tr>
//                 <th width="280">客户名称</th>
//                 <th width="120">联系人</th>
//                 <th width="120">联系电话</th>
//                 <th width="120">订单日期</th>
//                 <th width="120">合计金额</th>
//                 <th width="120">负责人</th>
//                 <th width="150">合同编号</th>
//                 <th width="120">购方要求</th>
//                 <th width="80">开票状态</th>
//                 <th width="150">操作</th> <!-- 增加宽度 -->
//             </tr>
//         </thead>
//     `;
//
//     var tableBody = '<tbody>';
//
//     if (data && data.length > 0) {
//         data.forEach(function(item, index) {
//             // 保存部门信息到映射表
//             if (item.id && item.bm) {
//                 departmentMap[item.id] = item.bm;
//             }
//
//             // 计算统计信息 - 使用全局变量
//             var amount = parseFloat(item.hj) || 0;
//             window.totalAmount += amount;
//
//             var invoiceStatus = item.kpzt || '';
//             switch(invoiceStatus) {
//                 case '未开票':
//                     window.uninvoicedCount++;
//                     break;
//                 case '已开票':
//                     window.invoicedCount++;
//                     break;
//                 case '不开票':
//                     window.noInvoiceCount++;
//                     break;
//                 default:
//                     // 如果开票状态为空或其他值，计入未开票
//                     window.uninvoicedCount++;
//                     break;
//             }
//
//             tableBody += `
//                 <tr data-id="${item.id}">
//                     <td>${item.khcm || ''}</td>
//                     <td>${item.lxr || ''}</td>
//                     <td>${item.lxdh || ''}</td>
//                     <td>${item.ddrq || ''}</td>
//                     <td>${formatNumber(item.hj)}</td>
//                     <td>${item.fzr || ''}</td>
//                     <td>${item.htbh || ''}</td>
//                     <td>${item.yq || ''}</td>
//                     <td>${item.kpzt || ''}</td>
//                     <td>
//                         <button class="btn btn-sm btn-info detail-btn"
//                                 data-id="${item.id}"
//                                 data-htbh="${item.htbh || ''}">
//                             <i class="bi bi-eye"></i> 详情
//                         </button>
//
//                     </td>
//                 </tr>
//             `;
//         });
//
//         // 更新统计显示
//         updateStatistics(window.totalAmount, window.uninvoicedCount, window.invoicedCount, window.noInvoiceCount);
//         $('#statisticsContainer').show();
//     } else {
//         tableBody += `
//             <tr>
//                 <td colspan="11" style="text-align: center; color: #999;">暂无客户数据</td>
//             </tr>
//         `;
//         // 没有数据时重置统计显示
//         updateStatistics(0, 0, 0, 0);
//         $('#statisticsContainer').show(); // 即使没有数据也显示统计区域，但显示0值
//     }
//
//     tableBody += '</tbody>';
//     $('#khzlTable').html(tableHeader + tableBody);
//     addRowClickEvent();
//     bindDetailButtonEvents();
//     bindDeleteButtonEvents(); // 绑定删除按钮事件
// }
// 填充表格
function fillTable(data) {
    $('#khzlTable').empty();

    // 清空并重新填充部门映射表
    departmentMap = {};

    // 移除这里的统计计算逻辑，保持表格填充功能
    // 统计现在由 calculateTotalStatistics 函数处理

    var tableHeader = `
        <thead>
            <tr>
                <th width="280">客户名称</th>
                <th width="120">联系人</th>
                <th width="120">联系电话</th>
                <th width="120">订单日期</th>
                <th width="120">合计金额</th>
                <th width="120">负责人</th>
                <th width="150">合同编号</th>
                <th width="120">购方要求</th>
                <th width="80">开票状态</th>
                <th width="150">操作</th>
            </tr>
        </thead>
    `;

    var tableBody = '<tbody>';

    if (data && data.length > 0) {
        data.forEach(function(item, index) {
            // 保存部门信息到映射表
            if (item.id && item.bm) {
                departmentMap[item.id] = item.bm;
            }

            tableBody += `
                <tr data-id="${item.id}">
                    <td>${item.khcm || ''}</td>
                    <td>${item.lxr || ''}</td>
                    <td>${item.lxdh || ''}</td>
                    <td>${item.ddrq || ''}</td>
                    <td>${formatNumber(item.hj)}</td>
                    <td>${item.fzr || ''}</td>
                    <td>${item.htbh || ''}</td>
                    <td>${item.yq || ''}</td>
                    <td>${item.kpzt || ''}</td>
                    <td>
                        <button class="btn btn-sm btn-info detail-btn" 
                                data-id="${item.id}" 
                                data-htbh="${item.htbh || ''}">
                            <i class="bi bi-eye"></i> 详情
                        </button>
                    </td>
                </tr>
            `;
        });

        // 统计显示已经由 calculateTotalStatistics 函数处理
        // 这里不再更新统计
    } else {
        tableBody += `
            <tr>
                <td colspan="11" style="text-align: center; color: #999;">暂无客户数据</td>
            </tr>
        `;
        // 没有数据时重置统计显示为0
        updateStatistics(0, 0, 0, 0);
    }

    tableBody += '</tbody>';
    $('#khzlTable').html(tableHeader + tableBody);
    addRowClickEvent();
    bindDetailButtonEvents();
}
// 添加格式化数字的函数
function formatNumber(value) {
    if (!value) return '0.00';

    var num = parseFloat(value);
    if (isNaN(num)) return '0.00';

    return num.toFixed(2);
}

// 新增：更新统计显示函数
function updateStatistics(totalAmount, uninvoicedCount, invoicedCount, noInvoiceCount) {
    console.log('更新统计显示:', totalAmount, uninvoicedCount, invoicedCount, noInvoiceCount);

    // 确保元素存在
    if ($('#totalAmount').length > 0) {
        // 格式化金额显示，保留两位小数
        var formattedAmount = parseFloat(totalAmount).toFixed(2);
        $('#totalAmount').text(formattedAmount);
        $('#uninvoicedCount').text(uninvoicedCount || 0);
        $('#invoicedCount').text(invoicedCount || 0);
        $('#noInvoiceCount').text(noInvoiceCount || 0);

        console.log('更新后的显示值:', {
            totalAmount: formattedAmount,
            uninvoicedCount: uninvoicedCount,
            invoicedCount: invoicedCount,
            noInvoiceCount: noInvoiceCount
        });
    } else {
        console.warn('统计显示元素不存在');
    }
}

// 绑定删除按钮事件
function bindDeleteButtonEvents() {
    $('.delete-btn').off('click').on('click', function(e) {
        e.stopPropagation();
        var id = $(this).data('id');
        var khcm = $(this).data('khcm');
        deleteOrder(id, khcm);
    });
}

// 绑定详情按钮事件
function bindDetailButtonEvents() {
    $('.detail-btn').off('click').on('click', function(e) {
        e.stopPropagation();
        var id = $(this).data('id');
        var htbh = $(this).data('htbh');
        showDetailModal(id, htbh);
    });
}

// 删除订单函数
function deleteOrder(id, khcm) {
    if (!id) {
        swal('无法获取订单ID');
        return;
    }

    var confirmMessage = '确定要删除客户 "' + (khcm || '该订单') + '" 的订单吗？';

    if (!confirm(confirmMessage)) {
        return;
    }

    // 显示加载中
    var deleteBtn = $('.delete-btn[data-id="' + id + '"]');
    var originalHtml = deleteBtn.html();
    deleteBtn.prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> 删除中...');

    $.ajax({
        url: '/xiadan/deletezt',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            id: id
        }),
        success: function(result) {
            deleteBtn.prop('disabled', false).html(originalHtml);

            if (result.success) {
                swal('订单删除成功');
                // 刷新数据列表
                getList(currentPage, pageSize, getSearchParams());
            } else {
                swal('删除失败: ' + result.message);
            }
        },
        error: function(xhr, status, error) {
            deleteBtn.prop('disabled', false).html(originalHtml);
            swal('请求失败: ' + error);
        }
    });
}

// 显示详情模态框
function showDetailModal(id, htbh) {
    currentId = id;
    currentHtbh = htbh;
    selectedWorkOrders = []; // 重置选中的工单
    productWorkOrders = {}; // 重置工单号
    productPrintCounts = {}; // 重置打印次数
    currentDetailData = null; // 重置详情数据

    fillBasicInfo(id);
    updateSelectedCountDisplay();

    if (id) {
        getDetailInfo(id);
    }

    $('#detailModal').modal('show');
}

// 获取详细信息
function getDetailInfo(id) {
    if (!id) {
        console.error('无效的ID');
        return;
    }

    showLoading();

    $ajax({
        type: 'post',
        url: '/xiadan/detail',
        contentType: 'application/json',
        data: JSON.stringify({ id: id }),
        dataType: 'json'
    }, false, '', function (res) {
        hideLoading();
        if (res.success) {
            console.log("返回的详细信息", res.data);

            // 保存详情数据
            currentDetailData = res.data;

            // 确保从后端获取工单号和打印次数
            initProductDataFromDB(res.data);

            // 生成详细信息表单
            generateDetailForm(res.data);

            // 更新选中数量显示
            updateSelectedCountDisplay();

        } else {
            console.error("获取详情失败:", res.message);
            $('#detailFormContainer').html('<p class="text-danger">获取详情失败: ' + res.message + '</p>');
        }
    });
}


// 从数据库初始化产品数据
function initProductDataFromDB(data) {
    if (!data || !data.pp || !data.cpxh) return;

    var ppArray = data.pp.split('|||');

    // 如果有数据库中的工单号，使用数据库的值
    var workOrderArray = [];
    if (data.scgd) {
        workOrderArray = data.scgd.split('|||');
    }

    // 获取货期数据（如果有的话）
    var hqArray = [];
    if (data.hq) {
        hqArray = data.hq.split('|||');
        console.log('从数据库获取的货期数据:', hqArray);
    }

    for (var i = 0; i < ppArray.length; i++) {
        var productKey = i.toString();

        // 工单号
        productWorkOrders[productKey] = workOrderArray[i] || '';

        // 货期（新增）- 从数据库获取
        if (hqArray[i] && hqArray[i].trim() !== '') {
            productHq[productKey] = hqArray[i];
        } else {
            productHq[productKey] = ''; // 如果没有货期，设为空
        }

        console.log(`产品 ${i} (${ppArray[i]}) 的工单号: ${productWorkOrders[productKey]}, 货期: ${productHq[productKey]}`);
    }

    // 初始化打印次数
    if (data.printCount) {
        var printCountArray = data.printCount.split('|||');
        for (var i = 0; i < ppArray.length; i++) {
            var productKey = i.toString();
            productPrintCounts[productKey] = printCountArray[i] || "0";
        }
    } else {
        for (var i = 0; i < ppArray.length; i++) {
            var productKey = i.toString();
            productPrintCounts[productKey] = "0";
        }
    }

    console.log('从数据库初始化工单号完成:', productWorkOrders);
    console.log('从数据库初始化货期完成:', productHq);
}

function generateWorkOrderNumber() {
    var today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    var storageKey = 'workOrderSequence_' + today;

    // 获取当前序列号，如果不存在或小于0，则从0开始
    var sequence = parseInt(localStorage.getItem(storageKey));
    if (isNaN(sequence) || sequence < 0) {
        sequence = 1;
    }

    // 生成工单号（格式：GD + 日期 + 3位序号）
    var workOrderNumber = 'GD' + today + String(sequence).padStart(3, '0');

    // 递增序列号并保存
    sequence++;
    localStorage.setItem(storageKey, sequence.toString());

    console.log('生成新工单号:', workOrderNumber, '，下一序号:', sequence);
    return workOrderNumber;
}

// 修改初始化函数，确保每天从001开始
function resetDailySequence() {
    var today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    var storageKey = 'workOrderSequence_' + today;
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var yesterdayKey = 'workOrderSequence_' + yesterday.toISOString().split('T')[0].replace(/-/g, '');

    // 检查是否是新的日期
    var currentSequence = localStorage.getItem(storageKey);
    var yesterdaySequence = localStorage.getItem(yesterdayKey);

    // 如果是新的一天，重置序列号为1
    if (!currentSequence) {
        localStorage.setItem(storageKey, '1');
        console.log('新的一天，初始化今日序列号为1');
    } else {
        console.log('今日序列号:', currentSequence);
    }

    // 可选：清理前一天的序列号
    if (yesterdaySequence) {
        localStorage.removeItem(yesterdayKey);
        console.log('清理昨日序列号');
    }
}

// 填充基础信息
function fillBasicInfo(id) {
    var rowData = null;
    $('#khzlTable tbody tr').each(function() {
        if ($(this).data('id') === id) {
            rowData = {
                khcm: $(this).find('td:eq(0)').text().trim(),
                lxr: $(this).find('td:eq(1)').text().trim(),
                lxdh: $(this).find('td:eq(2)').text().trim(),
                ddrq: $(this).find('td:eq(3)').text().trim(),
                hj: $(this).find('td:eq(4)').text().trim(),
                fzr: $(this).find('td:eq(5)').text().trim(),
                htbh: $(this).find('td:eq(6)').text().trim(),
                yq: $(this).find('td:eq(7)').text().trim(),
                kpzt: $(this).find('td:eq(8)').text().trim()
            };
            return false;
        }
    });

    if (rowData) {
        var basicInfoHtml = `
            <div class="col-md-4">
                <label><strong>客户名称：</strong></label>
                <span>${rowData.khcm}</span>
            </div>
            <div class="col-md-4">
                <label><strong>联系人：</strong></label>
                <span>${rowData.lxr}</span>
            </div>
            <div class="col-md-4">
                <label><strong>联系电话：</strong></label>
                <span>${rowData.lxdh}</span>
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
                <label><strong>负责人：</strong></label>
                <span>${rowData.fzr}</span>
            </div>
            <div class="col-md-4">
                <label><strong>合同编号：</strong></label>
                <span>${rowData.htbh}</span>
            </div>
            <div class="col-md-4">
                <label><strong>购方要求：</strong></label>
                <span>${rowData.yq}</span>
            </div>
            <div class="col-md-4">
                <label><strong>开票状态：</strong></label>
                <span>${rowData.kpzt}</span>
            </div>
        `;
        $('#basicInfo').html(basicInfoHtml);
    }
}

// 生成详细信息表单
function generateDetailForm(data) {
    var formHtml = '';

    if (data && data.pp && data.cpxh && data.sl && data.dj) {
        var ppArray = data.pp.split('|||');
        var cpxhArray = data.cpxh.split('|||');
        var slArray = data.sl.split('|||');
        var djArray = data.dj.split('|||');
        var bzArray = data.bz ? data.bz.split('|||') : [];

        var maxLength = Math.max(ppArray.length, cpxhArray.length, slArray.length, djArray.length);

        formHtml = `
            <div class="table-responsive">
                <div class="select-all-container" style="margin-bottom: 10px;">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="selectAllProducts">
                        <label class="form-check-label" for="selectAllProducts" style="font-weight: bold; color: #2196f3;">
                            <i class="bi bi-check-square"></i> 全选/取消全选
                        </label>
                        <span id="selectedInfo" style="margin-left: 15px; color: #666;">
                            <span id="selectedCount">0</span>/<span id="totalCount">${maxLength}</span> 个产品
                        </span>
                    </div>
                </div>
                <table class="table table-bordered table-striped detail-table">
                    <thead>
                        <tr>
                            <th width="40">选择</th>
                            <th width="60">序号</th>
                            <th width="150">产品名称</th>
                            <th width="120">产品型号</th>
                            <th width="100">订购数量</th>
                            <th width="100">含税单价</th>
                            <th width="150">生产工单</th>
                            <th width="120">货期</th> <!-- 新增货期列 -->
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

            var productKey = i.toString();
            var isChecked = selectedWorkOrders.includes(productKey) ? 'checked' : '';
            var workOrder = productWorkOrders[productKey] || '';
            var hq = productHq[productKey] || ''; // 获取货期

            formHtml += `
                        <tr class="product-row" data-index="${i}">
                            <td style="text-align: center;">
                                <input type="checkbox" class="form-check-input product-radio" 
                                       name="productSelect" data-index="${i}" ${isChecked}>
                            </td>
                            <td style="text-align: center;">${i + 1}</td>
                            <td>${pp}</td>
                            <td>${cpxh}</td>
                            <td style="text-align: right;">${sl}</td>
                            <td style="text-align: right;">${dj.toFixed(2)}</td>
                            <td style="text-align: center;">
                                <span class="work-order-number">${workOrder}</span>
                            </td>
                            <td style="text-align: center; font-weight: bold; color: #1890ff;">
                                <span class="hq-display" data-index="${i}">${hq}</span>
                            </td>
                            <td style="text-align: right; font-weight: bold;">${subtotal.toFixed(2)}</td>
                            <td>${bz}</td>
                        </tr>`;
        }

        formHtml += `
                        <tr>
                            <td colspan="8" style="text-align: right; font-weight: bold;">合计金额：</td>
                            <td style="text-align: right; font-weight: bold; color: #ff6b35;">${totalAmount.toFixed(2)}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>`;

        // 添加样式
        if (!$('#detail-table-styles').length) {
            $('<style id="detail-table-styles">')
                .prop('type', 'text/css')
                .html(`
                    .detail-table {
                        font-size: 14px;
                        margin-top: 10px;
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
                    .product-row.selected {
                        background-color: #e3f2fd !important;
                    }
                    .work-order-number {
                        font-family: 'Courier New', monospace;
                        font-weight: bold;
                        color: #2196f3;
                    }
                    .product-radio {
                        transform: scale(1.2);
                    }
                    .select-all-container {
                        background-color: #f8f9fa;
                        padding: 8px 15px;
                        border-radius: 4px;
                        border: 1px solid #dee2e6;
                    }
                    #selectedInfo {
                        font-size: 14px;
                    }
                    #selectedCount {
                        font-weight: bold;
                        color: #2196f3;
                    }
                    #totalCount {
                        font-weight: bold;
                    }
                    .hq-display {
                        font-weight: bold;
                        color: #1890ff;
                        padding: 4px 8px;
                        font-size: 13px;
                        background-color: #f8f9fa;
                        border-radius: 4px;
                        display: inline-block;
                        min-width: 80px;
                    }
                `)
                .appendTo('head');
        }
    } else {
        formHtml = '<p class="text-muted">暂无产品详细信息</p>';
    }

    $('#detailFormContainer').html(formHtml);

    // 初始化全选状态
    updateSelectAllCheckbox();

    // 绑定单选按钮事件
    bindProductRadioEvents();

    // 绑定全选复选框事件
    bindSelectAllEvents();
}

// 绑定全选复选框事件
function bindSelectAllEvents() {
    $('#selectAllProducts').off('change').on('change', function() {
        var isChecked = $(this).prop('checked');

        // 更新所有产品的复选框状态
        $('.product-radio').each(function() {
            var productIndex = $(this).data('index');
            var productKey = productIndex.toString();

            if (isChecked) {
                // 全选：如果不在选中数组中，则添加
                if (!selectedWorkOrders.includes(productKey)) {
                    selectedWorkOrders.push(productKey);
                }
            } else {
                // 取消全选：从选中数组中移除
                var index = selectedWorkOrders.indexOf(productKey);
                if (index > -1) {
                    selectedWorkOrders.splice(index, 1);
                }
            }

            // 更新复选框状态和行样式
            $(this).prop('checked', isChecked);
            var row = $(this).closest('.product-row');
            if (isChecked) {
                row.addClass('selected');
            } else {
                row.removeClass('selected');
            }
        });

        updateSelectedCountDisplay();
    });
}

// 更新全选复选框状态
function updateSelectAllCheckbox() {
    var totalProducts = $('.product-radio').length;
    var checkedProducts = $('.product-radio:checked').length;

    var selectAllCheckbox = $('#selectAllProducts');

    if (totalProducts === 0) {
        selectAllCheckbox.prop('checked', false);
        selectAllCheckbox.prop('disabled', true);
    } else if (checkedProducts === totalProducts) {
        selectAllCheckbox.prop('checked', true);
        selectAllCheckbox.prop('indeterminate', false);
    } else if (checkedProducts > 0) {
        selectAllCheckbox.prop('checked', false);
        selectAllCheckbox.prop('indeterminate', true);
    } else {
        selectAllCheckbox.prop('checked', false);
        selectAllCheckbox.prop('indeterminate', false);
    }
}

// 修改更新选中数量显示函数
function updateSelectedCountDisplay() {
    var selectedCount = selectedWorkOrders.length;
    var totalCount = $('.product-radio').length;

    // 更新数量显示
    $('#selectedCount').text(selectedCount);
    $('#totalCount').text(totalCount);

    // 更新全选复选框状态
    updateSelectAllCheckbox();

    // 更新打印按钮上的提示
    $('#selectedCountDisplay').text(selectedCount);

    // 如果选中了多个产品，显示提示信息
    if (selectedCount > 1) {
        $('#printHint').show().html(`已选择 <strong>${selectedCount}</strong> 个产品，将按选择顺序批量打印`);
    } else {
        $('#printHint').hide();
    }
}

function bindProductRadioEvents() {
    $('.product-radio').off('change').on('change', function() {
        var productIndex = $(this).data('index');
        var productKey = productIndex.toString();

        if ($(this).is(':checked')) {
            // 多选逻辑：添加当前选择到选中数组
            if (!selectedWorkOrders.includes(productKey)) {
                selectedWorkOrders.push(productKey);
            }
            $(this).closest('.product-row').addClass('selected');
        } else {
            // 取消选中
            var index = selectedWorkOrders.indexOf(productKey);
            if (index > -1) {
                selectedWorkOrders.splice(index, 1);
            }
            $(this).closest('.product-row').removeClass('selected');
        }

        updateSelectedCountDisplay();
    });

    // 绑定行点击事件
    $('.product-row').off('click').on('click', function(e) {
        if (!$(e.target).is('input[type="checkbox"]')) {
            var checkbox = $(this).find('.product-radio');
            checkbox.prop('checked', !checkbox.prop('checked')).trigger('change');
        }
    });
}

// 更新选中数量显示
function updateSelectedCountDisplay() {
    $('#selectedCount').text(selectedWorkOrders.length);

    // 如果选中了多个产品，显示提示信息
    if (selectedWorkOrders.length > 1) {
        $('#printHint').show().html(`已选择 <strong>${selectedWorkOrders.length}</strong> 个产品，将按选择顺序批量打印`);
    } else {
        $('#printHint').hide();
    }
}

// 获取选中行数据
function getSelectedRow() {
    // 如果当前有详情数据，直接从详情数据构造
    if (currentId && currentDetailData) {
        return {
            id: currentId,
            khcm: currentDetailData.khcm || '',
            lxr: currentDetailData.lxr || '',
            lxdh: currentDetailData.lxdh || '',
            ddrq: currentDetailData.ddrq || '',
            hj: currentDetailData.hj || '',
            fzr: currentDetailData.fzr || '',
            htbh: currentDetailData.htbh || '',
            yq: currentDetailData.yq || '',
            kpzt: currentDetailData.kpzt || '',
            zbz: currentDetailData.zbz || '',
            bm: currentDetailData.bm || departmentMap[currentId] || ''
        };
    }

    // 原有的表格行获取逻辑
    if (currentId) {
        var rowData = null;
        $('#khzlTable tbody tr').each(function() {
            if ($(this).data('id') === currentId) {
                rowData = {
                    id: currentId,
                    khcm: $(this).find('td:eq(0)').text().trim(),
                    lxr: $(this).find('td:eq(1)').text().trim(),
                    lxdh: $(this).find('td:eq(2)').text().trim(),
                    ddrq: $(this).find('td:eq(3)').text().trim(),
                    hj: $(this).find('td:eq(4)').text().trim(),
                    fzr: $(this).find('td:eq(5)').text().trim(),
                    htbh: $(this).find('td:eq(6)').text().trim(),
                    yq: $(this).find('td:eq(7)').text().trim(),
                    kpzt: $(this).find('td:eq(8)').text().trim(),
                    zbz: $(this).find('td:eq(9)').text().trim(),
                    bm: departmentMap[currentId] || ''
                };
                return false;
            }
        });
        return rowData;
    }
    return null;
}

// 批量打印选中的产品
// 批量打印选中的产品
function printSelectedProducts(rowData, selectedProductIndexes) {
    if (selectedProductIndexes.length === 0) {
        swal('请选择至少一个产品进行打印');
        return;
    }

    // 检查哪些选中的产品没有工单号
    var productsWithoutWorkOrder = [];
    selectedProductIndexes.forEach(function(productKey) {
        // 只处理没有工单号的产品（值为空或空字符串）
        if (!productWorkOrders[productKey] || productWorkOrders[productKey].trim() === '') {
            productsWithoutWorkOrder.push(productKey);
        }
    });

    console.log('需要生成工单号的产品:', productsWithoutWorkOrder);

    // 只为没有工单号的产品生成新的工单号
    if (productsWithoutWorkOrder.length > 0) {
        var newWorkOrderNumber = generateWorkOrderNumber();
        console.log('为新选中的产品生成统一工单号:', newWorkOrderNumber);

        // 为每个没有工单号的产品分配新工单号
        productsWithoutWorkOrder.forEach(function(productKey) {
            productWorkOrders[productKey] = newWorkOrderNumber;

            // 更新界面显示新生成的工单号
            $('.product-row[data-index="' + productKey + '"] .work-order-number').text(newWorkOrderNumber);
        });

        // 显示提示信息
        if (productsWithoutWorkOrder.length > 0) {
            console.log('为新选的 ' + productsWithoutWorkOrder.length + ' 个产品分配了工单号: ' + newWorkOrderNumber);
        }
    }

    // 如果有已存在工单号的产品，显示提示
    var existingWorkOrderCount = selectedProductIndexes.length - productsWithoutWorkOrder.length;
    if (existingWorkOrderCount > 0) {
        console.log(existingWorkOrderCount + ' 个产品已有工单号，保持原值');
    }

    // 保存工单号到数据库
    saveWorkOrdersAndPrintCounts(rowData.id);

    // 生成批量打印预览
    if (currentDetailData) {
        generateBatchPrintPreview(rowData, selectedProductIndexes);
    } else {
        fetchDetailAndGeneratePreview(rowData, selectedProductIndexes);
    }
}

// 辅助函数：获取详情并生成预览
function fetchDetailAndGeneratePreview(rowData, selectedProductIndexes) {
    $.ajax({
        url: '/xiadan/detail',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ id: rowData.id }),
        success: function(result) {
            if (result.success) {
                generateBatchPrintPreview(rowData, selectedProductIndexes);
            } else {
                swal('获取打印数据失败: ' + result.message);
            }
        },
        error: function(xhr, status, error) {
            swal('请求失败: ' + error);
        }
    });
}

// 打印单个产品
function printSingleProduct(rowData, productIndex) {
    var productKey = productIndex.toString();

    // 检查工单号，如果没有就生成新的
    if (!productWorkOrders[productKey] || productWorkOrders[productKey] === '') {
        productWorkOrders[productKey] = generateWorkOrderNumber();

        // 立即更新界面显示新生成的工单号
        $('.product-row[data-index="' + productKey + '"] .work-order-number').text(productWorkOrders[productKey]);
    }

    // 直接使用已加载的详情数据，避免重复请求
    if (currentDetailData) {
        // 更新打印次数
        updateProductPrintCount(productKey);

        // 生成打印内容
        generateSinglePrintContent(
            rowData,
            currentDetailData,
            parseInt(productIndex),
            productWorkOrders[productKey],
            productPrintCounts[productKey]
        );

        // 保存到数据库
        saveWorkOrdersAndPrintCounts(rowData.id);
    } else {
        // 如果没有详情数据，才重新请求
        $.ajax({
            url: '/xiadan/detail',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ id: rowData.id }),
            success: function(result) {
                if (result.success) {
                    // 更新打印次数
                    updateProductPrintCount(productKey);

                    // 生成打印内容
                    generateSinglePrintContent(
                        rowData,
                        result.data,
                        parseInt(productIndex),
                        productWorkOrders[productKey],
                        productPrintCounts[productKey]
                    );

                    // 保存到数据库
                    saveWorkOrdersAndPrintCounts(rowData.id);
                } else {
                    swal('获取打印数据失败: ' + result.message);
                }
            },
            error: function(xhr, status, error) {
                swal('请求失败: ' + error);
            }
        });
    }
}

function saveWorkOrdersAndPrintCounts(orderId) {
    var workOrdersArray = [];
    var printCountsArray = [];
    var hqArray = []; // 新增：货期数组

    // 确保遍历所有产品
    if (currentDetailData && currentDetailData.pp) {
        var ppArray = currentDetailData.pp.split('|||');

        for (var i = 0; i < ppArray.length; i++) {
            var key = i.toString();
            workOrdersArray.push(productWorkOrders[key] || '');
            printCountsArray.push(productPrintCounts[key] || '0');
            hqArray.push(productHq[key] || ''); // 保存货期
        }
    }

    var workOrdersString = workOrdersArray.join('|||');
    var printCountsString = printCountsArray.join('|||');
    var hqString = hqArray.join('|||'); // 货期字符串

    console.log('保存工单号:', workOrdersString);
    console.log('保存打印次数:', printCountsString);
    console.log('保存货期:', hqString);

    $.ajax({
        url: '/xiadan/saveWorkOrdersAndPrintCounts',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            id: orderId,
            scgd: workOrdersString,
            printCount: printCountsString,
            hq: hqString // 新增货期字段
        }),
        success: function(result) {
            if (result.success) {
                console.log('生产工单、打印次数和货期保存成功');
            } else {
                console.error('保存失败:', result.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('保存失败:', error);
        }
    });
}

// 更新产品打印次数
function updateProductPrintCount(productKey) {
    var currentCount = parseInt(productPrintCounts[productKey] || '0');
    productPrintCounts[productKey] = (currentCount + 1).toString();

    // 只更新数据，不更新界面（因为界面已经不显示打印次数）
    updateSelectedCountDisplay();
}

function generateSinglePrintContent(rowData, detailData, productIndex, workOrderNumber, printCount) {
    try {
        var printWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');

        if (!printWindow) {
            swal('打印窗口被浏览器拦截，请允许弹出窗口后重试。');
            return null;
        }

        var currentDate = new Date();
        var formattedDate = currentDate.getFullYear() + '/' +
            (currentDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
            currentDate.getDate().toString().padStart(2, '0');

        // 解析产品数据
        var ppArray = detailData.pp.split('|||');
        var cpxhArray = detailData.cpxh.split('|||');
        var slArray = detailData.sl.split('|||');
        var djArray = detailData.dj.split('|||');
        var bzArray = detailData.bz ? detailData.bz.split('|||') : [];

        // 获取当前产品的数据
        var currentProduct = {
            pp: ppArray[productIndex] || '',
            cpxh: cpxhArray[productIndex] || '',
            sl: slArray[productIndex] || '',
            dj: djArray[productIndex] || '',
            bz: bzArray[productIndex] || ''
        };

        // 获取收货地址
        var shippingAddress = detailData.shdz || '';

        // 获取当前产品的货期
        var productKey = productIndex.toString();
        var productHqValue = productHq[productKey] || '';

        var printContent = `
<!DOCTYPE html>
<html>
<head>
    <title>制造工单物控档 - ${currentProduct.pp}</title>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'SimSun', '宋体', serif; font-size: 16px; line-height: 1.4; color: #000; background: white; }
        .triple-form { width: 240mm; height: 140mm; border: 2px solid #000; margin: 0; padding: 0; background: white; }
        .form-header { text-align: center; font-size: 22px; font-weight: bold; padding: 8px 0; background-color: #f0f0f0; }
        .form-table { width: 100%; border-collapse: collapse; }
        .form-table td { border: 1px solid #000; padding: 6px 8px; vertical-align: top; height: 32px; }
        .label-cell { font-weight: bold; background-color: #f9f9f9; width: 80px; text-align: center; }
        .value-cell { background-color: white; }
        .large-cell { height: 40px; }
        .info-row { display: flex; justify-content: space-between; align-items: center; margin: 8px 0; padding: 0 15px; }
        .info-item { display: flex; align-items: center; font-size: 14px; }
        .info-label { font-weight: bold; margin-right: 5px; min-width: 70px; }
        .address-info { display: block; width: 100%; }
        .signature-area { display: flex; justify-content: space-between; margin-top: 10px; padding: 10px 15px; }
        .signature { text-align: center; display: flex; flex-direction: column; align-items: center; min-width: 100px; }
        .signature-label { font-weight: bold; margin-bottom: 5px; font-size: 14px; }
        
        @media print {
            @page { size: 240mm 140mm; margin: 0; padding: 0; }
            body { width: 240mm; height: 140mm; margin: 0; padding: 0; font-size: 16px; }
            .triple-form { width: 100%; height: 100%; border: 2px solid #000; page-break-after: always; }
        }
        
        @media screen {
            body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f5f5f5; }
            .triple-form { box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        }
    </style>
</head>
<body>
    <div class="triple-form">
        <div class="form-header">制造工单物控档</div>
        
        <div class="info-row">
            <div class="info-item"><span class="info-label">工单号：</span>${workOrderNumber}</div>
            <div class="info-item"><span class="info-label">日期：</span>${rowData.ddrq || ''}</div>
            <div class="info-item"><span class="info-label">部门：</span>${rowData.bm || ''}</div>
            <div class="info-item"><span class="info-label">订单号：</span>${rowData.htbh || ''}</div>
        </div>
        
        <div class="info-row">
            <div class="info-item"><span class="info-label">客户：</span>${rowData.khcm || ''}</div>
            <div class="info-item"><span class="info-label">业务员：</span>${rowData.fzr || ''}</div>
            <div class="info-item"><span class="info-label">电话：</span>${rowData.lxdh || ''}</div>
            <div class="info-item"><span class="info-label">货期：</span>${productHqValue}</div> <!-- 新增货期显示 -->
        </div>
        
        <div class="info-row">
            <div class="info-item"><span class="info-label">购方要求：</span>${rowData.yq || ''}</div>
        </div>
        
        <!-- 添加收货地址行 -->
        <div class="info-row">
            <div class="address-info">
                <span class="info-label">收货地址：</span>
                <span>${shippingAddress}</span>
            </div>
        </div>
        
        <table class="form-table">
            <tr>
                <th class="label-cell">工单号</th>
                <th class="label-cell">序号</th>
                <th class="label-cell">产品型号（cpxh）</th>
                <th class="label-cell">产品名称（pp）</th>
                <th class="label-cell">数量（sl）</th>
                <th class="label-cell">货期</th> <!-- 新增货期列 -->
                <th class="label-cell">备注（bz）</th>
            </tr>
            <tr>
                <td class="value-cell" style="text-align: center;">${workOrderNumber}</td>
                <td class="value-cell" style="text-align: center;">${productIndex + 1}</td>
                <td class="value-cell">${currentProduct.cpxh}</td>
                <td class="value-cell">${currentProduct.pp}</td>
                <td class="value-cell">${currentProduct.sl}</td>
                <td class="value-cell">${productHqValue}</td> <!-- 货期单元格 -->
                <td class="value-cell">${currentProduct.bz || rowData.zbz || ''}</td>
            </tr>
            <tr><td class="label-cell">品名</td><td class="value-cell" colspan="6">${currentProduct.pp}</td></tr>
            <tr><td class="label-cell">规格</td><td class="value-cell" colspan="6">${currentProduct.cpxh}</td></tr>
            <tr><td class="label-cell">客户</td><td class="value-cell" colspan="6">${rowData.khcm || ''}</td></tr>
            <tr><td class="label-cell">收货地址</td><td class="value-cell large-cell" colspan="6">${shippingAddress}</td></tr>
            <tr><td class="label-cell">备注</td><td class="value-cell large-cell" colspan="6">${currentProduct.bz || rowData.zbz || ''}</td></tr>
            <tr><td class="label-cell">购方要求</td><td class="value-cell large-cell" colspan="6">${rowData.yq || ''}</td></tr>
        </table>
        
        <div class="signature-area">
            <div class="signature"><div class="signature-label">制作：</div><div style="margin-top: 25px;"></div></div>
            <div class="signature"><div class="signature-label">审核：</div><div style="margin-top: 25px;"></div></div>
            <div class="signature"><div class="signature-label">入库：</div><div style="margin-top: 25px;"></div></div>
        </div>
        
        <div class="signature-area" style="border-top: none; margin-top: 0; padding-top: 5px;">
            <div class="signature"><div class="signature-label">工单日期：${formattedDate}</div></div>
            <div class="signature"><div class="signature-label">打印次数：${printCount}</div></div>
        </div>
    </div>
    
    <script>
        window.onafterprint = function() { setTimeout(function() { window.close(); }, 500); };
        window.onload = function() { setTimeout(function() { window.print(); }, 300); };
    </script>
</body>
</html>`;

        printWindow.document.write(printContent);
        printWindow.document.close();

        return printWindow;
    } catch (error) {
        console.error('生成打印内容失败:', error);
        swal('打印失败: ' + error);
        return null;
    }
}


// 添加行点击事件
function addRowClickEvent() {
    $('#khzlTable tbody tr').click(function() {
        $('#khzlTable tbody tr').removeClass('selected-row');
        $(this).addClass('selected-row');
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
}
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
            /* 新增：禁用状态样式 */
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
            /* 修改：统计区域样式 - 调整高度为80px并均匀分布 */
            .statistics-container {
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 10px 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                height: 80px;
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
                color: #6c757d;
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

function generateBatchPrintPreview(rowData, selectedProductIndexes) {
    try {
        var previewWindow = window.open('', '_blank', 'width=1000,height=700,scrollbars=yes,toolbar=yes,location=no,status=no');

        if (!previewWindow) {
            swal('预览窗口被浏览器拦截，请允许弹出窗口后重试。');
            return null;
        }

        // 获取负责人对应的联系电话
        var contactPhone = getContactByFzr(rowData.fzr);
        var displayPhone = contactPhone || rowData.lxdh || '';

        // 获取收货地址 - 从详情数据中获取
        var shippingAddress = '';
        if (currentDetailData && currentDetailData.shdz) {
            shippingAddress = currentDetailData.shdz;
        }

        console.log('批量打印预览 - 负责人电话:', {
            负责人: rowData.fzr,
            原始电话: rowData.lxdh,
            替换电话: contactPhone,
            显示电话: displayPhone,
            收货地址: shippingAddress
        });

        // 准备产品数据（按照选择的顺序）
        var selectedProducts = [];
        selectedProductIndexes.forEach(function(productKey, index) {
            var productIndex = parseInt(productKey);
            var productData = getProductDataByIndex(productIndex);
            if (productData) {
                selectedProducts.push({
                    ...productData,
                    workOrderNumber: productWorkOrders[productKey] || generateWorkOrderNumber(),
                    printCount: productPrintCounts[productKey] || "0",
                    originalIndex: productIndex,
                    displayIndex: index + 1 // 显示序号从1开始
                });
            }
        });

        // 计算分页
        var itemsPerPage = 18; // 每页显示20条数据
        var totalPages = Math.ceil(selectedProducts.length / itemsPerPage);

        var previewContent = `
<!DOCTYPE html>
<html>
<head>
    <title>制造工单物控档批量打印 - ${rowData.khcm || ''}</title>
    <meta charset="UTF-8">
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
            font-family: 'SimSun', '宋体', serif; 
        }
        
        body { 
            font-size: 12px; 
            line-height: 1.6; 
            color: #333; 
            background: white;
        }
        
        /* 打印控制栏样式 - 更紧凑 */
        .print-control-bar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 8px 15px;
            border-bottom: 2px solid #4a5568;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        
        .print-control-bar .preview-info {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
        }
        
        .info-item {
            display: flex;
            align-items: center;
            font-size: 13px;
            background: rgba(255,255,255,0.9);
            padding: 4px 10px;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .info-label {
            font-weight: bold;
            margin-right: 5px;
            color: #2d3748;
        }
        
        .info-value {
            color: #4a5568;
            font-weight: 600;
        }
        
        /* 按钮样式优化 */
        .btn-group {
            display: flex;
            gap: 8px;
        }
        
        .print-btn {
            background: linear-gradient(to right, #28a745, #20c997);
            color: white;
            border: none;
            padding: 6px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 5px;
            box-shadow: 0 2px 5px rgba(40, 167, 69, 0.3);
        }
        
        .print-btn:hover {
            background: linear-gradient(to right, #218838, #1aa179);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(40, 167, 69, 0.4);
        }
        
        .cancel-btn {
            background: linear-gradient(to right, #dc3545, #e74c3c);
            color: white;
            border: none;
            padding: 6px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 5px;
            box-shadow: 0 2px 5px rgba(220, 53, 69, 0.3);
        }
        
        .cancel-btn:hover {
            background: linear-gradient(to right, #c82333, #d6453d);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(220, 53, 69, 0.4);
        }
        
       /* 打印内容样式 */
        .print-content {
            width: 210mm;
            margin: 0 auto;
            background: #ffffff; /* 白色背景 */
        }
        
        /* 单页样式 - 更贴近实际打印效果 */
        .print-page {
            width: 210mm;
            min-height: 297mm;
            position: relative;
            box-sizing: border-box;
            background: #ffffff; /* 白色背景 */
            margin-bottom: 30px;
        }
        
        /* 页面内容区域 */
        .page-content {
            border: 1px solid #000000; /* 黑色边框 */
            background: #ffffff; /* 白色背景 */
            min-height: 240mm;
            position: relative;
        }
        
        /* 表头样式 - 更加突出 */
        .page-header {
            text-align: center;
        }
        
        .page-title {
            font-size: 24px;
            font-weight: bold;
            color: #000000; /* 黑色文字 */
            margin-bottom: 10px;
        }
        
        
        .info-block {
            text-align: center;
            padding: 5px;
            display: flex;
        }
        
        .info-block-label {
            margin-bottom: 2px;
            font-weight: bold;
            color: #000000; /* 黑色文字 */
            font-size: 13px;
            display: inline-block;
            min-width: 80px;
        }
        
        .info-block-value {
            color: #000000; /* 黑色文字 */
            font-size: 13px;
            font-weight: 600;
            margin-left: 13px;
        }
        
        /* 收货地址样式 - 更醒目 */
        .shipping-address-section {
            padding: 8px 12px;
        }
        
        .shipping-address-label {
            font-weight: bold;
            color: #000000; /* 黑色文字 */
            font-size: 13px;
            display: inline-block;
            min-width: 80px;
        }
        
        .shipping-address-value {
            color: #000000; /* 黑色文字 */
            font-size: 13px;
            font-weight: 600;
        }
        
        /* 要求信息样式 */
        .requirements-section {
            margin: 0px 3px;
            padding: 0px 10px;
        }
        
        .requirements-label {
            font-weight: bold;
            color: #000000; /* 黑色文字 */
            font-size: 12px;
            display: inline-block;
            min-width: 80px;
        }
        
        .requirements-value {
            color: #000000; /* 黑色文字 */
            font-size: 13px;
            font-weight: 600;
        }
        
        /* 表格样式 - 更清晰 */
        .data-table {
            width: 96%;
            border-collapse: collapse;
            font-size: 13px;
            margin: 15px;
            border: 2px solid #000000; /* 黑色边框 */
        }
        
        .data-table thead {
            background: #ffffff; /* 白色背景 */
            color: #000000; /* 黑色文字 */
        }
        
        .data-table th {
            border: 1px solid #000000; /* 黑色边框 */
            text-align: center;
            font-weight: bold;
            height: 30px;
            vertical-align: middle;
            padding: 6px 4px;
            background: #ffffff; /* 白色背景 */
            color: #000000; /* 黑色文字 */
        }
        
        .data-table td {
            border: 1px solid #000000; /* 黑色边框 */
            padding: 6px 4px;
            height: 28px;
            vertical-align: middle;
            text-align: center;
            background: #ffffff; /* 白色背景 */
            color: #000000; /* 黑色文字 */
        }
        
        .data-table tbody tr:hover {
            background-color: #ffffff; /* 白色背景 */
        }
        
        .data-table tbody tr:nth-child(even) {
            background-color: #ffffff; /* 白色背景 */
        }
        
        /* 列宽调整 */
        .col-1 { width: 6%; }   /* 序号 */
        .col-2 { width: 22%; }  /* 产品型号 */
        .col-3 { width: 22%; }  /* 产品名称 */
        .col-4 { width: 8%; }   /* 数量 */
        .col-5 { width: 15%; }  /* 货期 - 新增 */
        .col-6 { width: 27%; }  /* 备注 */

        
        /* 页脚样式 */
        .page-footer {
        }
        
        .signature-area {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 20px;
        }
        
        .signature {
            text-align: center;
            min-width: 100px;
            display: flex;
        }
        
        .signature-label {
            font-weight: bold;
            color: #000000; /* 黑色文字 */
            margin-bottom: 40px;
            font-size: 13px;
            margin-left: 15px;
        }
        
        /* 页码样式 */
        .page-number {
            text-align: center;
            margin-top: 15px;
            font-size: 12px;
            color: #000000; /* 黑色文字 */
            font-style: italic;
        }
        
        /* 页码指示器 */
        .page-indicator {
            position: absolute;
            bottom: 1mm;
            right: 5mm;
            background: #ffffff; /* 白色背景 */
            color: #000000; /* 黑色文字 */
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: bold;
            border: 1px solid #000000; /* 黑色边框 */
        }
        
        /* 公司信息页眉 */
        .company-header {
            position: absolute;
            top: 5mm;
            left: 20mm;
            right: 20mm;
            text-align: center;
            font-size: 10px;
            color: #000000; /* 黑色文字 */
            border-bottom: 1px solid #000000; /* 黑色边框 */
            padding-bottom: 3mm;
        }
        
        .company-name {
            font-weight: bold;
            color: #000000; /* 黑色文字 */
            font-size: 12px;
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
            .print-control-bar {
                flex-direction: column;
                gap: 10px;
            }
            
            .preview-info {
                width: 100%;
                justify-content: center;
            }
            
            .info-blocks {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        /* 打印样式 - 隐藏控制栏，其他样式保持不变 */
        @media print {
            .print-control-bar { 
                display: none !important; 
            }
            @page {
                size: A4;
                margin: 15mm;
            }
        }
        
        /* 屏幕预览样式 */
        @media screen {
            body { 
                background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
                min-height: 100vh;
                padding: 15px;
            }
            .preview-container {
                background: white;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                max-width: 1200px;
                margin: 0 auto;
                overflow: hidden;
            }
        }
    </style>
</head>
<body>
    <div class="preview-container">
        <!-- 打印控制栏 -->
        <div class="print-control-bar">
            <div class="preview-info">
                <div class="info-item">
                    <span class="info-label">客户：</span>
                    <span class="info-value">${rowData.khcm || ''}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">选中产品：</span>
                    <span class="info-value">${selectedProducts.length} 个</span>
                </div>
                <div class="info-item">
                    <span class="info-label">总页数：</span>
                    <span class="info-value">${totalPages} 页</span>
                </div>
                <div class="info-item">
                    <span class="info-label">负责人：</span>
                    <span class="info-value">${rowData.fzr || ''}</span>
                </div>
            </div>
            <div class="btn-group">
                <button id="cancelBtn" class="cancel-btn">
                    <span>✕</span> 关闭预览
                </button>
                <button id="printBtn" class="print-btn">
                    <span>🖨️</span> 确认打印
                </button>
            </div>
        </div>
                
        <div class="print-content">`;

        // 生成每一页的内容
        for (var pageNum = 0; pageNum < totalPages; pageNum++) {
            var startIndex = pageNum * itemsPerPage;
            var endIndex = Math.min(startIndex + itemsPerPage, selectedProducts.length);
            var pageProducts = selectedProducts.slice(startIndex, endIndex);

            // 每页的序号从 (pageNum * itemsPerPage + 1) 开始
            var pageStartNumber = pageNum * itemsPerPage + 1;

            // 获取第一个产品的工单号放在表头
            var firstWorkOrderNumber = "";
            if (selectedProducts.length > 0 && selectedProducts[0].workOrderNumber) {
                firstWorkOrderNumber = selectedProducts[0].workOrderNumber;
            }

            previewContent += `
    <div class="print-page" id="page-${pageNum + 1}">
        
        <!-- 公司信息页眉 -->
        <div class="company-header">
            <div class="company-name">制造工单物控档</div>
            <div>工单日期: ${new Date().toLocaleDateString('zh-CN')}</div>
        </div>
        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">制造工单物控档</div>
                
                <!-- 主要信息块 -->
                <div class="info-blocks">
                    <div class="info-block">
                        <div class="info-block-label">工单号：</div>
                        <div class="info-block-value">${firstWorkOrderNumber || rowData.htbh || ''}</div>
                    </div>
                    <div class="info-block">
                        <div class="info-block-label">订单号：</div>
                        <div class="info-block-value">${rowData.htbh || ''}</div>
                    </div>
                </div>
                
                <div class="info-blocks">
                    <div class="info-block">
                        <div class="info-block-label">客&nbsp户：</div>
                        <div class="info-block-value">${rowData.khcm || ''}</div>
                    </div>
                    <div class="info-block">
                        <div class="info-block-label">日&nbsp期：</div>
                        <div class="info-block-value">${rowData.ddrq || ''}</div>
                    </div>
                </div>
                
                <!-- 次要信息块 -->
                <div class="info-blocks" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="info-block">
                        <div class="info-block-label">部&nbsp门：</div>
                        <div class="info-block-value">${rowData.bm || ''}</div>
                    </div>
                    <div class="info-block">
                        <div class="info-block-label">负责人：</div>
                        <div class="info-block-value">${rowData.fzr || ''}</div>
                    </div>
                    <div class="info-block">
                        <div class="info-block-label">联系电话：</div>
                        <div class="info-block-value">${displayPhone}</div>
                    </div>
                    <div class="info-block">
                        <div class="info-block-label">货&nbsp期：</div>
                        <div class="info-block-value">${selectedProducts.length > 0 ? selectedProducts[0].hq : ''}</div>
                    </div>
                </div>
            </div>
            
            <!-- 收货地址 -->
            ${shippingAddress ? `
            <div class="shipping-address-section">
                <span class="shipping-address-label">收货地址：</span>
                <span class="shipping-address-value">${shippingAddress}</span>
            </div>
            ` : ''}
            
            <!-- 购方要求 -->
            ${rowData.yq ? `
            <div class="requirements-section">
                <span class="requirements-label">购方要求：</span>
                <span class="requirements-value">${rowData.yq}</span>
            </div>
            ` : ''}
            
            <!-- 产品表格 -->
            <table class="data-table">
                <thead>
                    <tr>
                        <th class="col-1">序号</th>
                        <th class="col-2">产品型号</th>
                        <th class="col-3">产品名称</th>
                        <th class="col-4">数量</th>
                        <th class="col-5">货期</th> <!-- 新增货期列 -->
                        <th class="col-6">备注</th>
                    </tr>
                </thead>
                <tbody>`;

            // 生成表格行
            pageProducts.forEach(function(product, index) {
                var displayNumber = pageStartNumber + index;

                previewContent += `
                    <tr>
                        <td class="col-1">${displayNumber}</td>
                        <td class="col-2">${product.cpxh || ''}</td>
                        <td class="col-3">${product.pp || ''}</td>
                        <td class="col-4">${product.sl || ''}</td>
                        <td class="col-5">${product.hq || ''}</td> <!-- 货期单元格 -->
                    <td class="col-6" style="border: 1px solid #000000 !important; text-align: left; padding-left: 8px;">${product.bz || ''}</td>
                    </tr>`;
            });

            // 如果本页数据不足，填充空行
            var remainingRows = itemsPerPage - pageProducts.length;
            for (var i = 0; i < remainingRows; i++) {
                previewContent += `
                    <tr>
                        <td class="col-1">&nbsp;</td>
                        <td class="col-2">&nbsp;</td>
                        <td class="col-3">&nbsp;</td>
                        <td class="col-4">&nbsp;</td>
                        <td class="col-5">&nbsp;</td>
                        <td class="col-6">&nbsp;</td>
                    </tr>`;
            }

            previewContent += `
                </tbody>
            </table>
            
            <!-- 页脚 -->
            <div class="page-footer">
                <div class="signature-area">
                    <div class="signature">
                        <div class="signature-label">制作：</div>
                        <div style="margin-top: 20px; border-top: 1px solid #cbd5e0; width: 70%;"></div>
                    </div>
                    <div class="signature">
                        <div class="signature-label">审核：</div>
                        <div style="margin-top: 20px; border-top: 1px solid #cbd5e0; width: 70%;"></div>
                    </div>
                    <div class="signature">
                        <div class="signature-label">入库：</div>
                        <div style="margin-top: 20px; border-top: 1px solid #cbd5e0; width: 70%;"></div>
                    </div>
                </div>
                
            </div>
            
            <!-- 页码指示器 -->
            <div class="page-indicator">
                第 ${pageNum + 1} / ${totalPages}
            </div>
        </div>
    </div>`;
        }

        previewContent += `
        </div>
    </div>
    
    <script>
        // 打印按钮点击事件
        document.getElementById('printBtn').onclick = function() {
            // 更新所有选中产品的打印次数
            ${selectedProductIndexes.map(productKey => `
                window.opener.updateProductPrintCount('${productKey}');
            `).join('')}
            
            // 保存到数据库
            window.opener.saveWorkOrdersAndPrintCounts('${rowData.id}');
            
            // 执行打印
            setTimeout(function() {
                window.print();
                
                // 打印完成后提示
                setTimeout(function() {
                    if (confirm('是否已成功打印所有页面？')) {
                        window.close();
                    }
                }, 500);
            }, 300);
        };
        
        // 关闭按钮点击事件
        document.getElementById('cancelBtn').onclick = function() {
            if (confirm('确定要关闭预览吗？')) {
                window.close();
            }
        };
        
        // 键盘快捷键
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                window.close();
            }
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                document.getElementById('printBtn').click();
            }
        });
        
        // 滚动到顶部
        window.scrollTo(0, 0);
        
        // 添加页面切换提示
        console.log('批量打印预览已打开，共' + ${totalPages} + '页');
        
    </script>
</body>
</html>`;

        previewWindow.document.write(previewContent);
        previewWindow.document.close();

        // 聚焦到预览窗口
        previewWindow.focus();

        return previewWindow;
    } catch (error) {
        console.error('生成批量打印预览失败:', error);
        swal('预览生成失败: ' + error);
        return null;
    }
}

// 根据索引获取产品数据
function getProductDataByIndex(index) {
    if (!currentDetailData) return null;

    var ppArray = currentDetailData.pp.split('|||');
    var cpxhArray = currentDetailData.cpxh.split('|||');
    var slArray = currentDetailData.sl ? currentDetailData.sl.split('|||') : [];
    var bzArray = currentDetailData.bz ? currentDetailData.bz.split('|||') : [];

    if (index < 0 || index >= ppArray.length) return null;

    var productKey = index.toString(); // 定义 productKey 变量
    return {
        pp: ppArray[index] || '',
        cpxh: cpxhArray[index] || '',
        sl: slArray[index] || '',
        bz: bzArray[index] || '',
        hq: productHq[productKey] || '' // 使用已定义的 productKey 变量
    };
}
// 更新多个产品的打印次数并保存
function updateMultipleProductPrintCounts(productKeys, orderId) {
    productKeys.forEach(function(productKey) {
        var currentCount = parseInt(productPrintCounts[productKey] || '0');
        productPrintCounts[productKey] = (currentCount + 1).toString();
    });

    // 更新选中数量显示
    updateSelectedCountDisplay();

    // 保存到数据库
    saveWorkOrdersAndPrintCounts(orderId);
}

// 修改原有的更新打印次数函数
function updateProductPrintCountAndSave(productKey, orderId) {
    var currentCount = parseInt(productPrintCounts[productKey] || '0');
    productPrintCounts[productKey] = (currentCount + 1).toString();

    // 更新选中数量显示
    updateSelectedCountDisplay();

    // 保存到数据库
    saveWorkOrdersAndPrintCounts(orderId);

}

// 修改 getListDH 函数保存员工信息
function getListDH() {
    $.ajax({
        type: 'post',
        url: '/ygxx/getList',
        success: function (res) {
            console.log('获取员工数据响应:', res);
            if (res.code == 200) {
                // 保存员工信息到全局变量
                employeeList = res.data || [];
                console.log('员工信息已保存，共', employeeList.length, '条记录');

                // 打印员工信息方便调试
                employeeList.forEach(emp => {
                    console.log(`员工: ${emp.xm}, 电话: ${emp.lxfs}, 部门: ${emp.bm}`);
                });
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
            console.error('获取员工列表失败:', error);
            swal("获取员工信息失败", "网络错误", "error");
        }
    });
}

// 根据负责人名称查找对应的联系电话
function getContactByFzr(fzrName) {
    if (!fzrName || !employeeList || employeeList.length === 0) {
        console.log('负责人名称为空或员工列表为空');
        return null;
    }

    console.log('查找负责人的电话，负责人:', fzrName);
    console.log('员工列表:', employeeList);

    // 精确匹配员工姓名
    var employee = employeeList.find(emp => {
        return emp && emp.xm && emp.xm.trim() === fzrName.trim();
    });

    if (employee) {
        console.log('找到匹配的员工:', employee.xm, '电话:', employee.lxfs);
        return employee.lxfs || '';
    } else {
        console.log('未找到匹配的员工，负责人:', fzrName);
        // 尝试模糊匹配
        var fuzzyMatch = employeeList.find(emp => {
            return emp && emp.xm && emp.xm.includes(fzrName.trim());
        });

        if (fuzzyMatch) {
            console.log('模糊匹配到员工:', fuzzyMatch.xm, '电话:', fuzzyMatch.lxfs);
            return fuzzyMatch.lxfs || '';
        }
    }

    return null;
}

// 导出到Excel函数
function exportToExcel(fileName) {
    var searchParams = getSearchParams();

    // 同步日期格式处理
    if (searchParams.startDate) {
        searchParams.startDate = searchParams.startDate.replaceAll('-', '/');
    }
    if (searchParams.endDate) {
        searchParams.endDate = searchParams.endDate.replaceAll('-', '/');
    }

    // 获取用户选择的字段
    var selectedColumns = exportColumnsConfig.mainColumns;
    if (selectedColumns.length === 0) {
        selectedColumns = exportColumnsConfig.allMainColumns.map(col => col.key);
    }

    // 获取字段显示名称映射
    var columnMapping = {};
    exportColumnsConfig.allMainColumns.forEach(col => {
        if (selectedColumns.includes(col.key)) {
            columnMapping[col.key] = col.name;
        }
    });

    console.log('准备导出筛选后的数据，参数:', searchParams, '选择列:', selectedColumns);

    showLoading();

    $.ajax({
        type: 'post',
        url: '/xiadan/export',
        contentType: 'application/json',
        data: JSON.stringify(searchParams),
        dataType: 'json',
        success: function(res) {
            hideLoading();
            var data = res.success ? res.data : null;

            if (data && Array.isArray(data)) {
                if (data.length === 0) {
                    swal('当前筛选条件下没有可导出的数据');
                    return;
                }

                // 根据用户选择的列转换数据
                var excelData = data.map(function(item) {
                    var row = {};
                    selectedColumns.forEach(function(key) {
                        var displayName = columnMapping[key] || key;
                        row[displayName] = item[key] || '';
                    });
                    return row;
                });

                var ws = XLSX.utils.json_to_sheet(excelData);
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, '下单明细');

                var now = new Date();
                var dateStr = now.getFullYear() +
                    String(now.getMonth() + 1).padStart(2, '0') +
                    String(now.getDate()).padStart(2, '0') + '_' +
                    String(now.getHours()).padStart(2, '0') +
                    String(now.getMinutes()).padStart(2, '0') +
                    String(now.getSeconds()).padStart(2, '0');

                var finalFileName = fileName || '下单明细_' + dateStr + '.xlsx';
                if (!finalFileName.endsWith('.xlsx')) finalFileName += '.xlsx';

                XLSX.writeFile(wb, finalFileName);
            } else {
                swal('导出失败: ' + (res.message || '未返回有效数据'));
            }
        },
        error: function(xhr, status, error) {
            hideLoading();
            swal('请求导出数据失败: ' + error);
        }
    });
}

// 排序函数

function sortTable(field) {
    // 如果点击同一个字段，切换排序方向
    if (currentSortField === field) {
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        // 点击不同字段，默认升序
        currentSortField = field;
        currentSortOrder = 'asc';
    }

    console.log('排序字段:', currentSortField, '排序方向:', currentSortOrder);

    // 更新排序图标
    updateSortIcons();

    // 重新获取数据
    var searchParams = getSearchParams();
    searchParams.sortField = currentSortField;
    searchParams.sortOrder = currentSortOrder;

    currentPage = 1; // 排序后回到第一页
    getList(currentPage, pageSize, searchParams);
}

function updateSortIcons() {
    // 清除所有图标
    $('.sort-icon').html('');

    // 设置当前排序字段的图标
    if (currentSortField) {
        var icon = currentSortOrder === 'asc' ? '↑' : '↓';
        $('#sort-' + currentSortField).html(icon);
    }
}

// 获取筛选后的统计信息
function getFilteredStatistics(searchParams) {
    // 发送一个获取全部数据（不分页）的请求来统计
    $ajax({
        type: 'post',
        url: '/xiadan/list',
        contentType: 'application/json',
        data: JSON.stringify({
            pageNum: 1, // 第一页
            pageSize: 999999, // 很大的数字，获取所有数据
            khcm: searchParams.khcm || '',
            lxr: searchParams.lxr || '',
            fzr: searchParams.fzr || '',
            kpzt: searchParams.kpzt || '',
            startDate: searchParams.startDate || '',
            endDate: searchParams.endDate || ''
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
    var totalAmount = 0;
    var uninvoicedCount = 0;
    var invoicedCount = 0;
    var noInvoiceCount = 0;

    dataList.forEach(function(item) {
        // 计算合计金额
        var amount = parseFloat(item.hj) || 0;
        totalAmount += amount;

        // 统计开票状态
        var invoiceStatus = item.kpzt || '';
        switch(invoiceStatus) {
            case '未开票':
                uninvoicedCount++;
                break;
            case '已开票':
                invoicedCount++;
                break;
            case '不开票':
                noInvoiceCount++;
                break;
            default:
                uninvoicedCount++;
                break;
        }
    });

    // 更新统计显示
    updateStatistics(totalAmount, uninvoicedCount, invoicedCount, noInvoiceCount);
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
                                    <i class="bi bi-info-circle"></i> 请选择要导出的字段，系统将根据当前筛选条件导出数据。
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-12">
                                <h6><i class="bi bi-list-check"></i> 导出字段选择</h6>
                                <div class="export-columns-container" style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
                                    <div class="form-check mb-2">
                                        <input type="checkbox" class="form-check-input" id="selectAllColumns">
                                        <label class="form-check-label" for="selectAllColumns">
                                            <strong>全选/全不选</strong>
                                        </label>
                                    </div>
                                    <div id="mainColumnsList">
                                        <!-- 导出列复选框将在这里动态生成 -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="exportFileName">导出文件名：</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="exportFileName" value="下单明细_${formatCurrentDateTime()}">
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
            fileName = `下单明细_${formatCurrentDateTime()}`;
        }

        // 确保文件名有.xlsx扩展名
        if (!fileName.endsWith('.xlsx')) {
            fileName += '.xlsx';
        }

        $('#exportModal').modal('hide');

        // 执行实际导出
        doExportToExcel(fileName);
    });
}

// 更新全选复选框状态
function updateSelectAllCheckbox() {
    var allChecked = $('.main-column-checkbox').length ===
        $('.main-column-checkbox:checked').length;
    $('#selectAllColumns').prop('checked', allChecked);
}

// 实际执行导出到Excel的函数
function doExportToExcel(fileName) {
    var searchParams = getSearchParams();

    // 同步日期格式处理
    if (searchParams.startDate) {
        searchParams.startDate = searchParams.startDate.replaceAll('-', '/');
    }
    if (searchParams.endDate) {
        searchParams.endDate = searchParams.endDate.replaceAll('-', '/');
    }

    // 获取用户选择的字段
    var selectedColumns = exportColumnsConfig.mainColumns;
    if (selectedColumns.length === 0) {
        selectedColumns = exportColumnsConfig.allMainColumns.map(col => col.key);
    }

    // 获取字段显示名称映射
    var columnMapping = {};
    exportColumnsConfig.allMainColumns.forEach(col => {
        if (selectedColumns.includes(col.key)) {
            columnMapping[col.key] = col.name;
        }
    });

    console.log('准备导出筛选后的数据，参数:', searchParams, '选择列:', selectedColumns);

    showLoading();

    $.ajax({
        type: 'post',
        url: '/xiadan/export',
        contentType: 'application/json',
        data: JSON.stringify(searchParams),
        dataType: 'json',
        success: function(res) {
            hideLoading();
            var data = res.success ? res.data : null;

            if (data && Array.isArray(data)) {
                if (data.length === 0) {
                    swal('当前筛选条件下没有可导出的数据');
                    return;
                }

                // 根据用户选择的列转换数据
                var excelData = data.map(function(item) {
                    var row = {};
                    selectedColumns.forEach(function(key) {
                        var displayName = columnMapping[key] || key;
                        var value = item[key] || '';

                        // 金额字段格式化
                        if (key === 'hj' && value) {
                            value = parseFloat(value).toFixed(2);
                        }

                        row[displayName] = value;
                    });
                    return row;
                });

                var ws = XLSX.utils.json_to_sheet(excelData);

                // 设置列宽
                var colWidths = [];
                selectedColumns.forEach(function() {
                    colWidths.push({ wch: 15 });
                });
                ws['!cols'] = colWidths;

                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, '下单明细');

                XLSX.writeFile(wb, fileName);

                swal('导出成功', `文件 ${fileName} 已生成并开始下载`, 'success');
            } else {
                swal('导出失败: ' + (res.message || '未返回有效数据'));
            }
        },
        error: function(xhr, status, error) {
            hideLoading();
            swal('请求导出数据失败: ' + error);
        }
    });
}