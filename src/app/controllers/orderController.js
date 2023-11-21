const OrderService = require("../services/orderService");
const OrderDetailService = require("../services/orderDetailService");
const Order = require("../models/orderModel");
const OrderDetail = require("../models/orderDetail");
const UserService = require("../services/userService");
const ProductService = require("../services/productService");
const MongoDB = require("../util/mongodb");
const ImageService = require("../services/imageService");
class OrderController {

  // tạo 1 hóa đơn
  async addOrder(req, res) {
    try {
      const { idUser, dayOrder, status, orderDetails } = req.body;
      // kiểm tra xem orderDetail có phải là một mảng không nếu k phải thì tạo 1 mãng mới và gán cho biến 
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
      for (const orderDetail of orderDetailsArray) {
        // trích xuất các thuộc tính từ mỗi phần tử orderDetailsArray.
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
  // hiện hóa đợn
  async showOrder(req, res) {
    try {
      const orderService = new OrderService(MongoDB.client);
      const orders = await orderService.getAllOrder();
      const orderData = [];
      for (const order of orders) {
        const userService = new UserService(MongoDB.client);
        const user = await userService.getByIdUser(order.idUser);

        const orderDetailService = new OrderDetailService(MongoDB.client);
        const orderDetail = await orderDetailService.getAllOrderDetail();
        // Tạo một mảng rỗng matchingOrderDetails để chứa các chi tiết đơn hàng tương ứng với đơn hàng hiện tại.
        const matchingOrderDetails = [];
        for (const detail of orderDetail) {
          // 
          if (detail.idOrder.toString() === order._id?.toString()) {
            const productService = new ProductService(MongoDB.client);
            const product = await productService.getOneProduct(
              detail.idProduct
            );
            // thêm đối tượng mới vào mảng
            matchingOrderDetails.push({
              ...detail,
              product,
            });
          }
        }
        orderData.push({
          order: order,
          user: user,
          orderDetail: matchingOrderDetails,
        });
      }

      res.send(orderData);
    } catch (err) {
      console.log(err);
    }
  }
  // xác nhận đơn 
  async update(req, res) {
    if ((Object.keys(req.body).length = 0)) {
      res.send(req.body, { mesaage: "Data to update can not be empty" });
    }
    try {
      const orderService = new OrderService(MongoDB.client);
      // Cập nhật lại trạng thái đơn hàng khi bấm xác nhận và thời gian
      const document = await orderService.updateOrder(req.params.id, req.body);
      res.send(document);
      
    } catch (err) {
      console.log(err);
    }
  }
  // hiện những sản phẩm của hóa đơn 
  async showProductOrder(req, res) {
    try { 
      const productService = new ProductService(MongoDB.client);
      const product = await productService.getOneProduct(req.params.id);
      if (product.image) {
        const imageService = new ImageService(MongoDB.client);
        const img = await imageService.getImage(product.image);
        console.log(img);
        product.imageData= img.name;
      }
      res.send(product);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new OrderController();
