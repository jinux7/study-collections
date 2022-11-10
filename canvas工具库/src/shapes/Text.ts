// import Util from '../Util';
import NuxObject from '../NuxObject';
class Text extends NuxObject {
  public type: string = 'text'; // 文本标识符
  public textStr: string; // 文本字符串
  public fontSize: number | string; // 字符大小
  public fontFamily: string; // 文本字体
  constructor(options: any) {
    super(options);
    this._initText(options);
  }
  _initText(options: any = {}) {
    this.textStr = options.textStr || '';
    this.fontSize =  parseInt(options.fontSize) || 14;
    this.fontFamily = options.fontFamily || 'Microsoft YaHei'
  }
  /** 文本的绘制方法 */
  _render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    let lines = [], textArr, num = 0;
    let fontSize = this.fontSize;
    let textStr = this.textStr;
    let maxWidth = this.width || 100;
    ctx.font = fontSize + 'px ' + this.fontFamily;
    ctx.textBaseline = 'top'; // 字符串上下居中
    ctx.textAlign = 'center'; // 字符串左右居中
    // 根据宽度将文本转成多行
    let originWidth = ctx.measureText(textStr).width;
    let oneWidth = originWidth/textStr.length;
    textArr = textStr.split('');
    while(textArr.length>0) {
      if(!lines[num]) {
        lines[num] = '';
      }
      lines[num] += textArr.shift();
      if(lines[num].length*oneWidth > maxWidth) {
        num++;
      }
    }
    this.setHeight(+fontSize * lines.length);
    lines.forEach((str, index)=> {
      let lineHeight = index*(fontSize as number) - num*(fontSize as number)/2;
      if (this.fill) {
        ctx.fillStyle = this.fill;
        ctx.fillText(str, 0, lineHeight, maxWidth);
      } 
      if (this.stroke) {
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeText(str, 0, lineHeight, maxWidth);
      }
    });
    ctx.closePath();
  }
}
export default Text;