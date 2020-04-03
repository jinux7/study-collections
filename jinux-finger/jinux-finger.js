/**
 * @desc 移动端手势库
 * @desc 分析
 */
;
(function(window) {
  // 获取两点间距离工具函数
  function getLen(v) {
      return Math.sqrt(v.x * v.x + v.y * v.y);
  }
  // dot和getAngle函数用来算两次手势状态之间的夹角, cross函数用来算方向的, getRotateAngle函数算手势真正的角度的
  function dot(v1, v2) {
      return v1.x * v2.x + v1.y * v2.y;
  }
 // 求两次手势状态之间的夹角
  function getAngle(v1, v2) {
      var mr = getLen(v1) * getLen(v2);
      if (mr === 0) return 0;
      var r = dot(v1, v2) / mr;
      if (r > 1) r = 1;
      return Math.acos(r);
  }
  // 利用cross结果的正负来判断旋转的方向(大于0为逆时针, 小于0为顺时针)
  function cross(v1, v2) {
      return v1.x * v2.y - v2.x * v1.y;
  }
  // 如果cross大于0那就是逆时针对于屏幕是正角,对于第一象限是负角,所以 角度 * -1, 然后角度单位换算
  function getRotateAngle(v1, v2) {
      var angle = getAngle(v1, v2);
      if (cross(v1, v2) > 0) {
          angle *= -1;
      }

      return angle * 180 / Math.PI;
  }

  var HandlerAdmin = function(el) {
      this.handlers = [];
      this.el = el;
  };
  // 函数管理构造函数
  function HandlerAdmin(el) {
    this.handlers = [];
    this.el = el;
  }
  // 添加需要触发的函数
  HandlerAdmin.prototype.add = function(handler) {
    this.handlers.push(handler);
  }
  // 删除需要触发的函数
  HandlerAdmin.prototype.del = function(handler) {
    // 如果什么也不传，清空函数数组
    if(!handler) {
      this.handlers = [];
    }
    // 比对数组中的函数，并且删除它
    for(var i=this.handlers.length; i>=0; i--) {
      if(this.handlers[i] === handler) {
          this.handlers.splice(i, 1);
      }
    }
  }
  // 运行需要触发的函数
  HandlerAdmin.prototype.dispatch = function() {
    for(var i=0,len=this.handlers.length; i<len; i++) {
        var handler = this.handlers[i];
        // 运行这些函数的时候，是作为元素的事件触发的，所以，这些函数的this要指向这个元素
        if(typeof handler === 'function') handler.apply(this.el, arguments);
    }
  }
  // 初始化函数管理对象
  function wrapFunc(el, handler) {
    var handlerAdmin = new HandlerAdmin(el);
    handlerAdmin.add(handler);
    return handlerAdmin;
  }

  // 手势库构造函数
  function AlloyFinger(el, option) {
    // 获取添加事件的元素
    this.element = typeof el === 'string' ? document.querySelector(el) : el;
    // 因为添加事件后这些方法的执行上下文是this.element，所以给方法bind JinuxFinger这个执行上下文
    this.start = this.start.bind(this);
    this.move = this.move.bind(this);
    this.end = this.end.bind(this);
    this.cancel = this.cancel.bind(this);
    // 给这个元素添加事件
    this.element.addEventListener("touchstart", this.start, false);
    this.element.addEventListener("touchmove", this.move, false);
    this.element.addEventListener("touchend", this.end, false);
    this.element.addEventListener("touchcancel", this.cancel, false);
    // 定义一些实例属性
    this.preV = { x: null, y: null }; // 两个手指间的x距离和y距离
    this.pinchStartLen = null; // 捏拽的长度
    this.zoom = 1; // 缩放比例
    this.isDoubleTap = false; // 是否是双击
    var noop = function() {} // 空函数
    // 实例化JinuxFinger时，设置的手势回调函数
    this.rotate = wrapFunc(this.element, option.rotate || noop); // 旋转
    this.touchStart = wrapFunc(this.element, option.touchStart || noop); // 触摸开始  
    this.multipointStart = wrapFunc(this.element, option.multipointStart || noop); // 多个手指触摸开始 
    this.multipointEnd = wrapFunc(this.element, option.multipointEnd || noop); // 多个手指触摸结束，如4个手指触摸，屏幕上剩下1个或不剩都会触发
    this.pinch = wrapFunc(this.element, option.pinch || noop); // 两个手指捏拽
    this.swipe = wrapFunc(this.element, option.swipe || noop); // 上下左右滑动，手指离开时触发
    this.tap = wrapFunc(this.element, option.tap || noop); // 无论是单击还是双击都会触发
    this.doubleTap = wrapFunc(this.element, option.doubleTap || noop); // 双击触发
    this.longTap = wrapFunc(this.element, option.longTap || noop); // 单手指长按触发，750ms
    this.singleTap = wrapFunc(this.element, option.singleTap || noop); // 单击触发，250ms
    this.pressMove = wrapFunc(this.element, option.pressMove || noop); // 1个手指屏幕上移动触发
    this.twoFingerPressMove = wrapFunc(this.element, option.twoFingerPressMove || noop); // 2个以上手指屏幕上移动触发
    this.touchMove = wrapFunc(this.element, option.touchMove || noop); // 无论几个手指在屏幕上移动都会触发
    this.touchEnd = wrapFunc(this.element, option.touchEnd || noop); // 触摸结束都会触发
    this.touchCancel = wrapFunc(this.element, option.touchCancel || noop); // 事件简单的说是在移动端发生了触摸中断，一般情况下就是优先级比当前活动更高的事件时，才会触发的。比如正在看新闻，手指滑动屏幕的时候，突然来电话，直接中断了触摸事件，跳转到了通话，页面此时就触发了touchcancel事件。这个事件不容易在浏览器的模拟器中模拟，之前我在用电脑的任务栏切换的时候，受到启发，可以试试在浏览器模拟器触摸的同时，按下键盘上的Alt+Tab键，果然触发了touchcancel事件，有兴趣的小伙伴可以试一下。
    
    this._cancelAllHandler = this.cancelAll.bind(this);
    // 触发window的scroll事件时，清除现有touch事件的回调函数执行
    window.addEventListener('scroll', this._cancelAllHandler);

    this.delta = null; // 双击的间隔时间
    this.last = null; // 相对于下一次点击，前一次点击的时间
    this.now = null; // 当前点击保存用的时间，也可以理解为相对于上一次点击，这个是当前点击的时间
    this.tapTimeout = null;
    this.singleTapTimeout = null;
    this.longTapTimeout = null;
    this.swipeTimeout = null;
    this.x1 = this.x2 = this.y1 = this.y2 = null;
    this.preTapPosition = { x: null, y: null }; // 相对于下次点击，前一次点击手指x,y坐标的保存对象
  }
  AlloyFinger.prototype = {
    start: function (evt) {
      if (!evt.touches) return; // 屏幕上没有手指则返回
      this.now = Date.now(); // 设置touch开始时的时间
      this.x1 = evt.touches[0].pageX; // 第一个手指触点相对于HTML文档左边沿的的X坐标. 当存在水平滚动的偏移时, 这个值包含了水平滚动
      this.y1 = evt.touches[0].pageY; // 第一个手指触点相对于HTML文档左边沿的的Y坐标
      this.delta = this.now - (this.last || this.now); // 双击的间隔时间
      this.touchStart.dispatch(evt, this.element); // 触发了touchStart回调函数
      if (this.preTapPosition.x !== null) { // 如果不为null，说明之前已经有点击了
          // 判断是否满足手指双击条件
          this.isDoubleTap = (this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30);
          if (this.isDoubleTap) clearTimeout(this.singleTapTimeout);
      }
      this.preTapPosition.x = this.x1; // 保存当前手指x坐标
      this.preTapPosition.y = this.y1;// 保存当前手指y坐标
      this.last = this.now; // 保存当前时间
      var preV = this.preV, 
          len = evt.touches.length; // 现在屏幕上有多少个手指
      if (len > 1) { // 两个手指以上触摸情况
          this._cancelLongTap(); // 清除长按回调函数的执行
          this._cancelSingleTap(); // 清除点击函数的执行
          // 计算两个手指x,y的距离
          var v = { x: evt.touches[1].pageX - this.x1, y: evt.touches[1].pageY - this.y1 };
          // 赋值给preV
          preV.x = v.x; 
          preV.y = v.y;
          this.pinchStartLen = getLen(preV); // 计算出两个手指间的距离
          this.multipointStart.dispatch(evt, this.element); // 触发多点触碰函数回调
      }
      this._preventTap = false; // 长按是否回调执行，否 
      this.longTapTimeout = setTimeout(function () { // 长按触发回调函数的定时器
          this.longTap.dispatch(evt, this.element); // 触发长按回调函数
          this._preventTap = true; // 长按是否回调执行，是
      }.bind(this), 750); // 长按是手指按下750ms后触发
  },
  move: function (evt) {
      if (!evt.touches) return; // 没有touches属性则返回
      var preV = this.preV, // 两个手指间距离暂存preV里
          len = evt.touches.length, // 屏幕上的手指数
          currentX = evt.touches[0].pageX, // 屏幕上第一个手指的pageX暂存
          currentY = evt.touches[0].pageY; // 屏幕上第一个手指的pageY暂存
      this.isDoubleTap = false; // 手指移动了，就不是双击了
      if (len > 1) { // 手指大于2个情况
          var sCurrentX = evt.touches[1].pageX, // 屏幕上第2个手指的pageX暂存
              sCurrentY = evt.touches[1].pageY; // 屏幕上第2个手指的pageY暂存
          // 两个手指间距离
          var v = { x: evt.touches[1].pageX - currentX, y: evt.touches[1].pageY - currentY };

          if (preV.x !== null) {
              if (this.pinchStartLen > 0) { // move之前两指间的距离如果大于0情况
                  evt.zoom = getLen(v) / this.pinchStartLen; // move后的距离/move前的，就是捏拽的比例
                  this.pinch.dispatch(evt, this.element); // 触发捏拽回调，并将zoom属性传递到事件对象里
              }
              // 获取手指移动的角度
              evt.angle = getRotateAngle(v, preV);
              this.rotate.dispatch(evt, this.element); // 触发旋转回调函数
          }
          preV.x = v.x; // move时将现在两指间的距离x赋值给preV
          preV.y = v.y; // move时将现在两指间的距离y赋值给preV

          if (this.x2 !== null && this.sx2 !== null) { // 因为是两个手指，所以取的是两个手指中间的值，两次move之间的偏移量,参考下变一个手指情况
              evt.deltaX = (currentX - this.x2 + sCurrentX - this.sx2) / 2;
              evt.deltaY = (currentY - this.y2 + sCurrentY - this.sy2) / 2;
          } else { // 第一次移动都为0
              evt.deltaX = 0;
              evt.deltaY = 0;
          }
          this.twoFingerPressMove.dispatch(evt, this.element); // 两个以上手指移动的事件回调

          this.sx2 = sCurrentX; // 第二个手指坐标x暂存
          this.sy2 = sCurrentY; // 第二个手指坐标y暂存
      } else { // 单指move情况下
          if (this.x2 !== null) { // 第一次移动this.x2=null的,第二次之后才为true
              evt.deltaX = currentX - this.x2; // x方向两次move事件的差值
              evt.deltaY = currentY - this.y2; // y方向两次move事件的差值

              //move事件中添加对当前触摸点到初始触摸点的判断，
              //如果曾经大于过某个距离(比如10),就认为是移动到某个地方又移回来，应该不再触发tap事件才对。
              var movedX = Math.abs(this.x1 - this.x2),
                  movedY = Math.abs(this.y1 - this.y2);

              if(movedX > 10 || movedY > 10){
                  this._preventTap = true;
              }

          } else { // 第一次移动都为0
              evt.deltaX = 0;
              evt.deltaY = 0;
          }
          
          
          this.pressMove.dispatch(evt, this.element); // 一个手指移动的触发回调
      }

      this.touchMove.dispatch(evt, this.element); // 有移动就触发touchMove事件回调

      this._cancelLongTap(); // 有移动事件了，清除长按的事件回调
      this.x2 = currentX; // 将当前第一个手指的坐标x复制给this.x2
      this.y2 = currentY; // 将当前第一个手指的坐标y复制给this.y2
      
      if (len > 1) { // 两个以上手指，阻止浏览器默认事件
          evt.preventDefault();
      }
  },
  end: function (evt) {
      if (!evt.changedTouches) return; // end事件触发时，changedTouches为空，则返回
      this._cancelLongTap(); // 取消长按的回调函数
      var self = this; // this暂存在bianliangself
      if (evt.touches.length < 2) { // 目前屏幕上留下的手指0或者1个
          this.multipointEnd.dispatch(evt, this.element); // 调用多指触摸的结束回调
          this.sx2 = this.sy2 = null;
      }

      //swipe
      // this.x2或this.y2有值说明有在屏幕上移动，并且计算移动后离开屏幕时的坐标与this.x1手指刚触摸屏幕时的坐标差值大于30，可以出发swipe事件回调
      if ((this.x2 && Math.abs(this.x1 - this.x2) > 30) ||
          (this.y2 && Math.abs(this.y1 - this.y2) > 30)) {
          // 获取滑动的方向  
          evt.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
          this.swipeTimeout = setTimeout(function () { // 触发swipe回调函数，加入宏任务队列
              self.swipe.dispatch(evt, self.element);

          }, 0)
      } else { // 这里说明不是swipe事件，只是点击事件
          this.tapTimeout = setTimeout(function () { // 点击定时器
              if(!self._preventTap){ // 长按事件函数没有执行
                  self.tap.dispatch(evt, self.element); // 执行tap回调
              }
              // trigger double tap immediately
              if (self.isDoubleTap) { // 如果是双击的话
                  self.doubleTap.dispatch(evt, self.element); // 执行双击事件回调
                  self.isDoubleTap = false; // 执行之后设置双击标识为假
              }
          }, 0)

          if (!self.isDoubleTap) { // 如果不是双击操作
              self.singleTapTimeout = setTimeout(function () { // 250ms后执行singleTap事件回调
                  self.singleTap.dispatch(evt, self.element);
              }, 250);
          }
      }

      this.touchEnd.dispatch(evt, this.element); // 手指离开都会触发touchEnd事件回调
      // 手指离开后将一些属性重置
      this.preV.x = 0;
      this.preV.y = 0;
      this.zoom = 1;
      this.pinchStartLen = null;
      this.x1 = this.x2 = this.y1 = this.y2 = null;
  },
  cancelAll: function () {
      this._preventTap = true; // 阻止tap事件
      clearTimeout(this.singleTapTimeout); // 清除singleTapTimeout定时器
      clearTimeout(this.tapTimeout); // 清除tapTimeout定时器
      clearTimeout(this.longTapTimeout); // 清除longTapTimeout定时器
      clearTimeout(this.swipeTimeout); // 清除swipeTimeout定时器
  },
  cancel: function (evt) { // cancel事件
      this.cancelAll()
      this.touchCancel.dispatch(evt, this.element); // 触发touchCancel回调
  },
  _cancelLongTap: function () { // 清除longTapTimeout定时器函数
      clearTimeout(this.longTapTimeout);
  },
  _cancelSingleTap: function () { // 清除singleTapTimeout定时器函数
      clearTimeout(this.singleTapTimeout);
  },
  // 计算swipe的方向函数
  _swipeDirection: function (x1, x2, y1, y2) {
      return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  },
  // 使用实例给事件添加回调函数
  on: function(evt, handler) {
      if(this[evt]) {
          this[evt].add(handler);
      }
  },
  // 使用实例给事件删除回调函数
  off: function(evt, handler) {
      if(this[evt]) {
          this[evt].del(handler);
      }
  },
  // 实例销毁函数
  destroy: function() {
      if(this.singleTapTimeout) clearTimeout(this.singleTapTimeout);
      if(this.tapTimeout) clearTimeout(this.tapTimeout);
      if(this.longTapTimeout) clearTimeout(this.longTapTimeout);
      if(this.swipeTimeout) clearTimeout(this.swipeTimeout);

      this.element.removeEventListener("touchstart", this.start);
      this.element.removeEventListener("touchmove", this.move);
      this.element.removeEventListener("touchend", this.end);
      this.element.removeEventListener("touchcancel", this.cancel);

      this.rotate.del();
      this.touchStart.del();
      this.multipointStart.del();
      this.multipointEnd.del();
      this.pinch.del();
      this.swipe.del();
      this.tap.del();
      this.doubleTap.del();
      this.longTap.del();
      this.singleTap.del();
      this.pressMove.del();
      this.twoFingerPressMove.del()
      this.touchMove.del();
      this.touchEnd.del();
      this.touchCancel.del();

      this.preV = this.pinchStartLen = this.zoom = this.isDoubleTap = this.delta = this.last = this.now = this.tapTimeout = this.singleTapTimeout = this.longTapTimeout = this.swipeTimeout = this.x1 = this.x2 = this.y1 = this.y2 = this.preTapPosition = this.rotate = this.touchStart = this.multipointStart = this.multipointEnd = this.pinch = this.swipe = this.tap = this.doubleTap = this.longTap = this.singleTap = this.pressMove = this.touchMove = this.touchEnd = this.touchCancel = this.twoFingerPressMove = null;

      window.removeEventListener('scroll', this._cancelAllHandler);
      return null;
    }

  }

  // 暴露给外部使用
  if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = AlloyFinger;
  } else {
      window.AlloyFinger = AlloyFinger;
  }
})(window)