const esprima = require('esprima');
// 深度遍历AST的工具库
const esTraverseFb = require('estraverse-fb')
// 生成AST节点的工具
const { builders } = require('ast-types')

const ast = esprima.parseScript('<div id="app"><p>hello</p>Jue Jin</div>', { jsx: true });

// 深度优先的方式
esTraverseFb.traverse(ast, {
  // 进入每个节点时都会出发enter函数
  enter: function (node) {
    const { type, openingElement } = node
    // 判断当前进入的节点是否是匹配的p节点
    if (type === 'JSXElement' && openingElement.name.name === 'p') {
      // 生成当前需要添加的属性节点
      const attribute = builders.jsxAttribute(
        // 第一个参数是name
        builders.jsxIdentifier('id'),
        // 第二个参数是value
        builders.literal('text')
      )
      // 为该节点的开始标签中添加生成的属性 id='text'
      openingElement.attributes.push(attribute)
    }
  },
  // 离开每个节点时会触发leave函数
  leave: function () {
    // nothing
  }
});

console.log(JSON.stringify(ast));