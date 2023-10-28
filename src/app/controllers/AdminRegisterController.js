const User = require("../models/useModel");
const AdminService = require("../services/adminService");
const validator = require('validator')

const bcrypt = require("bcrypt");

const MongoDB = require("../util/mongodb");

class AdminRegisterController {
  async create(req, res) {
    var message = "";

    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      const newUser = new User({
        name: req.body.name,
        phone: req.body.phone,
        position: req.body.position,
        address: req.body.address,
        password: hashed,
        rule: false,
      });

      const adminService = new AdminService(MongoDB.client);
      const adminExists = await adminService.findByPhone(newUser.phone);

      if(adminExists){
        message = "Tài Khoản Này Đã Tồn Tại";
        res.send(message);
        return;
    }else if(!validator.isMobilePhone(newUser.phone,"vi-VN")){
      message = "Số điện thoại không hợp lệ";
      res.send(message);

    } else {
        const admin = await adminService.create(newUser)
        message = "Đăng Ký Thành Công";
        res.send(message);
        // res.send(admin);

    }
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new AdminRegisterController();
