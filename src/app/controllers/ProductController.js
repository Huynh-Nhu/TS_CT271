const ProductService = require("../services/productService");
const caterogyService = require("../services/caterogyService");
const ImageService = require("../services/imageService");
const Image = require("../models/imgModel");
const Cart = require("../models/cartModel");
const CartService = require("../services/cartService");

const Product = require("../models/productModel");
const MongoDB = require("../util/mongodb");
const path = require("path");
const root = require("app-root-path");
const { log } = require("console");
// const upload = require('../util/upload'); // If you're not using this here, consider removing it.

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

    // res.render('listProduct');
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
      // console.log(product);
      // res.send(product);
      if (product.image) {
        const imageService = new ImageService(MongoDB.client);
        const img = await imageService.getImage(product.image);
        // console.log(img);
        product.imageData = img.name;
      }

      res.send(product);
      // console.log(product);
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
      if (document) {
        const cartService = new CartService(MongoDB.client);
        const carts = await cartService.getAll();
        
        
        const updatedCarts = [];
        let priceSizes= 0;
        for (const cart of carts) {
          console.log(cart);
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
            console.log(newcart);
            const updatedCart = await cartService.updateCart(cart._id, newcart);
            updatedCarts.push(updatedCart);
            console.log(updatedCart);
          }
        }

        if (updatedCarts.length > 0) {
          console.log("Updated carts:", updatedCarts);
        }
      }

      res.send({ message: "Updated product successfully" });
      // }
    } catch (err) {
      console.log("loi", err);
    }
  }

  async updateImage(req, res) {
    if ((Object.keys(req.body).length = 0)) {
      res.send(req.body, { mesaage: "Data to update can not be empty" });
    }

    // console.log("id img",req.params.id);
    try {
      const productService = new ProductService(MongoDB.client);
      const productId = await productService.getOneProduct(req.params.id);
      //  console.log("phhhh",productId.image);
      if (productId) {
        const imgProduct = req.files.image;
        const newImage = new Image({
          _id: productId.image,
          nameProduct: productId,
          name: imgProduct.name,
        });
        const imageService = new ImageService(MongoDB.client);
        const img = await imageService.updateProduct(productId.image, newImage);

        



        
        const filePath =
          "D:/NL_CT27110/project_ct27110/Vue_User/public/img/products/" +
          newImage.name;
        imgProduct.mv(filePath);

        // console.log("Product added successfully");
        res.send({ message: "Success" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  // async deleteProduct(req, res) {
  //   try {
  //     const productService = new ProductService(MongoDB.client);
  //     const productId = await productService.getOneProduct(req.params.id);
  //     if(productId){
  //       const cartService = new CartService(MongoDB.client);
  //       const carts = await cartService.getAll();
  //       for(const cart of carts){
  //         const cartRemove = await cartService.delete(cart._id);
          
  //       }
  //     }

  //     if (productId) {
  //       const imageService = new ImageService(MongoDB.client);
  //       const image = await imageService.deleteImage(productId.image);
  //     }
  //     const deleteProduct = productService.delete(req.params.id);
  //     if (!deleteProduct) {
  //       res.send({ mesaage: "Delete Product not found" });
  //     }
  //     res.send({ mesaage: "Product deleted successfully" });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  async deleteProduct(req, res) {
    try {
      const productService = new ProductService(MongoDB.client);
      const productId = await productService.getOneProduct(req.params.id);
      console.log("lấy all sản phẩm",productId.status);
      if(productId){
        
          
          const newProduct = new Product({
            ...productId,
            status: false
          })
          const document = await productService.updateProduct(productId._id,newProduct);
          console.log(document);
        
      }

      // if (productId) {
      //   const imageService = new ImageService(MongoDB.client);
      //   const image = await imageService.deleteImage(productId.image);
      // }
      // const deleteProduct = productService.delete(req.params.id);
      
      res.send({ mesaage: "Product deleted successfully" });
    } catch (err) {
      console.log(err);
    }
  }
  

  async addProduct(req, res) {
    const imgProduct = req.files;
    // const categoryId = req.params.categoryId
    const newProduct = new Product({
      // category: categoryId,
      name: req.body.name,
      image: imgProduct.image.name,
      sizeS: req.body.sizeS,
      sizeM: req.body.sizeM,
      details: req.body.details, // Fixed typo here
    });
    console.log(newProduct);
    try {
      const productService = new ProductService(MongoDB.client);
      const result = await productService.addProduct(newProduct);
      const filePath = path.join(
        "D:/NL_CT27110/project_ct27110/Vue_User/public/img/products/" +
          newProduct.image
      );
      imgProduct.image.mv(filePath);
      console.log("Product added successfully");
      res.redirect("/product/home");
    } catch (err) {
      console.log(err);
      res.status(500).send("There was an error adding the product."); // Provide feedback to the user
    }
  }
}

module.exports = new ProductController();
