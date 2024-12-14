import Order from "./order.model.js";

export const create = async (req, res) => {
  try {
    const { deliveryInfo, cartItems, shippingFee, total, paymentMethod } =
      req.body;

    // Create a new order
    const order = new Order({
      deliveryInfo,
      cartItems,
      shippingFee,
      total,
      paymentMethod,
    });

    await order.save();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const getAll = async (req, res) => {
  try {
    // Fetch orders from the database
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
