const mongoose = require('mongoose');

const users_Schema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true
    },
    user_password: {
        type: String,
        required: true
    },
    private_key:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        default:'Active'
    }
});

module.exports = mongoose.model('users', users_Schema);