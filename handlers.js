var globals = require('./globals');
var fs = require('fs');
var qs = require('querystring');
var storage = require('./persistent_storage');

var returnMessages = function(request, response){
		response.writeHead(200, globals.defaultCorsHeaders);
		storage.getMessages(function(message) {
			globals.messageLog.push(message);
		});

		response.end(JSON.stringify(globals.messageLog));
};

var postMessages = function(request, response){
		request.setEncoding();
		response.writeHead(302, globals.defaultCorsHeaders);
		console.log('message');
			request.on('data', function(data){
				var message = qs.parse(data);
				console.log("postMessages ", message);
				storage.postMess(message);
				fs.writeFile('log.txt', globals.messageLog);
			});
};

var serveFile = function(request, response){
			response.writeHead(200, {'Content-Type': 'text/html'});
			fs.createReadStream(__dirname + '/index.html').pipe(response);
			// read.pipe(fs.readFileSync('index.html', 'utf-8'));
};


exports.returnMessages = returnMessages;
exports.postMessages = postMessages;
exports.serveFile = serveFile;