import express from "express";
const cartRouter = express.Router();

import { addToCart, getCart, clearCart, updateQuantity, removeItem } from "../Controllers/cartController.js";
import { protect } from "../Middleware/isAuth.js";

cartRouter.post("/addcart", protect, addToCart);
cartRouter.get("/getcart", protect, getCart);
cartRouter.delete("/clear", protect, clearCart);
cartRouter.put("/update/:id", protect, updateQuantity);
cartRouter.delete("/remove/:id", protect, removeItem);

export default cartRouter;
