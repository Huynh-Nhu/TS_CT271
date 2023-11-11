const UserService = require("../services/userService");
const User = require("../models/useModel");
const ApiError = require("../api-error");
const bcrypt = require("bcrypt");
const MongoDB = require("../util/mongodb");
const { response } = require("express");
const validator = require('validator')

class RegisterController {
 
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
        message = "Vui Lòng Điền Tên Đăng Nhập";
        res.send(message);     
           return;
      }
      if (!newUser.phone || newUser.phone.trim() === "") {
        message = "Vui Lòng Nhập Số Điện Thoại ";
        res.send(message)
        return;
      } else if (!validator.isNumeric(newUser.phone) || newUser.phone.length !== 10) {
        message = "Số Điện Thoại Phải Đủ 10 Số";
        res.send(message)
        return;
      }
      if (!req.body.password || req.body.password.trim() === "") {
        message = "Vui lòng nhập mật khẩu";
        res.send(message);
        return;
      }
      if(req.body.password.length < 8){
        message = " Pass phải có ít nhất 8 ký tư"
        res.send(message);
        return;
      }
      const userService = new UserService(MongoDB.client);
  
      const userExists = await userService.findByPhone(newUser.phone);

      if (userExists) {
        message = "Tài Khoản Này Đã Tồn Tại";
        res.send(message);
        return;
      } 
      
      else if(!validator.isMobilePhone(newUser.phone,"vi-VN")){
        message = "Số điện thoại không hợp lệ";
        res.send(message);
  
      }
       else {
        const document = await userService.create(newUser);
        message = "Đăng Ký Thành Công";
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
