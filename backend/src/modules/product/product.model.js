import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  color: { type: String, required: true },
  urls: [{ type: String, required: true }],
});

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    price: { type: Number, required: true },
    sizes: [
      { type: String, enum: ["SM", "MD", "LG", "XL", "XXL"], default: [] },
    ],
    bestseller: { type: Boolean, default: false },
    imagesByColor: [ImageSchema],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
