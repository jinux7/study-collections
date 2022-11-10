import { EventCenter } from "./Event";
import NuxObject from "./NuxObject";
import Util from "./Util";
import { Point } from './Point';
const cursorMap = {
  tr: 'ne-resize',
  br: 'se-resize',
  bl: 'sw-resize',
  tl: 'nw-resize',
  ml: 'w-resize',
  mt: 'n-resize',
  mr: 'e-resize',
  mb: 's-resize',
};
class Nuxcas extends EventCenter{
  public width: number; // 画布宽
  public height: number; // 画布高
  public wrapperEl: HTMLElement; // 包围canvas的外层容器
  public lowerCanvasEl: HTMLCanvasElement; // 下层canvas，用于绘制所有物体
  public upperCanvasEl: HTMLCanvasElement; // 上层canvas，用于鼠标的事件监听
  public lowerContext: CanvasRenderingContext2D; // 下层画布canvas上下文
  public upperContext: CanvasRenderingContext2D; // 上层画布canvas上下文
  private _offset: any; // 整个画布到页面上边左边的偏移量
  private _objects: any = []; // 画布中所有要绘制的物体
  private objId: number = 1; // 画布中物体的id
  private _currentTransform: any; /** 当前物体的变换信息 */
  private _activeObject :any; /** 当前激活物体 */
  /** 一些鼠标样式 */
  public defaultCursor: string = 'default';
  public hoverCursor: string = 'move';
  public moveCursor: string = 'move';
  public rotationCursor: string = 'crosshair';

