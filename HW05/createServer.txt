
const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');

fs.readFile('./calendar.json','utf8',function (error,data) {
  if (error) throw error;
  var caldata = JSON.parse(data);
})

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  if(req.url === '/'){
    indexPage(req,res);
  }
  else if(req.url === '/index.html'){
    indexPage(req,res);
  }
  else if(req.url === '/calendar.html'){
    calendarPage(req,res);
  }
  else if(req.url === '/addCalendar.html'){
    addCalendarPage(req,res);
  }
  else if (req.url === '/calendar.json'){
    doJSON(req,res);
  }
  else if(req.url === '/postCalendarEntry'){
    handlePost(req,res)
  }
  else{
    res.writeHead(404, {'Content-Type': 'text/html'});
    return res.end("404 Not Found");
  }
}).listen(9000);


function indexPage(req, res) {
  fs.readFile('client/index.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}

function calendarPage(req,res) {
  fs.readFile('client/calendar.html', function(err, html) {
    if(err) {
      throw err;
    }
    html +=
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}

function addCalendarPage(req,res) {
  fs.readFile('client/addCalendar.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}

function doJSON(req,res) {
  if (req.method === 'GET') {
    fs.readFile('./calendar.json','utf8',function (error,data) {
      if (error) throw error;
      res.write(data);
      //var caldata = JSON.parse(data);
      //res.write(JSON.stringify(caldata));
      res.end();
    })
  }
}

function handlePost(req,res) {
    fs.readFile('./calendar.json','utf8',function (error,data) {
      if (error) throw error;
      var caldata = JSON.parse(data);
      let dataholder = '';
      req.on('data', chunk => {
        dataholder += chunk.toString();
      });
      req.on('end',() => {
        var entry = qs.parse(dataholder);
        var body = caldata['calendar'];
        body.push(entry);
        fs.writeFile('./calendar.json',JSON.stringify(caldata),function (error) {
          if (error) throw error;
        });
        res.writeHead(302, {
              'Location': '/calendar.html'
            });
        res.end();
      });
    });
}
