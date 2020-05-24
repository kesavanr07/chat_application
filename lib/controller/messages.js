const Messages     = require("../model/messages");
const common    = require('../utils/common');
const _self     = {}; 

_self.getMessagesByUsers = async (req, callback) => {

    var req_body = req.body || null;

    if(!req_body) 
        return callback("Empty request data");

    if(!req_body.user_id)
        return callback("Empty User id");

    if(!req_body.to_user_id)
        return callback("Empty to User id");

    try {
        const message_data = await Messages.find({ $or: [{ user_id : req_body.user_id, to_user_id : req_body.to_user_id }, { user_id : req_body.to_user_id, to_user_id : req_body.user_id }]}).sort({created_date: 'descending'});
        console.log('message_data :>> ', message_data);
        callback(null, {message_data});
    } catch (error) {
        callback(error);
    }
}

_self.saveMessages = async (req, callback) => {

    var req_body = req.body || null;

    if(!req_body) 
        return callback("Empty request data");

    if(!req_body.user_id)
        return callback("Empty User id");

    if(!req_body.to_user_id)
        return callback("Empty to User id");
    
    if(!req_body.content)
        return callback("Empty content");

    try {

        const message_count = await Messages.find({}).count();
        
        const new_message = Messages({
            user_id : req_body.user_id,
            to_user_id : req_body.to_user_id,
            content : req_body.content,
            message_id : (message_count || 0) + 1
        });

        const saved_message = await new_message.save();

        callback(null, {saved_message});
    } catch (error) {
        callback(error);
    }
}

module.exports = _self;