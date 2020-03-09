const http = require('http');
const fs = require('fs');
const path = require('path');
// const open = require('open');
var WebSocketServer = require('ws').Server;
var socketServer = new WebSocketServer({ port: 9000 });
var clients = [];

let index = 1;
socketServer.on('connection', function(socket) {

	clients.push(socket);
	let userId = index++;
	//broadcast to clients when new message comes from one client
	socket.on('message', function(message) {
		console.log(message);
		clients.forEach(function(client) {
			if (client !== socket) {
				client.send(message);
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