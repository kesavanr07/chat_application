const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
    message_id: {
        type: Number,
        unique: true,
        required: true,
        default: 0
    },
    content: {
        type: String,
        required: true
    },
    user_id: {
        type: Number, 
        required: true
    },
    to_user_id : {
        type: Number, 
        required: true
    },
    created_date : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('messages', MessagesSchema);
