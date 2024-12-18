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
    price: { type: Number, required: true },
    bestseller: { type: Boolean, default: false },
    imagesByColor: {
      type: Map,
      of: {
        color: { type: String, required: true },
        images: { type: [String], required: true },
      },
      default: {},
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
