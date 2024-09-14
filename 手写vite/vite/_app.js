// app.js
const connect = require("connect");
const http = require("http");
const path = require("path");
const fs = require("fs");
// 解析导入语句包
const { init, parse: parseEsModule } = require("es-module-lexer");
// 可以修改字符串的包
const MagicString = require("magic-string");
// 快速的构建工具
const { buildSync } = require("esbuild");
// 处理vue单文件包
const { parse: parseVue, compileScript, rewriteDefault, compileTemplate  } = require("@vue/compiler-sfc");

const app = connect();

const basePath = path.join('./', "../test/");
const typeAlias = {
  js: "application/javascript",
  css: "text/css",
  html: "text/html",
  json: "application/json",
};

app.use(async function (req, res) {
  if (req.url === "/index.html") {
    // 提供html页面
    let html = fs.readFileSync(path.join(basePath, "index.html"), "utf-8");
    res.setHeader("Content-Type", typeAlias.html);
    res.statusCode = 200;
    res.end(html);
  }else if (/^\/@module\//.test(req.url)) {
    // 拦截/@module请求
    let pkg = removeQuery(req.url.slice(9));// 从/@module/vue?import中解析出vue
    // 获取该模块的package.json
    let pkgJson = JSON.parse(
        fs.readFileSync(
            path.join(basePath, "node_modules", pkg, "package.json"),
            "utf8"
        )
    );
    // 找出该模块的入口文件
    let entry = pkgJson.module || pkgJson.main;
    // 使用esbuild编译
    let outfile = path.join(`./esbuild/${pkg}.js`);
    buildSync({
        entryPoints: [path.join(basePath, "node_modules", pkg, entry)],
        format: "esm",
        bundle: true,
        outfile,
    });
    let js = fs.readFileSync(outfile, "utf8");
    res.setHeader("Content-Type", typeAlias.js);
    res.statusCode = 200;
    res.end(js);
  }else if (/\.js\??[^.]*$/.test(req.url)) {
    // js请求
    let js = fs.readFileSync(path.join(basePath, req.url), "utf-8");
    await init;
    let parseResult = parseEsModule(js);
    let s = new MagicString(js);
    // 遍历导入语句
    parseResult[0].forEach((item) => {
      // 不是裸导入则替换
      if (item.n[0] !== "." && item.n[0] !== "/") {
        s.overwrite(item.s, item.e, `/@module/${item.n}?import`);
      } else {
        s.overwrite(item.s, item.e, `${item.n}?import`);
      }
    });
     res.setHeader("Content-Type", typeAlias.js);
     res.statusCode = 200;
     res.end(s.toString());
  }else if (/\.css\??[^.]*$/.test(req.url)) {
    // 拦截css请求
    let cssRes = fs.readFileSync(
        path.join(basePath, req.url.split("?")[0]),
        "utf-8"
    );
    if (checkQueryExist(req.url, "import")) {
        // import请求，返回js文件
        cssRes = `
            const insertStyle = (css) => {
                let el = document.createElement('style')
                el.setAttribute('type', 'text/css')
                el.innerHTML = css
                document.head.appendChild(el)
            }
            insertStyle(\`${cssRes}\`)
            export default insertStyle
        `;
        res.setHeader("Content-Type", typeAlias.js);
    } else {
        // link请求，返回css文件
        res.setHeader("Content-Type", typeAlias.css);
    }
    res.statusCode = 200;
    res.end(cssRes);
  }else if (/\.vue\??[^.]*$/.test(req.url)) {
    // Vue单文件
    let vue = fs.readFileSync(
      path.join(basePath, removeQuery(req.url)),
      "utf-8"
    );
    let { descriptor } = parseVue(vue);
    let code = "";

    // 处理模板请求
    if (
      new URL(path.resolve(basePath, req.url)).searchParams.get("type") ===
      "template"
    ) {
        code = compileTemplate({
            source: descriptor.template.content,
        }).code;
        code = await parseBareImport(code);// ++
        res.setHeader("Content-Type", typeAlias.js);
        res.statusCode = 200;
        res.end(code);
        return;
    }

    // 处理样式请求
    if (getQuery(req.url, "type") === "style") {
      // 获取样式块索引
      let index = getQuery(req.url, "index");
      let styleContent = descriptor.styles[index].content;
      code = `
          const insertStyle = (css) => {
              let el = document.createElement('style')
              el.setAttribute('type', 'text/css')
              el.innerHTML = css
              document.head.appendChild(el)
          }
          insertStyle(\`${styleContent}\`)
          export default insertStyle
      `;
      res.setHeader("Content-Type", typeAlias.js);
      res.statusCode = 200;
      res.end(code);
      return;
    }

    // 处理js部分
    let script = compileScript(descriptor);
    if (script) {
        let scriptContent = await parseBareImport(script.content); // ++
        code += rewriteDefault(scriptContent, "__script");
    }
    
    // 处理模板
    if(descriptor.template) {
      let templateRequest = removeQuery(req.url) + `?type=template`;
      code += `\nimport { render as __render } from ${JSON.stringify(
          templateRequest
      )}`;
      code += `\n__script.render = __render`;
    }
    console.log(descriptor.styles);

    // 处理样式
    if (descriptor.styles) {
      descriptor.styles.forEach((s, i) => {
          const styleRequest = removeQuery(req.url) + `?type=style&index=${i}`;
          code += `\nimport ${JSON.stringify(styleRequest)}`
      })
    }

    // 导出
    code += `\nexport default __script`;
    res.setHeader("Content-Type", typeAlias.js);
    res.statusCode = 200;
    res.end(code);
  }else {
    res.end('ok')
  }
});

// 去除url的查询参数
const removeQuery = (url) => {
  return url.split("?")[0];
};
// 判断url的某个query名是否存在
const checkQueryExist = (url, key) => {
  return new URL(path.resolve(basePath, url)).searchParams.has(key);
};
// 获取url的某个query值
const getQuery = (url, key) => {
  return new URL(path.resolve(basePath, url)).searchParams.get(key);
};
// css to js
const cssToJs = (css) => {
  return `
    const insertStyle = (css) => {
        let el = document.createElement('style')
        el.setAttribute('type', 'text/css')
        el.innerHTML = css
        document.head.appendChild(el)
    }
    insertStyle(\`${css}\`)
    export default insertStyle
  `;
};
// 处理裸导入
const parseBareImport = async (js) => {
  await init;
  let parseResult = parseEsModule(js);
  let s = new MagicString(js);
  // 遍历导入语句
  parseResult[0].forEach((item) => {
    // 不是裸导入则替换
    if (item.n[0] !== "." && item.n[0] !== "/") {
      s.overwrite(item.s, item.e, `/@module/${item.n}?import`);
    } else {
      s.overwrite(item.s, item.e, `${item.n}?import`);
    }
  });
  return s.toString();
};

http.createServer(app).listen(3000);
