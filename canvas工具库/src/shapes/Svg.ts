import NuxObject from "../NuxObject";
import Util from '../Util';

class Svg extends NuxObject {
  public ctx: CanvasRenderingContext2D;
  public type: string = 'svg'; // svg标识符
  public svg: string; // svg字符串
  public _element: HTMLImageElement; // svg转化的img element
  public loaded: boolean = false; // 图片是否已经下载
  constructor(options: any) {
    super(options);
    this.svg = options.svg;
    this._parseSVGToDataURL(this.svg).then(base64=> {
      Util.loadImage(base64).then((imgEle: HTMLImageElement) => {
        this._initSvg(imgEle, options);
        this.loaded = true;
        this.ctx&&this.render(this.ctx); // this.ctx有的话再绘制，也就是Nuxcas.add之后
      });
    });
  }
  private _initSvg(imgEle: HTMLImageElement, options: any) {
    this._element = imgEle;
    // 设置svg图片的宽高
    this.width = 'width' in options ? options.width : this.getElement() ? this.getElement().width || 0 : 0;
    this.height = 'height' in options ? options.height : this.getElement() ? this.getElement().height || 0 : 0;
  }
  public getElement(): HTMLImageElement {
    return this._element;
  }
  // svg绘制方法
  _render(ctx: CanvasRenderingContext2D): void {
    const element = this._element;
    let x, y;
    x = -this.width / 2;
    y = -this.height / 2;
    element&&ctx.drawImage(element, x, y, this.width, this.height);
  }
  // 将svg字符串转换成base64图片格式
  private _parseSVGToDataURL(svg: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const _svg = svg;
      const blob = new Blob([_svg], { type: 'image/svg+xml;charset=utf-8'});
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function (event: ProgressEvent<FileReader>) {
        const base64: string = event?.target?.result as string;
        resolve(base64);
      };
      reader.onerror = function(err) {
        reject(err);
      };
    });
  }
}
export default Svg;