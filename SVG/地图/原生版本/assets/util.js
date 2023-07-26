// 获取style
function getEleStyle(ele , name){
  if(window.getComputedStyle){
    //谷歌/edge浏览器，具有getComputedStyle()方法
    return getComputedStyle(ele , null)[name];
  }else{
    //IE没有getComputedStyle()方法，下面为IE8的方式
    return ele.currentStyle[name];
  }
}
// 获取scaleVal
function getScaleVal(nWrap) {
  var matrix = getEleStyle(nWrap, 'transform');
  var values = matrix.split('(')[1].split(')')[0].split(',');
  return +values[0];
}

// 通过经纬度转换成百分比
function transformLocation(arr) {
  // 以北京和广州机场为基准
  var BASEX_BEIJING = 0.7,
      BASEY_BEIJING = 0.33,
      BASEX_GUANGZHOU = 0.65,
      BASEY_GUANGZHOU = 0.66;
  var BASELONGITUDE_BEIJING = 116.4240655,
      BASELATITUDE_BEIJING = 39.5169397,
      BASELONGITUDE_GUANGZHOU = 113.3094958,
      BASELATITUDE_GUANGZHOU = 23.39249;
  return [
    (BASEX_GUANGZHOU-BASEX_BEIJING)*(arr[0]-BASELONGITUDE_BEIJING)/(BASELONGITUDE_GUANGZHOU-BASELONGITUDE_BEIJING)+BASEX_BEIJING,
    (BASEY_GUANGZHOU-BASEY_BEIJING)*(arr[1]-BASELATITUDE_BEIJING)/(BASELATITUDE_GUANGZHOU-BASELATITUDE_BEIJING)+BASEY_BEIJING
  ];
}
// 节流
function throttle(fn, wait) {
  let pre = Date.now()
  return function () {
      let _this = this
      let _arguments = arguments
      let now = Date.now()
      if (now - pre >= wait) {
          fn.apply(_this, _arguments)
          pre = Date.now()
      }
  }
}