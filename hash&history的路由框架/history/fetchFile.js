function fetchFile(selector, url, callback) {
  var CLEARCHACE = true; // 设置页面是否缓存
  if(CLEARCHACE) {
    $(selector).load(url+'?v='+Math.random(), callback);
  }else {
    $(selector).load(url, callback);
  }
};