const jwt_config    = require("../../config.json").jwt[process.env.NODE_ENV];
const bcrypt        = require('bcrypt');
const jwt           = require('jsonwebtoken');

const _self = {};

_self.handleResponse = (err, data, res) => {
    console.log('err :>> ', err);
    console.log('data :>> ', data);
    var response_data = {};
    if(err) {
        response_data = {
            "status" : "failure",
            "data" : err || "Unexpected error found"
        };
    } else {
        response_data = {
            "status" : "success",
            "data" : data || []
        };
    }
    res.status(200).set('Content-Type', 'application/json').json(response_data);
}

_self.authenticateToken = function(req, res, next) {

    if(req.headers && !req.headers.authorization)
        return _self.handleResponse("Invalid Token", null, res);
    
    const token = req.headers.authorization.replace("Bearer ", "");

    try {
        var decode_data = jwt.verify(token, jwt_config.secret)
        if(decode_data){
            next();
        } else {
            _self.handleResponse("Invalid Token from JWT");
        }
    } catch (error) {
        return _self.handleResponse(error && error.message || error, null, res);
    }
}


_self.cryptPassword = function(password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return callback(err);
        bcrypt.hash(password, salt, callback);
    });
};

_self.comparePassword = function(req_password, hashword, callback) {
    bcrypt.compare(req_password, hashword, callback);
};

module.exports = _self;