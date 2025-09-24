const Category = require("../models/Category");
const Tutorial = require("../models/Tutorial");
const { getPagination, getPagingData } = require("../utils/pagination");
module.exports = {
  // GET /api/categories?search=&page=&limit=&sort=createdAt,-name
  list: async (req, res, next) => {
    try {
      const { search = "", page = 1, size = 10, sort = "-createdAt" } = req.query;

      const { limit, offset } = getPagination(page, size);

      const q = search
        ? { name: { $regex: String(search), $options: "i" } }
        : {};

      // Mongoose: count + find + skip/limit
      const [total, rows] = await Promise.all([
        Category.countDocuments(q),
        Category.find(q)
          .sort(sort.split(",").join(" "))
          .skip(offset)
          .limit(limit)
      ]);

      const data = getPagingData({ count: total, rows }, page, limit);
      res.json(data);
    } catch (err) { next(err); }
  },

  // POST /api/categories
  create: async (req, res, next) => {
    try {
      const { name, description } = req.body;
      const doc = await Category.create({ name, description });
      res.status(201).json(doc);
    } catch (err) { next(err); }
  },

  // GET /api/categories/:id
  getById: async (req, res, next) => {
    try {
      const doc = await Category.findById(req.params.id).populate("tutorials");
      if (!doc) return res.status(404).json({ message: "Category not found" });
      res.json(doc);
    } catch (err) { next(err); }
  },

  // PUT /api/categories/:id
  update: async (req, res, next) => {
    try {
      const { name, description } = req.body;
      const doc = await Category.findByIdAndUpdate(
        req.params.id,
        { name, description },
        { new: true, runValidators: true }
      );
      if (!doc) return res.status(404).json({ message: "Category not found" });
      res.json(doc);
    } catch (err) { next(err); }
  },

  // DELETE /api/categories/:id  (xoá kèm tutorials thuộc category)
  remove: async (req, res, next) => {
    try {
      const id = req.params.id;
      const cat = await Category.findById(id);
      if (!cat) return res.status(404).json({ message: "Category not found" });

      await Promise.all([
        Tutorial.deleteMany({ category: id }),
        Category.findByIdAndDelete(id)
      ]);

      res.json({ message: "Deleted category and its tutorials" });
    } catch (err) { next(err); }
  }
};
