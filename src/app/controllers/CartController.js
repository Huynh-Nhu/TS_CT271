const MongoDB = require("../util/mongodb");
const CartService = require("../services/cartService");
const Cart = require("../models/cartModel");

class CartController {

  async addCart(req, res) {
    try {
      const {idUser, idProduct, name, image, size, quantity, priceSize, price, note } =
        req.body;

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
    try{
      const cartService = new CartService(MongoDB.client);
      const cart = cartService.getAll();
      cart.then(function(carts){
        res.send(carts);
      });
      cart.catch(function(err){
        console.log(err);
      })

    } catch(err){
      console.log(err);
    }
  }
  async delete(req, res){
    try{
      console.log(req.params.id);
      const cartService = new CartService(MongoDB.client);
      const cart = await cartService.delete(req.params.id);

      // const deleteCart = cartService.delete()
      res.send({message:"Remove successfully"});
    } catch(err){
      console.log(err);
    }
  }
}

module.exports = new CartController();
