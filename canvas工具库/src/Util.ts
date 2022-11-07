import { anyObject } from "./type";
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
}
export default Util;