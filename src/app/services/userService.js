const { ObjectId } = require("mongodb");
const userModel = require("../models/useModel");

class UserService {
  constructor(client) {
    this.registerRouter = client.db().collection("users");
  }
  async getAllUsers() {
    const users = await this.registerRouter.find({}).toArray();
    return users;
  }
  async findByPhone(phone) {
    const user = await this.registerRouter.findOne({ phone });
    return user;
    console.log(user);
  }
  async getByIdUser(id) {
    return await this.registerRouter.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }
  extractUsersFromDB(payload) {
    const userModel = {
      name: payload.name,
      phone: payload.phone,
      password: payload.password,
      rule: payload.rule,
    };

    Object.keys(userModel).forEach(
      (key) => userModel[key] === undefined && delete userModel[key]
    );
    return userModel;
  }

  async create(payload) {
    const users = this.extractUsersFromDB(payload);
    console.log(users);
    const result = await this.registerRouter.findOneAndUpdate(
      users,
      { $set: { rule: users.rule === true } },
      { returnDocument: "after", upsert: true, maxTimeMS: 30000 }
    );
    return { success: true, user: result.value };
    // console.log(result);
  }
}

module.exports = UserService;
