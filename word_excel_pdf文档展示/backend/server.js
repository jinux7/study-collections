const fs = require('fs');
const mammoth = require('mammoth');
const XLSX = require('xlsx');
const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const cors = require('koa-cors');
const _ = require('underscore');
const template = require('./template');
const app = new Koa();
const fileFolder = 'files';

const router = new Router();
// 设置静态文件目录
const staticPath = './public';
app.use(cors({
  origin: '*', // 允许任何来源的跨域请求，也可以指定具体的域名列表
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的HTTP方法
  allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
  exposedHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'], // 暴露给浏览器的响应头
  credentials: true, // 允许携带cookie
  maxAge: 100, // 预检请求（OPTIONS）的结果缓存时间
}));

app.use(serve(staticPath));

// txt文件
router.get('/txt/:fileName', async ctx=> {
  try {
    const fileName = ctx.params.fileName;
    const filePath = path.join(__dirname, fileFolder, fileName);        
    const data = fs.readFileSync(filePath, 'utf8');
    // 设置响应内容类型为纯文本
    ctx.response.type = 'text/plain';
    // 将TXT文件内容作为响应体返回
    ctx.body = data;  
  } catch (error) {
    ctx.status = 500;
    ctx.body = `Error reading file: ${error.message}`;
  }
});

// word .docx
router.get('/word/:fileName', async ctx=> {
  var options = {
    styleMap: [
      'u => u', 
      "p[style-name='center'] => p.center",
      
    ],
    transformDocument: transformElement,
  };
  function transformElement(element) {
    if (element.children) {
        var children = _.map(element.children, transformElement);
        element = { ...element, children: children };
    }
    if (element.type === 'paragraph') {
        element = transformParagraph(element);
    }
    return element;
  }
  function transformParagraph(element) {
    if (element.alignment === 'center' && !element.styleId) {
      return { ...element, styleName: 'center' };
    } else {
        return element;
    }
  }
  try {
    const fileName = ctx.params.fileName;
    const filePath = path.join(__dirname, fileFolder, fileName);
    const result = await mammoth.convertToHtml({path: filePath}, options);
    const html = result.value; // 获取HTML
    ctx.body = template(html);
  } catch (error) {
    ctx.status = 500;
    ctx.body = `Error reading file: ${error.message}`;
  }
});

// excel .xlsx
router.get('/excel/:fileName', async ctx=> {
  try {
    const excelArr = [];
    const fileName = ctx.params.fileName;
    const filePath = path.join(__dirname, fileFolder, fileName);
    // 读取Excel文件
    const workbook = XLSX.readFile(filePath);
    // 遍历工作表
    workbook.SheetNames.forEach(sheetName => {
      // 获取工作表数据
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
      // 将数据转换为HTML表格字符串
      let htmlTable = '<table border="1">\n';
      sheetData.forEach(row => {
        htmlTable += '<tr>\n';
        for(let i=0; i<row.length; i++) {
          if(row[i]) {
            htmlTable += `<td>${row[i]}</td>\n`;
          }else {
            htmlTable += `<td>&nbsp;&nbsp;&nbsp;</td>\n`;
          }
        }
        // row.forEach(cell => {
        //   htmlTable += `<td>${cell}</td>\n`;
        // });
        htmlTable += '</tr>\n';
      });
      htmlTable += '</table>';
      excelArr.push(htmlTable);
    });
    ctx.body = excelArr;
  } catch (error) {
    ctx.status = 500;
    ctx.body = `Error reading file: ${error.message}`;
  }
});

// pdf .pdf
router.get('/pdf/:fileName', async ctx=> {
  try {
    const fileName = ctx.params.fileName;
    const filePath = path.join(__dirname, fileFolder, fileName);
    const stream = fs.createReadStream(filePath);
    ctx.set('Content-Type', 'application/pdf');
    ctx.set('Content-Disposition', 'inline; filename="'+fileName+'"');
    ctx.body = stream;
  } catch (error) {
    ctx.status = 500;
    ctx.body = `Error reading file: ${error.message}`;
  }
});


app.use(router.routes()).use(router.allowedMethods());
// 启动服务器
app.listen(3000, () => {
  console.log('Static file server is running on http://localhost:3000');
});