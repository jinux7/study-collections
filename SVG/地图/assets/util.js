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
  // 以大兴机场为基准
  var BASEX = 0.7,
      BASEY = 0.33;
  var BASELONGITUDE = 116.4240655,
      BASELATITUDE = 39.5169397;
  return [
    arr[0]*BASEX/BASELONGITUDE,
    arr[1]*BASEY/BASELATITUDE
  ];
}