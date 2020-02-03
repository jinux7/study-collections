function ImgClipper(option) {
  this.option = option;
  this.init(this.option);
}

ImgClipper.prototype.init = function(option) {
  var _this = this;
  var nodeStr = `<div id="nux-main-wrap">
                  <img id="nux-img-main" alt="">
                  <div id="nux-clip-wrap">
                    <span class="nux-left-border"></span>
                    <span class="nux-top-border"></span>
                    <span class="nux-right-border"></span>
                    <span class="nux-bottom-border"></span>
                  </div>
                </div>`;
  var wrapEle = option.wrapEle;
  wrapEle.innerHTML = nodeStr;
  // 长宽比例
  var ratio = option.ratio;
  var callbackFn = option.onClipCallback;
  // 初始化一些变量
  var
    nImgMain = document.querySelector('#nux-img-main'), // 主图节点元素
    iMainImgWidth, // 主图的实际宽度
    iMainImgHeight, // 主图的实际高度
    nMainWrap = document.getElementById('nux-main-wrap'), // main-wrap节点元素
    nClipWrap = document.getElementById('nux-clip-wrap'), // clip-wrap元素节点元素
    nLeftBorder = nClipWrap.querySelector('.nux-left-border'), // 裁剪框左边节点
    nRightBorder = nClipWrap.querySelector('.nux-right-border'), // 裁剪框右边节点
    mainWrapWidth = this.getStyle(nMainWrap, 'width', true), // main-wrap节点的宽
    mainWrapHeight = this.getStyle(nMainWrap, 'height', true), // main-wrap节点的高
    curClipWrapWidth, // 当前clip-wrap节点的宽
    curClipWrapHeight, // 当前clip-wrap节点的高
    iLeft = this.getElementLeft(nMainWrap), // main-wrap节点在html页面的left值
    iTop = this.getElementTop(nMainWrap), // main-wrap节点在html页面的top值
    bMouseDown = false, // 鼠标是否按下
    curMoveDir = '', // 当前按下的元素的flag
    mainWrapMousedownX = 0, // 鼠标按下时记录的pageX
    mainWrapMousedownY = 0, // 鼠标按下时记录的pageY
    leftBorderOffX, // 裁剪框左边移动的距离
    leftBorderOffY, // 暂时无用
    rightBorderOffX, // 裁剪框右边移动的距离
    clipWrapCurStyleLeft, // 裁剪框当前style的left
    clipWrapCurStyleTop, // 裁剪框当前style的top
    bCanMoveLeft = true, // 是否可以移动裁剪框
    bCanMoveRight = true, // 是否可以移动裁剪框
    bCanMoveTop = true, // 是否可以移动裁剪框
    bCanMoveBottom = true; // 是否可以移动裁剪框

  clip();
  function clip() {
    // 初始化宽高
    nClipWrap.style.height = mainWrapWidth/ratio+'px';
    // 阻止所有图片默认事件
    document.querySelector('#nux-img-main').addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
        ev.preventDefault();
        return false;
      }, false);
    document.querySelector('#nux-img-main').addEventListener('dragstart', function(ev) {
        ev.preventDefault();
        ev.preventDefault();
        return false;
      }, false);
    // 整个裁剪框加mousedown事件
    nMainWrap.addEventListener('mousedown', function(ev) {
      ev.stopPropagation();
      mainWrapMousedownX = ev.pageX;
      mainWrapMousedownY = ev.pageY;
      clipWrapCurStyleLeft = _this.getStyle(nClipWrap, 'left', true);
      clipWrapCurStyleTop = _this.getStyle(nClipWrap, 'top', true);
      bMouseDown = true;
      curMoveDir = 'main-wrap';
    }, false);
    // 左边线加mousedown事件
    nLeftBorder.addEventListener('mousedown', function(ev) {
      ev.stopPropagation();
      mainWrapMousedownX = ev.pageX;
      mainWrapMousedownY = ev.pageY;
      clipWrapCurStyleLeft = _this.getStyle(nClipWrap, 'left', true);
      clipWrapCurStyleTop = _this.getStyle(nClipWrap, 'top', true);
      curClipWrapWidth = _this.getStyle(nClipWrap, 'width', true);
      curClipWrapHeight = _this.getStyle(nClipWrap, 'height', true);
      bMouseDown = true;
      curMoveDir = 'left-border';
    }, false);
    // 右边线加mousedown事件
    nRightBorder.addEventListener('mousedown', function(ev) {
      ev.stopPropagation();
      mainWrapMousedownX = ev.pageX;
      mainWrapMousedownY = ev.pageY;
      clipWrapCurStyleLeft = _this.getStyle(nClipWrap, 'left', true);
      clipWrapCurStyleTop = _this.getStyle(nClipWrap, 'top', true);
      curClipWrapWidth = _this.getStyle(nClipWrap, 'width', true);
      curClipWrapHeight = _this.getStyle(nClipWrap, 'height', true);
      bMouseDown = true;
      curMoveDir = 'right-border';
    }, false);
    // 鼠标抬起
    document.addEventListener('mouseup', function(ev) {
      bMouseDown = false;
      if(curMoveDir === 'left-border') {
      }
      if(curMoveDir === 'main-wrap') {
      }
    }, false);
    // document添加mousemove事件
    document.addEventListener('mousemove', onMove, false);
  }
  function onMove(ev) {
    if(!bMouseDown) return void 0; 
    leftBorderOffX = ev.pageX - iLeft;
    leftBorderOffY = ev.pageY - iTop;
    rightBorderOffX = ev.pageX - iLeft;
    wrapOffX = ev.pageX - mainWrapMousedownX;
    wrapOffY = ev.pageY - mainWrapMousedownY;
    var bLeftRightMove = (_this.getStyle(nClipWrap, 'top', true)+_this.getStyle(nClipWrap, 'height', true) >=
        _this.getStyle(nImgMain, 'height', true));
    var hLeftRight = _this.getStyle(nImgMain, 'height', true)-_this.getStyle(nClipWrap, 'top', true);
    switch(curMoveDir) {
      case 'left-border':
        if(leftBorderOffX<=0) {
          leftBorderOffX = 0;
          return void 0;
        }
        if(leftBorderOffX>=mainWrapWidth) {
          leftBorderOffX = mainWrapWidth;
          return void 0;
        }
        if(bLeftRightMove&&(ev.pageX - mainWrapMousedownX)<0) {
          nClipWrap.style.width = hLeftRight*ratio +'px';
          nClipWrap.style.height = hLeftRight +'px';
          return ;
        }
        nClipWrap.style.width = curClipWrapWidth - wrapOffX +'px';
        nClipWrap.style.height = (curClipWrapWidth - wrapOffX)/ratio +'px';
        nClipWrap.style.left = leftBorderOffX + 'px';
        bCanMoveLeft = bCanMoveRight = bCanMoveTop = bCanMoveBottom = true;
        callbackFn(_this.getBaseCode());
        break;
      case 'right-border':
        if(rightBorderOffX>=mainWrapWidth) {
          return void 0;
        }
        if(rightBorderOffX<=0) {
          return void 0;
        }
        if(bLeftRightMove&&(ev.pageX - mainWrapMousedownX)>0) {
          nClipWrap.style.width = hLeftRight*ratio +'px';
          nClipWrap.style.height = hLeftRight +'px';
          return ;
        }
        nClipWrap.style.width = curClipWrapWidth + wrapOffX +'px';
        nClipWrap.style.height = (curClipWrapWidth + wrapOffX)/ratio +'px';
        bCanMoveLeft = bCanMoveRight = bCanMoveTop = bCanMoveBottom = true;
        callbackFn(_this.getBaseCode());
        break;
      case 'main-wrap':
        let left = _this.getStyle(nClipWrap, 'left', true),
            top = _this.getStyle(nClipWrap, 'top', true),
            width = _this.getStyle(nClipWrap, 'width', true),
            height = _this.getStyle(nClipWrap, 'height', true),
            mainWrapHeight = _this.getStyle(nMainWrap, 'height', true);
        if(left<=0) {
          bCanMoveLeft = false;
          nClipWrap.style.left = 0;
        }
        if(clipWrapCurStyleLeft+wrapOffX>0) {
          bCanMoveLeft = true;
        }
        if((left+width)>=mainWrapWidth) {
          bCanMoveRight = false;
          nClipWrap.style.left = (mainWrapWidth-width)+'px';
        }
        if(clipWrapCurStyleLeft+wrapOffX<mainWrapWidth-width) {
          bCanMoveRight = true;
        }
        if(top<=0) {
          bCanMoveTop = false;
          nClipWrap.style.top = 0;
        }
        if(clipWrapCurStyleTop+wrapOffY>0) {
          bCanMoveTop = true;
        }
        if((top+height)>=mainWrapHeight) {
          bCanMoveBottom = false;
          nClipWrap.style.top = mainWrapHeight-height+'px';
        }
        if(clipWrapCurStyleTop+wrapOffY<mainWrapHeight-_this.getStyle(nClipWrap, 'height', true)) {
          bCanMoveBottom = true;
        }
        if(bCanMoveLeft&&bCanMoveRight) {
          nClipWrap.style.left = clipWrapCurStyleLeft + wrapOffX + 'px';
        }
        if(bCanMoveTop&&bCanMoveBottom) {
          nClipWrap.style.top = clipWrapCurStyleTop + wrapOffY + 'px';
        }
        callbackFn(_this.getBaseCode());
    }
  }
}
// 设置图片
ImgClipper.prototype.setImg = function(imgFile) {
  var _this = this;
  var nImg = document.querySelector('#nux-img-main');
  nImg.src = imgFile;
  nImg.onload = function() {
    _this.resetClipbox();
  }

  var img = new Image();
  img.src = imgFile;
  img.onload = function() {
    _this.iMainImgWidth = img.width;
    _this.iMainImgHeight = img.height;
    _this.getBaseCode = _this.compressImgPercent(
      document.getElementById('nux-main-wrap'), 
      document.getElementById('nux-clip-wrap'), 
      document.querySelector('#nux-img-main'),
      0.3, 16/9, 
      _this.getStyle(document.getElementById('nux-main-wrap'), 'width', true)
    );

  }
}
// 裁剪框的宽高大小应该适应图片
ImgClipper.prototype.resetClipbox = function() {
  var nImgMain = document.querySelector('#nux-img-main'), // 主图节点元素
      nClipWrap = document.getElementById('nux-clip-wrap'), // clip-wrap元素节点元素
      width = nImgMain.width,
      height = nImgMain.height;
  if(width/height>this.option.ratio) {
    nClipWrap.style.height = height + 'px';
    nClipWrap.style.width = height*this.option.ratio + 'px';
  }else {
    nClipWrap.style.width = width + 'px';
    nClipWrap.style.height = width/this.option.ratio + 'px';
  }
}

