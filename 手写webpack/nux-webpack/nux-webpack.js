const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

let ID = 0;
function createAsset(fileName) {
  // 这个文件里所依赖的其它文件路径
  let dependencies = [];
  const content = fs.readFileSync(fileName, 'utf8');
  // 用babel的parser来解析读取的的文件内容content,获取ast抽象语法书
  const ast = parser.parse(content, {
    sourceType: 'module'
  });
  // 用babel的traverse功能来观察ast语法树的相应节点，进行相应的处理
  traverse(ast, {
    ImportDeclaration({ node }) {
      // console.log(node.source.value);
      dependencies.push(node.source.value);
    }
  });
  // 用babel来讲es6语法转成es5语法
  const { code } = babel.transformFromAstSync(ast, null, {
    presets: ['@babel/preset-env']
  })

  let id = ID++;

  return {
    id,
    fileName,
    dependencies,
    code,
  };
}

function createGraph() {
  const mainAsset = createAsset('./src/main.js');
  // 队列存放单个文件资源,这里利用循环队列去搜寻依赖文件，而没有使用递归方法
  const queue = [ mainAsset ];
  for(const asset of queue) {
    const dirname = path.dirname(asset.fileName);
    asset.mapping = {};
    asset.dependencies.forEach(relativePath => {
      const absolutePath = path.join(dirname, relativePath);
      const child = createAsset(absolutePath);
      asset.mapping[relativePath] = child.id;
      queue.push(child);
    });
  }
  return queue;
}
// 打包生成处理后的js文件
function bundle() {
  const graph = createGraph('./src/main.js');
  let modules = ``;
  graph.forEach(mod=> {
    modules += `
      ${mod.id}: [
        function(require, module, exports) {
          ${mod.code}
        },
        ${JSON.stringify(mod.mapping)}
      ],
    `;
  });
  const result = `(function(modules) {
    function require(id) {
      const fn = modules[id][0],
            mapping = modules[id][1];
      function localRequire(relativePath) {
        return require(mapping[relativePath]);
      }
      const module = {
        exports: {}
      };
      fn(localRequire, module, module.exports);
      return module.exports;
    }
    require(0);
  })({${modules}})`;

  return result;
}

const result = bundle();
fs.writeFileSync('./dist/bundle.js', result);
