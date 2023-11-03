const caterogyService = require("../services/caterogyService");
const ProductService = require("../services/productService");
const ImageService = require("../services/imageService");
const Product = require("../models/productModel");
const Image = require("../models/imgModel");
const root = require("app-root-path");
const path = require("path");

const category = require("../models/caterogyModel");
const MongoDB = require("../util/mongodb");
const { log } = require("console");

class categoryController {
  show(req, res) {
    try {
      const categoryService = new caterogyService(MongoDB.client);
      const listCategories = categoryService.getAllCategory();
      listCategories.then(function (categories) {
        res.send(categories);
        // console.log(categories);
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
      // const categoryName = await categoryService.findByName(idCategories)
      res.send(idCategories);
      console.log(idCategories);
    } catch (err) {
      console.log(err);
    }
  }

  async create(req, res) {
    var message = [];
    const img = req.files.img;
    console.log(img);
    try {
      const newCategory = new category({
        name: req.body.name,
        img: img.name,
      });
      console.log(newCategory);
      if (newCategory.name === "") {
        message = "Vui lòng nhập tên loại sản phẩm";
        res.send(message);
      } else {
        const categoryService = new caterogyService(MongoDB.client);
        const caterogyExists = await categoryService.findByName(
          newCategory.name
        );

        console.log(caterogyExists);
        if (caterogyExists) {
          message = "da co loai san pham trong";
          res.send(message);
        } else {
          const result = await categoryService.addCate(newCategory);
          console.log(result);
          message = "Them loai san pham moi thanh cong";
          res.send(message);
          const filePath =
            "D:/NL_CT27110/project_ct27110/Vue_User/public/img/products/" +
            img.name;
          img.mv(filePath);
        }
        // res.send(result);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async addProduct(req, res) {
    try {
      const categoryService = new caterogyService(MongoDB.client);
      const categoryId = await categoryService.findById(req.params.id);
      // console.log(req.body);
      const imgProduct = req.files.image;
      // console.log("abc: ", imgProduct.name);

      if (categoryId) {
        const newProduct = new Product({
          category: categoryId,
          name: req.body.name,
          image: req.body.image,
          sizeS: req.body.sizeS,
          sizeM: req.body.sizeM,
          details: req.body.details,
        });
        // console.log("newproduct ", newProduct._id);

        const productService = new ProductService(MongoDB.client);
        const result = await productService.addProduct(newProduct);
        // console.log("id", result.value._id);
        const filePath =
          "D:/NL_CT27110/project_ct27110/Vue_User/public/img/products/" +
          imgProduct.name;
        imgProduct.mv(filePath);
        if (result.value._id) {
          const newImage = new Image({
            nameProduct: result.value._id,
            name: imgProduct.name,
          });
          const imageService = new ImageService(MongoDB.client);
          const img = await imageService.create(newImage);
          // console.log(img.value);

          newProduct.image = img.value._id;
          await productService.updateProduct(result.value._id, newProduct);
        }

        console.log("Product added successfully");
        res.send({ message: "Success" });
      } else {
        res.status(404).json({ message: "khong co loai san pham nay" });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = new categoryController();
