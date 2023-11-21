const MongoDB = require("../util/mongodb");
const ConnectService = require("../services/connectService");
const UserService = require("../services/userService");
const config = require("../config")
const Connect = require("../models/connectModel");

class ConnectController {
  // tạo đánh giá cuả khách hàng
  async createConnect(req, res) {
    let fileImages = [];
    let imageNames = [];

    if (req.files) {
      // kiểm tra image có phải là một mảng hay không
      if (Array.isArray(req.files["image[]"])) {
        fileImages = req.files["image[]"];
        // lấy các tên tệp tin gán cho imageNames
        imageNames = fileImages.map((file) => file.name);
      } else {
        fileImages.push(req.files["image[]"]);
        imageNames.push(req.files["image[]"].name);
      }
    } 
    // gán giá trị imageNames nếu rỗng thì gan k có ảnh
    const image = imageNames.length > 0 ? imageNames : 'Không có ảnh được gửi lên';
    const newConnect = new Connect({
      idUser: req.body.idUser,
      comment: req.body.comment,
      image: image,
      dayComment:req.body.dayComment
    });
    const connectService = new ConnectService(MongoDB.client);
    const connect = await connectService.newConnect(newConnect);

    // luu anh vao thu muc
    const filePath =
      config.filePath.comment;
    // Trong mỗi vòng lặp, lấy tệp tin ảnh từ fileImages[i] vào biến imageFile
    // và lấy tên tệp tin từ imageNames[i] vào biến filename.
    for (let i = 0; i < fileImages.length; i++) {
      const imageFile = fileImages[i];
      const filename = imageNames[i];
      //Tạo đường dẫn đích cho tệp tin ảnh bằng cách kết hợp filePath và filename trong biến fileDestPath.
      const fileDestPath = filePath + filename;

      await imageFile.mv(fileDestPath);
    }

    res.send({ message: "gửi thành công" });
  }
  // hiện những đánh giá của khách hàng
  async showConnect(req, res) {
    const connectService = new ConnectService(MongoDB.client);
    const connects = await connectService.getConnectAll();
 
    const connectResult = [];
    for (const connect of connects) {
      const userService = new UserService(MongoDB.client);
      if (connect) {
        const user = await userService.getByIdUser(connect.idUser);
        connectResult.push({
          ...connect,
          userName: user.name,
          phoneUser: user.phone,
        });
      }
    }

    res.send(connectResult);
  }
}

module.exports = new ConnectController();
