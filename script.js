// 图表实例
let myChart;

// 当前数据
let currentData = {
    labels: ['产品A', '产品B', '产品C', '产品D', '产品E', '产品F'],
    values: [12, 19, 3, 15, 8, 22],
    title: '产品销售额对比 (已更新v2)'
};

// 初始化
function init() {
    // 加载默认数据（增加更多数据点）
    loadData(currentData);
    
    // 绑定事件监听器
    document.getElementById('chartType').addEventListener('change', updateChart);
    document.getElementById('updateChart').addEventListener('click', updateChart);
    document.getElementById('resetData').addEventListener('click', resetData);
}

// 加载数据到输入框
function loadData(data) {
    document.getElementById('dataLabels').value = data.labels.join(',');
    document.getElementById('dataValues').value = data.values.join(',');
    document.getElementById('chartTitle').value = data.title;
    currentData = data;
    updateChart();
}

// 重置数据
function resetData() {
    loadData(currentData);
}

// 解析输入数据
function parseInputData() {
    const labelsInput = document.getElementById('dataLabels').value;
    const valuesInput = document.getElementById('dataValues').value;
    const title = document.getElementById('chartTitle').value || '销售数据图表';
    
    let labels = labelsInput.split(',').map(label => label.trim()).filter(label => label);
    let values = valuesInput.split(',').map(value => {
        const num = parseFloat(value.trim());
        return isNaN(num) ? 0 : num;
    });
    
    // 当数据量不足时，自动扩充数据
    if (values.length < 3) {
        const minValue = values.length > 0 ? Math.min(...values) : 1;
        const maxValue = values.length > 0 ? Math.max(...values) : 10;
        
        while (values.length < 6) {
            values.push(Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
        }
        
        while (labels.length < values.length) {
            labels.push(`数据${labels.length + 1}`);
        }
    }
    
    // 确保标签和值数量一致
    const maxLength = Math.max(labels.length, values.length);
    
    return {
        labels: labels.slice(0, maxLength),
        values: values.slice(0, maxLength),
        title: title
    };
}

// 更新图表
function updateChart() {
    const chartType = document.getElementById('chartType').value;
    let data = parseInputData();
    
    // 根据图表类型进一步优化数据
    data = optimizeDataForChartType(data, chartType);
    
    const chartConfig = getChartConfig(data, chartType);
    
    const ctx = document.getElementById('myChart').getContext('2d');
    
    if (myChart) {
        myChart.destroy();
    }
    
    myChart = new Chart(ctx, chartConfig);
    
    // 添加动画效果
    animateChart();
}

// 根据图表类型优化数据
function optimizeDataForChartType(data, chartType) {
    const optimizedData = { ...data };
    
    switch (chartType) {
        case 'boxplot':
            // 为箱线图生成更多数据点以显示分布
            if (data.values.length < 10) {
                const originalData = [...data.values];
                const mean = originalData.reduce((a, b) => a + b, 0) / originalData.length;
                const std = Math.sqrt(originalData.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / originalData.length);
                
                while (optimizedData.values.length < 15) {
                    const randomValue = mean + (Math.random() - 0.5) * 2 * std;
                    optimizedData.values.push(Math.max(0, randomValue));
                }
                
                while (optimizedData.labels.length < optimizedData.values.length) {
                    optimizedData.labels.push(`数据${optimizedData.labels.length + 1}`);
                }
            }
            break;
            
        case 'errorBar':
            // 误差棒图只使用用户输入的数据，不自动生成额外数据
            if (data.values.length < 2) {
                // 如果数据不足，至少需要2个数据点
                while (optimizedData.values.length < 2) {
                    optimizedData.values.push(Math.max(1, (optimizedData.values.length + 1) * 5));
                }
                while (optimizedData.labels.length < optimizedData.values.length) {
                    optimizedData.labels.push(`数据${optimizedData.labels.length + 1}`);
                }
            }
            break;
            
        case 'radar':
            // 雷达图需要至少3个数据点
            if (data.values.length < 3) {
                while (optimizedData.values.length < 6) {
                    optimizedData.values.push(Math.floor(Math.random() * 20) + 5);
                }
                while (optimizedData.labels.length < optimizedData.values.length) {
                    optimizedData.labels.push(`特性${optimizedData.labels.length + 1}`);
                }
            }
            break;
            
        case 'histogram':
            // 直方图需要更多数据点
            if (data.values.length < 10) {
                const mean = data.values.reduce((a, b) => a + b, 0) / data.values.length;
                for (let i = 0; i < 15; i++) {
                    optimizedData.values.push(Math.max(1, mean + (Math.random() - 0.5) * mean));
                }
                optimizedData.labels = ['数据分布'];
            }
            break;
    }
    
    return optimizedData;
}

// 获取图表配置
function getChartConfig(data, chartType) {
    const colors = generateColors(data.values.length);
    
    const baseConfig = {
        data: {
            labels: data.labels,
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 30,
                    right: 30,
                    bottom: 30,
                    left: 30
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: data.title,
                    font: {
                        size: 22,
                        weight: 'bold'
                    },
                    padding: {
                        top: 20,
                        bottom: 20
                    }
                },
                legend: {
                    display: !['pie', 'doughnut', 'radar'].includes(chartType),
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 20,
                        boxWidth: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    };
    
    switch (chartType) {
        case 'line':
            baseConfig.type = 'line';
            baseConfig.data.datasets = [{
                label: '数据系列',
                data: data.values,
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#4f46e5',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 10
            }];
            baseConfig.options.scales = {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 10
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 10
                    }
                }
            };
            break;
            
        case 'bar':
            baseConfig.type = 'bar';
            baseConfig.data.datasets = [{
                label: '数据系列',
                data: data.values,
                backgroundColor: colors.map(color => color),
                borderColor: colors.map(color => color),
                borderWidth: 2,
                borderRadius: 4
            }];
            baseConfig.options.scales = {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 10
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 10
                    }
                }
            };
            break;
            
        case 'stackedBar':
            baseConfig.type = 'bar';
            const stackedData = createStackedData(data.values, 3);
            baseConfig.data.datasets = stackedData.map((values, index) => ({
                label: `系列${index + 1}`,
                data: values,
                backgroundColor: colors[index],
                borderColor: colors[index],
                borderWidth: 1,
                borderRadius: 3
            }));
            baseConfig.options.scales = {
                y: {
                    stacked: true,
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 10
                    }
                },
                x: {
                    stacked: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 10
                    }
                }
            };
            break;
            
        case 'horizontalBar':
            baseConfig.type = 'bar';
            baseConfig.data.datasets = [{
                label: '数据系列',
                data: data.values,
                backgroundColor: colors.map(color => color),
                borderColor: colors.map(color => color),
                borderWidth: 2,
                borderRadius: 4
            }];
            baseConfig.options.indexAxis = 'y';
            baseConfig.options.scales = {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 10
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 15
                    }
                }
            };
            break;
            
        case 'stackedHorizontalBar':
            baseConfig.type = 'bar';
            const stackedHorizontalData = createStackedData(data.values, 3);
            baseConfig.data.datasets = stackedHorizontalData.map((values, index) => ({
                label: `系列${index + 1}`,
                data: values,
                backgroundColor: colors[index],
                borderColor: colors[index],
                borderWidth: 1,
                borderRadius: 3
            }));
            baseConfig.options.indexAxis = 'y';
            baseConfig.options.scales = {
                x: {
                    stacked: true,
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 10
                    }
                },
                y: {
                    stacked: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 15
                    }
                }
            };
            break;
            
        case 'histogram':
            baseConfig.type = 'bar';
            const histogramData = generateHistogramData(data.values);
            baseConfig.data.labels = histogramData.bins;
            baseConfig.data.datasets = [{
                label: '频率分布',
                data: histogramData.frequencies,
                backgroundColor: colors.map(color => color),
                borderColor: colors.map(color => color),
                borderWidth: 0,
                barPercentage: 1.0,
                categoryPercentage: 1.0
            }];
            baseConfig.options.scales = {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '频率',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 10
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 10
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '数据区间',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 10
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 11,
                            weight: 'bold'
                        },
                        padding: 5
                    }
                }
            };
            break;
            
        case 'pie':
            baseConfig.type = 'pie';
            baseConfig.data.datasets = [{
                data: data.values,
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: 0.3,
                hoverOffset: 1
            }];
            baseConfig.options.plugins = {
                title: {
                    display: true,
                    text: data.title,
                    font: {
                        size: 8,
                        weight: 'bold'
                    },
                    padding: {
                        top: 1,
                        bottom: 1
                    }
                },
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        font: {
                            size: 6,
                            weight: 'bold'
                        },
                        padding: 1,
                        boxWidth: 3,
                        usePointStyle: true
                    }
                }
            };
            // 进一步减小饼图大小
            baseConfig.options.layout = {
                padding: {
                    top: 1,
                    right: 1,
                    bottom: 1,
                    left: 1
                }
            };
            // 减小饼图半径
            baseConfig.options.cutout = '0%';
            break;
            
        case 'doughnut':
            baseConfig.type = 'doughnut';
            baseConfig.data.datasets = [{
                data: data.values,
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: 0.3,
                hoverOffset: 1
            }];
            baseConfig.options.plugins = {
                title: {
                    display: true,
                    text: data.title,
                    font: {
                        size: 8,
                        weight: 'bold'
                    },
                    padding: {
                        top: 1,
                        bottom: 1
                    }
                },
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        font: {
                            size: 6,
                            weight: 'bold'
                        },
                        padding: 1,
                        boxWidth: 3,
                        usePointStyle: true
                    }
                }
            };
            // 进一步减小环形图大小
            baseConfig.options.layout = {
                padding: {
                    top: 1,
                    right: 1,
                    bottom: 1,
                    left: 1
                }
            };
            // 减小环形图洞大小
            baseConfig.options.cutout = '30%';
            break;
            
        case 'scatter':
            baseConfig.type = 'scatter';
            baseConfig.data.datasets = [{
                label: '散点分布',
                data: data.values.map((value, index) => ({
                    x: index,
                    y: value
                })),
                backgroundColor: colors[0],
                borderColor: colors[0],
                borderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 12
            }];
            baseConfig.options.scales = {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 10
                    }
                },
                x: {
                    type: 'linear',
                    position: 'bottom',
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 10
                    }
                }
            };
            break;
            
        case 'bubble':
            baseConfig.type = 'bubble';
            baseConfig.data.datasets = [{
                label: '气泡分布',
                data: data.values.map((value, index) => ({
                    x: index,
                    y: value,
                    r: Math.max(8, value / 3)
                })),
                backgroundColor: colors[0],
                borderColor: colors[0],
                borderWidth: 1
            }];
            baseConfig.options.scales = {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 10
                    }
                },
                x: {
                    type: 'linear',
                    position: 'bottom',
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 10
                    }
                }
            };
            break;
            
        case 'boxplot':
            // 实现真正的箱线图效果
            return getBoxplotConfig(data);
            
        case 'radar':
            baseConfig.type = 'radar';
            // 确保雷达图有足够的标签
            if (data.labels.length < 3) {
                const radarLabels = ['产品质量', '客户服务', '市场推广', '运营效率', '技术创新', '品牌价值'];
                baseConfig.data.labels = radarLabels.slice(0, Math.max(3, data.values.length));
                const radarValues = [...data.values];
                while (radarValues.length < baseConfig.data.labels.length) {
                    radarValues.push(Math.max(1, radarValues[radarValues.length - 1] * 0.8));
                }
                baseConfig.data.datasets[0].data = radarValues.slice(0, baseConfig.data.labels.length);
            } else {
                baseConfig.data.datasets = [{
                    label: '关键指标评分',
                    data: data.values,
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderColor: '#4f46e5',
                    borderWidth: 1,
                    pointBackgroundColor: '#4f46e5',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#4f46e5',
                    pointRadius: 1,
                    pointHoverRadius: 2
                }];
            }
            baseConfig.options.scales = {
                r: {
                    beginAtZero: true,
                    suggestedMax: Math.max(...data.values) * 1.05,
                    ticks: {
                        stepSize: Math.max(1, Math.ceil(Math.max(...data.values) / 8)),
                        font: {
                            size: 6,
                            weight: 'bold'
                        },
                        backdropColor: 'rgba(255, 255, 255, 0.5)',
                        backdropPadding: 0
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        lineWidth: 0.2,
                        circular: true
                    },
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        lineWidth: 0.2
                    },
                    pointLabels: {
                        font: {
                            size: 7,
                            weight: 'bold'
                        },
                        padding: 0.5,
                        color: '#374151'
                    }
                }
            };
            // 进一步减小雷达图大小
            baseConfig.options.layout = {
                padding: {
                    top: 1,
                    right: 1,
                    bottom: 1,
                    left: 1
                }
            };
            break;
            
        case 'errorBar':
            // 实现真正的误差棒图
            return getErrorBarConfig(data);
    }
    
    return baseConfig;
}

