// echarts
const chartStore = {
    pie: null,
    bar: null,
    line: null,
}

const optionForPie = function(data) {
    let option = {
        title: {
            text: '地区占比',
            x: 'center',
            y: '50px'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
            {
                name: '地区占比',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: data,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }

    return option
}

const optionForArea = function(area) {
    let data = _.map(area, (v, k) => {
        let o = {
            name: k,
            value: v.length,
        }
        return o
    })
    let option = optionForPie(data)
    return option
}

const optionForBar = function(data) {
    let option = {
        title: {
            text: '类型划分',
            x: 'center'
        },
        xAxis: {
            data: data.axis,
            name: '电影类型',
            axisLabel: {
                textStyle: {
                    color: '#000'
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            z: 10
        },
        yAxis: {
            name: '电影数量',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#999'
                }
            }
        },
        series: [
            {
                type: 'bar',
                itemStyle: {
                    normal: {color: 'rgba(0,0,0,0.05)'}
                },
                barGap:'-100%',
                barCategoryGap:'40%',
                animation: false
            },
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#83bff6'},
                                {offset: 0.5, color: '#188df0'},
                                {offset: 1, color: '#188df0'}
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#2378f7'},
                                {offset: 0.7, color: '#2378f7'},
                                {offset: 1, color: '#83bff6'}
                            ]
                        )
                    }
                },
                data: data.data
            }
        ]
    }
    return option
}

const optionForType = function(type) {
    let data = {
        axis: [],
        data: [],
    }
    _.each(type, (v, k) => {
        data.axis.push(k)
        data.data.push(v.length)
    })
    let option = optionForBar(data)
    return option
}

const optionForLine = function(data) {
    let option = {
        title: {
            text: '平均分数',
            x: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                params = params[0]
                let value = params.value
                let s = value[0] + ': ' + value[1]
                return s
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            name: '上映时间',
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            name: '平均分',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            },
            min: 8,
        },
        series: [{
            name: '模拟数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: data
        }]
    };
    return option
}

const optionForYear = function(year) {
    let data = _.map(year, (v, k) => {
        let avg = _.meanBy(v, 'score')
        let o = {
            name: k,
            value: [k, avg.toFixed(2)],
        }
        return o
    })
    let option = optionForLine(data)
    return option
}

const renderChart = function(d) {
    let data = d

    let area = _.groupBy(data, 'area')
    let areaOption = optionForArea(area)
    let pie = chartStore.pie
    pie.setOption(areaOption)

    let type = _.groupBy(data, 'type')
    let typeOption = optionForType(type)
    let bar = chartStore.bar
    bar.setOption(typeOption)

    let year = _.groupBy(data, 'year')
    let yearOption = optionForYear(year)
    let line = chartStore.line
    line.setOption(yearOption)
}

const fetchMovies = function() {
    let protocol = location.protocol
    if (protocol === 'http:') {
        api.fetchMovies(function (d) {
            d = JSON.parse(d)
            renderChart(d)
        })
    } else {
        let d = movieJSON()
        renderChart(d)
    }
}

const initedChart = function() {
    _.each(chartStore, (v, k) => {
        let selector = '#' + k
        let element = document.querySelector(selector)
        let chart = echarts.init(element)
        chartStore[k] = chart
    })
}

const __main = function() {
    initedChart()
    fetchMovies()
}

$(document).ready(function() {
    __main()
})
