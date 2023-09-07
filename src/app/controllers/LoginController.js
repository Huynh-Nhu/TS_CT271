// const User = require('../models/Users');


class LoginController {

     async login (req,res){
        try {
            const user = await User.findOne({name: req.body.name});
            if (!user){
                res.status(404).json('Wrong username');
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            
            );
            if (!validPassword) {
                 res.status(404).json('Wrong password');

            }
            if(user && validPassword){
            res.status(200).json(User);

            }

            
                
        }
        catch(err){
            res.status(404).json(err.message);
        }
        
        // res.render('login');
        
    }

    
}
 
//tạo ra một đối tượng và gửi ra ngoài 
module.exports = new LoginController;