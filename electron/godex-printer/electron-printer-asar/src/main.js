import { app, BrowserWindow, nativeImage } from 'electron';
import path from 'path';
import { __dirnameFn } from './utils.js';
import usb  from'usb';
import Koa from'koa';
import Router from 'koa-router';
import cors from 'koa-cors';
import bodyParser from 'koa-bodyparser';
import { injectMainWindow } from './controller/buildMenu.js';

const koaApp = new Koa();
const router = new Router();

// 替换为你的设备的vendorId和productId
let vendorId = 0x195F;
let productId = 0x1;

function PrintLabel(commands) {
// 注意，下边的字符必须定格，否则发送到打印机解析不了。
// let commands = `
// ^Q30,3
// ^W50
// ^H5
// ^P1
// ^S2
// ^AT
// ^C1
// ^R0
// ~Q+0
// ^O0
// ^D0
// ^E12
// ~R200
// ^XSET,ROTATION,0
// ^L
// Dy2-me-dd
// Th:m:s
// BQ,26,15,2,46,40,0,0,${info.da1}
// AE,25,130,1,1,0,0,${info.da2}
// AD,90,178,1,1,0,0,${info.da1}
// AB,310,114,1,1,0,0,${info.da3}
// XRB26,65,4,0,${info.da2.length}
// ${info.da2}
// XRB325,71,4,0,${info.da3.length}
// ${info.da3}
// E
// `;
// commands = `
// ^Q30,3
// ^W50
// ^H5
// ^P1
// ^S2
// ^AT
// ^C1
// ^R0
// ~Q+0
// ^O0
// ^D0
// ^E12
// ~R200
// ^XSET,ROTATION,0
// ^L
// Dy2-me-dd
// Th:m:s
// BQ,26,15,2,46,40,0,0,wl-1801
// AE,25,130,1,1,0,0,100i100f7bi32500002
// AD,90,178,1,1,0,0,3wl-1801
// AB,310,114,1,1,0,0,2
// XRB26,65,4,0,19
// 100i100f7bi32500002
// XRB325,71,4,0,1
// 2
// E
// `;
  console.log(commands);
	let device = usb.findByIds(vendorId, productId)
	device.open()
	for (let i = 0, len = device.interfaces.length ; i < len ; i++) {
		for (let j = 0, len2 = device.interfaces[i].endpoints.length ; j < len2 ; j++) {
			if (device.interfaces[i].endpoints[j].direction == 'out') {
				device.interfaces[i].claim() // 找到了要用的对象后，首先要声明所有权
				let outEndpoint = device.interfaces[i].endpoints[j]
				outEndpoint.transferType = 2 // bulk 批量传输
				outEndpoint.transfer(commands, (err) => {
					if (err) {
						console.log(err)
					}
					device.close()
				})
				return
			}
		}
	}
	device.close()
}

const createWindow = ()=> {
    const win = new BrowserWindow({
      width: 500,
      height: 300,
      resizable: false,
      // minimizable: false,
      // maximizable: false,
      webPreferences: {
        // preload: path.resolve(__dirnameFn(import.meta.url), './preload/index.js')
      },
      show: false,
      icon: nativeImage.createFromPath(path.resolve(__dirnameFn(import.meta.url), './icon.png')),
      // frame: false, // 去除上方工具栏
    });
    // 注入到buildMenu中
    injectMainWindow(win);
    // win.loadURL('http://localhost:5173');
    win.loadFile(path.resolve(__dirnameFn(import.meta.url), './index.html'));
    // win.webContents.openDevTools(); // 打开调试工具面板
    // winState.manage(win);
    win.on('ready-to-show', ()=> {
      win.show();
      // 设置全屏
      // win.maximize();
      // 退出全屏
      // win.unmaximize();
    });
  }
  
app.whenReady().then(()=> {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  });
  // 打开zadig应用
  // let childProcess = exec(path.resolve(__dirnameFn(import.meta.url),'./zadig.exe'), (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`执行的错误: ${error}`);
  //     return;
  //   }
  //   if(stderr) {
  //     console.log(`标准错误输出：${stderr}`);
  //   }
  // });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

koaApp.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
  credentials: true,
  maxAge: 100,
}));
router.post('/send/printinfo', async ctx=> {
  const body = ctx.request.body;
  vendorId = +('0X'+body.vendorId);
  productId = +('0x'+body.productId);
  const arrTemplate = body.arrTemplate;
  console.log(vendorId, productId);
  const resModel = {
    code: '200',
    message: 'success'
  };
  try{
    arrTemplate.forEach(item => {
	    PrintLabel(item);
    });
  }catch(err) {
    // console.log(err);
    resModel.code = '500';
    resModel.message = '打印错误';
    ctx.status = 500;
  }
  ctx.body = resModel;
});
koaApp.use(bodyParser());
koaApp.use(router.routes());
koaApp.use(router.allowedMethods());
koaApp.listen(8899, () => {
	console.log(`Server running on http://localhost:${8899}`);
});