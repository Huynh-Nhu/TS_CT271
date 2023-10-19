const UserService = require("../services/userService");
const User = require("../models/useModel");
const ApiError = require("../api-error");
const bcrypt = require("bcrypt");
const MongoDB = require("../util/mongodb");
const { response } = require("express");
class RegisterController {
  createon(req, res) {
    res.send('register');
  }
  async create(req, res, next) {
    var message = "";

    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      const newUser = new User({
        name: req.body.name,
        phone: req.body.phone,
        password: hashed,
      });

      if (!newUser.name || newUser.name.trim() === "") {
        message = "Dien ten dang nhap";
        res.send(message);     
           return;
      }
      if (!newUser.phone || newUser.phone.trim() === "") {
        message = "Dien so dien thoai";
        res.send(message)
        return;
      } else if (!/^\d{10}$/.test(newUser.phone)) {
        message = "So dien thoai gom 10 so";
        res.send(message)
        return;
      }
      const userService = new UserService(MongoDB.client);
  
      const userExists = await userService.findByPhone(newUser.phone);

      if (userExists) {
        message = "Tai khoan da ton tai";
        res.send(message);
        return;
      } else {
        const document = await userService.create(newUser);
        message = "Dang ky thanh cong";
        res.send(message);
        console.log(document);
      }
      res.send(message);
    } catch (err) {
      console.log(err);
      return next(
          new ApiError(500, "An error occurred while creating")
      )
    }
  }
}

//tạo ra một đối tượng và gửi ra ngoài
module.exports = new RegisterController();
