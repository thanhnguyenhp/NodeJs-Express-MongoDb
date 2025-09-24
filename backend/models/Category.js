const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

// Virtual để có thể populate tất cả tutorials thuộc category này
categorySchema.virtual("tutorials", {
  ref: "Tutorial",
  localField: "_id",
  foreignField: "category"
});
categorySchema.set("toJSON", { virtuals: true });
categorySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Category", categorySchema);
