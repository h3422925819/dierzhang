// 预设数据集
const salesData = {
    months: ['1月', '2月', '3月', '4月', '5月', '6月'],
    products: ['手机', '笔记本', '平板', '耳机', '智能手表', '显示器'],
    regions: ['华东', '华南', '华北', '华中', '西南', '西北'],
    priceRanges: ['0-1000', '1001-2000', '2001-3000', '3001-4000', '4001-5000', '5000+'],
    
    // 销售数据
    lineChart: {
        dataset1: [120, 190, 170, 210, 180, 230],
        dataset2: [90, 120, 110, 150, 130, 180]
    },
    
    barChart: {
        dataset1: [65, 59, 80, 81, 56, 55],
        dataset2: [28, 48, 40, 19, 86, 27]
    },
    
    horizontalBarChart: {
        dataset1: [45, 30, 60, 35, 50, 40],
        dataset2: [20, 35, 45, 25, 30, 50]
    },
    
    areaChart: {
        dataset1: [30, 40, 60, 50, 70, 45],
        dataset2: [15, 25, 35, 45, 55, 65]
    },
    
    histogram: [12, 19, 23, 17, 25, 18],
    
    pieChart: [35, 25, 15, 10, 8, 7]
};

// 图表实例
const charts = {};

// 初始化所有图表
function initCharts() {
    // 折线图
    charts.lineChart = new Chart(
        document.getElementById('lineChart'),
        {
            type: 'line',
            data: {
                labels: salesData.months,
                datasets: [{
                    label: '线上销售',
                    data: salesData.lineChart.dataset1,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1,
                    fill: false
                }, {
                    label: '线下销售',
                    data: salesData.lineChart.dataset2,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: getCommonOptions('月度销售趋势')
        }
    );

    // 柱形图
    charts.barChart = new Chart(
        document.getElementById('barChart'),
        {
            type: 'bar',
            data: {
                labels: salesData.products,
                datasets: [{
                    label: '2024年',
                    data: salesData.barChart.dataset1,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 1
                }, {
                    label: '2023年',
                    data: salesData.barChart.dataset2,
                    backgroundColor: 'rgba(255, 159, 64, 0.7)',
                    borderColor: 'rgb(255, 159, 64)',
                    borderWidth: 1
                }]
            },
            options: getCommonOptions('产品销量对比', true)
        }
    );

    // 条形图
    charts.horizontalBarChart = new Chart(
        document.getElementById('horizontalBarChart'),
        {
            type: 'bar',
            data: {
                labels: salesData.regions,
                datasets: [{
                    label: 'Q1',
                    data: salesData.horizontalBarChart.dataset1,
                    backgroundColor: 'rgba(153, 102, 255, 0.7)',
                    borderColor: 'rgb(153, 102, 255)',
                    borderWidth: 1
                }, {
                    label: 'Q2',
                    data: salesData.horizontalBarChart.dataset2,
                    backgroundColor: 'rgba(255, 206, 86, 0.7)',
                    borderColor: 'rgb(255, 206, 86)',
                    borderWidth: 1
                }]
            },
            options: {
                ...getCommonOptions('地区销售分布', true),
                indexAxis: 'y'
            }
        }
    );

    // 面积图
    charts.areaChart = new Chart(
        document.getElementById('areaChart'),
        {
            type: 'line',
            data: {
                labels: salesData.months,
                datasets: [{
                    label: '线上渠道',
                    data: salesData.areaChart.dataset1,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: true
                }, {
                    label: '线下渠道',
                    data: salesData.areaChart.dataset2,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                    fill: '+1'
                }]
            },
            options: getCommonOptions('销售渠道分布')
        }
    );

    // 直方图
    charts.histogramChart = new Chart(
        document.getElementById('histogramChart'),
        {
            type: 'bar',
            data: {
                labels: salesData.priceRanges,
                datasets: [{
                    label: '价格分布',
                    data: salesData.histogram,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)'
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 206, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(153, 102, 255)',
                        'rgb(255, 159, 64)'
                    ],
                    borderWidth: 1
                }]
            },
            options: getCommonOptions('产品价格分布')
        }
    );

    // 饼图
    charts.pieChart = new Chart(
        document.getElementById('pieChart'),
        {
            type: 'pie',
            data: {
                labels: salesData.regions,
                datasets: [{
                    data: salesData.pieChart,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)'
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 206, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(153, 102, 255)',
                        'rgb(255, 159, 64)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                ...getCommonOptions('市场份额'),
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        }
    );
}

// 获取通用图表配置
function getCommonOptions(title, stacked = false) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: title,
                font: {
                    size: 16
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            y: {
                beginAtZero: true,
                stacked: stacked
            },
            x: {
                stacked: stacked
            }
        }
    };
}

// 更新图表数据
function updateLineChart() {
    charts.lineChart.data.datasets[0].data = salesData.lineChart.dataset1.map(v => v * (0.9 + Math.random() * 0.2));
    charts.lineChart.data.datasets[1].data = salesData.lineChart.dataset2.map(v => v * (0.9 + Math.random() * 0.2));
    charts.lineChart.update();
}

function updateBarChart() {
    charts.barChart.data.datasets[0].data = salesData.barChart.dataset1.map(v => v * (0.8 + Math.random() * 0.4));
    charts.barChart.data.datasets[1].data = salesData.barChart.dataset2.map(v => v * (0.8 + Math.random() * 0.4));
    charts.barChart.update();
}

function updateHorizontalBarChart() {
    charts.horizontalBarChart.data.datasets[0].data = salesData.horizontalBarChart.dataset1.map(v => v * (0.8 + Math.random() * 0.4));
    charts.horizontalBarChart.data.datasets[1].data = salesData.horizontalBarChart.dataset2.map(v => v * (0.8 + Math.random() * 0.4));
    charts.horizontalBarChart.update();
}

function updateAreaChart() {
    charts.areaChart.data.datasets[0].data = salesData.areaChart.dataset1.map(v => v * (0.9 + Math.random() * 0.2));
    charts.areaChart.data.datasets[1].data = salesData.areaChart.dataset2.map(v => v * (0.9 + Math.random() * 0.2));
    charts.areaChart.update();
}

function updateHistogram() {
    charts.histogramChart.data.datasets[0].data = salesData.histogram.map(v => Math.floor(v * (0.7 + Math.random() * 0.6)));
    charts.histogramChart.update();
}

function updatePieChart() {
    charts.pieChart.data.datasets[0].data = salesData.pieChart.map(v => Math.floor(v * (0.8 + Math.random() * 0.4)));
    charts.pieChart.update();
}

// 切换堆积模式
function toggleStacked(chartId) {
    const chart = charts[chartId];
    const isStacked = chart.options.scales.y.stacked;
    
    chart.options.scales.y.stacked = !isStacked;
    chart.options.scales.x.stacked = !isStacked;
    chart.update();
}

// 切换圆环图
function toggleDoughnut() {
    const isDoughnut = charts.pieChart.config.type === 'doughnut';
    charts.pieChart.config.type = isDoughnut ? 'pie' : 'doughnut';
    charts.pieChart.update();
}

// 添加图表交互
function setupChartInteractions() {
    document.querySelectorAll('canvas').forEach(canvas => {
        canvas.addEventListener('click', function(e) {
            const chart = Object.values(charts).find(c => c.canvas === this);
            if (chart) {
                const activePoints = chart.getElementsAtEventForMode(
                    e, 'nearest', { intersect: true }, false
                );
                if (activePoints.length > 0) {
                    const datasetIndex = activePoints[0].datasetIndex;
                    const dataIndex = activePoints[0].index;
                    const label = chart.data.labels[dataIndex];
                    const value = chart.data.datasets[datasetIndex].data[dataIndex];
                    const datasetLabel = chart.data.datasets[datasetIndex].label;
                    
                    alert(`选中数据点:\n${datasetLabel} - ${label}\n数值: ${value}`);
                }
            }
        });
    });
}

// 初始化
window.onload = function() {
    initCharts();
    setupChartInteractions();
};