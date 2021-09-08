var a = require('./a');
var b = require('./b');
console.log('a moule--->', a.count);
console.log('b moule--->', b.count);
a.count = 5;
b.count = 20;
console.log('a plus 5 moule--->', a.count);
console.log('b plus 20 moule--->', b.count);
var newA = require('./a');
var NewB = require('./b');
console.log('new a moudle--->', newA.count);
console.log('new b moudle--->', NewB.count);
// 进行cache处理
console.log(Object.prototype.toString.call(require.cache)); // require.cache是一个对象
Object.keys(require.cache).forEach(key=> {
    console.log(require.resolve(key)); // require.resolve(key)可以把相对路径转成绝对路径，使用更安全
    // require.resolve('./a.js');
    if(key.includes('a.js')) {
        delete require.cache[require.resolve(key)];
    }
});
console.log(require.cache);
var cacheA = require('./a');
var cacheB = require('./b');
console.log('new a moudle cache--->', cacheA.count);
console.log('new b moudle cache--->', cacheB.count);