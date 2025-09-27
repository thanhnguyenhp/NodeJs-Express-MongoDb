const Order = require("../models/Order");
const Product = require("../models/Products");
const { getPagination, getPagingData } = require("../utils/pagination");

const orderController = {
    // Tạo đơn hàng
  createOrder: async (req, res) => {
    try {
      const { customer, products } = req.body;

      // Tính tổng tiền
      let totalAmount = 0;
      for (const item of products) {
        const product = await Product.findById(item.product);
        if (product) {
          totalAmount += product.price * item.quantity;
        }
      }

      const newOrder = new Order({
        customer,
        products,
        totalAmount,
        status: "Pending"
      });

      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
    // Lấy 1 đơn hàng
  getOrderById: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate("customer").populate("products.product");
      if (!order) return res.status(404).json({ msg: "Không tìm thấy đơn hàng" });
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (req, res) => {
    try {
      const updated = await Order.findByIdAndUpdate(
        req.params.id,
        { $set: { status: req.body.status } },
        { new: true }
      );
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

    // Xóa đơn hàng
  deleteOrder: async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res.status(200).json({ msg: "Đã xóa đơn hàng" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

    // Lấy đơn hàng với phân trang và lọc
   getAllOrders: async (req, res) => {
    try {
      const { page = 1, size = 10, status, customer, fromDate, toDate } = req.query;
      const { limit, offset } = getPagination(page, size);

      const filter = {};

      if (status) filter.status = status;
      if (customer) filter.customer = customer;

      if (fromDate || toDate) {
        filter.createdAt = {};
        if (fromDate) filter.createdAt.$gte = new Date(fromDate);
        if (toDate) filter.createdAt.$lte = new Date(toDate);
      }

      const [count, rows] = await Promise.all([
        Order.countDocuments(filter),
        Order.find(filter)
          .populate("customer")
          .populate("products.product")
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
      ]);

      const response = getPagingData({ count, rows }, page, limit);
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = orderController;
