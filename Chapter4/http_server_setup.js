var http = require('http');
var formidable = require('formidable');

var server = http.createServer(function(req, res){

	switch (req.method) {

	case 'GET':

		show(req, res);
		
		break;
		
	case 'POST':
	
		upload(req, res);
		break;
	}
	
	function show(req, res) {
	
		var html = '' +
			'<form method="post" action="/" enctype="multipart/form-data">' +
			'<p><input type="text" name="name" /></p>' +
			'<p><input type="file" name="file" /></p>' +
			'<p><input type="submit" value="Upload" /></p>' +
			'</form>';
			
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', Buffer.byteLength(html));
		res.end(html);
	}

	function upload(req, res) {

		if (!isFormData(req)) {
			
			res.statusCode = 400;
			res.end('Bad Request: expecting multipart/form-data');
			return;
		}
		
		var form = new formidable.IncomingForm();
		
		form.parse(req, function(err, fields, files){
			
			console.log(fields);
			console.log(files);
			res.end('upload complete!');
			
			// TODO: Report progress to client using socket.io. Can do this 
			// after the socket.io chapter.
		});		
		
		form.on('progress', function(bytesReceived, bytesExpected){
			
			var percent = Math.floor(bytesReceived / bytesExpected * 100);
			console.log(percent);
		});
		
		// Private functions.
		
		function isFormData(req) {
			
			var type = req.headers['content-type'] || '';
			return (type.indexOf('multipart/form-data') === 0);
		}	
	}
});

server.listen(3000, function() {
	console.log("listening on port 3000");
});
