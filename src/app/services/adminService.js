const { ObjectId } = require("mongodb");
const userModel = require("../models/useModel");

class AdminService {
  constructor(client) {
    this.registerRouter = client.db().collection("users");

  }

 
  AdminService(payload) {
    const adminModel = {
      name: payload.name,
      phone: payload.phone,
      position: payload.position,
      address: payload.address,
      password: payload.password,
      rule: payload.rule,
    };

    Object.keys(adminModel).forEach(
      (key) => adminModel[key] === undefined && delete adminModel[key]
    );
    return adminModel;
  }

  async create(payload) {
    const users = this.AdminService(payload);
    console.log(users);
    const result = await this.registerRouter.findOneAndUpdate(
      users,
      { $set: { rule: users.rule === false } },
      { returnDocument: "after", upsert: true, maxTimeMS: 30000 }
    );
    return { success: true, user: result.value };
    // console.log(result);
  }
  async findByPhone(phone) {
    const admin = await  this.registerRouter.findOne({ phone });
    return admin;
    console.log(admin);
  }
}

module.exports = AdminService;
