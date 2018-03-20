// chartRow1
(function () {
    var chart2 = echarts.init(document.getElementById('chart2'));

    var option2 = {
        title: {
            text: '专业布局概览',
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
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        backgroundColor: '#fff',

        grid: {
            top: 100,
            bottom: 80
        },

        legend: {
            x: 10,
            y: 10,
            orient: 'vertical',
            data: utils.getData('name', rawData2)
        },

        calculable: true,

        series: [
            {
                name: '专业概览',
                type: 'pie',
                radius: [30, 110],
                center: ['50%', '50%'],
                roseType: 'area',
                data: rawData2
            }
        ]
    };

    chart2.setOption(option2);
})();