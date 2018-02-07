var express = require('express');
var router = express.Router();
var appUrl = "http://localhost:9090";
router.get('/', function(req, res, next) {
    res.render('index', { appUrl : appUrl });
});

router.get('/login', function(req, res, next) {
    res.render('login', { appUrl : appUrl });
});

router.get('/adminlogin', function(req, res, next) {
    res.render('adminlogin', { appUrl : appUrl });
});

router.get('/admin', function (req, res, next) {
    var accessToken = req.cookies.access_token;
    if (accessToken == null || accessToken == '') {
        res.redirect('/adminlogin');
    } else {
        console.log('admin access_token: ', accessToken);
        res.render('admin/admin', { appUrl: appUrl });
    }
});

router.get('/merchant', function (req, res, next) {
    var accessToken = req.cookies.access_token;
    if (accessToken == null || accessToken == '') {
        res.redirect('/login');
    } else {
        console.log('merchant access_token: ', accessToken);
        res.render('merchant/merchant', { appUrl: appUrl });
    }
});

module.exports = router;
