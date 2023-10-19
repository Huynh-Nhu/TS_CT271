const UserService = require("../services/userService")
const User = require('../models/useModel');
const ApiError = require('../api-error');
const MongoDB = require('../util/mongodb');
const bcrypt = require('bcrypt');
const { response } = require("express");
class LoginController {
    async login(req, res) {    
        try {
            const { phone, password } = req.body;
            // const 
            // Retrieve user from database based on phone number
            const userService = new UserService(MongoDB.client);
            const user = await userService.findByPhone(phone);
            console.log(user);

            //Nếu người dùng không tồn tại hoặc mật khẩu không chính xác, hiển thị thông báo lỗi
            if (!user || !(await bcrypt.compare(password, user.password))) {
                const errorMessage = 'Số điện thoại hoặc mật khẩu không chính xác . Ban ne nhap lai';
                res.status(400).json({ error: errorMessage } );
                // return;
            } else{
                
                    res.status(200).send(user)
            }
           
                
            
           
            
        } catch(err) {
            console.log(err);
            // Handle error and render error page
            // res.render('error', { error: 'An error occurred while logging in' });
        }
    };
}

// tạo ra một đối tượng và gửi ra ngoài 
module.exports = new LoginController;