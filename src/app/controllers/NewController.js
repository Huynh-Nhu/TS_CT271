
class NewController {

    //[get]/news

    index(req,res){
        res.render('news')
    }

    //[get]   show new biến động

    show(req,res){
        res.send('News deatail!!!')

    }
}
 
//tạo ra một đối tượng và gửi ra ngoài 
module.exports = new NewController;