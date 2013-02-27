//Server test
/*var http = require('http');

var s = http.createServer( function(req,res){
	res.writeHead(200,{'content-type': 'text/plain'});
	console.log("I got a request!");
	setTimeout(function(){
		res.end("hello world \n");
	},2000);
});

s.listen(8000);*/
console.log("Starting Server");
var net = require('net');

var sockets = [];

var s = net.createServer(function(socket){
	sockets.push(socket);
	socket.on('data',function(d){
		for (var i = 0; i < sockets.length; i++){
			if (sockets[i] = socket) continue;
			socket[i].write(d);
		}
	});
	socket.on('end',function(){
		var i = sockets.indexOf(socket);
		sockets.splice(i,1);
	});
});

s.listen(8000);