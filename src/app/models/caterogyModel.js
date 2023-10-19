const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    description: "Tên loại sản phẩm",
  },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;