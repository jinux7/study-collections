const esprima = require('esprima');

// 调用parseScript获得输入代码生成的抽象语法树
const ast = esprima.parseScript('<div id="app"><p>hello</p>Jue Jin</div>', { jsx: true });

console.log(ast, 'ast');
