import Util from './Util';
import { anyObject } from './type'
class NuxObject {
  public type: string = 'object'; // 物体类型标识符
  public visible: boolean = true; // 物体是否可见
  public active: boolean = false; // 是否处于激活状态
  public top: number = 0; // 位置top值，就是y
  public left: number = 0; // 位置left值，就是x
  public width: number = 0; // 物体的原始宽度
  public height: number = 0; // 物体的原始高度
  public scaleX: number = 1; // 物体当前的缩放倍数X
  public scaleY: number = 1; // 物体当前的缩放倍数y
  public angle: number = 0; // 物体当前的旋转角度
  public fill: string = 'rgb(0,0,0)'; // 物体默认填充颜色
  public stroke: string; // 物体默认描边颜色，默认无
  public strokeWidth: number = 1; // 物体默认描边宽度

  constructor(options: any) {
    this.initialize(options); // 初始化各种属性，就是简单的赋值
  }
  initialize(options: any = {}) {
    this.setOptions(options);
  }
  setOptions(options: any) {
    // 特殊处理下scale
    this.scaleX = this.scaleY = options.scale || 1;
    for (let prop in options) {
        this[prop] = options[prop] as any;
    }
  }
  // 获取属性值
  get(key: string) {
    return this[key];
  }
  // 设置值
  set(key: string, value: any): NuxObject {
    this[key] = value;
    return this;
  }
  // 绘制函数
  render(ctx: CanvasRenderingContext2D) {
    if((this.type!=='circle'&&this.type!=='text'&&this.type!=='svg')&&(this.width===0 || this.height===0 || !this.visible)) return;
    // 绘制之前把画笔ctx上下文的状态保存下来
    ctx.save();
    // 1.变换坐标
    this.transform(ctx);
    // 2.绘制物体
    this._render(ctx);
    // 恢复ctx上下文状态
    ctx.restore();
  }
  transform(ctx: CanvasRenderingContext2D) {
    ctx.translate(this.left, this.top);
    ctx.rotate(Util.degreesToRadians(this.angle));
    ctx.scale(this.scaleX, this.scaleY);
  }
  /** 具体由子类来实现，因为这确实是每个子类物体所独有的 */
  _render(ctx: CanvasRenderingContext2D) {}
  // 物体动画
  animate(props: anyObject, animateOptions: anyObject): NuxObject {
    let propsToAnimate = [];
    for (let prop in props) {
        propsToAnimate.push(prop);
    }
    const len = propsToAnimate.length;
    propsToAnimate.forEach((prop, i) => {
        const skipCallbacks = i !== len - 1;
        this._animate(prop, props[prop], animateOptions, skipCallbacks);
    });
    return this;
  }
  /**
    * 让物体真正动起来
    * @param property 物体需要动画的属性
    * @param to 物体属性的最终值
    * @param options 一些动画选项
    * @param skipCallbacks 是否跳过绘制
    */
   _animate(property: string, to: any, options: anyObject = {}, skipCallbacks: boolean) {
    options = Util.clone(options);
    let currentValue = this.get(property);

    if (!options.from) options.from = currentValue;
    to = to.toString();
    if (~to.indexOf('=')) {
      to = currentValue + parseFloat(to.replace('=', ''));
    } else {
      to = parseFloat(to);
    }
    Util.animate({
      startValue: options.from,
      endValue: to,
      byValue: options.by,
      easing: options.easing,
      duration: options.duration,
      abort: options.abort && (() => options.abort.call(this)),
      onChange: (value: any) => {
        this.set(property, value);
        if (skipCallbacks) {
            return;
        }
        options.onChange && options.onChange();
      },
      onComplete: () => {
        if (skipCallbacks) {
            return;
        }
        options.onComplete && options.onComplete();
      },
    });
  }
}
export default NuxObject;