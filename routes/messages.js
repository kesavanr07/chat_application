const express   = require('express');
const router    = express.Router();

const common    = require('../lib/utils/common');
const messages  = require('../lib/controller/messages');


router.post('/get', common.authenticateToken, function(req, res, next) {
    messages.getMessagesByUsers(req, (err, data) => {
        common.handleResponse(err, data, res);
    });
});

router.post('/save', common.authenticateToken, function(req, res, next) {
    messages.saveMessages(req, (err, data) => {
        common.handleResponse(err, data, res);
    });
});


module.exports = router;
