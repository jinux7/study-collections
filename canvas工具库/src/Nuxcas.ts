class Nuxcas {
  public width: number; // 画布宽
  public height: number; // 画布高
  public wrapperEl: HTMLElement; // 包围canvas的外层容器
  public lowerCanvasEl: HTMLCanvasElement; // 下层canvas，用于绘制所有物体
  public lowerContext: CanvasRenderingContext2D; // 下层画布canvas上下文
  private _offset: any; // 整个画布到页面上边左边的偏移量
  private _objects: any = []; // 画布中所有要绘制的物体

  constructor(el: HTMLCanvasElement, options?: any) {
    this.lowerCanvasEl = el
    // this.lowerContext = this.lowerCanvasEl.getContext('2d') as CanvasRenderingContext2D; // 用下边的写法也对
    this.lowerContext = this.lowerCanvasEl.getContext('2d')!;

    this.width = +this.lowerCanvasEl.width;
    this.height = +this.lowerCanvasEl.height;
    this.lowerCanvasEl.style.width = this.width + 'px';
    this.lowerCanvasEl.style.height = this.height + 'px';
  }

  // 添加绘制物体对象
  add(...args: any): Nuxcas{
    this._objects.push(...args);
    this.renderAll();
    return this;
  }
  // 绘制所有的物体
  renderAll() {
    const ctx = this.lowerContext;
    // 清除画布
    this.clearContext(ctx);
    // 绘制所有物体
    this._objects.forEach((obj: any) => {
      if(obj.type==='image' || obj.type==='svg' || obj.type==='html') {
        obj.ctx = ctx
        // 如果图片已经下载，直接绘制
        obj.loaded&&obj.render(ctx);
      }else {
        obj.render(ctx);
      }
    });
  }
  // 清除画布
  clearContext(ctx: CanvasRenderingContext2D): Nuxcas {
    ctx && ctx.clearRect(0, 0, this.width, this.height);
    return this;
  }
}
export default Nuxcas;