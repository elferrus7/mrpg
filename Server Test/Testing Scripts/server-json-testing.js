
var http = require("http");

console.log('Server starting');

var s = http.createServer(function(req,res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    /*var jason = function myJsonMethod(){
      "age" : "24",
      "hometown" : "Missoula, MT",
      "gender" : "male"
    };*/
    res.write('myJsonMethod({"age" : "24","hometown" : "Missoula, MT","gender" : "male"});');
    res.end();
}).listen(8000);
/*var options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST'
};

var req = http.request(options, function(res) {
  console.log('Request');
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.write('data\n');
req.write('data\n');
req.end();*/