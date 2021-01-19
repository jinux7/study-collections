function Crop(option) {
  this.option = option || {};
  this.option.moveCallback = option.moveCallback || function() {};
  this.option.upCallback = option.upCallback || function() {};
  // nWrap
  this.nWrapObj = {
    width: 0,
    height: 0
  };
  // nCrop
  this.nCropObj = {
    top: 0,
    left: 0,
    width: this.option.initCropWidth || 200,
    height: this.option.initCropHeight || 100,
  };
  // mousu相关事件
  this.mouseEvtObj = {
    downTop: 0, // 按下
    downLeft: 0, // 按下
    moveTop: 0, // 移动
    moveLeft: 0, // 移动
    bEnter: true, // 鼠标是否在nCrop上
  };
  this.init();
}
// 初始化函数
Crop.prototype.init = function() {
  this.createCrop();
  this.addEvent();
}
// 创建crop元素节点
Crop.prototype.createCrop = function() {
  var nWrap = document.querySelector('#' + this.option.wrapId);
  var nCrop = document.createElement('div');
  // nWrap
  this.nWrapObj.width = parseInt(this._getStyle(nWrap, 'width'));
  this.nWrapObj.height = parseInt(this._getStyle(nWrap, 'height'));
  // ncrop
  this.nCropObj.nCrop = nCrop;
  this.nCropObj.top = nCrop.offsetTop;
  this.nCropObj.left = nCrop.offsetLeft;
  nCrop.setAttribute('id', 'jinux-crop');
  // 设置初始化设置的宽高
  nCrop.style.width = this.nCropObj.width+ 'px';
  nCrop.style.height = this.nCropObj.height + 'px';
  nCrop.innerHTML = `
    <div>
      <p class="crop-p-1"></p>
      <p class="crop-p-2"></p>
      <p class="crop-p-3"></p>
      <p class="crop-p-4"></p>
      <span class="crop-span-1"></span>
      <span class="crop-span-2"></span>
      <span class="crop-span-3"></span>
      <span class="crop-span-4"></span>
    </div>
  `;
  nWrap.appendChild(nCrop);
  // console.log(this.nWrapObj, this.nCropObj);
}
// 添加crop事件
Crop.prototype.addEvent = function() {
  var self = this;
  // 鼠标按下
  self.nCropObj.nCrop.addEventListener('mousedown', function(evt) {
    self.mouseEvtObj.downLeft = evt.pageX;
    self.mouseEvtObj.downTop = evt.pageY;
    if(evt.target.nodeName === 'SPAN') {
      document.onmousemove = function(event) {
        self.mouseEvtObj.moveLeft = event.pageX;
        self.mouseEvtObj.moveTop = event.pageY;
        self.option.moveCallback(self.mouseEvtObj);
        if(evt.target.className === 'crop-span-1') {
          if(self.nCropObj.left <= self.mouseEvtObj.downLeft-self.mouseEvtObj.moveLeft) {
            self.nCropObj.nCrop.style.width = self.nCropObj.width + self.nCropObj.left + 'px';
            self.nCropObj.nCrop.style.left = 0;
            if(self.nCropObj.top <= self.mouseEvtObj.downTop-self.mouseEvtObj.moveTop) {
              self.nCropObj.nCrop.style.height = self.nCropObj.height + self.nCropObj.top + 'px';
              self.nCropObj.nCrop.style.top = 0;
            }else {
              self.nCropObj.nCrop.style.height = self.nCropObj.height + self.mouseEvtObj.downTop - self.mouseEvtObj.moveTop + 'px';
              self.nCropObj.nCrop.style.top = self.nCropObj.top - (self.mouseEvtObj.downTop - self.mouseEvtObj.moveTop) + 'px';
            }
          }else if(self.nCropObj.top <= self.mouseEvtObj.downTop-self.mouseEvtObj.moveTop) {
            self.nCropObj.nCrop.style.height = self.nCropObj.height + self.nCropObj.top + 'px';
            self.nCropObj.nCrop.style.top = 0;
            if(self.nCropObj.left <= self.mouseEvtObj.downLeft-self.mouseEvtObj.moveLeft) {
              self.nCropObj.nCrop.style.width = self.nCropObj.width + self.nCropObj.left + 'px';
              self.nCropObj.nCrop.style.left = 0;
            }else {
              self.nCropObj.nCrop.style.width = self.nCropObj.width - (self.mouseEvtObj.moveLeft - self.mouseEvtObj.downLeft) + 'px';
              self.nCropObj.nCrop.style.left = self.nCropObj.left - (self.mouseEvtObj.downLeft - self.mouseEvtObj.moveLeft) + 'px';
            }
          }else {
            self.nCropObj.nCrop.style.width = self.nCropObj.width - (self.mouseEvtObj.moveLeft - self.mouseEvtObj.downLeft) + 'px';
            self.nCropObj.nCrop.style.height = self.nCropObj.height + self.mouseEvtObj.downTop - self.mouseEvtObj.moveTop + 'px';
            self.nCropObj.nCrop.style.top = self.nCropObj.top - (self.mouseEvtObj.downTop - self.mouseEvtObj.moveTop) + 'px';
            self.nCropObj.nCrop.style.left = self.nCropObj.left - (self.mouseEvtObj.downLeft - self.mouseEvtObj.moveLeft) + 'px';
          }
          console.log(self.nCropObj.left, self.mouseEvtObj.downLeft, self.mouseEvtObj.moveLeft);
        }
        if(evt.target.className === 'crop-span-2') {
          if(self.nCropObj.width + self.mouseEvtObj.moveLeft - self.mouseEvtObj.downLeft + self.nCropObj.left >= self.nWrapObj.width) {
            self.nCropObj.nCrop.style.width = self.nWrapObj.width - self.nCropObj.left + 'px';
            if(self.nCropObj.top - (self.mouseEvtObj.downTop - self.mouseEvtObj.moveTop) <= 0) {
              self.nCropObj.nCrop.style.height = self.nCropObj.height + self.nCropObj.top + 'px';
              self.nCropObj.nCrop.style.top = 0;
            }else {
              self.nCropObj.nCrop.style.height = self.nCropObj.height + self.mouseEvtObj.downTop - self.mouseEvtObj.moveTop + 'px';
              self.nCropObj.nCrop.style.top = self.nCropObj.top - (self.mouseEvtObj.downTop - self.mouseEvtObj.moveTop) + 'px';
            }
          }else if(self.nCropObj.top - (self.mouseEvtObj.downTop - self.mouseEvtObj.moveTop) <= 0) {
            self.nCropObj.nCrop.style.height = self.nCropObj.height + self.nCropObj.top + 'px';
            self.nCropObj.nCrop.style.top = 0;
            if(self.nCropObj.width + self.mouseEvtObj.moveLeft - self.mouseEvtObj.downLeft + self.nCropObj.left >= self.nWrapObj.width) {
              self.nCropObj.nCrop.style.width = self.nWrapObj.width - self.nCropObj.left + 'px';
            }else {
              self.nCropObj.nCrop.style.width = self.nCropObj.width + self.mouseEvtObj.moveLeft - self.mouseEvtObj.downLeft + 'px';
            }
          }else {
            self.nCropObj.nCrop.style.width = self.nCropObj.width + self.mouseEvtObj.moveLeft - self.mouseEvtObj.downLeft + 'px';
            self.nCropObj.nCrop.style.height = self.nCropObj.height + self.mouseEvtObj.downTop - self.mouseEvtObj.moveTop + 'px';
            self.nCropObj.nCrop.style.top = self.nCropObj.top - (self.mouseEvtObj.downTop - self.mouseEvtObj.moveTop) + 'px';
          }
        }
        if(evt.target.className === 'crop-span-3') {
          if(self.nCropObj.width + self.mouseEvtObj.moveLeft - self.mouseEvtObj.downLeft + self.nCropObj.left >= self.nWrapObj.width) {
            self.nCropObj.nCrop.style.width = self.nWrapObj.width - self.nCropObj.left + 'px';
            if(self.nCropObj.height + self.mouseEvtObj.moveTop - self.mouseEvtObj.downTop + self.nCropObj.top >= self.nWrapObj.height) {
              self.nCropObj.nCrop.style.height = self.nWrapObj.height - self.nCropObj.top + 'px';
            }else {
              self.nCropObj.nCrop.style.height = self.nCropObj.height + self.mouseEvtObj.moveTop - self.mouseEvtObj.downTop + 'px';
            }
          }else if(self.nCropObj.height + self.mouseEvtObj.moveTop - self.mouseEvtObj.downTop + self.nCropObj.top >= self.nWrapObj.height) {
            self.nCropObj.nCrop.style.height = self.nWrapObj.height - self.nCropObj.top + 'px';
            self.nCropObj.nCrop.style.width = self.nCropObj.width + self.mouseEvtObj.moveLeft - self.mouseEvtObj.downLeft + 'px';
          }else {
            self.nCropObj.nCrop.style.width = self.nCropObj.width + self.mouseEvtObj.moveLeft - self.mouseEvtObj.downLeft + 'px';
            self.nCropObj.nCrop.style.height = self.nCropObj.height + self.mouseEvtObj.moveTop - self.mouseEvtObj.downTop + 'px';
          }
        }
        if(evt.target.className === 'crop-span-4') {
          if(self.mouseEvtObj.downLeft-self.mouseEvtObj.moveLeft >= self.nCropObj.left) {
            self.nCropObj.nCrop.style.width = self.nCropObj.width + self.nCropObj.left + 'px';
            self.nCropObj.nCrop.style.left = 0;
            if(self.mouseEvtObj.moveTop - self.mouseEvtObj.downTop + self.nCropObj.height + self.nCropObj.top >= self.nWrapObj.height) {
              self.nCropObj.nCrop.style.height = self.nWrapObj.height - self.nCropObj.top + 'px';
            }else {
              self.nCropObj.nCrop.style.height = self.nCropObj.height + self.mouseEvtObj.moveTop - self.mouseEvtObj.downTop + 'px';
            }
          }else if(self.mouseEvtObj.moveTop - self.mouseEvtObj.downTop + self.nCropObj.height + self.nCropObj.top >= self.nWrapObj.height) {
            self.nCropObj.nCrop.style.height = self.nWrapObj.height - self.nCropObj.top + 'px';
            if(self.mouseEvtObj.downLeft-self.mouseEvtObj.moveLeft >= self.nCropObj.left) {
              self.nCropObj.nCrop.style.width = self.nCropObj.width + self.nCropObj.left + 'px';
              self.nCropObj.nCrop.style.left = 0;
            }else {
              self.nCropObj.nCrop.style.width = self.nCropObj.width - (self.mouseEvtObj.moveLeft - self.mouseEvtObj.downLeft) + 'px';
              self.nCropObj.nCrop.style.left = self.nCropObj.left - (self.mouseEvtObj.downLeft - self.mouseEvtObj.moveLeft) + 'px';
            }
          }else {
            self.nCropObj.nCrop.style.width = self.nCropObj.width - (self.mouseEvtObj.moveLeft - self.mouseEvtObj.downLeft) + 'px';
            self.nCropObj.nCrop.style.height = self.nCropObj.height + self.mouseEvtObj.moveTop - self.mouseEvtObj.downTop + 'px';
            self.nCropObj.nCrop.style.left = self.nCropObj.left - (self.mouseEvtObj.downLeft - self.mouseEvtObj.moveLeft) + 'px';
          }
        }
      }
      return void 0;
    }
    // 鼠标按下添加移动事件
    self.nCropObj.nCrop.onmousemove = function(evt) {
      self.mouseEvtObj.moveLeft = evt.pageX;
      self.mouseEvtObj.moveTop = evt.pageY;
      self.option.moveCallback(self.mouseEvtObj);
      // nCrop移动
      // 上边界,下边界
      if(self.nCropObj.top + self.mouseEvtObj.moveTop - self.mouseEvtObj.downTop<=0) {
        self.nCropObj.nCrop.style.top = 0;  
      }else if(self.nCropObj.top + self.mouseEvtObj.moveTop - self.mouseEvtObj.downTop + self.nCropObj.height >= self.nWrapObj.height) {
        self.nCropObj.nCrop.style.top = self.nWrapObj.height - self.nCropObj.height + 'px'; 
      }else {
        self.nCropObj.nCrop.style.top = self.nCropObj.top + self.mouseEvtObj.moveTop - self.mouseEvtObj.downTop + 'px';
      }
      
      // 左边界,右边界
      if(self.nCropObj.left + self.mouseEvtObj.moveLeft - self.mouseEvtObj.downLeft<=0) {
        self.nCropObj.nCrop.style.left = 0;  
      }else if(self.nCropObj.left + self.mouseEvtObj.moveLeft - self.mouseEvtObj.downLeft + self.nCropObj.width >= self.nWrapObj.width) {
        self.nCropObj.nCrop.style.left = self.nWrapObj.width - self.nCropObj.width + 'px'; 
      }else {
        self.nCropObj.nCrop.style.left = self.nCropObj.left + self.mouseEvtObj.moveLeft - self.mouseEvtObj.downLeft + 'px';
      }
    }

  }, false);
  // 鼠标抬起, 这里鼠标抬起事件放在document上，因为鼠标可以脱离nCrop后抬起
  document.addEventListener('mouseup', function(evt) {
    self.nCropObj.top = parseInt(self._getStyle(self.nCropObj.nCrop, 'top'));
    self.nCropObj.left = parseInt(self._getStyle(self.nCropObj.nCrop, 'left'));
    self.nCropObj.width = parseInt(self._getStyle(self.nCropObj.nCrop, 'width'));
    self.nCropObj.height = parseInt(self._getStyle(self.nCropObj.nCrop, 'height'));
    // 删除事件
    self.nCropObj.nCrop.onmousemove = null;
    document.onmousemove = null;
    // 回调函数
    self.option.upCallback({
      cropObj: self.nCropObj,
      mouseEvtObj: self.mouseEvtObj
    });
  }, false);
  // 鼠标移出
  self.nCropObj.nCrop.onmouseleave = function() {
    self.mouseEvtObj.bEnter = false;
  }
  // 鼠标移入
  self.nCropObj.nCrop.onmouseenter = function() {
    self.mouseEvtObj.bEnter = true;
  }
  
}
// 工具函数
// 获取一个元素到页面左侧的距离
Crop.prototype._getElementLeft = function(element) {
  var actualLeft = element.offsetLeft;
  var current = element.offsetParent;
  while(current !== null) {
    actualLeft += current.offsetLeft;
  　current = current.offsetParent;
  }
  return actualLeft;
}
// 工具函数
// 获取一个元素到页面顶部的距离
Crop.prototype._getElementTop = function(element) {
  var actualTop = element.offsetTop;
  var current = element.offsetParent;
  while (current !== null){
  　actualTop += current.offsetTop;
  　current = current.offsetParent;
  }
  return actualTop;
}
// 工具函数
// 获取样式
Crop.prototype._getStyle = function(element, attr) {
  var computed;
  if(element.currentStyle) {
    computed = element.currentStyle;
  } else {
    computed = window.getComputedStyle(element, false);
  }
  return computed.getPropertyValue( attr ) || computed[ attr ];
}