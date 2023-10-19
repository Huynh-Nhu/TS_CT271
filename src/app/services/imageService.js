const image = require("../models/imgModel");
const { ObjectId } = require("mongodb");

class imageService {
  constructor(client) {
    this.registerRouter = client.db().collection("image");
  }
  async getImageProduct() {
    const image = await this.registerRouter.find().toArray();
    return image;
  }
  async getImage(id){
    const image = await this.registerRouter.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    })
    return image;
  }
  async getImageOne(nameProduct) {
    const image = await this.registerRouter.findOne({ nameProduct });
    return image;
    console.log(image);
  }
  async getById(id) {
    return await this.registerRouter.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    // const img = await this.registerRouter.findOne({
    //   _id: new ObjectId(id
    // })
    // return id;
  }
  async deleteImage(id){
    const result = await this.registerRouter.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) :null,
    });
    return result;

  }
  async updateProduct(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const updateImage = this.extractImageFromDB(payload);
    const result = await this.registerRouter.findOneAndUpdate(
      filter,
      { $set: updateImage },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  extractImageFromDB(payload) {
    const imageModel = {
      nameProduct: payload.nameProduct,
      name: payload.name,
    };

    Object.keys(imageModel).forEach(
      (key) => imageModel[key] === undefined && delete imageModel[key]
    );
    return imageModel;
  }

  async create(payload) {
    const image = this.extractImageFromDB(payload);
    console.log(image);
    const result = await this.registerRouter.findOneAndUpdate(
      image,
      { $set: image },
      { returnDocument: "after", upsert: true, maxTimeMS: 30000 }
    );
    return result;
    console.log(result);
  }
}

module.exports = imageService;
