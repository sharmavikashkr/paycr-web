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

router.get('/admin', function(req, res, next) {
  res.render('admin/admin', { appUrl : appUrl });
});

router.get('/merchant', function(req, res, next) {
  res.render('merchant/merchant', { appUrl : appUrl });
});

module.exports = router;