ImgClipper.prototype.getStyle = function (ele, attr, flag) {
  return flag?
          parseInt(window.getComputedStyle(ele, false)[attr]):
          window.getComputedStyle(ele, false)[attr];
} 
// 获取一个元素到页面左侧的距离
ImgClipper.prototype.getElementLeft = function(element) {
  var actualLeft = element.offsetLeft;
  var current = element.offsetParent;
  while(current !== null) {
    actualLeft += current.offsetLeft;
  　current = current.offsetParent;
  }
  return actualLeft;
}
// 获取一个元素到页面顶部的距离
ImgClipper.prototype.getElementTop = function(element) {
  var actualTop = element.offsetTop;
  var current = element.offsetParent;
  while (current !== null){
  　actualTop += current.offsetTop;
  　current = current.offsetParent;
  }
  return actualTop;
}
// 显示比例的压缩图片
ImgClipper.prototype.compressImgPercent = function(mainWrap, clipRect, nImg, compressVal, percentVal, mainWrapWidth) {
  var _this = this;
  var nCanvas = document.createElement('canvas');
  nCanvas.style.display = 'none';
  document.body.appendChild(nCanvas);
  nCanvas.width = this.iMainImgWidth;
  nCanvas.height = this.iMainImgWidth/percentVal;
  var ctx = nCanvas.getContext("2d");
  return function() {
    let per = this.iMainImgWidth/mainWrapWidth;
    let clipRectWidth = _this.getStyle(clipRect, "width", true)*per;
    let clipRectHeight = _this.getStyle(clipRect, "height", true)*_this.iMainImgHeight/_this.getStyle(mainWrap, 'height', true);
    let clipRectOffsetLeft = clipRect.offsetLeft; 
    let clipRectOffsetTop = clipRect.offsetTop;  
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
    ctx.drawImage(nImg,clipRectOffsetLeft*per,clipRectOffsetTop*per,clipRectWidth,clipRectHeight,
                    0, 0, ctx.canvas.width, ctx.canvas.height);
    
    var base64Data = nCanvas.toDataURL("image/jpeg", compressVal);
    return base64Data;
  }
}