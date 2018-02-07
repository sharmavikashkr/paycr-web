// set up ======================================================================
var express = require('express');
var cookieParser = require('cookie-parser')
var path = require('path');
var bodyParser = require('body-parser');
var Cookies = require("cookies");
var router = require('./routes/router');

var app = express();
app.use(cookieParser());
var port = process.env.PORT || 9000;

app.set('views', path.join(__dirname, 'public/html'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());

app.use('/', router);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
