const User = require('../models/useModel');
const UserService = require('../services/userService');
const MongoDB = require('../util/mongodb');

class UserController {

    ListUsers(req,res){
        try{

            const userService = new UserService(MongoDB.client);
            const listUser = userService.getAllUsers();
            listUser.then(function(users){
                res.send(users);
            });
            listUser.catch(function(err){
                console.log(err);
            })
            
        } catch (err){
            console.log(err);
        }

    }

}

module.exports = new  UserController;
