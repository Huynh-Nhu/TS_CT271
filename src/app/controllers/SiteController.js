
class SiteController {

    //[get]/home

    home(req,res){
        res.render('home');
    }
    // show(req,res){
    //     res.render('regis')
    // }
   
    
}
 
//tạo ra một đối tượng và gửi ra ngoài 
module.exports = new SiteController;