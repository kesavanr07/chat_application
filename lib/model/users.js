const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email_id: {
        type: String,
        required: true
    },
    user_id: {
        type: Number, 
        default: 1
    }
});


module.exports = mongoose.model('users', UserSchema);
