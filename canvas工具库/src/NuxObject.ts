import Util from './Util';
import { anyObject } from './type'
import { Point } from './Point';
import Nuxcas from './Nuxcas';
import { EventCenter } from './Event';
class NuxObject extends EventCenter {
  private id: number; // 物体的id
  public nuxcas: Nuxcas; // 物体所在的Nuxcas实例
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
  
  public padding: number = 1; // 选中态边框和物体的内间距
  public borderWidth: number = 1; // 选中态的边框宽度
  public borderColor: string = 'red'; // 选中态边框的颜色
  public hasRotatingPoint: boolean = true; // 选中态是否有旋转控制点
  public rotatingPointOffset: number = 40; // 选中态旋转控制点偏移量
  public hasControls: boolean = true; // 选中态是否有控制点
  public cornerSize: number = 12; // 选中态物体控制点大小，单位 px
  public transparentCorners: boolean = false; // 选中态物体控制点用 stroke 还是 fill
  public cornerColor: string = 'red'; // 选中态控制点颜色
  public isMoving: boolean = false; // 物体是否在移动中
  public borderOpacityWhenMoving: number = 0.4; // 移动的时候边框透明度
  public oCoords: any; // 物体控制点位置，随时变化
  public currentWidth: number = 0; /** 物体缩放后的宽度 */
  public currentHeight: number = 0; /** 物体缩放后的高度 */

