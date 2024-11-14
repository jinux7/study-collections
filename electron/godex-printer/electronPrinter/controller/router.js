import Router from 'koa-router';
import usb from 'usb';
const router = new Router();

// 设备的vendorId和productId
const vendorId = 0x195F;
const productId = 0x1;

// function PrintLabel(info= {da1: '', da2: '', da3: ''}) {
//   // let commands = `
//   //   ^Q30,3
//   //   ^W50
//   //   ^H5
//   //   ^P1
//   //   ^S2
//   //   ^AT
//   //   ^C1
//   //   ^R0
//   //   ~Q+0
//   //   ^O0
//   //   ^D0
//   //   ^E12
//   //   ~R200
//   //   ^XSET,ROTATION,0
//   //   ^L
//   //   Dy2-me-dd
//   //   Th:m:s
//   //   BQ,26,15,2,46,40,0,0,${info.da1}
//   //   AE,25,130,1,1,0,0,${info.da2}
//   //   AD,90,178,1,1,0,0,${info.da1}
//   //   AB,310,114,1,1,0,0,${info.da3}
//   //   XRB26,65,4,0,10
//   //   ${info.da2}
//   //   XRB325,71,4,0,4
//   //   ${info.da3}
//   //   E
//   //   `;
//   let commands = `
//   ^Q30,3
//   ^W50
//   ^H5
//   ^P1
//   ^S2
//   ^AT
//   ^C1
//   ^R0
//   ~Q+0
//   ^O0
//   ^D0
//   ^E12
//   ~R200
//   ^XSET,ROTATION,0
//   ^L
//   Dy2-me-dd
//   Th:m:s
//   BQ,26,15,2,46,40,0,0,WS003
//   AE,25,130,1,1,0,0,WS00301002
//   AD,90,178,1,1,0,0,WS003
//   AB,310,114,1,1,0,0,1241
//   XRB26,65,4,0,10
//   WS00301002
//   XRB325,71,4,0,4
//   1241
//   E
//   `
// 	let device = usb.findByIds(vendorId, productId)
// 	device.open()
// 	for (let i = 0, len = device.interfaces.length ; i < len ; i++) {
// 		for (let j = 0, len2 = device.interfaces[i].endpoints.length ; j < len2 ; j++) {
// 			if (device.interfaces[i].endpoints[j].direction == 'out') {
// 				device.interfaces[i].claim() // 找到了要用的对象后，首先要声明所有权
// 				let outEndpoint = device.interfaces[i].endpoints[j]
// 				outEndpoint.transferType = 2 // bulk 批量传输
// 				outEndpoint.transfer(commands, (err) => {
// 					if (err) {
// 						console.log(err)
// 					}
// 					device.close()
// 				})
// 				return
// 			}
// 		}
// 	}
// 	device.close()
// }

let commands = `
  ^Q30,3
  ^W50
  ^H5
  ^P1
  ^S2
  ^AT
  ^C1
  ^R0
  ~Q+0
  ^O0
  ^D0
  ^E12
  ~R200
  ^XSET,ROTATION,0
  ^L
  Dy2-me-dd
  Th:m:s
  BQ,26,15,2,46,40,0,0,WS003
  AE,25,130,1,1,0,0,WS00301002
  AD,90,178,1,1,0,0,WS003
  AB,310,114,1,1,0,0,1241
  XRB26,65,4,0,10
  WS00301002
  XRB325,71,4,0,4
  1241
  E
  `
function PrintLabel(cmds) {
	let device = usb.findByIds(vendorId, productId)
	device.open()
	for (let i = 0, len = device.interfaces.length ; i < len ; i++) {
		for (let j = 0, len2 = device.interfaces[i].endpoints.length ; j < len2 ; j++) {
			if (device.interfaces[i].endpoints[j].direction == 'out') {
				device.interfaces[i].claim() // 找到了要用的对象后，首先要声明所有权
				let outEndpoint = device.interfaces[i].endpoints[j]
				outEndpoint.transferType = 2 // bulk 批量传输
				outEndpoint.transfer(cmds, (err) => {
          console.log(device.open);
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

router.post('/send/printinfo', async ctx=> {
  const arr = ctx.request.body;
  const resModel = {
    code: '200',
    message: 'success'
  };
  try{
    arr.forEach(item => {
      PrintLabel(commands);
    });
  }catch(err) {
    resModel.code = '500';
    resModel.message = '打印错误';
    ctx.status = 500;
  }
  ctx.body = resModel;
});

export default router;