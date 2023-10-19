const multer = require("multer");
// storage đối tượng có hai thuộc tính có  

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'imgProduct/');
      },
    // xác định tên tệp được tải lên 
    filename: function (req, file, cb) {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-') + '-' + Date.now();
        cb(null, fileName + fileExt);
      }
});

module.exports = multer({storage: storage});