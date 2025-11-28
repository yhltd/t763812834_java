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
var currentDetailData = null;
var chanpindanwei = [];

// 页面加载完成后初始化
$(document).ready(function() {
    console.log('页面加载完成，初始化客户信息页面...');
    addTableStyles();
    initKhxxPage();
    initToolbarEvents();
    initDetailModalEvents();
    getDW();

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

// 初始化工具栏事件
function initToolbarEvents() {
    console.log('初始化工具栏事件...');

    // 刷新按钮
    $('#refresh-btn').off('click').on('click', function() {
        console.log('刷新数据');
        resetSearchAndRefresh();
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
            // 只打印选中的产品
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
        var ppArray = currentDetailData.pp.split(',');
        var cpxhArray = currentDetailData.cpxh.split(',');
        var slArray = currentDetailData.sl ? currentDetailData.sl.split(',') : [];
        var djArray = currentDetailData.dj ? currentDetailData.dj.split(',') : [];
        var scgdArray = currentDetailData.scgd ? currentDetailData.scgd.split(',') : [];
        var bzArray = currentDetailData.bz ? currentDetailData.bz.split(',') : [];
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
    currentPage = 1;
    getList(currentPage, pageSize, searchParams);
}

// 填充表格
function fillTable(data) {
    $('#khzlTable').empty();

    // 清空并重新填充部门映射表
    departmentMap = {};

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
                <th width="200">备注</th>
                <th width="150">操作</th> <!-- 增加宽度 -->
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
                    <td>${item.hj || ''}</td>
                    <td>${item.fzr || ''}</td>
                    <td>${item.htbh || ''}</td>
                    <td>${item.yq || ''}</td>
                    <td>${item.kpzt || ''}</td>
                    <td>${item.zbz || ''}</td>
                    <td>
                        <button class="btn btn-sm btn-info detail-btn" 
                                data-id="${item.id}" 
                                data-htbh="${item.htbh || ''}">
                            <i class="bi bi-eye"></i> 详情
                        </button>
                        <button class="btn btn-sm btn-danger delete-btn" 
                                data-id="${item.id}"
                                data-khcm="${item.khcm || ''}">
                            <i class="bi bi-trash"></i> 删除
                        </button>
                    </td>
                </tr>
            `;
        });
    } else {
        tableBody += `
            <tr>
                <td colspan="11" style="text-align: center; color: #999;">暂无客户数据</td>
            </tr>
        `;
    }

    tableBody += '</tbody>';
    $('#khzlTable').html(tableHeader + tableBody);
    addRowClickEvent();
    bindDetailButtonEvents();
    bindDeleteButtonEvents(); // 绑定删除按钮事件
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

            // 初始化产品数据 - 从数据库获取工单号
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

    var ppArray = data.pp.split(',');

    // 如果有数据库中的工单号，使用数据库的值
    if (data.scgd) {
        var workOrderArray = data.scgd.split(',');

        for (var i = 0; i < ppArray.length; i++) {
            var productKey = i.toString();
            // 使用数据库中的工单号，如果没有就留空
            productWorkOrders[productKey] = workOrderArray[i] || '';
        }
    } else {
        // 没有数据库工单号，全部留空
        for (var i = 0; i < ppArray.length; i++) {
            var productKey = i.toString();
            productWorkOrders[productKey] = '';
        }
    }

    // 初始化打印次数为0
    for (var i = 0; i < ppArray.length; i++) {
        var productKey = i.toString();
        productPrintCounts[productKey] = "0";
    }
}

function generateWorkOrderNumber() {
    var today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    var storageKey = 'workOrderSequence_' + today;
    var sequence = parseInt(localStorage.getItem(storageKey)) || 1;

    var workOrderNumber = 'GD' + today + String(sequence).padStart(3, '0');

    sequence++;
    localStorage.setItem(storageKey, sequence.toString());

    return workOrderNumber;
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
                kpzt: $(this).find('td:eq(8)').text().trim(),
                zbz: $(this).find('td:eq(9)').text().trim()
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
            <div class="col-md-12">
                <label><strong>备注：</strong></label>
                <span>${rowData.zbz}</span>
            </div>
        `;
        $('#basicInfo').html(basicInfoHtml);
    }
}

// 生成详细信息表单
function generateDetailForm(data) {
    var formHtml = '';

    if (data && data.pp && data.cpxh && data.sl && data.dj) {
        var ppArray = data.pp.split(',');
        var cpxhArray = data.cpxh.split(',');
        var slArray = data.sl.split(',');
        var djArray = data.dj.split(',');
        var bzArray = data.bz ? data.bz.split(',') : [];

        var maxLength = Math.max(ppArray.length, cpxhArray.length, slArray.length, djArray.length);

        formHtml = `
            <div class="table-responsive">
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

            formHtml += `
                        <tr class="product-row" data-index="${i}">
                            <td style="text-align: center;">
                                <input type="radio" class="form-check-input product-radio" 
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
                            <td style="text-align: right; font-weight: bold;">${subtotal.toFixed(2)}</td>
                            <td>${bz}</td>
                        </tr>`;
        }

        formHtml += `
                        <tr>
                            <td colspan="7" style="text-align: right; font-weight: bold;">合计金额：</td>
                            <td style="text-align: right; font-weight: bold; color: #ff6b35;">${totalAmount.toFixed(2)}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>`;

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
                `)
                .appendTo('head');
        }
    } else {
        formHtml = '<p class="text-muted">暂无产品详细信息</p>';
    }

    $('#detailFormContainer').html(formHtml);

    // 绑定单选按钮事件
    bindProductRadioEvents();
}

// 修改绑定产品选择事件，改为单选逻辑
function bindProductRadioEvents() {
    $('.product-radio').off('change').on('change', function() {
        var productIndex = $(this).data('index');
        var productKey = productIndex.toString();

        if ($(this).is(':checked')) {
            // 单选逻辑：清空之前的选择，只保留当前选择
            selectedWorkOrders = [productKey];

            // 取消其他单选按钮的选中状态
            $('.product-radio').not(this).prop('checked', false);

            // 更新所有行的选中样式
            $('.product-row').removeClass('selected');
            $(this).closest('.product-row').addClass('selected');
        } else {
            // 如果取消选中，清空选择
            selectedWorkOrders = [];
            $(this).closest('.product-row').removeClass('selected');
        }

        updateSelectedCountDisplay();
    });

    // 绑定行点击事件
    $('.product-row').off('click').on('click', function(e) {
        if (!$(e.target).is('input[type="radio"]')) {
            var radio = $(this).find('.product-radio');
            radio.prop('checked', true).trigger('change');
        }
    });
}

// 更新选中数量显示
function updateSelectedCountDisplay() {
    $('#selectedCount').text(selectedWorkOrders.length);
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

// 打印选中的产品
function printSelectedProducts(rowData, selectedProductIndexes) {
    if (selectedProductIndexes.length === 0) {
        swal('请选择一个产品进行打印');
        return;
    }

    // 只打印选中的产品（单选模式下只有一个）
    var selectedIndex = selectedProductIndexes[0];
    printSingleProduct(rowData, selectedIndex);
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
// 保存工单号和打印次数到数据库
function saveWorkOrdersAndPrintCounts(orderId) {
    // 构建工单号字符串（格式：GD20240101001,GD20240101002,...）
    var workOrdersArray = [];
    var printCountsArray = [];

    for (var i = 0; i < Object.keys(productWorkOrders).length; i++) {
        var key = i.toString();
        workOrdersArray.push(productWorkOrders[key] || '');
        printCountsArray.push(productPrintCounts[key] || '0');
    }

    var workOrdersString = workOrdersArray.join(',');
    var printCountsString = printCountsArray.join(',');

    $.ajax({
        url: '/xiadan/saveWorkOrdersAndPrintCounts',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            id: orderId,
            scgd: workOrdersString, // 工单号字符串
            printCount: printCountsString // 打印次数字符串
        }),
        success: function(result) {
            if (result.success) {
                console.log('生产工单和打印次数保存成功');
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

// 生成单个产品的打印内容
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
        var ppArray = detailData.pp.split(',');
        var cpxhArray = detailData.cpxh.split(',');
        var slArray = detailData.sl.split(',');
        var djArray = detailData.dj.split(',');
        var bzArray = detailData.bz ? detailData.bz.split(',') : [];

        // 获取当前产品的数据
        var currentProduct = {
            pp: ppArray[productIndex] || '',
            cpxh: cpxhArray[productIndex] || '',
            sl: slArray[productIndex] || '',
            dj: djArray[productIndex] || '',
            bz: bzArray[productIndex] || ''
        };

        var printContent = `
<!DOCTYPE html>
<html>
<head>
    <title>制造工单物控档 - ${currentProduct.pp}</title>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'SimSun', '宋体', serif; font-size: 16px; line-height: 1.4; color: #000; background: white; }
        .triple-form { width: 240mm; height: 130mm; border: 2px solid #000; margin: 0; padding: 0; background: white; }
        .form-header { text-align: center; font-size: 22px; font-weight: bold; padding: 8px 0; background-color: #f0f0f0; }
        .form-table { width: 100%; border-collapse: collapse; }
        .form-table td { border: 1px solid #000; padding: 6px 8px; vertical-align: top; height: 32px; }
        .label-cell { font-weight: bold; background-color: #f9f9f9; width: 80px; text-align: center; }
        .value-cell { background-color: white; }
        .large-cell { height: 40px; }
        .info-row { display: flex; justify-content: space-between; align-items: center; margin: 10px 0; padding: 0 15px; }
        .info-item { display: flex; align-items: center; font-size: 14px; }
        .info-label { font-weight: bold; margin-right: 5px; }
        .signature-area { display: flex; justify-content: space-between; margin-top: 10px; padding: 10px 15px; }
        .signature { text-align: center; display: flex; flex-direction: column; align-items: center; min-width: 100px; }
        .signature-label { font-weight: bold; margin-bottom: 5px; font-size: 14px; }
        
        @media print {
            @page { size: 240mm 130mm; margin: 0; padding: 0; }
            body { width: 240mm; height: 130mm; margin: 0; padding: 0; font-size: 16px; }
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
        
        <table class="form-table">                   
            <tr><td class="label-cell">品名</td><td class="value-cell" colspan="3">${currentProduct.pp}</td><td class="label-cell">数量</td><td class="value-cell">${currentProduct.sl}</td></tr>
            <tr><td class="label-cell">规格</td><td class="value-cell" colspan="3">${currentProduct.cpxh}</td><td class="label-cell">负责</td><td class="value-cell">${rowData.fzr || ''}</td></tr>
            <tr><td class="label-cell">客户</td><td class="value-cell" colspan="3">${rowData.khcm || ''}</td><td class="label-cell">电话</td><td class="value-cell">${rowData.lxdh || ''}</td></tr>
            <tr><td class="label-cell">备注</td><td class="value-cell large-cell" colspan="5">${currentProduct.bz || rowData.zbz || ''}</td></tr>
            <tr><td class="label-cell">购方要求</td><td class="value-cell large-cell" colspan="5">${rowData.yq || ''}</td></tr>
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

// 在CSS中添加选中行样式
function addTableStyles() {
    if ($('#table-styles').length) return;

    $('<style id="table-styles">')
        .prop('type', 'text/css')
        .html(`
            .selected-row { background-color: #b3d9ff !important; font-weight: bold; }
            .table-div { max-height: 600px; overflow-y: auto; border: 1px solid #ddd; }
        `)
        .appendTo('head');
}