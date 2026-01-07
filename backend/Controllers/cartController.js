import Cart from "../models/cartModel.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, name, price, image, size, quantity } = req.body;

    if (!productId || !name || !price) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await Cart.findOne({ productId, size });

    if (existing) {
      existing.quantity += quantity || 1;
      await existing.save();
      return res.json({ message: "Quantity updated", cart: existing });
    }

    const newItem = await Cart.create({
      productId,
      name,
      price,
      image,
      size,
      quantity: quantity || 1,
    });

    res.json({ message: "Added to cart", cart: newItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.find();
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany();
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    const item = await Cart.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (action === "increase") item.quantity += 1;
    if (action === "decrease" && item.quantity > 1) item.quantity -= 1;

    await item.save();
    res.json({ message: "Quantity updated", item });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
