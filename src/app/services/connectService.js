const { ObjectId } = require("mongodb");
const connectModel = require('../models/connectModel')

class ConnectService {
  constructor(client) {
    this.registerRouter = client.db().collection("connect");
  }
 
  extractConnectFromDB(payload) {
    const connectModel = {
        idUser: payload.idUser,
        comment: payload.comment,
        image:[ payload.image],
        dayComment: payload.dayComment,
    };

    Object.keys(connectModel).forEach(
      (key) => connectModel[key] === undefined && delete connectModel[key]
    );
    return connectModel;
  }

  async newConnect(payload) {
    const connects = this. extractConnectFromDB(payload);
    console.log(connects);
    const result = await this.registerRouter.findOneAndUpdate(
      connects,
      { $set: connects },
      { returnDocument: "after", upsert: true, maxTimeMS: 30000 }
    );
    return result;

  }

  async getConnectAll(){
    const  connects = await this.registerRouter.find().toArray();
    return  connects;
  }
}

module.exports = ConnectService;
