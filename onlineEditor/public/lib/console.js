// 重写的console对象的构造函数，直接修改console对象的方法进行拦截的方式是不行的，有兴趣可以自行尝试
function ProxyConsole() {};
// 拦截console的所有方法
[
    'debug',
    'clear',
    'error',
    'info',
    'log',
    'warn',
    'dir',
    'props',
    'group',
    'groupEnd',
    'dirxml',
    'table',
    'trace',
    'assert',
    'count',
    'markTimeline',
    'profile',
    'profileEnd',
    'time',
    'timeEnd',
    'timeStamp',
    'groupCollapsed'
].forEach((method) => {
    let originMethod = console[method]
    // 设置原型方法
    ProxyConsole.prototype[method] = function (...args) {
        // 发送信息给父窗口
        window.parent.postMessage({
            type: 'console',
            method,
            data: any2str(args)
        })
        // 调用原始方法
        originMethod.apply(ProxyConsole, args)
    }
})
// 覆盖原console对象
window.console = new ProxyConsole()

// 处理console的参数转字符串
const any2str = (arr)=> {
  let str = '';
  arr.forEach(item=> {
    str += change2str(item) + ' ';
  });

  return str;
}

const type = arg=> {
  return Object.prototype.toString.call(arg).slice(7, -1);
}

const change2str = content=> {
  let contentType = type(content)
  switch (contentType) {
    case 'boolean': // 布尔值
      content = content ? 'true' : 'false'
      break;
    case 'null': // null
      content = 'null'
      break;
    case 'undefined': // undefined
      content = 'undefined'
      break;
    case 'symbol': // Symbol，Symbol不能直接通过postMessage进行传递，会报错，需要转成字符串
      content = content.toString()
      break;
    default:
      break;
  }
  return content;  
}