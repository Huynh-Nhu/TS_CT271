const ProductService = require("../services/productService");
const caterogyService = require("../services/caterogyService");
const ImageService = require("../services/imageService");
const Image = require("../models/imgModel");

const Product = require("../models/productModel");
const MongoDB = require("../util/mongodb");
const path = require("path");
const root = require("app-root-path");
const { response } = require("express");
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
      console.log(product);
      // res.send(product);
      if (product.image) {
        const imageService = new ImageService(MongoDB.client);
        const img = await imageService.getImage(product.image);
        console.log(img);
        product.imageData= img.name;
      }
      
      res.send(product);
      console.log(product);
    } catch (err) {
      console.log(err);
    }
  }

  async update(req, res) {
    if ((Object.keys(req.body).length = 0)) {
      res.send(req.body, { mesaage: "Data to update can not be empty" });
    }
    try {
      // const categoryService = new caterogyService(MongoDB.client);
      // const categoryId = await categoryService.findById(req.params.id);
      // if (categoryId) {
      const productService = new ProductService(MongoDB.client);
      const document = await productService.updateProduct(
        req.params.id,
        req.body
      );
      res.send({ message: "Updated product successfully" });
      // }
    } catch (err) {
      console.log(err);
    }
  }
  // async getId(req, res) {
  //   const getService = new ImageService(MongoDB.client);
  //   const imageId = await getService.getById(rw);
  //   console.log(imageId);
  // }
  async updateImage(req, res) {
    if ((Object.keys(req.body).length = 0)) {
      res.send(req.body, { mesaage: "Data to update can not be empty" });
    }
    
    console.log("id img",req.params.id);
    try {
      const productService = new ProductService(MongoDB.client);
       const productId =await productService.getOneProduct(req.params.id)
       console.log("phhhh",productId.image);
       if(productId){ 
             const imgProduct = req.files.image;
             const newImage = new Image({
              _id: productId.image,
              nameProduct: productId,
              name: imgProduct.name,
            });
            const imageService = new ImageService(MongoDB.client);
            const img = await imageService.updateProduct(productId.image, newImage);
            console.log(img);
            const filePath =
              "D:/NL_CT27110/project_ct27110/Vue_User/public/img/products/" + newImage.name;
            imgProduct.mv(filePath);
              
            console.log("Product added successfully");
            res.send({ message: "Success" });

          

          
       }
      
    } catch (err) {
      console.log(err);
    }
  }

  async deleteProduct(req, res) {
    try{
      const productService = new ProductService(MongoDB.client);
      const productId =await productService.getOneProduct(req.params.id)
      if(productId){
        const imageService = new ImageService(MongoDB.client);
        const image = await imageService.deleteImage(productId.image)
 
      }
      const deleteProduct = productService.delete(req.params.id);
      if(!deleteProduct){
        res.send({mesaage: "Delete Product not found"});
      }
      res.send({mesaage: "Product deleted successfully"});
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
        "D:/NL_CT27110/project_ct27110/Vue_User/public/img/products/"  + newProduct.image
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
