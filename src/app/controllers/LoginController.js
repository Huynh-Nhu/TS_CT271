const UserService = require("../services/userService");
const User = require("../models/useModel");
const ApiError = require("../api-error");
const MongoDB = require("../util/mongodb");
const bcrypt = require("bcrypt");
const { response } = require("express");
class LoginController {
  async login(req, res) {
    try {
      const { phone, password } = req.body;
      console.log(phone);

      const userService = new UserService(MongoDB.client);
      const user = await userService.findByPhone(phone);
      console.log("user sau khi tim", user);

      //Nếu người dùng không tồn tại hoặc mật khẩu không chính xác, hiển thị thông báo lỗi
      if (!user || !(await bcrypt.compare(password, user.password))) {
        const message = "Số điện thoại hoặc mật khẩu không chính xác";
        res.send({ message });
        // return;
      } else {
        const message = "Đăng nhập thành công"; // Success message
        res.send({ user, message });
      }
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new LoginController();
