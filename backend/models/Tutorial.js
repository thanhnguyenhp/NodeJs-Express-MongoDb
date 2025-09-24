const mongoose = require("mongoose");

const tutorialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tutorial", tutorialSchema);
