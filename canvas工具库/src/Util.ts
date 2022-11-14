import { anyObject } from "./type";
import { Point } from "./Point";
const PiBy180 = Math.PI / 180; // 写在这里相当于缓存，因为会频繁调用
class Util {
  /** 角度转弧度，注意 canvas 中用的都是弧度，但是角度对我们来说比较直观 */
  static degreesToRadians(degrees: number): number {
    return degrees * PiBy180;
  }
  /** 弧度转角度，注意 canvas 中用的都是弧度，但是角度对我们来说比较直观 */
  static radiansToDegrees(radians: number): number {
    return radians / PiBy180;
  }
  // 图片下载
  static loadImage(url: string, options: any = {}) {
    return new Promise<HTMLImageElement>(function (resolve, reject) {
      let img = document.createElement('img');
      let done = () => {
          img.onload = img.onerror = null;
          resolve(img);
      };
      if (url) {
          img.onload = done;
          img.onerror = () => {
              reject(new Error('Error loading ' + img.src));
          };
          options && options.crossOrigin && (img.crossOrigin = options.crossOrigin);
          img.src = url;
      } else {
          done();
      }
    });
  }
  // 物体动画
  static animate(options: anyObject) {
    window.requestAnimationFrame((timestamp: number) => {
        let start = timestamp || +new Date(), // 开始时间
            duration = options.duration || 500, // 动画时间
            finish = start + duration, // 结束时间
            time, // 当前时间
            onChange = options.onChange || (() => {}),
            abort = options.abort || (() => false),
            easing = options.easing || ((t, b, c, d) => -c * Math.cos((t / d) * (Math.PI / 2)) + c + b),
            startValue = options.startValue || 0, // 初始值
            endValue = options.endValue || 100, // 结束值
            byValue = options.byValue || endValue - startValue; // 值的变化范围

        function tick(ticktime: number) {
            // tick 的主要任务就是根据时间更新值
            time = ticktime || +new Date();
            let currentTime = time > finish ? duration : time - start; // 当前已经执行了多久时间（介于0~duration）
            if (abort()) {
                options.onComplete && options.onComplete();
                return;
            }
            onChange(easing(currentTime, startValue, byValue, duration)); // 其实 animate 函数只是根据 easing 函数计算出了某个值，然后传给调用者而已
            if (time > finish) {
                options.onComplete && options.onComplete();
                return;
            }
            window.requestAnimationFrame(tick);
        }

        options.onStart && options.onStart(); // 动画开始前的回调
        tick(start);
    });
  }
  // clone
  static clone(obj: any) {
    if (!obj || typeof obj !== 'object') return obj;
    let temp = new obj.constructor();
    for (let key in obj) {
        if (!obj[key] || typeof obj[key] !== 'object') {
            temp[key] = obj[key];
        } else {
            temp[key] = Util.clone(obj[key]);
        }
    }
    return temp;
  }
  /** 给元素设置样式 */
  static setStyle(element: HTMLElement, styles) {
    let elementStyle = element.style;

    if (typeof styles === 'string') {
        element.style.cssText += ';' + styles;
        return styles.indexOf('opacity') > -1 ? Util.setOpacity(element, styles.match(/opacity:\s*(\d?\.?\d*)/)[1]) : element;
    }
    for (let property in styles) {
        if (property === 'opacity') {
            Util.setOpacity(element, styles[property]);
        } else {
            elementStyle[property] = styles[property];
        }
    }
    return element;
  }
  static addListener(element: HTMLElement, eventName: string, handler: (e: MouseEvent)=> void) {
    element.addEventListener<Event>(eventName, handler, false);
  }
  static removeListener(element: HTMLElement, eventName: string, handler: ()=> void) {
      element.removeEventListener(eventName, handler, false);
  }
  /** 计算元素偏移值 */
  static getElementOffset(element: any): object {
    let valueT = 0,
        valueL = 0;
    do {
        valueT += element.offsetTop || 0;
        valueL += element.offsetLeft || 0;
        element = element.offsetParent;
    } while (element);
    return { left: valueL, top: valueT };
  }
  /** 获取鼠标的点击坐标，相对于页面左上角，注意不是画布的左上角，到时候会减掉 offset */
  static getPointer(event: Event, upperCanvasEl: HTMLCanvasElement) {
    event || (event = window.event);

    let element: HTMLElement | Document = event.target as Document | HTMLElement,
        body = document.body || { scrollLeft: 0, scrollTop: 0 },
        docElement = document.documentElement,
        orgElement = element,
        scrollLeft = 0,
        scrollTop = 0,
        firstFixedAncestor;

    while (element && element.parentNode && !firstFixedAncestor) {
        element = element.parentNode as Document | HTMLElement;
        if (element !== document && Util.getElementPosition(element as HTMLElement) === 'fixed') firstFixedAncestor = element;

        if (element !== document && orgElement !== upperCanvasEl && Util.getElementPosition(element as HTMLElement) === 'absolute') {
            scrollLeft = 0;
            scrollTop = 0;
        } else if (element === document && orgElement !== upperCanvasEl) {
            scrollLeft = body.scrollLeft || docElement.scrollLeft || 0;
            scrollTop = body.scrollTop || docElement.scrollTop || 0;
        } else {
            scrollLeft += (element as HTMLElement).scrollLeft || 0;
            scrollTop += (element as HTMLElement).scrollTop || 0;
        }
    }

    return {
        x: Util.pointerX(event) + scrollLeft,
        y: Util.pointerY(event) + scrollTop,
    };
  }
  /**
     * 将 point 绕 origin 旋转 radians 弧度
     * @param {Point} point 要旋转的点
     * @param {Point} origin 旋转中心点
     * @param {number} radians 注意 canvas 中用的都是弧度
     * @returns
     */
   static rotatePoint(point: Point, origin: Point, radians: number): Point {
    const sin = Math.sin(radians),
        cos = Math.cos(radians);

    point.subtractEquals(origin);

    const rx = point.x * cos - point.y * sin;
    const ry = point.x * sin + point.y * cos;

    return new Point(rx, ry).addEquals(origin);
  }
  /** 获取元素position */
  static getElementPosition(element: HTMLElement) {
    return window.getComputedStyle(element, null).position;
  }
  static pointerX(event) {
    return event.clientX || 0;
  }
  static pointerY(event) {
      return event.clientY || 0;
  }
  /**
     * 数组的最小值
     */
   static min(array: any[], byProperty = '') {
    if (!array || array.length === 0) return undefined;

    let i = array.length - 1,
        result = byProperty ? array[i][byProperty] : array[i];

    if (byProperty) {
        while (i--) {
            if (array[i][byProperty] < result) {
                result = array[i][byProperty];
            }
        }
    } else {
        while (i--) {
            if (array[i] < result) {
                result = array[i];
            }
        }
    }
    return result;
}
/**
 * 数组的最大值
 */
static max(array: any[], byProperty = '') {
    if (!array || array.length === 0) return undefined;

    let i = array.length - 1,
        result = byProperty ? array[i][byProperty] : array[i];
    if (byProperty) {
        while (i--) {
            if (array[i][byProperty] >= result) {
                result = array[i][byProperty];
            }
        }
    } else {
        while (i--) {
            if (array[i] >= result) {
                result = array[i];
            }
        }
    }
    return result;
  }
}
export default Util;