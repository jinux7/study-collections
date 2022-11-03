// import Util from './Util';
import NuxObject from '../NuxObject';
class Rect extends NuxObject {
  public type: string = 'rect'; // 矩形标识符
  public rx: number = 0; // 圆角rx
  public ry: number = 0; // 圆角ry
  
  constructor(options: any) {
    super(options);
    this._initRxRy(options);
  }
  _initRxRy(options: any = {}) {
    this.rx = options.rx || 0;
    this.ry = options.ry || 0;
  }
  /** 矩形的绘制方法 */
  _render(ctx: CanvasRenderingContext2D) {
    let rx = this.rx || 0,
        ry = this.ry || 0,
        x = -this.width / 2,
        y = -this.height / 2,
        w = this.width,
        h = this.height;
    // 绘制一个新的东西，大部分情况下都要开启一个新路径，要养成习惯
    ctx.beginPath();
    // 从左上角开始向右顺时针画一个矩形，这里就是单纯的绘制一个规规矩矩的矩形
    // 不考虑旋转缩放啥的，因为旋转缩放会在调用 _render 函数之前处理
    // 另外这里考虑了圆角的实现，所以用到了贝塞尔曲线，不然你可以直接画成四条线段，再懒一点可以直接调用原生方法 fillRect 和 strokeRect
    // 不过自己写的话自由度更高，也方便扩展
    ctx.moveTo(x + rx, y);
    ctx.lineTo(x + w - rx, y);
    ctx.bezierCurveTo(x + w, y, x + w, y + ry, x + w, y + ry);
    ctx.lineTo(x + w, y + h - ry);
    ctx.bezierCurveTo(x + w, y + h, x + w - rx, y + h, x + w - rx, y + h);
    ctx.lineTo(x + rx, y + h);
    ctx.bezierCurveTo(x, y + h, x, y + h - ry, x, y + h - ry);
    ctx.lineTo(x, y + ry);
    ctx.bezierCurveTo(x, y, x + rx, y, x + rx, y);
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
export default Rect;