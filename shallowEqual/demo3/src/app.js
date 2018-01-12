var equal = require('fast-deep-equal');
let a = {foo: 'bar', list:[1], params:{name:"小明",age:25}};
let b = {foo: 'bar', list:[1], params:{name:"小明",age:25,work:"programer"}};
let isEqual = equal(a,b);
console.log(isEqual);