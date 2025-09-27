const Product = require("../models/Products");

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

  // Lấy danh sách sản phẩm (có lọc theo category, search)
  getAllProducts: async (req, res) => {
    try {
      const { categoryId, search } = req.query;
      let filter = {};
      if (categoryId) filter.category = categoryId;
      if (search) filter.name = { $regex: search, $options: "i" };

      const products = await Product.find(filter).populate("category");
      res.status(200).json(products);
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
  }
};

module.exports = productController;
