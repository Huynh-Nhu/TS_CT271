const cart = require('../models/cartModel');
const {ObjectId} = require("mongodb")



class  CartService{
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
          priceSize : payload.priceSize,
          price: payload.price,
          note: payload.note
        };
        console.log(cartModel);
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

      async getAll(){
        const carts = await this.registerRouter.find().toArray();
        return carts;
      }
      // async getOneCart(id){
      //   return await this.registerRouter.findOne({
      //     _id: ObjectId.isValid(id) ? new ObjectId(id) :null,
    
      //   })
      // }
      async delete(id){
        const result = await this.registerRouter.findOneAndDelete({
          _id: ObjectId.isValid(id) ? new ObjectId(id) :null,
        });
        return result;
    
      }
}


module.exports = CartService;