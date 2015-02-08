var http=require('http');
var fs = require('fs');
var port = process.env.PORT || 1337;
var url=require('url');

var server=http.createServer(function(req,res){
    var pathname=url.parse(req.url).pathname;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    switch(pathname){
        case '/data':
            res.end('123');
        break;
        default:
        	fs.readFile('./dumpserver.html', function (err, html) {
            	res.end(html);
            });
        break;
    }

}).listen(port);
console.log('Server running at http://localhost:'+port);