var express = require('express');
var cookieParser = require('cookie-parser');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var router = require('./routes/router');
var port = process.env.PORT || 9000;

var app = express();
app.use(cookieParser());

app.set('views', path.join(__dirname, 'public/html'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(cors);

app.use('/', router);

app.use(function (req, res, next) {
    res.status(404);
    if (req.accepts('html')) {
        res.render('errorpage', { message: "Requested Resource not found" });
        return;
    }
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }
    res.type('txt').send('Not found');
});

app.listen(port);
console.log("App listening on port " + port);
