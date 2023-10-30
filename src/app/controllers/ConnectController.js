const MongoDB = require("../util/mongodb");
const ConnectService = require("../services/connectService");
const UserService = require("../services/userService");
const path = require("path");
const Connect = require("../models/connectModel");

class ConnectController {
  async createConnect(req, res) {
    let fileImages = [];
    let imageNames = [];

    if (req.files) {
      if (Array.isArray(req.files["image[]"])) {
        fileImages = req.files["image[]"];
        imageNames = fileImages.map((file) => file.name);
      } else {
        fileImages.push(req.files["image[]"]);
        imageNames.push(req.files["image[]"].name);
      }
    } 
    const image = imageNames.length > 0 ? imageNames : 'Không có ảnh được gửi lên';
    const newConnect = new Connect({
      idUser: req.body.idUser,
      comment: req.body.comment,
      image: image,
      dayComment:req.body.dayComment
    });
    // console.log(newConnect);
    const connectService = new ConnectService(MongoDB.client);
    const connect = await connectService.newConnect(newConnect);

    const filePath =
      "D:/NL_CT27110/project_ct27110/Vue_User/public/img/Comment/";

    for (let i = 0; i < fileImages.length; i++) {
      const imageFile = fileImages[i];
      const filename = imageNames[i];
      const fileDestPath = filePath + filename;

      await imageFile.mv(fileDestPath);
    }

    res.send({ message: "gửi thành công" });
  }

  async showConnect(req, res) {
    const connectService = new ConnectService(MongoDB.client);
    const connects = await connectService.getConnectAll();
    // console.log(connect);
    const connectResult = [];
    for (const connect of connects) {
      // console.log(connect.idUser);
      const userService = new UserService(MongoDB.client);
      if (connect) {
        const user = await userService.getByIdUser(connect.idUser);
        // console.log(user);

        connectResult.push({
          ...connect,
          userName: user.name,
          phoneUser: user.phone,
        });
        // console.log(connectResult);
      }
    }

    res.send(connectResult);
  }
}

module.exports = new ConnectController();
