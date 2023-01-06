const tokenize = require('./tokenized');
const parse = require('./parse');
const transform = require('./transform');
const generate = require('./generate');

const tokens = tokenize('<div><p>Vue</p><p>Template</p></div>');
const templateAST = parse('<div><p>Vue</p><p>Template</p></div>');
transform(templateAST);
const code = generate(templateAST.jsNode);
console.log(JSON.stringify(tokens, null));
console.log(JSON.stringify(templateAST, null, 2));
console.log(JSON.stringify(templateAST.jsNode, null, 2));
console.log(code);

// compile函数
function compile(template) {
  // 模板AST
  const ast = parse(template);
  // 将模板AST转换为javascript AST
  transform(ast);
  // 代码生成
  const code = generate(ast.jsNode);

  return code;
}

console.log(compile('<div><p>Vue</p><p>Template</p></div>'));
