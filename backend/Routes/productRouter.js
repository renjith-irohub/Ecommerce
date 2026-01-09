import express from "express";
const router = express.Router();
import * as productController from "../Controllers/productController.js";
import upload from "../Middleware/multer.js";
import { protect, authorize } from "../Middleware/isAuth.js";

router.post("/create", protect, authorize("admin"), upload.fields([{ name: "images", maxCount: 5 }, { name: "video", maxCount: 1 }]), productController.createProduct);
router.get("/all", productController.readproduct);
router.put("/update/:id", protect, authorize("admin"), upload.fields([{ name: "images", maxCount: 5 }, { name: "video", maxCount: 1 }]), productController.updateProduct);
router.delete("/delete/:id", protect, authorize("admin"), productController.deleteproduct);
router.get("/:id", productController.getProductById);

router.post("/upload", protect, authorize("admin"), upload.single("file"), productController.uploadFile);
router.get("/files", protect, authorize("admin"), productController.getAllFiles);

export default router;
