(function () {
    var chart4 = echarts.init(document.getElementById('chart4'));
    var chart5 = echarts.init(document.getElementById('chart5'));
    var chart61 = echarts.init(document.getElementById('chart61'));

    var option4 = {
        backgroundColor: '#fff',

        title: {
            text: '专任教师学位情况',
            top: 20,
            left: 'center',
            textStyle: {
                fontSize: 24,
                color: '#646464',
                fontWeight: 'normal'
            }
        },

        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}人 ({d}%)'
        },

        legend: {
            orient: 'vertical',
            left: 15,
            top: 20,
            data: utils.getData('name', rawData4)
        },

        // roseType: 'radius',
        //
        // color: [
        //     '#bd3333',
        //     '#ffbc47',
        //     '#2e425a',
        //     '#36ce9b',
        //     '#84acb6',
        //     '#66BB6A',
        //     '#E98F6F',
        //     '#797B7F',
        //
        // ],

        series: [
            {
                name: '',
                type: 'pie',
                radius: [0, '50%'],
                data: rawData4,
                // itemStyle: {
                //     normal: {
                //         label: {
                //             show: false
                //         }
                //     }
                // }
            }
        ]
    };

    // chart5中9个柱子柱子分成5份
    var _option5BarIndexArr = [0, 1, 1, 2, 2, 3, 3, 4, 4];

    var option5 = {

        backgroundColor: '#fff',

        color: [
            '#ff7f50',
            '#87cefa',
            '#da70d6',
            '#32cd32',
            '#6495ed',
            '#ff69b4',
            '#ba55d3',
            '#cd5c5c',
            '#ffa500'
        ],

        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params) {
                var resultArr = [], item;
                for (var i = 0, len = params.length; i < len; i++) {
                    item = params[i];
                    if (item.value !== '') {
                        resultArr.push(
                            item.seriesName + ': ' + item.value + '个'
                        );
                    }
                }
                return resultArr.join('<br/>');
            }
        },
        legend: {
            top: 10,
            data: utils.getData('name', rawData5)
        },
        grid: {
            top:90,
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: {
            type: 'value'
        },
        xAxis: {
            type: 'category',
            data: ['博士后流动站', '博士学科点', '硕士学科点', '交叉学科', '目录外二级学科']
        },

        series: _option5BarIndexArr.map(function (item, index) {
            return _initSeriesItem(rawData5[index], item)
        })
    };


    var titleArr61 = [
        {
            name: '教学科研及辅助用房',
            key: 'eduBld',
            detail: [
                {
                    name: '教室',
                    key: 'classRoom'
                },
                {
                    name: '图书馆',
                    key: 'library'
                },
                {
                    name: '实验室、实习场所',
                    key: 'lab'
                },
                {
                    name: '专用科研用房',
                    key: 'scientific'
                },
                {
                    name: '体育馆',
                    key: 'stadium'
                },
                {
                    name: '会堂',
                    key: 'hall'
                }
            ]
        },
        {
            name: '行政用房',
            key: 'adminBld'
        }
    ];

    var option61 = {
        zLevel: 1,

        tooltip: {},

        series: [
            {
                name: '教学行政用房',
                type: 'treemap',
                visibleMin: 300,
                label: {
                    show: true,
                    formatter: '{b}'
                },

                width: '80%',
                height: '88%',
                top: 20,

                upperLabel: {
                    normal: {
                        show: true,
                        height: 30
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor: '#fff'
                    }
                },
                levels: getLevelOption(),
                data: [
                    {
                        name: titleArr61[0].name,
                        value: rawData6.eduAdminBld[titleArr61[0].key].value,
                        children: (function () {
                            var arr = [],
                                children = titleArr61[0].detail;
                            for (var i = 0, len = children.length; i < len; i++) {
                                arr.push({
                                    name: children[i].name,
                                    value: rawData6.eduAdminBld[titleArr61[0].key].detail[children[i].key]
                                });
                            }
                            return arr;
                        })()
                    },
                    {
                        name: titleArr61[1].name,
                        value: rawData6.eduAdminBld[titleArr61[1].key].value
                    }
                ]
            }
        ]
    };

    chart4.setOption(option4);
    chart5.setOption(option5);
    chart61.setOption(option61);

    /**
     * 生成levelOption
     * @returns {*[]}
     */
    function getLevelOption() {
        return [
            {
                itemStyle: {
                    normal: {
                        borderColor: '#777',
                        borderWidth: 0,
                        gapWidth: 1
                    }
                },
                upperLabel: {
                    normal: {
                        show: false
                    }
                }
            },
            {
                itemStyle: {
                    normal: {
                        borderColor: '#555',
                        borderWidth: 5,
                        gapWidth: 1
                    },
                    emphasis: {
                        borderColor: '#ddd'
                    }
                }
            },
            {
                colorSaturation: [0.35, 0.5],
                itemStyle: {
                    normal: {
                        borderWidth: 5,
                        gapWidth: 1,
                        borderColorSaturation: 0.6
                    }
                }
            }
        ];
    }


    /**
     * Option5中的series
     * @param data
     * @param barIndex
     * @returns {{name, type: string, stack: string, label: {normal: {show: boolean, position: string}}, data: Function}}
     * @private
     */
    function _initSeriesItem(data, barIndex) {
        return {
            name: data.name,
            type: 'bar',
            stack: 'A',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            data: (function () {
                var arr = [];
                for (var i = 0; i < 5; i++) {
                    arr.push(i === barIndex ? data.value: '');
                }
                return arr;
            })()
        };
    }
})();