var http = require('http'),
	fs = require('fs'),
	url = require('url'),
	CONTENT_TYPE={
		html: {'Content-Type': 'text/html'},
		js: {'Content-Type': 'text/javascript'},
		css: {'Content-Type': 'text/css'},
		jpg: {'Content-Type': 'text/jpg'},
		png: {'Content-Type': 'text/png'},
		gif: {'Content-Type': 'text/gif'}
	},
	port = 2333;

http.createServer(function(req, res){
	var path_name = url.parse(req.url).pathname,key;
	console.log(path_name)
	if(path_name.indexOf('.') > -1){
		key = path_name.split('.')[1]
		responseResource('.'+path_name, res, CONTENT_TYPE[key])
	}else{
		if(path_name == '/'){
			responseResource('./index.html', res, CONTENT_TYPE['html'])
		}
	}
	
}).listen(port,function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})

function responseResource(url, res, content_type){
	fs.readFile(url, function(err, data){
			if(err){
				res.writeHead(404, content_type)
				res.write('no such file')
				res.end()
			}else{
				res.writeHead(200, content_type)
				res.write(data)
				res.end()
			}
		})
}
