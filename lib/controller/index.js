const jwt_config    = require("../../config.json").jwt[process.env.NODE_ENV];
const Users         = require("../model/users");
const common        = require('../utils/common');
const jwt           = require('jsonwebtoken');
const _self         = {}; 



_self.loginUser = async (req, res, callback) => {

    var req_body = req.body || null;

    if(!req_body) 
        return callback("Empty request data");

    if(!req_body.email_id)
        return callback("Empty Email id");

    if(!req_body.password)
        return callback("Empty password");
    
    try {
        const user_data = await Users.findOne({ email_id : req_body.email_id });

        if(!user_data)
            return callback('Invalid Email Id');
        
        common.comparePassword(req_body.password, user_data.password, (err, password_match) => {
            if(err) return callback(err);

            if(!password_match) return callback("Invalid Password");

            const token = jwt.sign({ username:  user_data.username}, jwt_config.secret);

            callback(null, {
                message : "Logged in successfully",
                token,
                user_id : user_data.user_id,
                username : user_data.username
            });
        });
    } catch (error) {
        callback(error);
    }
}

_self.registerUser = async (req, res, callback) => {

    var req_body = req.body || null;

    if(!req_body) 
        return callback("Empty request data");

    if(!req_body.username)
        return callback("Empty Username");

    if(!req_body.password)
        return callback("Empty password");

    if(!req_body.email_id)
        return callback("Empty Email Id");

    try {
        const user_data = await Users.findOne({ $or: [{ username : req_body.username }, { email_id : req_body.email_id }]});
        
        if(user_data && user_data.username === req_body.username)  
            return callback('Username already exist');
        
        if(user_data && user_data.email_id === req_body.email_id)  
            return callback('Email Id already exist');

        common.cryptPassword(req_body.password, async (err, hash_password) => {
            if(err) return callback(err);

            const user_count = await Users.find({}).count();

            const new_user = Users({
                username : req_body.username,
                email_id : req_body.email_id,
                password : hash_password,
                user_id : (user_count || 0) + 1
            });
    
            const req_user = await new_user.save();
            console.log('reg_user :>> ', req_user);
            const token = jwt.sign({ username:  req_user.username}, jwt_config.secret);
            callback(null, {
                message: "Registered successfully", 
                token,
                user_id : req_user.user_id,
                username : req_user.username
            });
        });
    } catch (error) {
        callback(error);
    }
}

_self.getUserData = async (req, callback) => {
    var req_body = req.body || null;

    if(!req_body.user_id)
        return callback("Empty User Id");

    try {
        const user_data = await Users.find({ user_id: { $ne: req_body.user_id } });
        
        if(!user_data)
            return callback('Empty user details found');

        callback(null, {user_data});
    } catch (error) {
        callback(error);
    }
}

_self.logoutUser = (req, callback) => {
    // req.logOut();
    callback(null, { status : 'Logged out successfully' });
}

module.exports = _self;