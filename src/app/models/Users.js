const mongoose = require('mongoose');

// Chua thuoc tinh của model
const userSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true,
        minlength: 10,
        maxlength: 30,
        unique: true // tra ve da co username ton tail
        
    },
    phone:{
        type: 'number',
        required: true,
        minlength: 1,
        maxlength: 11,
        unique: true // tra ve sdt da on tai 
    },
    password: {
        type: 'string',
        required: true,
        minlength: 6,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    // admin:{
    //     type:'boolean',
    //     default: false,
    // },

}
// ,
//     {
//         timestamps: true,
//     }
);


module.exports = mongoose.model('User',userSchema);