// yjbb.js - 修复版本的ECharts代码
let processedData = []; // 全局变量
// 确保DOM完全加载后再执行
function initChart(chardata, personName) {
    console.log('DOM加载完成，开始初始化图表');

    // 检查ECharts是否可用
    if (typeof echarts === 'undefined') {
        console.error('ECharts库未加载');
        return;
    }

    // 检查DOM元素是否存在
    const basicChartEl = document.getElementById('basicChart');
    const statsContainer = document.getElementById('statsContainer');

    if (!basicChartEl) {
        console.error('找不到图表容器元素');
        return;
    }

    console.log('所有DOM元素找到，开始初始化ECharts实例');

    try {
        // 初始化图表实例
        const basicChart = echarts.init(basicChartEl);
        var option;
        console.log('ECharts实例初始化成功');

        // prettier-ignore
        let dataAxis = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        // prettier-ignore
        let data = chardata;
        let yMax = 500;
        let dataShadow = [];

        // 计算统计数据
        const totalSales = data.reduce((sum, value) => sum + value, 0);
        const averageSales = totalSales / data.length;
        const maxSales = Math.max(...data);
        const minSales = Math.min(...data);
        const maxMonth = dataAxis[data.indexOf(maxSales)];
        const minMonth = dataAxis[data.indexOf(minSales)];

        // 计算同比增长（假设与上月比较）
        const growthRates = [];
        for (let i = 1; i < data.length; i++) {
            if (data[i - 1] !== 0) {
                const growth = ((data[i] - data[i - 1]) / data[i - 1] * 100).toFixed(1);
                growthRates.push({
                    month: dataAxis[i],
                    rate: growth
                });
            }
        }

        // 创建统计信息HTML
        const statsHTML = `
            <div class="stats-card">
                <h3>销售统计概览 - ${personName}</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-label">总销售额</div>
                        <div class="stat-value">¥${totalSales.toLocaleString()}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">月均销售额</div>
                        <div class="stat-value">¥${averageSales.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">最高销售额</div>
                        <div class="stat-value">¥${maxSales.toLocaleString()} (${maxMonth})</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">最低销售额</div>
                        <div class="stat-value">¥${minSales.toLocaleString()} (${minMonth})</div>
                    </div>
                </div>
                <div class="monthly-stats">
                    <h4>月度详细数据</h4>
                    <div class="monthly-grid">
                        ${data.map((value, index) => `
                            <div class="month-item">
                                <span class="month-name">${dataAxis[index]}:</span>
                                <span class="month-value">¥${value.toLocaleString()}</span>
                                ${index > 0 ? `<span class="growth-rate ${value > data[index-1] ? 'positive' : 'negative'}">
                                    ${value > data[index-1] ? '↑' : '↓'} ${Math.abs(((value - data[index-1]) / data[index-1] * 100)).toFixed(1)}%
                                </span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // 插入统计信息到页面
        if (statsContainer) {
            statsContainer.innerHTML = statsHTML;
        } else {
            // 如果不存在统计容器，在图表上方创建一个
            const statsDiv = document.createElement('div');
            statsDiv.id = 'autoStatsContainer';
            statsDiv.innerHTML = statsHTML;
            basicChartEl.parentNode.insertBefore(statsDiv, basicChartEl);
        }

        for (let i = 0; i < data.length; i++) {
            dataShadow.push(yMax);
        }

        option = {
            title: {
                text: '销售额统计图表',
                subtext: personName,
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    const dataIndex = params[0].dataIndex;
                    let html = `${params[0].name}<br/>`;
                    html += `${params[0].marker} 销售额: ¥${params[0].value.toLocaleString()}<br/>`;

                    if (dataIndex > 0) {
                        const growth = ((data[dataIndex] - data[dataIndex-1]) / data[dataIndex-1] * 100).toFixed(1);
                        html += `环比: ${growth}%`;
                    }
                    return html;
                }
            },
            xAxis: {
                data: dataAxis,
                axisLabel: {
                    color: '#000000'
                },
                axisTick: {
                    show: true,
                    alignWithLabel: true
                },
                axisLine: {
                    show: true
                },
                z: 10
            },
            yAxis: {
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#999',
                    formatter: '¥{value}'
                }
            },
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    bottom: 10,
                    height: 30,
                    start: 0,
                    end: 100
                }
            ],
            series: [
                {
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(255,255,255,0)'
                    },
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#83bff6' },
                            { offset: 0.5, color: '#188df0' },
                            { offset: 1, color: '#188df0' }
                        ])
                    },
                    emphasis: {
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#2378f7' },
                                { offset: 0.7, color: '#2378f7' },
                                { offset: 1, color: '#83bff6' }
                            ])
                        }
                    },
                    data: data,
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '¥{c}',
                        color: '#333',
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                }
            ]
        };

        // Enable data zoom when user click bar.
        const zoomSize = 6;
        basicChart.on('click', function (params) {
            console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
            basicChart.dispatchAction({
                type: 'dataZoom',
                startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
            });
        });

        option && basicChart.setOption(option);
        console.log('所有图表配置应用成功');

    } catch (error) {
        console.error('初始化图表时出错:', error);
    }
}

// 添加CSS样式
const style = document.createElement('style');
style.textContent = `
.stats-card {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stats-card h3 {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 18px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
}

.stat-item {
    background: white;
    padding: 15px;
    border-radius: 6px;
    border-left: 4px solid #1890ff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stat-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 5px;
}

.stat-value {
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.monthly-stats h4 {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 14px;
}

.monthly-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
}

.month-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: white;
    border-radius: 4px;
    font-size: 12px;
}

.month-name {
    color: #666;
}

.month-value {
    font-weight: bold;
    color: #333;
}

.growth-rate {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 10px;
    margin-left: 8px;
}

.growth-rate.positive {
    background: #f6ffed;
    color: #52c41a;
    border: 1px solid #b7eb8f;
}

.growth-rate.negative {
    background: #fff2f0;
    color: #ff4d4f;
    border: 1px solid #ffccc7;
}
`;
document.head.appendChild(style);
function onYearChange(Year) {
    getList();

}
// 当下拉框选择变化时
function onPersonChange(personName) {
    // 从processedData中找到对应负责人的数据
    const personData = processedData.find(item => item.fzr === personName);

    // 如果找到了，按月份顺序提取数据到data数组
    if (personData) {
        const chardata = [
            personData.yiyue || 0,      // 一月
            personData.eryue || 0,      // 二月
            personData.sanyue || 0,     // 三月
            personData.siyue || 0,      // 四月
            personData.wuyue || 0,      // 五月
            personData.liuyue || 0,     // 六月
            personData.qiyue || 0,      // 七月
            personData.bayue || 0,      // 八月
            personData.jiuyue || 0,     // 九月
            personData.shiyue || 0,     // 十月
            personData.shiyiyue || 0,   // 十一月
            personData.shieryue || 0    // 十二月
        ];

        // 更新图表
        initChart(chardata,personName);
    }
    else{
        initChart(emptyData,personName);
    }
}
var startname ="";
var emptyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var idd;
let count = 1;
var currentPage = 1;
var pageSize = 20;
var totalCount = 0;
var totalPages = 0;
function getList(page, size, keyword) {
    currentPage = page || currentPage;
    pageSize = size || pageSize;
    keyword = keyword || "";
    var date = new Date();
    date.setMonth(date.getMonth()-3);
    var year = date.getFullYear();
    var month = ('0'+(date.getMonth()+1)).slice(-2);
    var day = ('0'+date.getDate()).slice(-2);
    var ks = year+'-'+month+'-'+day
    var jsyear = date.getFullYear();
    var jsmonth = ('0'+(date.getMonth()+4)).slice(-2);
    var jsday = ('0'+date.getDate()).slice(-2);
    var js = jsyear+'-'+jsmonth+'-'+jsday
    const selectedYear = document.getElementById('ksrq').value || null;
    // 显示加载中
    showLoading();
    $ajax({
        type: 'post',
        url: '/yjbb/list',
        contentType: 'application/json',
        data: JSON.stringify({
            pageNum: currentPage,
            pageSize: pageSize,
            keyword: keyword,
            selectedYear:selectedYear
        }),
        dataType: 'json'
    }, false, '', function (res) {
        hideLoading();
        if (res.success) {
            console.log("返回的应收账款信息", res);
            processedData = transformData(res.data.list);
            fillTable(processedData);
            totalCount = processedData.length;
            totalPages  = Math.ceil(totalCount / pageSize);
            updatePagination();

            // 数据加载完成后，自动更新图表（如果有选中的负责人）
            const personSelect = document.getElementById('fzrDropdown');
            if (personSelect && personSelect.value) {
                setTimeout(() => {
                    onPersonChange(personSelect.value);
                }, 100);
            }
        } else {
            console.error("查询失败:", res.message);
            swal("查询失败: " + res.message);
        }
    })
}


function getfzr() {
    $ajax({
        type: 'post',
        url: '/yjbb/getfzr',
        contentType: 'application/json',
        data: JSON.stringify({
        }),
        dataType: 'json'
    }, false, '', function (res) {
        if (res.code == 200) {
            console.log("返回的员工信息", res);
            populateFzrDropdownJQuery(res.data);
        } else {
            console.error("查询失败:", res.message);
            swal("查询失败: " + res.message);
        }
    })
}
function populateFzrDropdownJQuery(data) {
    const $dropdown = $('#fzrDropdown');

    if ($dropdown.length === 0) {
        console.error('下拉框元素未找到');
        return;
    }

    // 清空并添加默认选项
    $dropdown.empty().append('<option value="">请选择负责人</option>');

    // 添加负责人选项
    $.each(data, function(index, item) {
        $dropdown.append($('<option>', {
            value: item.fzr,
            text: (item.xm)
        }));
    });

    console.log(`成功添加 ${data.length} 个负责人选项`);
}
function updatePagination() {
    // 移除旧的分页控件
    $('#paginationContainer').remove();

    // 创建分页容器
    var paginationHtml = `
        <div id="paginationContainer" class="pagination-container">
            <div class="pagination-info">
                共 <span class="total-count">${totalCount}</span> 条记录，
                第 <span class="current-page">${currentPage}</span> 页 / 共 <span class="total-pages">${totalPages}</span> 页
            </div>
            <div class="pagination-controls">
                <button class="pagination-btn first-page" ${currentPage === 1 ? 'disabled' : ''}>首页</button>
                <button class="pagination-btn prev-page" ${currentPage === 1 ? 'disabled' : ''}>上一页</button>
                
                <div class="page-numbers">
    `;

    // 生成页码按钮
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
        </div>
    `;

    // 插入分页控件
    $('.table-waiceng').after(paginationHtml);

    // 绑定分页事件
    bindPaginationEvents();
}

function bindPaginationEvents() {
    // 首页
    $('.first-page').click(function() {
        if (!$(this).prop('disabled')) {
            currentPage = 1;
            getList(currentPage, pageSize, getCurrentKeyword());
        }
    });

    // 上一页
    $('.prev-page').click(function() {
        if (!$(this).prop('disabled')) {
            currentPage--;
            getList(currentPage, pageSize, getCurrentKeyword());
        }
    });

    // 下一页
    $('.next-page').click(function() {
        if (!$(this).prop('disabled')) {
            currentPage++;
            getList(currentPage, pageSize, getCurrentKeyword());
        }
    });

    // 末页
    $('.last-page').click(function() {
        if (!$(this).prop('disabled')) {
            currentPage = totalPages;
            getList(currentPage, pageSize, getCurrentKeyword());
        }
    });

    // 页码点击
    $('.page-number').click(function() {
        var page = parseInt($(this).text());
        if (page !== currentPage) {
            currentPage = page;
            getList(currentPage, pageSize, getCurrentKeyword());
        }
    });

    // 页大小改变
    $('.page-size-select').change(function() {
        pageSize = parseInt($(this).val());
        currentPage = 1; // 切换页大小时回到第一页
        getList(currentPage, pageSize, getCurrentKeyword());
    });

    // 页码跳转
    $('.jump-btn').click(function() {
        var targetPage = parseInt($('.page-jump-input').val());
        if (targetPage && targetPage >= 1 && targetPage <= totalPages) {
            currentPage = targetPage;
            getList(currentPage, pageSize, getCurrentKeyword());
        } else {
            swal('请输入有效的页码（1-' + totalPages + '）');
        }
    });

    // 回车跳转
    $('.page-jump-input').keypress(function(e) {
        if (e.which === 13) { // 回车键
            $('.jump-btn').click();
        }
    });
}

// 获取当前搜索关键词
function getCurrentKeyword() {
    // 假设你有一个搜索输入框，根据实际情况修改
    return $('#searchInput').val() || '';
}
function showLoading() {
    // 可以在表格区域显示加载提示
    $('#yjbbTable').html('<tr><td colspan="12" style="text-align: center; padding: 20px;">加载中...</td></tr>');
}

// 隐藏加载中
function hideLoading() {
    // 加载完成后的处理
}

function fillTable(data) {
    // 清空表格
    $('#yjbbTable').empty();

    // 创建表头
    var tableHeader = `
        <thead >
         <tr style="color:#eb6464;font-size: 10px">
                <th >表格内数据为该年每月销售额</th>
                <th ></th>
                <th></th>
                <th ></th>
                <th ></th>
                <th ></th>
                <th ></th>
                <th ></th>
                <th ></th>
                <th ></th>
                <th ></th>
                <th ></th>
                <th ></th>
                <th ></th>
            </tr>
            <tr>
                <th >工号</th>
                <th >姓名</th>
                <th>一月</th>
                <th >二月</th>
                <th >三月</th>
                <th >四月</th>
                <th >五月</th>
                <th >六月</th>
                <th >七月</th>
                <th >八月</th>
                <th >九月</th>
                <th >十月</th>
                <th >十一月</th>
                <th >十二月</th>
            </tr>
        </thead>
    `;

    // 创建表格内容
    var tableBody = '<tbody>';

    if (data && data.length > 0) {
        data.forEach(function(item, index) {
            // 处理空值显示


            tableBody += `
                <tr>
                    <td>${item.gh || '-'}</td>
                    <td>${item.fzr || '-'}</td>
                    <td>${item.yiyue || '-'}</td>
                    <td>${item.eryue || '-'}</td>
                    <td>${item.sanyue || '-'}</td>
                    <td>${item.siyue || '-'}</td>
                    <td>${item.wuyue || '-'}</td>
                    <td>${item.liuyue || '-'}</td>
                    <td>${item.qiyue || '-'}</td>
                    <td>${item.bayue || '-'}</td>
                    <td>${item.jiuyue || '-'}</td>
                    <td>${item.shiyue || '-'}</td>
                    <td>${item.shiyiyue || '-'}</td>
                    <td>${item.shieryue || '-'}</td>
                </tr>
            `;
        });
    } else {
        tableBody += `
            <tr>
                <td colspan="12" style="text-align: center; color: #999;">暂无业绩报表数据</td>
            </tr>
        `;
    }

    tableBody += '</tbody>';

    // 组合表格
    $('#yjbbTable').html(tableHeader + tableBody);




}

/**
 * 将按月份平铺的数据转换为按人员汇总的透视表格式
 * @param {Array} apiData - 原始API数据
 * @returns {Array} 转换后的透视表数据
 */
function transformData(apiData) {
    if (!Array.isArray(apiData)) {
        console.warn('transformData: 输入数据不是数组');
        return [];
    }

    console.log('transformData输入数据:', apiData);

    const resultMap = new Map();

    apiData.forEach((item, index) => {
        console.log(`处理第${index}条数据:`, item);

        // 增强数据验证
        if (!item) {
            console.warn('transformData: 数据项为空');
            return;
        }

        if (item.gh == null) {
            console.warn('transformData: 工号为空', item);
            return;
        }

        if (item.month == null) {
            console.warn('transformData: 月份为空', item);
            return;
        }

        const monthField = getMonthField(Number(item.month));
        if (!monthField) {
            console.warn(`transformData: 无效的月份 ${item.month}`, item);
            return;
        }

        // 创建或获取记录
        if (!resultMap.has(item.gh)) {
            const newRecord = {
                gh: item.gh,
                fzr: item.fzr || '',
                xm: item.xm || ''
            };
            console.log('创建新记录:', newRecord);
            resultMap.set(item.gh, newRecord);
        }

        const record = resultMap.get(item.gh);
        console.log('获取记录:', record, '工号:', item.gh);

        if (!record) {
            console.error('transformData: 记录不存在，工号:', item.gh);
            return;
        }

        // 设置月份值
        const zjValue = Number(item.zj) || 0;
        console.log(`设置 ${monthField} = ${zjValue}`);
        record[monthField] = zjValue;
    });

    const result = Array.from(resultMap.values());
    console.log('transformData最终结果:', result);
    return result;
}

/**
 * 将数字月份转换为对应的字段名
 * @param {number} month - 月份(1-12)
 * @returns {string} 月份字段名
 */
function getMonthField(month) {
    const monthMap = {
        1: 'yiyue', 2: 'eryue', 3: 'sanyue', 4: 'siyue',
        5: 'wuyue', 6: 'liuyue', 7: 'qiyue', 8: 'bayue',
        9: 'jiuyue', 10: 'shiyue', 11: 'shiyiyue', 12: 'shieryue'
    };
    return monthMap[month] || '';
}

// 添加分页样式



function initToolbarEvents() {
    $('#select-btn').click(function () {

        getList();
    });

}

// 动态生成年份选项
function initYearDropdown() {
    const yearSelect = document.getElementById('ksrq');
    if (!yearSelect) return;

    // 清空现有选项
    yearSelect.innerHTML = '<option value="">请选择年份</option>';

    // 设置年份范围（例如：从当前年份往前10年，往后2年）
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    const endYear = 2100;

    // 生成年份选项
    for (let year = endYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year + '年';

        // 默认选中当前年份
        if (year === currentYear) {
            option.selected = true;
        }

        yearSelect.appendChild(option);
    }

    console.log('年份下拉框初始化完成');
}
// 初始化调用
$(document).ready(function() {
    initYearDropdown();
    initToolbarEvents();
    initChart(emptyData,startname);
    getList();
    getfzr();

});


