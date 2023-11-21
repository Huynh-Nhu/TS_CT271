const MongoDB = require("../util/mongodb");
const CartService = require("../services/cartService");
const ProductService = require("../services/productService");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");


class CartController {
  async addCart(req, res) {
    try {
      const {
        idUser,
        idProduct,
        name,
        image,
        size,
        quantity,
        priceSize,
        price,
        note,
      } = req.body;

      const newCart = new Cart({
        idUser,
        idProduct,
        name,
        image,
        size,
        quantity,
        priceSize,
        price,
        note,
      });
      const cartService = new CartService(MongoDB.client);
      const cart = await cartService.addCart(newCart);
      res.send(cart);
    } catch (err) {
      console.log(err);
    }
  }
  async showCart(req, res) {
    try {
      const cartService = new CartService(MongoDB.client);
      const cart = await cartService.getAll();
  
      const productService = new ProductService(MongoDB.client);
      const products = {}; // Khởi tạo đối tượng trống để lưu trữ thông tin sản phẩm
  
      const updatedCart = await Promise.all(
        cart.map(async function (cartItem) {
          if (!products[cartItem.idProduct]) {
            // Kiểm tra xem thông tin sản phẩm đã được lấy chưa
            const product = await productService.getOneProduct(cartItem.idProduct);
            products[cartItem.idProduct] = product; // Lưu trữ thông tin sản phẩm
          }
  
          const updatedCartItem = {
            ...cartItem,
            status: products[cartItem.idProduct].status, // Gán thuộc tính "status" từ sản phẩm tương ứng
          };
  
          return updatedCartItem;
        })
      );
      res.send(updatedCart);
    } catch (err) {
      console.log(err);
    }
  }

  async delete(req, res) {
    try {
      console.log(req.params.id);
      const cartService = new CartService(MongoDB.client);
      const cart = await cartService.delete(req.params.id);
      res.send({ message: "Remove successfully" });
    } catch (err) {
      console.log(err);
    }
  }
  async deleteAll(req, res) {
    try {
      const cartService = new CartService(MongoDB.client);
      const cart = await cartService.deleteAllCart(req.params.id);
      res.send({ message: "Remove successfully" });
    } catch (err) {
      console.log(err);
    }
  }
  async updateCart(req, res) {
    const cartService = new CartService(MongoDB.client);
    const cart = await cartService.updateCart(req.params.id, req.body);
    res.send(cart);
  }
}

module.exports = new CartController();
