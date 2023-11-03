const { deleteOnProduct } = require("../controllers/ProductController");
const Product = require("../models/productModel");
const {ObjectId} = require("mongodb")

class ProductService {
  constructor(client) {
    this.registerRouter = client.db().collection("product");
  }
  async getAllProduct() {
    const products = await this.registerRouter.find().toArray();
    return products;
  }
  async searchProduct(name){
    const product = await this.registerRouter.findOne({
      name :{ $regex: new RegExp(name), $options: "i" }
    });
      return product;
  }
  async getOneProduct(id){
    return await this.registerRouter.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) :null,

    })
  }
 
  async updateProduct(id, payload){
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) :null,
    };
    const updateProduct = this.extractProductData(payload);
    const result = await this.registerRouter.findOneAndUpdate(
      filter,
      {$set: updateProduct},
      {returnDocument: "after", }
    );
    return result;
  }
  async delete(id){
    const result = await this.registerRouter.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) :null,
    });
    return result;

  }

  extractProductData(payload) {
    const productModel = {
      category: payload.category,
      name: payload.name,
      image: payload.image,
      sizeS: payload.sizeS,
      sizeM: payload.sizeM,
      details: payload.details,
      status: payload.status
    };
    console.log(productModel);
    Object.keys(productModel).forEach(
      (key) => productModel[key] === undefined && productModel[key]
    );
    return productModel;
  }
  async addProduct(payload) {
    const products = this.extractProductData(payload);
    const result = await this.registerRouter.findOneAndUpdate(
      products,
      { $set: {status: products.status === true} },
      { returnDocument: "after", upsert: true, maxTimeMS: 30000 }
    );
    return result;
  }
}

module.exports = ProductService;