  constructor(el: HTMLCanvasElement, options?: any) {
    super();
    this._offset = Util.getElementOffset(el);
    this._initLowerCanvas(el);
    this._initUpperCanvas();
    this._initEvent();
  }
  // 初始化下层画布
  _initLowerCanvas(el: HTMLCanvasElement) {
    this.lowerCanvasEl = el
    // this.lowerContext = this.lowerCanvasEl.getContext('2d') as CanvasRenderingContext2D; // 用下边的写法也对
    this.lowerContext = this.lowerCanvasEl.getContext('2d')!;
    this.width = +this.lowerCanvasEl.width;
    this.height = +this.lowerCanvasEl.height;
    this.lowerCanvasEl.style.width = this.width + 'px';
    this.lowerCanvasEl.style.height = this.height + 'px';
  }
  // 初始化上层画布
  _initUpperCanvas() {
    const upperCanvasEl = document.createElement('canvas'); // 创建画布
    this.upperCanvasEl = upperCanvasEl;
    upperCanvasEl.width = this.width;
    upperCanvasEl.height = this.height;
    upperCanvasEl.style.width = this.width + 'px';
    upperCanvasEl.style.height = this.height + 'px';
    Util.setStyle(upperCanvasEl, {
      position: 'absolute',
      top: 0,
      left: 0
    });
    // 新建一个画布包围盒
    this.wrapperEl = document.createElement('div');
    Util.setStyle(this.wrapperEl, {
      position: 'relative',
      width: this.width+'px',
      height: this.height+'px'
    });
    // 将节点插入到dom树
    this.wrapperEl.appendChild(this.lowerCanvasEl);
    this.wrapperEl.appendChild(this.upperCanvasEl);
    document.body.appendChild(this.wrapperEl);
  }
  // 初始化事件，就是给上层画布加事件
  _initEvent() {
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onResize = this._onResize.bind(this);

    Util.addListener(window, 'resize', this._onResize);
    Util.addListener(this.upperCanvasEl, 'mousedown', this._onMouseDown);
    Util.addListener(this.upperCanvasEl, 'mousemove', this._onMouseMove);
  }
  _onMouseDown(e: MouseEvent) {
    // 只处理左键点击
    let isLeftClick = 'which' in e ? e.which === 1 : e.button === 1;
    if (!isLeftClick) return;

    const target = this.findTarget(e);
    this._objects.forEach(item=> {
      item.active = false;
    });
    this._activeObject = null;
    if(target) {
      this._activeObject = target;
      target.active = true;
      this._setupCurrentTransform(e, target);
    }
    this.renderAll();
    // 设置事件
    Util.addListener(document, 'mouseup', this._onMouseUp);
    Util.addListener(document, 'mousemove', this._onMouseMove);
    Util.removeListener(this.upperCanvasEl, 'mousemove', this._onMouseMove);
  }
  _onMouseUp() {
    let target;
    if (this._currentTransform) {
      let transform = this._currentTransform;
      target = transform.target;
      // if (target._scaling) {
      //     target._scaling = false;
      // }

      // 每次物体更改都要重新计算新的控制点
      let i = this._objects.length;
      while (i--) {
          this._objects[i].setCoords();
      }

      target.isMoving = false;

      // 在点击之间如果物体状态改变了才派发事件
      // if (target.hasStateChanged()) {
      //     this.emit('object:modified', { target });
      //     target.emit('modified');
      // }
      this._currentTransform = null; // 鼠标抬起设置为null
      this.renderAll();
    }
    // 设置事件
    Util.removeListener(document, 'mouseup', this._onMouseUp);
    Util.removeListener(document, 'mousemove', this._onMouseMove);
    Util.addListener(this.upperCanvasEl, 'mousemove', this._onMouseMove);
  }
  _onResize() {

  }
  _onMouseMove(e: MouseEvent) {
    let target, pointer;
    if(this._currentTransform) {
      // 有激活的物体
       // 如果是旋转、缩放、平移等操作
       pointer = Util.getPointer(e, this.upperCanvasEl);

       let x = pointer.x,
           y = pointer.y;

       this._currentTransform.target.isMoving = true;

       let t = this._currentTransform,
           reset = false;
       if (this._currentTransform.action === 'rotate') {
           // 如果是旋转操作
           this._rotateObject(x, y);

           this.emit('object:rotating', {
               target: this._currentTransform.target,
               e,
           });
           this._currentTransform.target.emit('rotating');
       } else if (this._currentTransform.action === 'scale') {
          // 如果是整体缩放操作
          this._scaleObject(x, y);
          this.emit('object:scaling', {
            target: this._currentTransform.target,
            e,
          });
          this._currentTransform.target.emit('scaling', { e });
       } else if (this._currentTransform.action === 'scaleX') {
           // 如果只是缩放 x
           this._scaleObject(x, y, 'x');

           this.emit('object:scaling', {
               target: this._currentTransform.target,
               e,
           });
           this._currentTransform.target.emit('scaling', { e });
       } else if (this._currentTransform.action === 'scaleY') {
           // 如果只是缩放 y
           this._scaleObject(x, y, 'y');

           this.emit('object:scaling', {
               target: this._currentTransform.target,
               e,
           });
           this._currentTransform.target.emit('scaling', { e });
       } else {
           // 如果是拖拽物体
           this._translateObject(x, y);

           this.emit('object:moving', {
               target: this._currentTransform.target,
               e,
           });

          this._setCursor(this.moveCursor);
          this._currentTransform.target.emit('moving', { e });
       }

       this.renderAll();
    }else {
      // 如果是 hover 事件，我们只需要改变鼠标样式，并不会重新渲染
      const style = this.upperCanvasEl.style;
      // findTarget 的过程就是看鼠标有没有 hover 到某个物体上
      target = this.findTarget(e);
      // 设置鼠标样式
      if (target) {
          this._setCursorFromEvent(e, target);
      } else {
          style.cursor = this.defaultCursor;
      }
    }
  }
  /** 检测是否有物体在鼠标位置 */
  findTarget(e: MouseEvent): NuxObject|void {
    let target;
    // 从后往前遍历所有物体，判断鼠标点是否在物体包围盒内
    for (let i = this._objects.length; i--; ) {
        const object = this._objects[i];
        if (object && this.containsPoint(e, object)) {
            target = object;
            break;
        }
    }
    if (target) return target;
    return void 0;
  }
  // 判断当前鼠标位置是否在target范围内
  containsPoint(e: MouseEvent, target: NuxObject): boolean {
    let pointer = this.getPointer(e), // 鼠标距离canvas左上角的坐标
        // xy = this._normalizePointer(target, pointer),
        // x = xy.x,
        // y = xy.y;
        x = pointer.x,
        y = pointer.y;
    let iLines = target._getImageLines(target.oCoords),
        xpoints = target._findCrossPoints(x, y, iLines);
    if ((xpoints && xpoints % 2 === 1) || target._findTargetCorner(e, this._offset)) {
        return true;
    }
    return false;
  }
  // 获取鼠标相对于画布左上角的坐标位置
  getPointer(e: MouseEvent): any {
    let pointer = Util.getPointer(e, this.upperCanvasEl);
    return {
        x: pointer.x - this._offset.left,
        y: pointer.y - this._offset.top,
    };
  }
  /** 设置鼠标样式 */
  _setCursor(value: string) {
    this.upperCanvasEl.style.cursor = value;
  }
  /** 根据鼠标位置来设置相应的鼠标样式 */
  _setCursorFromEvent(e: MouseEvent, target: NuxObject): boolean {
    let s = this.upperCanvasEl.style;
    if (target) {
        // let activeGroup = this.getActiveGroup();
        let activeGroup = false;
        let corner = (!activeGroup || !activeGroup.contains(target)) && target._findTargetCorner(e, this._offset);

        if (corner) {
            corner = corner as string;
            if (corner in cursorMap) {
                s.cursor = cursorMap[corner];
            } else if (corner === 'mtr' && target.hasRotatingPoint) {
                s.cursor = this.rotationCursor;
            } else {
                s.cursor = this.defaultCursor;
                return false;
            }
        } else {
            s.cursor = this.hoverCursor;
        }
        return true;
    } else {
        s.cursor = this.defaultCursor;
        return false;
    }
  }
  /** 记录当前物体的变换状态 */
  _setupCurrentTransform(e: MouseEvent, target: NuxObject) {
    let action = 'drag',
        corner,
        pointer = Util.getPointer(e, target.nuxcas.upperCanvasEl);

    corner = target._findTargetCorner(e, this._offset);
    if (corner) {
        // 根据点击的控制点判断此次操作是什么
        action = corner === 'ml' || corner === 'mr' ? 'scaleX' : corner === 'mt' || corner === 'mb' ? 'scaleY' : corner === 'mtr' ? 'rotate' : 'scale';
    }

    let originX = 'center',
        originY = 'center';

    if (corner === 'ml' || corner === 'tl' || corner === 'bl') {
        // 如果点击的是左边的控制点，则变换基点就是右边，以右边为基准向左变换
        originX = 'right';
    } else if (corner === 'mr' || corner === 'tr' || corner === 'br') {
        originX = 'left';
    }

    if (corner === 'tl' || corner === 'mt' || corner === 'tr') {
        // 如果点击的是上方的控制点，则变换基点就是底部，以底边为基准向上变换
        originY = 'bottom';
    } else if (corner === 'bl' || corner === 'mb' || corner === 'br') {
        originY = 'top';
    }

    if (corner === 'mtr') {
        // 如果是旋转操作，则基点就是中心点
        originX = 'center';
        originY = 'center';
    }

    // let center = target.getCenterPoint();
    this._currentTransform = {
        target,
        action,
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        offsetX: pointer.x - target.left,
        offsetY: pointer.y - target.top,
        originX,
        originY,
        ex: pointer.x,
        ey: pointer.y,
        left: target.left,
        top: target.top,
        theta: Util.degreesToRadians(target.angle),
        width: target.width * target.scaleX,
        mouseXSign: 1,
        mouseYSign: 1,
    };
    // 记录物体原始的 original 变换参数
    this._currentTransform.original = {
        left: target.left,
        top: target.top,
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        originX,
        originY,
    };
    // let { target: target2, ...other } = this._currentTransform;
    // console.log(JSON.stringify(other, null, 4));

    // this._resetCurrentTransform(e); // 好像没必要重新赋值？除非按下了 altKey 键
  }
  // 添加绘制物体对象
  add(...args: any): Nuxcas{
    args.forEach((item: any)=> {
      item.setId(this.objId++);
      item.setCoords();
      item.nuxcas = this;
    });
    this._objects.push(...args);
    this.renderAll();
    return this;
  }
  // 绘制所有的物体
  renderAll() {
    // 每次绘制重新排序要绘制的物体，因为图片和svg类型物体需要下载，异步操作
    this._objects = this._objects.sort((a, b)=> {
      return a.id - b.id;
    });
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
  /** 平移当前选中物体，注意这里我们没有用 += */
  _translateObject(x: number, y: number) {
    // console.log(this._currentTransform.offsetX, this._currentTransform.offsetY, this._offset.top, this._offset.left);
    let target = this._currentTransform.target;
    target.set('left', x - this._currentTransform.offsetX);
    target.set('top', y - this._currentTransform.offsetY);
  }
  /**
   * 缩放当前选中物体
   * @param x 鼠标点 x
   * @param y 鼠标点 y
   * @param by 是否等比缩放，x | y | equally
   */
  _scaleObject(x: number, y: number, by = 'equally') {
    let t = this._currentTransform,
        offset = this._offset,
        target: NuxObject = t.target;

    // 缩放基点：比如拖拽右边中间的控制点，其实我们参考的变换基点是左边中间的控制点
    let constraintPosition = target.translateToOriginPoint(target.getCenterPoint(), t.originX, t.originY);
    // 以物体变换中心为原点的鼠标点坐标值
    let localMouse = target.toLocalPoint(new Point(x - offset.left, y - offset.top), t.originX, t.originY);

    if (t.originX === 'right') {
      localMouse.x *= -1;
    } else if (t.originX === 'center') {
      localMouse.x *= t.mouseXSign * 2;

      if (localMouse.x < 0) {
          t.mouseXSign = -t.mouseXSign;
      }
    }

    if (t.originY === 'bottom') {
      localMouse.y *= -1;
    } else if (t.originY === 'center') {
      localMouse.y *= t.mouseYSign * 2;

      if (localMouse.y < 0) {
          t.mouseYSign = -t.mouseYSign;
      }
    }

    // 计算新的缩放值，以变换中心为原点，根据本地鼠标坐标点/原始宽度进行计算，重新设定物体缩放值
    let newScaleX = target.scaleX,
        newScaleY = target.scaleY;
    if (by === 'equally') {
      let dist = localMouse.y + localMouse.x;
      let lastDist = target.height * t.original.scaleY + target.width * t.original.scaleX + target.padding * 2 - target.strokeWidth * 2 + 1; /* additional offset needed probably due to subpixel rendering, and avoids jerk when scaling an object */

      // We use t.scaleX/Y instead of target.scaleX/Y because the object may have a min scale and we'll loose the proportions
      newScaleX = (t.original.scaleX * dist) / lastDist;
      newScaleY = (t.original.scaleY * dist) / lastDist;

      target.set('scaleX', newScaleX);
      target.set('scaleY', newScaleY);
    } else if (!by) {
      newScaleX = localMouse.x / (target.width + target.padding);
      newScaleY = localMouse.y / (target.height + target.padding);

      target.set('scaleX', newScaleX);
      target.set('scaleY', newScaleY);
    } else if (by === 'x') {
      newScaleX = localMouse.x / (target.width + target.padding);
      target.set('scaleX', newScaleX);
    } else if (by === 'y') {
      newScaleY = localMouse.y / (target.height + target.padding);
      target.set('scaleY', newScaleY);
    }
    // 如果是反向拉伸 x
    if (newScaleX < 0) {
      if (t.originX === 'left') t.originX = 'right';
      else if (t.originX === 'right') t.originX = 'left';
    }
    // 如果是反向拉伸 y
    if (newScaleY < 0) {
      if (t.originY === 'top') t.originY = 'bottom';
      else if (t.originY === 'bottom') t.originY = 'top';
    }

    // console.log(constraintPosition, localMouse, t.originX, t.originY);

    // 缩放会改变物体位置，所以要重新设置
    target.setPositionByOrigin(constraintPosition, t.originX, t.originY);
  }
  /** 重置当前 transform 状态为 original，并设置 resizing 的基点 */
  _resetCurrentTransform(e: MouseEvent) {
    let t = this._currentTransform;

    t.target.set('scaleX', t.original.scaleX);
    t.target.set('scaleY', t.original.scaleY);
    t.target.set('left', t.original.left);
    t.target.set('top', t.original.top);

    if (e.altKey) {
        if (t.originX !== 'center') {
            if (t.originX === 'right') {
                t.mouseXSign = -1;
            } else {
                t.mouseXSign = 1;
            }
        }
        if (t.originY !== 'center') {
            if (t.originY === 'bottom') {
                t.mouseYSign = -1;
            } else {
                t.mouseYSign = 1;
            }
        }

        t.originX = 'center';
        t.originY = 'center';
    } else {
        t.originX = t.original.originX;
        t.originY = t.original.originY;
    }
  }
  /** 旋转当前选中物体，这里用的是 += */
  _rotateObject(x: number, y: number) {
    const t = this._currentTransform;
    const o = this._offset;
    // 鼠标按下的点与物体中心点连线和 x 轴正方向形成的弧度
    const lastAngle = Math.atan2(t.ey - o.top - t.top, t.ex - o.left - t.left);
    // 鼠标拖拽的终点与物体中心点连线和 x 轴正方向形成的弧度
    const curAngle = Math.atan2(y - o.top - t.top, x - o.left - t.left);
    let angle = Util.radiansToDegrees(curAngle - lastAngle + t.theta); // 新的角度 = 变换的角度 + 原来的角度
    if (angle < 0) {
      angle = 360 + angle;
    }
    angle = angle % 360;
    t.target.angle = angle;
  }
}
export default Nuxcas;