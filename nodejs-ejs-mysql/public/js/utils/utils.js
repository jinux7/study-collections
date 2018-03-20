/**
 * Created by liuyang on 2018/1/27.
 */
var utils = {
    /**
     * 生成数据数组
     * @param key
     * @param rawData
     * @returns {Array}
     */
    getData: function (key, rawData) {
        var arr = [];
        for (var i = 0, len = rawData.length; i < len; i++) {
            arr.push(rawData[i][key]);
        }
        return arr;
    },

    /**
     * 计算series中的data
     * @param key
     * @param rawData
     * @returns {Array}
     */
    getSeriesData: function (key, rawData) {
        var arr = [], item;
        for (var i = 0, len = rawData.length; i < len; i++) {
            item = rawData[i];
            arr.push({
                name: item.name,
                value: item[key]
            });
        }
        return arr;
    },

    /**
     * 浅复制一个数组
     * @param originalArr
     * @returns {Array}
     */
    copyArray: function (originalArr) {
        var arr = [];
        for (var i = 0, len = originalArr.length; i < len; i++) {
            arr.push(originalArr);
        }
        return arr;
    }
};

/**
 * 添加导航栏
 */
(function () {
    // var $level2Btn = $('.nav-item.nav-level2');
    //
    // $level2Btn.on('click', function (e) {
    //     e.preventDefault();
    //     $(this)
    //         .siblings('.nav-wrapper-level3')
    //         .slideToggle('fast');
    //     $(this)
    //         .parent()
    //         .siblings('.nav-wrapper-level2')
    //         .find('.nav-wrapper-level3')
    //         .slideUp('fast');
    // });

    var $nav = $('.nav');

    var $smallNav = $nav.find('.small-nav'),
        $bigNav = $nav.find('.big-nav');
    $nav.hover(function (e) {
        if (e.type === 'mouseenter') {
            $smallNav.addClass('hidden');
            $bigNav.removeClass('hidden');
        } else {
            $smallNav.removeClass('hidden');
            $bigNav.addClass('hidden');
        }
    });



})();