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
  var BASEX_BEIJING = 0.698,
      BASEY_BEIJING = 0.345,
      BASEX_LASHA = 0.25,
      BASEY_LASHA = 0.55;
  var millBeijing = convert(116.4240655, 39.5169397);
  var millLasha = convert(90.9119034, 29.2978001);
  var BASELONGITUDE_BEIJING = millBeijing[0],
      BASELATITUDE_BEIJING = millBeijing[1],
      BASELONGITUDE_LASHA = millLasha[0],
      BASELATITUDE_LASHA = millLasha[1];
  return [
    (BASEX_LASHA-BASEX_BEIJING)*(arr[0]-BASELONGITUDE_BEIJING)/(BASELONGITUDE_LASHA-BASELONGITUDE_BEIJING)+BASEX_BEIJING,
    (BASEY_LASHA-BASEY_BEIJING)*(arr[1]-BASELATITUDE_BEIJING)/(BASELATITUDE_LASHA-BASELATITUDE_BEIJING)+BASEY_BEIJING
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
// 经纬度坐标转平面
function convert(lon, lat) { // lat：维度，lon：精度
  var L = 6381372 * Math.PI * 2,//地球周长
      W = L,// 平面展开后，x轴等于周长 
      H = L / 2,// y轴约等于周长一半
      mill = 2.3,// 米勒投影中的一个常数，范围大约在正负2.3之间
      x = lon * Math.PI / 180,// 将经度从度数转换为弧度
      y = lat * Math.PI / 180;// 将纬度从度数转换为弧度
  var temp = Math.tan(0.25 * Math.PI + 0.4 * y);
  y = 1.25 * Math.log(temp);// 米勒投影的转换
  // 弧度转为实际距离  
  x = (W / 2) + (W / (2 * Math.PI)) * x;
  y = (H / 2) - (H / (2 * mill)) * y;
  return [x, y];
}