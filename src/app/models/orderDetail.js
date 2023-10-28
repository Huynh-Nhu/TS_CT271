const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderDetailSchema = new Schema ({
   idOrder: {
   type:Schema.Types.ObjectId,
   ref:"Order",
   },
   idProduct:{
      type:Schema.Types.ObjectId,
      ref:"Product",
   },
   quantityProduct:{
      type: String,
   },
   priceAll:{
      type: String,
   },
   localUser:{
      type: String,
   },
   note:{
      type: String,
   }


});



const OrderDetail = mongoose.model('OrderDetail',  orderDetailSchema);
module.exports = OrderDetail;
