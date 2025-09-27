const Customer = require("../models/Customer");

const customerController = {
  createCustomer: async (req, res) => {
    try {
      const newCustomer = new Customer(req.body);
      const savedCustomer = await newCustomer.save();
      res.status(201).json(savedCustomer);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getAllCustomers: async (req, res) => {
    try {
      const customers = await Customer.find();
      res.status(200).json(customers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getCustomerById: async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.id);
      if (!customer) return res.status(404).json({ msg: "Không tìm thấy khách hàng" });
      res.status(200).json(customer);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateCustomer: async (req, res) => {
    try {
      const updated = await Customer.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteCustomer: async (req, res) => {
    try {
      await Customer.findByIdAndDelete(req.params.id);
      res.status(200).json({ msg: "Đã xóa khách hàng" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = customerController;
