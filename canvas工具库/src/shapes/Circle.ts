import Util from '../Util';
import NuxObject from '../NuxObject';
class Circle extends NuxObject {
  public type: string = 'circle'; // 圆形标识符
  public r: number = 0; // 圆形半径
  public startAngle: number = 0; // 弧度起点
  public endAngle: number = 360; // 弧度终点
  constructor(options: any) {
    super(options);
    this._initCircle(options);
  }
  _initCircle(options: any = {}) {
    this.r = options.r || 0;
    this.startAngle = options.startAngle || 0;
    this.endAngle = options.endAngle || 360;
  }
  /** 圆形的绘制方法 */
  _render(ctx: CanvasRenderingContext2D) {
    // debugger;
    ctx.beginPath();
    let r = this.r,
        startRad = Util.degreesToRadians(this.startAngle),
        endRad = Util.degreesToRadians(this.endAngle);
    ctx.arc(0, 0, r, startRad, endRad, true);
    // ctx.arc(200, 200, 100, Math.PI * 0, Math.PI * 2, true)
    ctx.closePath();
    if (this.fill) {
      ctx.fillStyle = this.fill;
      ctx.fill();
    } 
    if (this.stroke) {
      ctx.strokeStyle = this.stroke;
      ctx.lineWidth = this.strokeWidth;
      ctx.stroke();
    }
  }
}
export default Circle;