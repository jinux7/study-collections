const http = require('http');
const fs = require('fs');
const path = require('path');
const open = require('open');
var WebSocketServer = require('ws').Server;
var socketServer = new WebSocketServer({ port: 9000 });
var clients = [];


const server = http.createServer((req,res)=>{
	if (/^\/(?=\?.*)?$/.test(req.url)) {
	    res.writeHead(200, { 'Content-Type': 'text/html' });
	    fs.readFile(path.resolve(__dirname, './public/index.html'),function(err,data){
	    	if(err) {
	    		console.log('读取文件失败');
	    	}else {
	    		res.write(data);
	    	}
	    	res.end();
	    });
	  } else {
	    res.writeHead(404, { 'Content-Type': 'text/plain' })
	    res.end()
	  }
});
server.listen(3500, () => console.log(`server start on port 3500`));
//open('http://localhost:3500');


let index = 1;
socketServer.on('connection', function(socket) {

	//if not the specified origin, disconnect the socket
	/*var origin = socket.upgradeReq.headers.origin;
	if (origin !== 'http://localhost') {
		socket.close();
		return;
	}*/

	//add to clients when socket is connected
	clients.push(socket);
	let userId = index++;
	//broadcast to clients when new message comes from one client
	socket.on('message', function(message) {
		console.log(message);
		clients.forEach(function(client) {
			if (client !== socket) {
				client.send('user'+userId+': '+message);
			}
		});
	});

	//remove from clients when socket is offline or disconnected
	socket.on('close', function() {
		for (var i = 0; i < clients.length; i++) {
			var client = clients[i];
			if (client === socket) {
				clients.splice(i, 1);
			}
		}
	});
	//error
	socket.on('error',function(){
		console.log('socket error!');
	});
});

console.log('socketServer is listening on 9000...');