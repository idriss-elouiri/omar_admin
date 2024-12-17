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

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // تحديث حالة الطلب
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // يُعيد الطلب المُحدث
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};
