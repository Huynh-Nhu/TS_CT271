const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema ({
    idUser:{
        type: String,
    },
    idProduct:{
        type: String,
    },
    name:{
        type: String,
    },
    image:{
        type: String,
    },
    size:{
        type: String,
    },
    quantity:{
        type: String,
    },
    priceSize:{
        type: String,
    },
    price:{
        type: String,
    },
    note:{
        type: String,
    }
    

});



const Cart = mongoose.model('Cart',cartSchema);
module.exports = Cart;
