// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    deliveryInfo: {
      firstName: String,
      lastName: String,
      email: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
      phone: String,
    },
    cartItems: [
      {
        id: String,
        title: String,
        price: Number,
      },
    ],
    shippingFee: Number,
    total: Number,
    paymentMethod: String,
    status: {
      type: String,
      default: "pending", // Can be 'pending', 'paid', etc.
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
