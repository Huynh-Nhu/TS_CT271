const mongoose = require('mongoose');
const validator = require('validator')
const Schema = mongoose.Schema;

// mode addmin
const userSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required:true,
        unique: true,
        validate:{
            validator:(value) =>{
                return validator.isMobilePhone(value,"vi-VN");
            },
            message: "Số điện thoại không hợp lệ"
        }

       
    },
    password: {
        type: String,
        required: true
    },
    position:{
        type: String,
        required: true
        
    },
    address:{
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
