const Tutorial = require("../models/Tutorial");
const Category = require("../models/Category");
const { getPagination, getPagingData } = require("../utils/pagination");
module.exports = {
  // GET /api/tutorials?categoryId=&search=&page=&limit=&sort=-createdAt,title
  list: async (req, res, next) => {
    try {
      const { categoryId, search = "", page = 1, size = 10, sort = "-createdAt" } = req.query;

      const { limit, offset } = getPagination(page, size);

      const q = {};
      if (categoryId) q.category = categoryId.trim();
      if (search) q.title = { $regex: String(search), $options: "i" };

      const [total, rows] = await Promise.all([
        Tutorial.countDocuments(q),
        Tutorial.find(q)
          .populate("category")
          .sort(sort.split(",").join(" "))
          .skip(offset)
          .limit(limit)
      ]);

      const data = getPagingData({ count: total, rows }, page, limit);
      res.json(data);
    } catch (err) { next(err); }
  },

  // POST /api/tutorials
  create: async (req, res, next) => {
    try {
      const { title, content, category } = req.body;

      // đảm bảo category tồn tại
      const cat = await Category.findById(category);
      if (!cat) return res.status(400).json({ message: "Invalid category" });

      const doc = await Tutorial.create({ title, content, category });
      res.status(201).json(doc);
    } catch (err) { next(err); }
  },

  // GET /api/tutorials/:id
  getById: async (req, res, next) => {
    try {
      const doc = await Tutorial.findById(req.params.id).populate("category");
      if (!doc) return res.status(404).json({ message: "Tutorial not found" });
      res.json(doc);
    } catch (err) { next(err); }
  },

  // PUT /api/tutorials/:id
  update: async (req, res, next) => {
    try {
      const { title, content, category } = req.body;
      if (category) {
        const cat = await Category.findById(category);
        if (!cat) return res.status(400).json({ message: "Invalid category" });
      }
      const doc = await Tutorial.findByIdAndUpdate(
        req.params.id,
        { title, content, category },
        { new: true, runValidators: true }
      );
      if (!doc) return res.status(404).json({ message: "Tutorial not found" });
      res.json(doc);
    } catch (err) { next(err); }
  },

  // DELETE /api/tutorials/:id
  remove: async (req, res, next) => {
    try {
      const doc = await Tutorial.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ message: "Tutorial not found" });
      res.json({ message: "Deleted tutorial" });
    } catch (err) { next(err); }
  }
};
