class MyPromise {
  // 等待状态
  static PENDING = "pending";
  // 成功状态
  static FULFILLED = "fulfilled";
  // 拒绝状态
  static REJECTED = "rejected";
  constructor(executor) {
    // 默认状态是等待
    this.status = MyPromise.PENDING;
    // 成功值
    this.value = null;
    // 拒绝值
    this.reason = null;
    // then的回调数组
    this.callbacks = [];
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }
  // 成功调用函数
  resolve(value) {
    if(this.status === MyPromise.PENDING) {
      this.value = value;
      this.status = MyPromise.FULFILLED;
      setTimeout(()=> {
        this.callbacks.forEach(item=> {
          item.onFulfilled(this.value);
        });
      });
    }
  }
  // 拒绝调用函数
  reject(reason) {
    if(this.status === MyPromise.PENDING) {
      this.reason = reason;
      this.status = MyPromise.REJECTED;
      setTimeout(()=> {
        this.callbacks.forEach(item=> {
          item.onRejected(this.reason);
        });
      });
    }
  }
  // then函数
  then(onFulfilled, onRejected) {
    if (typeof onFulfilled != "function") {
      onFulfilled = () => this.value;
    }
    if (typeof onRejected != "function") {
      onRejected = () => this.reason;
    }
    // 链式调用，返回一个MyPromise
    const p = new MyPromise((resolve, reject)=> {
      if(this.status === MyPromise.PENDING) {
        this.callbacks.push({
          onFulfilled: (value)=> {
            let result = onFulfilled(value);
            if(result instanceof MyPromise) {
              result.then(resolve, reject);
            }else {
              resolve(result);
            }
          },
          onRejected: (value)=> {
            let result = onRejected(value);
            if(result instanceof MyPromise) {
              result.then(resolve, reject);
            }else {
              resolve(result);
            }
          }
        });
      }
      if(this.status === MyPromise.FULFILLED) {
        setTimeout(()=> {
          let result = onFulfilled(this.value);
          if(result instanceof MyPromise) {
            result.then(resolve, reject);
          }else {
            resolve(result);
          }
        });
      }
      if(this.status === MyPromise.REJECTED) {
        setTimeout(()=> {
          let result = onRejected(this.reason);
          if(result instanceof MyPromise) {
            result.then(resolve, reject);
          }else {
            resolve(result);
          }
        });
      }
    });
    return p;
  }
  // MyPromise.resolve方法
  static resolve(value) {
    return new MyPromise((resolve, reject)=> {
      if(value instanceof MyPromise) {
        value.then(resolve, reject);
      }
      resolve(value);
    });
  }
  // MyPromise.reject方法
  static reject(reason) {
    return new MyPromise((resolve, reject)=> {
      reject(reason);
    });
  }
  // MyPromise.all方法
  static all(promises) {
    return new MyPromise((resolve, reject)=> {
      let values = [];
      promises.forEach(item => {
        item.then(
          value=> {
            values.push(value);
            if(values.length === promises.length) {
              resolve(values);
            }
          },
          reason=> {
            reject(reason);
          }
        );
      });
    });
  }
  // MyPromise.race方法
  static race(promises) {
    return new MyPromise((resolve, reject)=> {
      promises.forEach(item => {
        item.then(
          value=> {
            resolve(value);
          },
          reason=> {
            reject(reason);
          }
        );
      });
    });
  }
}