;
window.XMLHttpRequestMock = window.XMLHttpRequest;
window.mock = {
  urlData: {},
  setPath: function(path, data) {
    this.urlData[path] = data;
  } 
}

function XmlMock() {
  this.type = null;
  this.url = null;
  this.onreadystatechange = null;
}
XmlMock.prototype.open = function(type, url) {
  this.type = type;
  this.url = url;
  this.readyState = 4;
  this.status = 200
}
XmlMock.prototype.send = function(params) {
  var path = ''; 
  var _this = this; 
  for(var key in mock.urlData) {
    if((this.url).indexOf(key)>-1) {
      path = key;
    }
  }
  if(path) {
    this.responseText = mock.urlData[key];
    this.onreadystatechange(this);
  }else {
    var xhr = new XMLHttpRequestMock();
    xhr.open('get', this.url, false);
    xhr.onreadystatechange = function() {
      if(xhr.readyState===4&&xhr.status===200) {
        _this.responseText = xhr.responseText;
        _this.onreadystatechange(_this);
      }
    }
    xhr.send();
  }
}
window.XMLHttpRequest = XmlMock;