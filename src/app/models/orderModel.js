const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// mode addmin
const orderSchema = new Schema ({
   idUser: {
    type:Schema.Types.ObjectId,
    ref:"User",
    description:"id của khach hang",
   },
   dayOrder:{
    type: String
   },
   dayCurrent:{
      type: String
   },
   status:{
    type: String,
    enum:['Pending', 'Completed'],
    default: 'Pending',
   }
});



const Order = mongoose.model('Order',  orderSchema);
module.exports = Order;
