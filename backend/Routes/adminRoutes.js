import express from "express";
import { getAdminOrders, updateOrderStatus } from "../Controllers/adminController.js";

const adminRoutes = express.Router();

adminRoutes.get("/fetchadmin", getAdminOrders);
adminRoutes.put("/update-status/:id", updateOrderStatus);

export default adminRoutes;
 