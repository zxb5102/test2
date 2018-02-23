var fs = require("fs"),
    http = require("http"),
    url = require("url"),
    path = require("path");

http.createServer(function (req, res) {
  var reqObj = url.parse(req.url,true);
  var key = reqObj.query.key;
  var video = reqObj.query.video;
  console.log(video);
  console.log(key);
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  if(key){
        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.write("<h1>"+key+"</h1>");
        res.end('<video src="http://localhost:3000/video?video='+key+'" controls></video>');
  }else if(video){

    var file = path.resolve("f:\\movie/",video);
    fs.stat(file, function(err, stats) {
      if (err) {
        if (err.code === 'ENOENT') {
          // 404 Error if file not found
          return res.sendStatus(404);
        }
      res.end(err);
      }
      var range = req.headers.range;
      if (!range) {
       // 416 Wrong range
       return res.sendStatus(416);
      }
      var positions = range.replace(/bytes=/, "").split("-");
      var start = parseInt(positions[0], 10);
      var total = stats.size;
      var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      var chunksize = (end - start) + 1;

      res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4"
      });
      if(start > end ){
        res.end();
      }
      var stream = fs.createReadStream(file, { start: start, end: end })
        .on("open", function() {
          stream.pipe(res);
        }).on("error", function(err) {
          res.end(err);
        });
    });
  }else{
    //读取目录下的视频列表返回页面
    var list = fs.readdirSync("F:/movie",{encoding:"utf8"})
    res.write("<ul>");
      for(var item of list){
        res.write("<li><a href='/"+item+"?key="+item+"'>"+item+"</a></li>");
      }
    res.end("</ul>");
  }
}).listen(3000);


/*if (req.url != "/RBD-673C.mp4") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end('<video src="http://localhost:8888/RBD-673C.mp4" controls></video>');
  } else {
    var file = path.resolve("f:\\movie","RBD-673C.mp4");
    fs.stat(file, function(err, stats) {
      if (err) {
        if (err.code === 'ENOENT') {
          // 404 Error if file not found
          return res.sendStatus(404);
        }
      res.end(err);
      }
      var range = req.headers.range;
      if (!range) {
       // 416 Wrong range
       return res.sendStatus(416);
      }
      var positions = range.replace(/bytes=/, "").split("-");
      var start = parseInt(positions[0], 10);
      var total = stats.size;
      var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      var chunksize = (end - start) + 1;

      res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4"
      });

      var stream = fs.createReadStream(file, { start: start, end: end })
        .on("open", function() {
          stream.pipe(res);
        }).on("error", function(err) {
          res.end(err);
        });
    });
  }*/