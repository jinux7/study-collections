/**
 * @desc 拖拽库
 * @author jinux
 */

;(function(window) {
  // drag类
  function UnxDrag(el, option) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if(!this.el) return;
    // 对option进行assign操作
    option = option || {};
    this.option = {
      copy: false, // 拖拽时原拖拽元素是否保留
      delete: false // 拖拽出父级区域后删除拖拽元素
    };
    option.copy && (this.option.copy = option.copy); 
    option.delete && (this.option.delete = option.delete);
    // 给el元素添加事件 
    this.el.setAttribute('draggable', true);
    this.el.addEventListener('dragstart', this.dragstart.bind(this), false);
    this.el.addEventListener('drag', this.drag.bind(this), false);
    this.el.addEventListener('dragend', this.dragend.bind(this), false);
  }
  UnxDrag.prototype = {
    dragstart: function(ev) {
      dragObj.set(this.el, this.option);
      // console.log('drag开始');
    },
    drag: function(ev) {
      // console.log('drag中');
    },
    dragend: function(ev) {
      // console.log('drag结束');
    },
  }

  // drop类
  function UnxDrop(el) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if(!this.el) return;
    this.el.addEventListener('dragenter', this.dragenter.bind(this), false);
    this.el.addEventListener('dragover', this.dragover.bind(this), false);
    this.el.addEventListener('dragleave', this.dragleave.bind(this), false);
    this.el.addEventListener('drop', this.drop.bind(this), false);

  }
  UnxDrop.prototype = {
    dragenter: function(ev) {
      // console.log('drag进入容器');
    },
    dragover: function(ev) {
      ev.preventDefault();
      // console.log('drag在容器中移动');
    },
    dragleave: function(ev) {
      // console.log('drag离开容器');
    },
    drop: function(ev) {
      ev.preventDefault();
      // 禁止拖拽元素在父级元素区域内drag
      if(isParent(dragObj.get().el, this.el)) return; 
      // 如果delete属性true，拖拽出父级区域便删除
      if(dragObj.get().option.delete) {
        dragObj.get().el.parentNode.removeChild(dragObj.get().el);
        return void 0;
      }
      // 如果copy属性true，拖拽会复制节点
      if(dragObj.get().option.copy) {
        var cloneNode = dragObj.get().el.cloneNode(true);
        this.el.appendChild(cloneNode);
        new UnxDrag(cloneNode, {
          delete: true
        });
      }else { // copy属性为false，拖拽到新的位置原来节点删除
        this.el.appendChild(dragObj.get().el);
      }
    },
  }

  // 当前drag对象
  function DragObj() {
    var currentDragEl = null;
    this.set = function(el, option) {
      currentDrag = {
        el,
        option
      }
    },
    this.get = function(el) {
      return currentDrag;
    }
  }
  var dragObj = new DragObj();

  // 工具函数，判断是否是父节点
  function isParent (node,parentNode){
    while (node != undefined && node != null && node.tagName.toUpperCase() != 'BODY'){
    if (node == parentNode){
      return true;
    }
      node = node.parentNode;
    }
      return false;
  }
  // 暴露类
  window.UnxDrag = UnxDrag;
  window.UnxDrop = UnxDrop;
})(window)