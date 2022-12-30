const esprima = require('esprima');

// 配置支持jsx和tokens 利用parseScript Api 打印对应的tokens
const { tokens } = esprima.parseScript('<div id="app"><p>hello</p>Jue Jin</div>', { jsx: true, tokens: true });

console.log(tokens,'tokens');
