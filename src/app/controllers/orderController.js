const OrderService = require("../services/orderService");
const OrderDetailService = require("../services/orderDetailService");
const Order = require("../models/orderModel");
const OrderDetail = require("../models/orderDetail");
const UserService = require("../services/userService");
// const Product = require("../models/productModel");
const ProductService = require("../services/productService");
const MongoDB = require("../util/mongodb");
const ImageService = require("../services/imageService");

const { response } = require("express");

class OrderController {
  async addOrder(req, res) {
    try {
      const { idUser, dayOrder, status, orderDetails } = req.body;
      const orderDetailsArray = Array.isArray(orderDetails)
        ? orderDetails
        : [orderDetails];

      const newOrder = new Order({
        idUser,
        dayOrder,
        status,
      });
      const orderService = new OrderService(MongoDB.client);
      const order = await orderService.create(newOrder);
      console.log(order);

      for (const orderDetail of orderDetailsArray) {
        const { idProduct, quantityProduct, priceAll, localUser, note } =
          orderDetail;
        const newOrderDetail = new OrderDetail({
          idOrder: order.value._id,
          idProduct,
          quantityProduct,
          priceAll,
          localUser,
          note,
        });
        const orderDetailService = new OrderDetailService(MongoDB.client);
        await orderDetailService.create(newOrderDetail);
      }
      res.status(200).json({ message: "success" });
    } catch (err) {
      console.log(err);
    }
  }
  async showOrder(req, res) {
    try {
      const orderService = new OrderService(MongoDB.client);
      const orders = await orderService.getAllOrder();
      // const  user =

      const orderData = [];
      for (const order of orders) {
        const userService = new UserService(MongoDB.client);
        const user = await userService.getByIdUser(order.idUser);

        const orderDetailService = new OrderDetailService(MongoDB.client);
        const orderDetail = await orderDetailService.getAllOrderDetail();

        const matchingOrderDetails = [];
        for (const detail of orderDetail) {
          if (detail.idOrder.toString() === order._id.toString()) {
            const productService = new ProductService(MongoDB.client);
            const product = await productService.getOneProduct(
              detail.idProduct
            );

            matchingOrderDetails.push({
              ...detail,
              product,
            });
            // console.log(matchingOrderDetails);
          }
        }
        // console.log(user);
        orderData.push({
          order: order,
          user: user,
          orderDetail: matchingOrderDetails,
        });
        // console.log(orderData);
      }

      res.send(orderData);
    } catch (err) {
      console.log(err);
    }
  }
  async update(req, res) {
    if ((Object.keys(req.body).length = 0)) {
      res.send(req.body, { mesaage: "Data to update can not be empty" });
    }
    try {
      // const {status} = req.body
      const orderService = new OrderService(MongoDB.client);
      const document = await orderService.updateOrder(req.params.id, req.body);
      res.send(document);
      // }
    } catch (err) {
      console.log(err);
    }
  }
  async showProductOrder(req, res) {
    try { 
      const productService = new ProductService(MongoDB.client);
      const product = await productService.getOneProduct(req.params.id);
      // console.log("prodct",product);
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
}

module.exports = new OrderController();
