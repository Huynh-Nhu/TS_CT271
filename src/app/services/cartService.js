const cart = require("../models/cartModel");
const { ObjectId } = require("mongodb");

class CartService {
  constructor(client) {
    this.registerRouter = client.db().collection("cart");
  }
  extractCartData(payload) {
    const cartModel = {
      idUser: payload.idUser,
      idProduct: payload.idProduct,
      name: payload.name,
      image: payload.image,
      size: payload.size,
      quantity: payload.quantity,
      priceSize: payload.priceSize,
      price: payload.price,
      note: payload.note,
    };
    Object.keys(cartModel).forEach(
      (key) => cartModel[key] === undefined && cartModel[key]
    );
    return cartModel;
  }
  async addCart(payload) {
    const carts = this.extractCartData(payload);
    const result = await this.registerRouter.findOneAndUpdate(
      carts,
      { $set: carts },
      { returnDocument: "after", upsert: true, maxTimeMS: 30000 }
    );
    return result;
  }

  async getAll() {
    const carts = await this.registerRouter.find().toArray();
    return carts;
  }

  async delete(id) {
    const result = await this.registerRouter.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
  async deleteAllCart(idUser) {
    try {
      console.log("name", idUser);
      const user = await this.registerRouter.findOne({
        idUser:new ObjectId(idUser)
       
      });
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }
      const result = await this.registerRouter.deleteMany({
        idUser:new ObjectId(idUser)
      });
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async updateCart(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const updateCarts = this.extractCartData(payload);
    // console.log("product",product);
    const result = await this.registerRouter.findOneAndUpdate(
      filter,
      { $set: updateCarts },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }
}

module.exports = CartService;
