const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// mode addmin
const userSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
       
    },
    password: {
        type: String,
        required: true
    },
    rule: {
        type: Boolean,
        default: false
    }
});



const User = mongoose.model('User', userSchema);
module.exports = User;
