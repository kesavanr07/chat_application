const express = require('express');
const router  = express.Router();

const common  = require('../lib/utils/common');
const index   = require('../lib/controller/index');

router.get('/', function(req, res, next) {
    res.send().json({"status": "success"});
});

router.post('/login', function(req, res, next) {
    index.loginUser(req, res, (err, data) => {
        common.handleResponse(err, data, res);
    });
});

router.post('/register', function(req, res, next) {
    index.registerUser(req, res, (err, data) => {
        common.handleResponse(err, data, res);
    });
});

router.post('/get_user', common.authenticateToken, function(req, res, next) {
  index.getUserData(req, (err, data) => {
      common.handleResponse(err, data, res);
  });
});


module.exports = router;
