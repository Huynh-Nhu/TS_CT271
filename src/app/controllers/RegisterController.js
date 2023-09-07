const User = require('../models/Users');

class RegisterController {

    registerUser (req,res){
        res.render('regis')

    //     User.find().then((User, err) => {
    //         res.json(User);
    //    })
    //    .catch(() => { res.status(400).json({ error: 'ERROR!!!' }) });

    //     try {
    //         const salt = await bcrypt.getSalt(10);
    //         const hash = await bcrypt.hash(req.body,salt);

    //         // tao user
    //         const newUser = await new User({
    //             name: req.body.name,
    //             phone: req.body.phone,
    //             password: hash
    //         });

    //         // lua trong DB
    //         const user = await newUser.save();
    //         res.status(200).json(User);

    //     }
    //     catch(err){
    //         res.status(404).json(err);
    //     }
        
    }

    
}
 
//tạo ra một đối tượng và gửi ra ngoài 
module.exports = new RegisterController;