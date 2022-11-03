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
}
export default Util;