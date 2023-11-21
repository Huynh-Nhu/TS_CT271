const caterogyService = require("../services/categoryService");
const ProductService = require("../services/productService");
const ImageService = require("../services/imageService");
const Product = require("../models/productModel");
const Image = require("../models/imgModel");
const config = require("../config");
const category = require("../models/categoryModel");
const MongoDB = require("../util/mongodb");

class categoryController {
  // hiện danh sách các loại sản phẩm
  show(req, res) {
    try {
      const categoryService = new caterogyService(MongoDB.client);
      const listCategories = categoryService.getAllCategory();
      listCategories.then(function (categories) {
        res.send(categories);
      });
      listCategories.catch(function (err) {
        res.send(err);
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getId(req, res) {
    try {
      const categoryService = new caterogyService(MongoDB.client);
      const idCategories = await categoryService.findById(req.params.id);
      res.send(idCategories);
    } catch (err) {
      console.log(err);
    }
  }
  // tạo một loại sản phẩm mới
  async create(req, res) {
    var message = [];
    const img = req.files.img;
    try {
      const newCategory = new category({
        name: req.body.name,
        img: img.name,
      });
      if (newCategory.name === "") {
        message = "Vui lòng nhập tên loại sản phẩm";
        res.send(message);
      } else {
        const categoryService = new caterogyService(MongoDB.client);
        const caterogyExists = await categoryService.findByName(
          newCategory.name
        );
        if (caterogyExists) {
          message = "Đã có loại sản phẩm này";
          res.send(message);
        } else {
          const result = await categoryService.addCate(newCategory);
          message = "Them loai san pham moi thanh cong";
          res.send(message);
          const filePath = config.filePath.product + img.name;
          img.mv(filePath);
        }
        res.send(result);
      }
    } catch (err) {
      console.log(err);
    }
  }
  // thêm sản phẩm theo loại
  async addProduct(req, res) {
    var message = "";
    try {
      const categoryService = new caterogyService(MongoDB.client);
      const categoryId = await categoryService.findById(req.params.id);
      const imgProduct = req.files.image;
      if (categoryId) {
        const newProduct = new Product({
          category: categoryId,
          name: req.body.name,
          image: req.body.image,
          sizeS: req.body.sizeS,
          sizeM: req.body.sizeM,
          details: req.body.details,
        });
        const productService = new ProductService(MongoDB.client);
        const result = await productService.addProduct(newProduct);
        const filePath = config.filePath.product + imgProduct.name;
        imgProduct.mv(filePath);
        if (result.value._id) {
          const newImage = new Image({
            nameProduct: result.value._id,
            name: imgProduct.name,
          });
          // cập nhật lại hình ảnh sau khi thêm sản phâm
          const imageService = new ImageService(MongoDB.client);
          const img = await imageService.create(newImage);
          newProduct.image = img.value._id;
          await productService.updateProduct(result.value._id, newProduct);
        }
        message = "Thêm sản phẩm tành công";
        res.send(message);
      } else {
        res.status(404).json({ message: "khong co loai san pham nay" });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = new categoryController();
