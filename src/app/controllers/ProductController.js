const ProductService = require("../services/productService");
const ImageService = require("../services/imageService");
const Image = require("../models/imgModel");
const Cart = require("../models/cartModel");
const CartService = require("../services/cartService");
const Product = require("../models/productModel");
const MongoDB = require("../util/mongodb");
const path = require("path");
const config = require("../config")

class ProductController {
  show(req, res) {
    try {
      const productService = new ProductService(MongoDB.client);
      const listProduct = productService.getAllProduct();
      listProduct.then(function (products) {
        res.send(products);
      });
      listProduct.catch(function (err) {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
    }
  }
  showImage(req, res) {
    try {
      const imageService = new ImageService(MongoDB.client);
      const imageProduct = imageService.getImageProduct();
      imageProduct.then(function (image) {
        res.send(image);
      });
      imageProduct.catch(function (err) {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getOneProduct(req, res) {
    try {
      const productService = new ProductService(MongoDB.client);
      const product = await productService.getOneProduct(req.params.id);
    
      if (product.image) {
        const imageService = new ImageService(MongoDB.client);
        const img = await imageService.getImage(product.image);
        product.imageData = img.name;
      }

      res.send(product);
    } catch (err) {
      console.log(err);
    }
  }

  async update(req, res) {
    if ((Object.keys(req.body).length = 0)) {
      res.send(req.body, { mesaage: "Data to update can not be empty" });
    }
    try {
      const productService = new ProductService(MongoDB.client);
      const document = await productService.updateProduct(
        req.params.id,
        req.body
      );
      // Nếu update sản phẩm thì thay đổi lại trong cart 
      if (document) {
        const cartService = new CartService(MongoDB.client);
        const carts = await cartService.getAll();

        const updatedCarts = []; // tạo mãng rỗng lưu giỏ hàng
        let priceSizes= 0;
        for (const cart of carts) {
          console.log(document.value._id);
          if (cart.idProduct == document.value._id) {
            switch(cart.size){
              case "S":
                priceSizes = document.value.sizeS;
                break;
              case "M":
                priceSizes = document.value.sizeM;
                break;
            }
              console.log(priceSizes);
            const newcart = new Cart({
              idUser: cart.idUser,
              idProduct: document.value._id,
              name: document.value.name,
              image: cart.image,
              size: cart.size,
              quantity: cart.quantity,
              priceSize: priceSizes,
              price: priceSizes * cart.quantity ,
              note: cart.note,
            });
            const updatedCart = await cartService.updateCart(cart._id, newcart);
            updatedCarts.push(updatedCart); // đưa kết quả update vào mãng đã tạo ở trên
          }
        }

        if (updatedCarts.length > 0) {
          console.log("Updated carts:", updatedCarts); // kiểm tra có phần tử naò được cập nhật không , có thì in ra cùng vối danh sách 
        }
      }

      res.send({ message: "Updated product successfully" });
    } catch (err) {
      console.log("loi", err);
    }
  }

  async updateImage(req, res) {
    if ((Object.keys(req.body).length = 0)) {
      res.send(req.body, { mesaage: "Data to update can not be empty" });
    }
    try {
      const productService = new ProductService(MongoDB.client);
      const productId = await productService.getOneProduct(req.params.id); // tìm id sản phẩm
      if (productId) {
        const imgProduct = req.files.image;
        const newImage = new Image({
          _id: productId.image,
          nameProduct: productId,
          name: imgProduct.name,
        });
        const imageService = new ImageService(MongoDB.client);
        const img = await imageService.updateProduct(productId.image, newImage);
       // lưu ảnh vào thư mục
        const filePath =
          config.filePath.product +
          newImage.name;
        imgProduct.mv(filePath); // di chuyển tệp ảnh tới đương dẵn đã định
        res.send({ message: "Success" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async deleteProduct(req, res) {
    try {
      const productService = new ProductService(MongoDB.client);
      const productId = await productService.getOneProduct(req.params.id);
      if(productId){
          const newProduct = new Product({
            ...productId, // sao chép các thuộc tính qua đối tượng mới
            status: false
          })
          const document = await productService.updateProduct(productId._id,newProduct); // cập nhật lại trang thái thay vì xóa trong CSDL
         
      }
      res.send({ mesaage: "Product deleted successfully" });
    } catch (err) {
      console.log(err);
    }
  }
  

  // async addProduct(req, res) {
  //   const imgProduct = req.files;
  //   const newProduct = new Product({
  //     name: req.body.name,
  //     image: imgProduct.image.name,
  //     sizeS: req.body.sizeS,
  //     sizeM: req.body.sizeM,
  //     details: req.body.details, // Fixed typo here
  //   });
  //   console.log(newProduct);
  //   try {
  //     const productService = new ProductService(MongoDB.client);
  //     const result = await productService.addProduct(newProduct);
  //     const filePath = path.join(
  //       "D:/NL_CT27110/project_ct27110/Vue_User/public/img/products/" +
  //         newProduct.image
  //     );
  //     imgProduct.image.mv(filePath);
  //     console.log("Product added successfully");
  //     res.redirect("/product/home");
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).send("There was an error adding the product."); // Provide feedback to the user
  //   }
  // }
}

module.exports = new ProductController();
