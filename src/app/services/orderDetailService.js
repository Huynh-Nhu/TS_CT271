const orderDetail = require('../models/orderDetail')
const {ObjectId} = require("mongodb")


class orderDetailService{
    constructor(client) {
        this.registerRouter = client.db().collection("orderDetail");
    }
    
    extractOrderDetailFromDB(payload) {
        const orderDetailModel = {
           idOrder: payload.idOrder,
           idProduct: payload.idProduct,
           quantityProduct: payload.quantityProduct,
           priceAll: payload.priceAll,
           localUser: payload.localUser,
           note: payload.note
          
        };
    
        Object.keys(orderDetailModel).forEach(
          (key) => orderDetailModel[key] === undefined && delete orderDetailModel[key]
        );
        return orderDetailModel;
    }

    async create(payload){
        const orderDetail = this.extractOrderDetailFromDB(payload);
        console.log(orderDetail);
        const result = await this.registerRouter.findOneAndUpdate(
          orderDetail,
          { $set: orderDetail },
          { returnDocument: "after", upsert: true, maxTimeMS: 30000 }
        );
        return result;
        console.log(result);
    }
    // async getAllOrderDetail(){
    //   const orderDetail = await this.registerRouter.find({ idOrder: order._id }).populate('idProduct').exec();
    //     return orderDetail;
    // }
    async getAllOrderDetail() {
      try {
        const orderDetails = await this.registerRouter.find().toArray();
        return orderDetails;
      } catch (error) {
        console.log(error);
        throw new Error("Error retrieving order details");
      }
    }
    async getOrderDetail(id){
      return await this.registerRouter.findOne({
        _id: ObjectId.isValid(id) ? new ObjectId(id) :null,
  
      })
    }
    async findByOrderDetailS(idOrder) {
      const orderDetail = await this.registerRouter.findOne({ idOrder });
      return orderDetail;
      console.log(user);
    }
}

module.exports =  orderDetailService;