// 箱线图专用配置
function getBoxplotConfig(data) {
    const boxplotData = generateTrueBoxplotData(data.values);
    
    // 使用折线图模拟箱线图效果
    return {
        type: 'line',
        data: {
            labels: ['', '最小值', 'Q1', '中位数', 'Q3', '最大值', ''],
            datasets: [
                {
                    label: '箱线图',
                    data: [null, boxplotData[0], boxplotData[1], boxplotData[2], boxplotData[3], boxplotData[4], null],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.3)',
                    borderWidth: 2,
                    fill: false,
                    stepped: 'middle',
                    tension: 0,
                    pointStyle: 'rectRot',
                    pointRadius: 8,
                    pointHoverRadius: 12
                },
                {
                    label: '箱体范围',
                    data: [null, null, boxplotData[1], null, boxplotData[3], null, null],
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderColor: 'rgba(79, 70, 229, 0.3)',
                    borderWidth: 0,
                    fill: true,
                    tension: 0,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: data.title + ' - 数据分布箱线图',
                    font: { size: 18, weight: 'bold' },
                    padding: 20
                },
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const labels = ['最小值', '第一四分位数 (Q1)', '中位数', '第三四分位数 (Q3)', '最大值'];
                            const value = context.dataset.data[context.dataIndex];
                            const index = context.dataIndex - 1;
                            if (index >= 0 && index < labels.length) {
                                return `${labels[index]}: ${value}`;
                            }
                            return `值: ${value}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: '数据值' }
                },
                x: {
                    title: { display: true, text: '统计指标' }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    };
}

// 误差棒图专用配置
function getErrorBarConfig(data) {
    const errorBarData = generateTrueErrorBarData(data.values);
    
    return {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: '数据值',
                    data: errorBarData.values,
                    backgroundColor: 'rgba(79, 70, 229, 0.8)',
                    borderColor: '#4f46e5',
                    borderWidth: 2,
                    barPercentage: 0.6
                },
                {
                    label: '误差范围',
                    data: errorBarData.errors,
                    backgroundColor: 'rgba(239, 68, 68, 0.6)',
                    borderColor: '#ef4444',
                    borderWidth: 1,
                    barPercentage: 0.6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: data.title + ' - 数据测量误差分析',
                    font: { size: 18, weight: 'bold' },
                    padding: 20
                },
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.dataset.data[context.dataIndex];
                            if (context.datasetIndex === 0) {
                                const errorValue = errorBarData.errors[context.dataIndex];
                                return `数据值: ${value} ± ${errorValue}`;
                            } else {
                                return `误差范围: ${value}`;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: '数值和误差' }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    };
}

// 生成更美观的颜色数组
function generateColors(count) {
    const baseColors = [
        '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#ec4899',
        '#14b8a6', '#f43f5e', '#a855f7', '#3b82f6', '#eab308'
    ];
    
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
}

// 创建堆积数据
function createStackedData(values, seriesCount) {
    const stackedData = [];
    for (let i = 0; i < seriesCount; i++) {
        stackedData.push(values.map(value => Math.max(1, value * (0.2 + i * 0.3))));
    }
    return stackedData;
}

// 生成直方图数据
function generateHistogramData(values) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const binCount = Math.min(8, Math.max(4, Math.floor(values.length / 3)));
    const binSize = range / binCount;
    
    const bins = [];
    const frequencies = new Array(binCount).fill(0);
    
    for (let i = 0; i < binCount; i++) {
        const binStart = min + i * binSize;
        const binEnd = min + (i + 1) * binSize;
        bins.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
    }
    
    values.forEach(value => {
        const binIndex = Math.min(binCount - 1, Math.floor((value - min) / binSize));
        frequencies[binIndex]++;
    });
    
    return { bins, frequencies };
}

// 生成真正的箱线图数据 - 五数概括
function generateTrueBoxplotData(values) {
    if (values.length === 0) return [0, 0, 0, 0, 0];
    
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    
    // 计算最小值、Q1、中位数、Q3、最大值
    const min = sorted[0];
    const max = sorted[n - 1];
    
    // 计算中位数
    const median = n % 2 === 0 ? 
        (sorted[n/2 - 1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)];
    
    // 计算Q1和Q3
    const q1Index = Math.floor(n * 0.25);
    const q3Index = Math.floor(n * 0.75);
    const q1 = n % 4 === 0 ? 
        (sorted[q1Index - 1] + sorted[q1Index]) / 2 : sorted[q1Index];
    const q3 = n % 4 === 0 ? 
        (sorted[q3Index - 1] + sorted[q3Index]) / 2 : sorted[q3Index];
    
    return [min, q1, median, q3, max];
}

// 生成真正的误差棒图数据
function generateTrueErrorBarData(values) {
    // 为每个数据点生成一个合理的误差值（15%-25%的数据值）
    const errors = values.map(value => 
        Math.max(1, value * (0.15 + Math.random() * 0.1))
    );
    
    return {
        values: values,
        errors: errors
    };
}

// 添加动画效果
function animateChart() {
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.style.opacity = '0';
    chartContainer.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        chartContainer.style.transition = 'all 0.5s ease';
        chartContainer.style.opacity = '1';
        chartContainer.style.transform = 'scale(1)';
    }, 100);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);