import Util from './Util';
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
    for (let prop in options) {
        this[prop] = options[prop];
    }
  }
  render(ctx: CanvasRenderingContext2D) {
    if((this.type!=='circle'&&this.type!=='text')&&(this.width===0 || this.height===0 || !this.visible)) return;
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
}
export default NuxObject;