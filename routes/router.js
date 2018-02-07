var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
    res.render('index', { title : "PayCr" });
});

router.get('/terms', function (req, res, next) {
    res.render('terms', { title: "PayCr" });
});

router.get('/policy', function (req, res, next) {
    res.render('policy', { title: "PayCr" });
});

router.get('/register', function (req, res, next) {
    res.render('register', { title: "PayCr" });
});

router.get('/register-success', function (req, res, next) {
    res.render('register-success', { title: "PayCr" });
});

router.get('/contactus-success', function (req, res, next) {
    res.render('contactus-success', { title: "PayCr" });
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: "PayCr" });
});

router.get('/adminlogin', function(req, res, next) {
    res.render('adminlogin', { title: "PayCr" });
});

router.get('/forgot-password', function (req, res, next) {
    res.render('forgot-password', { title: "PayCr" });
});

router.get('/admin', function (req, res, next) {
    var accessToken = req.cookies.access_token;
    if (accessToken == null || accessToken == '') {
        res.redirect('/adminlogin');
    } else {
        console.log('admin access_token: ', accessToken);
        res.render('admin/admin', { title: "PayCr" });
    }
});

router.get('/merchant', function (req, res, next) {
    var accessToken = req.cookies.access_token;
    if (accessToken == null || accessToken == '') {
        res.redirect('/login');
    } else {
        console.log('merchant access_token: ', accessToken);
        res.render('merchant/merchant', { title: "PayCr" });
    }
});

module.exports = router;
