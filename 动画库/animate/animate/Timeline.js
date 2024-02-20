import Animate from "./Animate";
const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations');
const START_TIME = Symbol('start-time');
const PAUSE_START = Symbol('pause-start');
const PAUSE_TIME = Symbol('pause--time');
export default class Timeline {
  constructor() {
    this.state = 'inited';
    this[ANIMATIONS] = new Set();  
    this[START_TIME] = new Map();  
  }

  start() {
    if(this.state !== 'inited') {
      return;
    }
    this.state = 'started';
    let startTime = Date.now();
    this[PAUSE_TIME] = 0;
    this[TICK] = ()=> {
      let now = Date.now();
      for(let animation of this[ANIMATIONS]) {
        let t;

        if(this[START_TIME].get(animation) < startTime) {
          t = now - startTime - this[PAUSE_TIME] - animation.delay;
        }else {
          t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay;
        }

        if(animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          if(animation.options.loop) { // 如果这个动画需要循环
            if(animation.options.loop==='reverse') {
              let temp = animation.options.startValue;
              animation.options.startValue = animation.options.endValue;
              animation.options.endValue = temp;
            }
            animation.options.startTime = Date.now() - this[PAUSE_TIME] + 100;
            this.add(animation.options);
          }
          t = animation.duration;
        }

        if(t > 0) {
          animation.receive(t);
        }
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
    }
    this[TICK]();
  }

  pause() {
    if(this.state !== 'started') {
      return;
    }
    this.state = 'paused';
    this[PAUSE_START] = Date.now();
    cancelAnimationFrame(this[TICK_HANDLER]);
  }

  resume() {
    if(this.state !== 'paused') {
      return;
    }
    this.state = 'started';
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
    this[TICK]();
  }

  reset() {
    this.pause();
    this.state = 'inited';
    let startTime = Date.now();
    this[PAUSE_TIME] = 0;
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
    this[PAUSE_START] = 0;
    this[TICK_HANDLER] = null;
  }

  _add(animation, startTime) {
    if(arguments.length < 2) {
      startTime = Date.now();
    }
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime);
  }

  add(options) {
    let el = options.el;
    el = typeof el === 'string'?document.querySelector(el):el;
    if(!el) throw Error('动画绑定dom元素失败');
    let animate = new Animate(
      el.style, options.property, options.startValue, options.endValue, 
      options.duration*1000, options.delay*1000, options.timingFunction, options.template
    );
    animate.options = options;
    options.startTime?this._add(animate, options.startTime):this._add(animate);
  }
}