import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, name, price, image, size, quantity, discount } = req.body;


    if (!productId || !name || !price) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const userId = req.user.id;
    const existing = await Cart.findOne({ productId, size, userId });

    if (existing) {
      existing.quantity += quantity || 1;
      await existing.save();
      return res.json({ message: "Quantity updated", cart: existing });
    }

    const newItem = await Cart.create({
      userId,
      productId,
      discount,
      name,
      price,
      image,
      size,
      quantity: quantity || 1,
    });
    console.log("newitem", newItem);

    res.json({ message: "Added to cart", cart: newItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.find({ userId });

    // Populate live prices from Product model
    const cart = await Promise.all(cartItems.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (product) {
        return {
          ...item._doc,
          price: (product.discount > 0 && product.discount < product.price) ? product.discount : product.price,
          originalPrice: product.price,
          isDiscounted: product.discount > 0 && product.discount < product.price
        };
      }
      return item;
    }));

    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.deleteMany({ userId });
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

    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }

    if (action === "increase") item.quantity += 1;
    if (action === "decrease") {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        await Cart.findByIdAndDelete(id);
        return res.json({ message: "Item removed from cart" });
      }
    }

    await item.save();
    res.json({ message: "Quantity updated", item });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removeItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Cart.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to remove this item" });
    }

    await Cart.findByIdAndDelete(id);
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
