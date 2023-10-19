const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema ({
    nameProduct: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,

    },
    name:{
        type: String,
    },
});



const Image = mongoose.model('Image',imageSchema);
module.exports = Image;
