const Product = require("../models/Products");
const { getPagination, getPagingData } = require("../utils/pagination");

const productController = {
  // Tạo sản phẩm
  createProduct: async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  // Lấy 1 sản phẩm
  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate("category");
      if (!product) return res.status(404).json({ msg: "Không tìm thấy sản phẩm" });
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Cập nhật
  updateProduct: async (req, res) => {
    try {
      const updated = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Xóa
  deleteProduct: async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json({ msg: "Đã xóa sản phẩm" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Lấy danh sách sản phẩm có phân trang, lọc, tìm kiếm
  getAllProducts: async (req, res) => {
    try {
      const { page = 1, size = 10, search = "", minPrice, maxPrice, category } = req.query;
      const { limit, offset } = getPagination(page, size);

      const filter = {};

      if (search) {
        filter.name = { $regex: search, $options: "i" };
      }

      if (category) {
        filter.category = category;
      }

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
      }

      const [count, rows] = await Promise.all([
        Product.countDocuments(filter),
        Product.find(filter)
          .populate("category")
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

module.exports = productController;
