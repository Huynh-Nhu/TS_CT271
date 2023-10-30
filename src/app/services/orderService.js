const order = require("../models/orderModel");
const { ObjectId } = require("mongodb");

class orderService {
  constructor(client) {
    this.registerRouter = client.db().collection("order");
  }

  extractOrderFromDB(payload) {
    const orderModel = {
      idUser: payload.idUser,
      dayOrder: payload.dayOrder,
      dayCurrent: payload.dayCurrent,
      status: payload.status,
    };

    Object.keys(orderModel).forEach(
      (key) => orderModel[key] === undefined && delete orderModel[key]
    );
    return orderModel;
  }

  async create(payload) {
    const order = this.extractOrderFromDB(payload);
    console.log(order);
    const result = await this.registerRouter.findOneAndUpdate(
      order,
      { $set: order },
      { returnDocument: "after", upsert: true, maxTimeMS: 30000 }
    );
    return result;
  }
  async getAllOrder() {
    const order = await this.registerRouter.find().toArray();
    return order;
  }
  async getOrder(id) {
    return await this.registerRouter.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }
  async updateOrder(id, status, dayCurrent) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const updateOrder = this.extractOrderFromDB(status, dayCurrent);
    
    const result = await this.registerRouter.findOneAndUpdate(
      filter,
      { $set: updateOrder },
      { returnDocument: "after", upsert: true },
    );
    return result;
  }
}

module.exports = orderService;
