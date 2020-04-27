class Vue {
  constructor(option) {
    this.el = option.el && document.querySelector(option.el);
    this.$data = option.data;
    this.$methods = option.methods;
    this.init();
  }
  init() {
    this.observer(this.$data);
    new Compile(this.el, this);
  }
  // 给data值设置get，set的数据劫持
  observer(daObj) {
    if(typeof daObj === 'object') {
      for(let key in daObj) {
        let value = daObj[key];
        if(value && typeof value === 'object') {
          this.observer(value);
        }else {
          let dep = new Dep(); 
          Object.defineProperty(daObj, key, {
            get() {
              Dep.target && dep.push(Dep.target);
              return value;
            },
            set(val) {
              value = val;
              // 这里注意。依赖触发要在value=val的下边
              dep.dispatch();
            }
          });
        }
      }
    }
  }
}
// 依赖类
class Dep {
  constructor() {
    this.watchers = [];
  }
  push(watcher) {
    this.watchers.push(watcher);
  }
  dispatch() {
    this.watchers.forEach(watcher=> {
      watcher && watcher.callback && watcher.callback(); 
    });
  }
}
// 观察者类
class Watcher {
  constructor(callback) {
    Dep.target = this;
    this.callback = callback;
  }
}
// 编译模板字符串类
class Compile {
  constructor(el, vm) {
    this.parseHtml(el, vm);
  }
  parseHtml(el, vm) {
    Array.from(el.childNodes).forEach(item=> {
      // 处理带有指令的节点元素
      this.updateDirect(item, vm);
      if(item.nodeType === 1 && item.childNodes.length>0) {
        // 递归解析
        this.parseHtml(item, vm);
      }else if(item.nodeType === 3 && /\{\{(.*)\}\}/.test(item.textContent)) {
        let epx = RegExp.$1;
        this.updateText(item, vm, epx);
        new Watcher(()=> {
          this.updateText(item, vm, epx);
        });
        eval('vm.$data.' + epx);
        Dep.target = null;
      }
    });
  }
  // 判断是否是指令节点
  updateDirect(node, vm) {
    // 如果元素节点的属性是一个json对象
    if(typeof node.attributes === 'object') {
      // 转换成数组
      let attrs = Array.from(node.attributes);
      if(attrs.length > 0) {
        for(let i=0; i<attrs.length; i++) {
          // v-xxx指令
          if(/^v\-.+/.test(attrs[i].name)) {
            let handleStr = attrs[i].name.substring(2);
            let epx = attrs[i].value;
            this['dir'+handleStr](node, vm, epx);
          }
          // @事件
          if(/^\@.+/.test(attrs[i].name)){
            let eventName = attrs[i].name.substring(1);
            let callbackName = attrs[i].value;
            this['eventHandler'](node, vm, eventName, callbackName);
          }
        }
      }
    }
  }
  // 处理指令节点数据响应
  dirtext(node, vm, epx) {
    this.updateText(node, vm, epx);
    new Watcher(()=> {
      this.updateText(node, vm, epx);
    });
    eval('vm.$data.' + epx);
    Dep.target = null;
  }
  dirhtml(node, vm, epx) {
    this.updateHtml(node, vm, epx);
    new Watcher(()=> {
      this.updateHtml(node, vm, epx);
    });
    eval('vm.$data.' + epx);
    Dep.target = null;
  }
  dirmodel(node, vm, epx) {
    this.updateValue(node, vm, epx);
    new Watcher(()=> {
      this.updateValue(node, vm, epx);
    });
    eval('vm.$data.' + epx);
    Dep.target = null;
    // 添加input事件
    node.addEventListener('input', (ev)=> {
      eval('vm.$data.' + epx + '="' + ev.target.value + '"');
    }, false);
  }
  // 处理指令事件
  eventHandler(node, vm, eventName, callbackName) {
    node.addEventListener(eventName, vm.$methods[callbackName]||loop, false);
  }
  // 更改元素节点的textContent
  updateText(node, vm, epx) {
    node.textContent = eval('vm.$data.'+epx);
  }
  // 更改元素节点的innerHTML
  updateHtml(node, vm, epx) {
    node.innerHTML = eval('vm.$data.'+epx);
  }
  // 更改input元素的value
  updateValue(node, vm, epx) {
    node.value = eval('vm.$data.'+epx);
  }
}

var loop = function() {}