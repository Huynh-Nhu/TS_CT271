const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// mode addmin
const connectSchema = new Schema ({
    idUser:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    comment:{
        type: String,
    },
    image:[{
        type: String,
    }],
    dayComment:{
        type: String,
    }
    

});



const Connect = mongoose.model('Connect', connectSchema);
module.exports = Connect;
