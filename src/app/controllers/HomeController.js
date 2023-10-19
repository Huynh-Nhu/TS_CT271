
class HomeController {

    //[get]/home

    home(req,res){
        res.render('login');
    }
    addhome(req,res){
        res.render('home');
    }
}
 
//tạo ra một đối tượng và gửi ra ngoài 
module.exports = new HomeController;