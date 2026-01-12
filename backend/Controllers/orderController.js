import Order from "../models/orderModel.js";

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentId, orderId } = req.body;
    const userId = req.user.id;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, error: "Items missing" });
    }

    const existing = await Order.findOne({ orderId });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Order already exists",
        order: existing,
      });
    }

    const newOrder = await Order.create({
      userId,
      items: items.map(item => ({
        ...item,
        isRated: false,
      })),
      totalAmount,
      paymentId,
      orderId,
      status: "Paid",
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error("Order create error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).populate("userId", "name email address").sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error("Get my orders error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const rateProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const order = await Order.findOne({ userId, "items.productId": productId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.items.forEach(item => {
      if (item.productId === productId) {
        item.isRated = true;
      }
    });

    await order.save();
    res.status(200).json({ message: "Product rated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