  constructor(options: any) {
    super();
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
  // 获取id
  getId(): number {
    return this.id;
  }
  // 设置id
  setId(id: number): NuxObject {
    this.id = id;
    return this;
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
  /** 获取当前大小，包含缩放效果 */
  getWidth(): number {
    return this.width * this.scaleX;
  }
  /** 获取当前大小，包含缩放效果 */
  getHeight(): number {
    return this.height * this.scaleY;
  }
  // 设置width
  setWidth(value: number): NuxObject {
    this['width'] = value;
    return this;
  }
  // 设置height
  setHeight(value: number): NuxObject {
    this['height'] = value;
    return this;
  }
  getAngle(): number {
    return this.angle;
  }
  setAngle(angle: number) {
    this.angle = angle;
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
     // 如果是选中态
     if (this.active) {
      // 绘制物体边框
      this.drawBorders(ctx);
      // 绘制物体四周的控制点，共⑨个
      this.drawControls(ctx);
    }
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
  // 绘制物体的边框
  drawBorders(ctx: CanvasRenderingContext2D): NuxObject {
    let padding = this.padding, // 边框和物体的内间距，也是个配置项，和 css 中的 padding 一个意思
        padding2 = padding * 2,
        strokeWidth = 1; // 边框宽度始终是 1，不受缩放的影响，当然可以做成配置项

    ctx.save();

    // ctx.globalAlpha = this.isMoving ? 0.5 : 1; // 物体变换的时候使其透明度减半，提升用户体验
    ctx.strokeStyle = this.borderColor;
    ctx.lineWidth = strokeWidth;

    /** 画边框的时候需要把 transform 变换中的 scale 效果抵消，这样才能画出原始大小的线条 */
    ctx.scale(1 / this.scaleX, 1 / this.scaleY);

    let w = this.getWidth(),
        h = this.getHeight();
    // 这里直接用原生的 api strokeRect 画边框即可，当然要考虑到边宽和内间距的影响
    // 就是画一个规规矩矩的矩形
    ctx.strokeRect(
        (-(w / 2) - padding - strokeWidth / 2),
        (-(h / 2) - padding - strokeWidth / 2),
        (w + padding2 + strokeWidth),
        (h + padding2 + strokeWidth)
    );

    // 除了画边框，还要画旋转控制点和边框相连接的那条线
    if (this.hasRotatingPoint && this.hasControls) {
      let rotateHeight = (-h - strokeWidth - padding * 2) / 2;
      ctx.beginPath();
      ctx.moveTo(0, rotateHeight);
      ctx.lineTo(0, rotateHeight - this.rotatingPointOffset); // rotatingPointOffset 是旋转控制点到边框的距离
      ctx.closePath();
      ctx.stroke();
    }

    ctx.restore();
    return this;
  }
  /** 绘制包围盒模型的控制点 */
  drawControls(ctx: CanvasRenderingContext2D): NuxObject {
    if (!this.hasControls) return this;
    // 因为画布已经经过变换，所以大部分数值需要除以 scale 来抵消变换
    let size = this.cornerSize,
        size2 = size / 2,
        strokeWidth2 = this.strokeWidth / 2,
        // top 和 left 值为物体左上角的点
        left = -(this.width / 2),
        top = -(this.height / 2),
        _left,
        _top,
        sizeX = size / this.scaleX,
        sizeY = size / this.scaleY,
        paddingX = this.padding / this.scaleX,
        paddingY = this.padding / this.scaleY,
        scaleOffsetY = size2 / this.scaleY,
        scaleOffsetX = size2 / this.scaleX,
        scaleOffsetSizeX = (size2 - size) / this.scaleX,
        scaleOffsetSizeY = (size2 - size) / this.scaleY,
        height = this.height,
        width = this.width,
        // 控制点是实心还是空心
        methodName = this.transparentCorners ? 'strokeRect' : 'fillRect';

    ctx.save();

    ctx.lineWidth = this.borderWidth / Math.max(this.scaleX, this.scaleY);

    ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
    ctx.strokeStyle = ctx.fillStyle = this.cornerColor;

    // top-left
    _left = left - scaleOffsetX - strokeWidth2 - paddingX;
    _top = top - scaleOffsetY - strokeWidth2 - paddingY;
    ctx.clearRect(_left, _top, sizeX, sizeY);
    ctx[methodName](_left, _top, sizeX, sizeY);

    // top-right
    _left = left + width - scaleOffsetX + strokeWidth2 + paddingX;
    _top = top - scaleOffsetY - strokeWidth2 - paddingY;
    ctx.clearRect(_left, _top, sizeX, sizeY);
    ctx[methodName](_left, _top, sizeX, sizeY);

    // bottom-left
    _left = left - scaleOffsetX - strokeWidth2 - paddingX;
    _top = top + height + scaleOffsetSizeY + strokeWidth2 + paddingY;
    ctx.clearRect(_left, _top, sizeX, sizeY);
    ctx[methodName](_left, _top, sizeX, sizeY);

    // bottom-right
    _left = left + width + scaleOffsetSizeX + strokeWidth2 + paddingX;
    _top = top + height + scaleOffsetSizeY + strokeWidth2 + paddingY;
    ctx.clearRect(_left, _top, sizeX, sizeY);
    ctx[methodName](_left, _top, sizeX, sizeY);

    // middle-top
    _left = left + width / 2 - scaleOffsetX;
    _top = top - scaleOffsetY - strokeWidth2 - paddingY;
    ctx.clearRect(_left, _top, sizeX, sizeY);
    ctx[methodName](_left, _top, sizeX, sizeY);

    // middle-bottom
    _left = left + width / 2 - scaleOffsetX;
    _top = top + height + scaleOffsetSizeY + strokeWidth2 + paddingY;
    ctx.clearRect(_left, _top, sizeX, sizeY);
    ctx[methodName](_left, _top, sizeX, sizeY);

    // middle-right
    _left = left + width + scaleOffsetSizeX + strokeWidth2 + paddingX;
    _top = top + height / 2 - scaleOffsetY;
    ctx.clearRect(_left, _top, sizeX, sizeY);
    ctx[methodName](_left, _top, sizeX, sizeY);

    // middle-left
    _left = left - scaleOffsetX - strokeWidth2 - paddingX;
    _top = top + height / 2 - scaleOffsetY;
    ctx.clearRect(_left, _top, sizeX, sizeY);
    ctx[methodName](_left, _top, sizeX, sizeY);

    // 绘制旋转控制点
    if (this.hasRotatingPoint) {
        _left = left + width / 2 - scaleOffsetX;
        _top = top - this.rotatingPointOffset / this.scaleY - sizeY / 2 - strokeWidth2 - paddingY;

        ctx.clearRect(_left, _top, sizeX, sizeY);
        ctx[methodName](_left, _top, sizeX, sizeY);
    }

    ctx.restore();

    return this;
  }
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
        this.setCoords(); // 动画结束了，更新下oCoords坐标
        options.onComplete && options.onComplete();
      },
    });
  }
  /** 重新设置物体包围盒的边框和各个控制点，包括位置和大小 */
  setCoords(): NuxObject {
    let strokeWidth = this.strokeWidth > 1 ? this.strokeWidth : 0,
        padding = this.padding,
        radian = Util.degreesToRadians(this.angle);

    this.currentWidth = (this.width + strokeWidth) * this.scaleX + padding * 2;
    this.currentHeight = (this.height + strokeWidth) * this.scaleY + padding * 2;

    // 物体中心点到顶点的斜边长度
    let _hypotenuse = Math.sqrt(Math.pow(this.currentWidth / 2, 2) + Math.pow(this.currentHeight / 2, 2));
    let _angle = Math.atan(this.currentHeight / this.currentWidth);
    // let _angle = Math.atan2(this.currentHeight, this.currentWidth);

    // offset added for rotate and scale actions
    let offsetX = Math.cos(_angle + radian) * _hypotenuse,
        offsetY = Math.sin(_angle + radian) * _hypotenuse,
        sinTh = Math.sin(radian),
        cosTh = Math.cos(radian);

    let coords = this.getCenterPoint();
    let tl = {
        x: coords.x - offsetX,
        y: coords.y - offsetY,
    };
    let tr = {
        x: tl.x + this.currentWidth * cosTh,
        y: tl.y + this.currentWidth * sinTh,
    };
    let br = {
        x: tr.x - this.currentHeight * sinTh,
        y: tr.y + this.currentHeight * cosTh,
    };
    let bl = {
        x: tl.x - this.currentHeight * sinTh,
        y: tl.y + this.currentHeight * cosTh,
    };
    let ml = {
        x: tl.x - (this.currentHeight / 2) * sinTh,
        y: tl.y + (this.currentHeight / 2) * cosTh,
    };
    let mt = {
        x: tl.x + (this.currentWidth / 2) * cosTh,
        y: tl.y + (this.currentWidth / 2) * sinTh,
    };
    let mr = {
        x: tr.x - (this.currentHeight / 2) * sinTh,
        y: tr.y + (this.currentHeight / 2) * cosTh,
    };
    let mb = {
        x: bl.x + (this.currentWidth / 2) * cosTh,
        y: bl.y + (this.currentWidth / 2) * sinTh,
    };
    let mtr = {
        x: tl.x + (this.currentWidth / 2) * cosTh,
        y: tl.y + (this.currentWidth / 2) * sinTh,
    };

    // clockwise
    this.oCoords = { tl, tr, br, bl, ml, mt, mr, mb, mtr };

    // set coordinates of the draggable boxes in the corners used to scale/rotate the image
    this._setCornerCoords();

    return this;
  }
  /** 获取物体中心点 */
  getCenterPoint() {
    return this.translateToCenterPoint(new Point(this.left, this.top), 'center', 'center');
  }
  /** 将中心点移到变换基点 */
  translateToCenterPoint(point: Point, originX: string, originY: string): Point {
    let cx = point.x,
        cy = point.y;

    if (originX === 'left') {
        cx = point.x + this.getWidth() / 2;
    } else if (originX === 'right') {
        cx = point.x - this.getWidth() / 2;
    }

    if (originY === 'top') {
        cy = point.y + this.getHeight() / 2;
    } else if (originY === 'bottom') {
        cy = point.y - this.getHeight() / 2;
    }
    const p = new Point(cx, cy);
    if (this.angle) {
        return Util.rotatePoint(p, point, Util.degreesToRadians(this.angle));
    } else {
        return p;
    }
  }
  /** 获取包围盒的四条边 */
  _getImageLines(corner: any) {
    return {
        topline: {
            o: corner.tl,
            d: corner.tr,
        },
        rightline: {
            o: corner.tr,
            d: corner.br,
        },
        bottomline: {
            o: corner.br,
            d: corner.bl,
        },
        leftline: {
            o: corner.bl,
            d: corner.tl,
        },
    };
  }
   /**
   * 射线检测法：以鼠标坐标点为参照，水平向右做一条射线，求坐标点与多边形的交点个数
   * 如果和物体相交的个数为偶数点则点在物体外部；如果为奇数点则点在内部
   * 在 fabric 中的点选多边形其实就是点选矩形，所以针对矩形做了一些优化
   */
  _findCrossPoints(ex: number, ey: number, lines: any): number {
    let b1, // 射线的斜率
        b2, // 边的斜率
        a1,
        a2,
        xi, // 射线与边的交点 x
        // yi, // 射线与边的交点 y
        xcount = 0,
        iLine; // 当前边

    // 遍历包围盒的四条边
    for (let lineKey in lines) {
        iLine = lines[lineKey];

        // 优化1：如果边的两个端点的 y 值都小于鼠标点的 y 值，则跳过
        if (iLine.o.y < ey && iLine.d.y < ey) continue;
        // 优化2：如果边的两个端点的 y 值都大于等于鼠标点的 y 值，则跳过
        if (iLine.o.y >= ey && iLine.d.y >= ey) continue;

        // 优化3：如果边是一条垂线
        if (iLine.o.x === iLine.d.x && iLine.o.x >= ex) {
            xi = iLine.o.x;
            // yi = ey;
        } else {
            // 执行到这里就是一条普通斜线段了
            // 用 y=kx+b 简单算下射线与边的交点即可
            b1 = 0;
            b2 = (iLine.d.y - iLine.o.y) / (iLine.d.x - iLine.o.x);
            a1 = ey - b1 * ex;
            a2 = iLine.o.y - b2 * iLine.o.x;

            xi = -(a1 - a2) / (b1 - b2);
            // yi = a1 + b1 * xi;
        }
        // 只需要计数 xi >= ex 的情况
        if (xi >= ex) {
            xcount += 1;
        }
        // 优化4：因为 fabric 中的点选只需要用到矩形，所以根据矩形的特质，顶多只有两个交点，于是就可以提前结束循环
        if (xcount === 2) {
            break;
        }
    }
    return xcount;
  }
  /** 重新设置物体的每个控制点，包括位置和大小 */
  _setCornerCoords() {
    let coords = this.oCoords,
        radian = Util.degreesToRadians(this.angle),
        newTheta = Util.degreesToRadians(45 - this.angle),
        cornerHypotenuse = Math.sqrt(2 * Math.pow(this.cornerSize, 2)) / 2,
        cosHalfOffset = cornerHypotenuse * Math.cos(newTheta),
        sinHalfOffset = cornerHypotenuse * Math.sin(newTheta),
        sinTh = Math.sin(radian),
        cosTh = Math.cos(radian);

    coords.tl.corner = {
        tl: {
            x: coords.tl.x - sinHalfOffset,
            y: coords.tl.y - cosHalfOffset,
        },
        tr: {
            x: coords.tl.x + cosHalfOffset,
            y: coords.tl.y - sinHalfOffset,
        },
        bl: {
            x: coords.tl.x - cosHalfOffset,
            y: coords.tl.y + sinHalfOffset,
        },
        br: {
            x: coords.tl.x + sinHalfOffset,
            y: coords.tl.y + cosHalfOffset,
        },
    };

    coords.tr.corner = {
        tl: {
            x: coords.tr.x - sinHalfOffset,
            y: coords.tr.y - cosHalfOffset,
        },
        tr: {
            x: coords.tr.x + cosHalfOffset,
            y: coords.tr.y - sinHalfOffset,
        },
        br: {
            x: coords.tr.x + sinHalfOffset,
            y: coords.tr.y + cosHalfOffset,
        },
        bl: {
            x: coords.tr.x - cosHalfOffset,
            y: coords.tr.y + sinHalfOffset,
        },
    };

    coords.bl.corner = {
        tl: {
            x: coords.bl.x - sinHalfOffset,
            y: coords.bl.y - cosHalfOffset,
        },
        bl: {
            x: coords.bl.x - cosHalfOffset,
            y: coords.bl.y + sinHalfOffset,
        },
        br: {
            x: coords.bl.x + sinHalfOffset,
            y: coords.bl.y + cosHalfOffset,
        },
        tr: {
            x: coords.bl.x + cosHalfOffset,
            y: coords.bl.y - sinHalfOffset,
        },
    };

    coords.br.corner = {
        tr: {
            x: coords.br.x + cosHalfOffset,
            y: coords.br.y - sinHalfOffset,
        },
        bl: {
            x: coords.br.x - cosHalfOffset,
            y: coords.br.y + sinHalfOffset,
        },
        br: {
            x: coords.br.x + sinHalfOffset,
            y: coords.br.y + cosHalfOffset,
        },
        tl: {
            x: coords.br.x - sinHalfOffset,
            y: coords.br.y - cosHalfOffset,
        },
    };

    coords.ml.corner = {
        tl: {
            x: coords.ml.x - sinHalfOffset,
            y: coords.ml.y - cosHalfOffset,
        },
        tr: {
            x: coords.ml.x + cosHalfOffset,
            y: coords.ml.y - sinHalfOffset,
        },
        bl: {
            x: coords.ml.x - cosHalfOffset,
            y: coords.ml.y + sinHalfOffset,
        },
        br: {
            x: coords.ml.x + sinHalfOffset,
            y: coords.ml.y + cosHalfOffset,
        },
    };

    coords.mt.corner = {
        tl: {
            x: coords.mt.x - sinHalfOffset,
            y: coords.mt.y - cosHalfOffset,
        },
        tr: {
            x: coords.mt.x + cosHalfOffset,
            y: coords.mt.y - sinHalfOffset,
        },
        bl: {
            x: coords.mt.x - cosHalfOffset,
            y: coords.mt.y + sinHalfOffset,
        },
        br: {
            x: coords.mt.x + sinHalfOffset,
            y: coords.mt.y + cosHalfOffset,
        },
    };

    coords.mr.corner = {
        tl: {
            x: coords.mr.x - sinHalfOffset,
            y: coords.mr.y - cosHalfOffset,
        },
        tr: {
            x: coords.mr.x + cosHalfOffset,
            y: coords.mr.y - sinHalfOffset,
        },
        bl: {
            x: coords.mr.x - cosHalfOffset,
            y: coords.mr.y + sinHalfOffset,
        },
        br: {
            x: coords.mr.x + sinHalfOffset,
            y: coords.mr.y + cosHalfOffset,
        },
    };

    coords.mb.corner = {
        tl: {
            x: coords.mb.x - sinHalfOffset,
            y: coords.mb.y - cosHalfOffset,
        },
        tr: {
            x: coords.mb.x + cosHalfOffset,
            y: coords.mb.y - sinHalfOffset,
        },
        bl: {
            x: coords.mb.x - cosHalfOffset,
            y: coords.mb.y + sinHalfOffset,
        },
        br: {
            x: coords.mb.x + sinHalfOffset,
            y: coords.mb.y + cosHalfOffset,
        },
    };

    coords.mtr.corner = {
        tl: {
            x: coords.mtr.x - sinHalfOffset + sinTh * this.rotatingPointOffset,
            y: coords.mtr.y - cosHalfOffset - cosTh * this.rotatingPointOffset,
        },
        tr: {
            x: coords.mtr.x + cosHalfOffset + sinTh * this.rotatingPointOffset,
            y: coords.mtr.y - sinHalfOffset - cosTh * this.rotatingPointOffset,
        },
        bl: {
            x: coords.mtr.x - cosHalfOffset + sinTh * this.rotatingPointOffset,
            y: coords.mtr.y + sinHalfOffset - cosTh * this.rotatingPointOffset,
        },
        br: {
            x: coords.mtr.x + sinHalfOffset + sinTh * this.rotatingPointOffset,
            y: coords.mtr.y + cosHalfOffset - cosTh * this.rotatingPointOffset,
        },
    };
  }
  /** 检测哪个控制点被点击了 */
  _findTargetCorner(e: MouseEvent, offset: any): boolean | string {
    if (!this.hasControls || !this.active) return false;

    let pointer = Util.getPointer(e, this.nuxcas.upperCanvasEl),
        ex = pointer.x - offset.left,
        ey = pointer.y - offset.top,
        xpoints,
        lines;

    for (let i in this.oCoords) {
        if (i === 'mtr' && !this.hasRotatingPoint) {
            continue;
        }
        lines = this._getImageLines(this.oCoords[i].corner);

        // debugger 绘制物体控制点的四个顶点
        // this.canvas.contextTop.fillRect(lines.bottomline.d.x, lines.bottomline.d.y, 2, 2);
        // this.canvas.contextTop.fillRect(lines.bottomline.o.x, lines.bottomline.o.y, 2, 2);

        // this.canvas.contextTop.fillRect(lines.leftline.d.x, lines.leftline.d.y, 2, 2);
        // this.canvas.contextTop.fillRect(lines.leftline.o.x, lines.leftline.o.y, 2, 2);

        // this.canvas.contextTop.fillRect(lines.topline.d.x, lines.topline.d.y, 2, 2);
        // this.canvas.contextTop.fillRect(lines.topline.o.x, lines.topline.o.y, 2, 2);

        // this.canvas.contextTop.fillRect(lines.rightline.d.x, lines.rightline.d.y, 2, 2);
        // this.canvas.contextTop.fillRect(lines.rightline.o.x, lines.rightline.o.y, 2, 2);

        xpoints = this._findCrossPoints(ex, ey, lines);
        if (xpoints % 2 === 1 && xpoints !== 0) {
            return i;
        }
    }
    return false;
  }
  /**
     * 平移坐标系到中心点
     * @param center
     * @param {string} originX  left | center | right
     * @param {string} originY  top | center | bottom
     * @returns
     */
   translateToOriginPoint(center: Point, originX: string, originY: string): Point {
    let x = center.x,
        y = center.y;

    // Get the point coordinates
    if (originX === 'left') {
        x = center.x - this.getWidth() / 2;
    } else if (originX === 'right') {
        x = center.x + this.getWidth() / 2;
    }
    if (originY === 'top') {
        y = center.y - this.getHeight() / 2;
    } else if (originY === 'bottom') {
        y = center.y + this.getHeight() / 2;
    }

    // Apply the rotation to the point (it's already scaled properly)
    return Util.rotatePoint(new Point(x, y), center, Util.degreesToRadians(this.angle));
  }
  /** 转换成本地坐标 */
  toLocalPoint(point: Point, originX: string, originY: string): Point {
    let center = this.getCenterPoint();

    let x, y;
    if (originX !== undefined && originY !== undefined) {
        if (originX === 'left') {
            x = center.x - this.getWidth() / 2;
        } else if (originX === 'right') {
            x = center.x + this.getWidth() / 2;
        } else {
            x = center.x;
        }

        if (originY === 'top') {
            y = center.y - this.getHeight() / 2;
        } else if (originY === 'bottom') {
            y = center.y + this.getHeight() / 2;
        } else {
            y = center.y;
        }
    } else {
        x = this.left;
        y = this.top;
    }

    return Util.rotatePoint(new Point(point.x, point.y), center, -Util.degreesToRadians(this.angle)).subtractEquals(new Point(x, y));
  }
  /**
     * 根据物体的 origin 来设置物体的位置
     * @method setPositionByOrigin
     * @param {Point} pos
     * @param {string} originX left | center | right
     * @param {string} originY top | center | bottom
     */
   setPositionByOrigin(pos: Point, originX: string, originY: string) {
    let center = this.translateToCenterPoint(pos, originX, originY);
    let position = this.translateToOriginPoint(center, this.originX, this.originY);
    // console.log(`更新缩放的物体位置:[${position.x}，${position.y}]`);
    this.set('left', position.x);
    this.set('top', position.y);
  }
}
export default NuxObject;