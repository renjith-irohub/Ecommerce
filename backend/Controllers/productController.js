import asynchandler from "express-async-handler";
import Product from "../models/productModel.js";
import uploadFromBuffer, { uploadMultipleFromBuffer, deleteFromCloudinary } from "../utils/cloudinaryUpload.js";

export const createProduct = asynchandler(async (req, res) => {
  const { pname, price, category, soldcount, description, instock, discount } = req.body;

  if (!pname || !price || !category || !description || !instock) {
    return res.status(400).json({ message: "These are required fields" });
  }

  let imageUrls = [];
  let cloudinaryIds = [];
  let videoUrl = null;
  let videoCloudinaryId = null;

  // Handle multiple images upload
  if (req.files && req.files.images && req.files.images.length > 0) {
    try {
      const uploadResults = await uploadMultipleFromBuffer(req.files.images, "product_uploads");
      imageUrls = uploadResults.map(result => result.secure_url);
      cloudinaryIds = uploadResults.map(result => result.public_id);
    } catch (error) {
      return res.status(500).json({ message: "Failed to upload images", error: error.message });
    }
  }

  // Handle video upload
  if (req.files && req.files.video && req.files.video.length > 0) {
    try {
      const videoResult = await uploadFromBuffer(req.files.video[0].buffer, "product_videos");
      videoUrl = videoResult.secure_url;
      videoCloudinaryId = videoResult.public_id;
    } catch (error) {
      return res.status(500).json({ message: "Failed to upload video", error: error.message });
    }
  }

  // Set primary image as first image
  const primaryImage = imageUrls[0] || null;
  const primaryCloudinaryId = cloudinaryIds[0] || null;

  const newProduct = await Product.create({
    pname,
    price,
    image: primaryImage,
    images: imageUrls,
    category,
    cloudinary_id: primaryCloudinaryId,
    cloudinary_ids: cloudinaryIds,
    soldcount: soldcount || 0,
    description,
    instock: instock || 0,
    discount: discount || 0,
    video: videoUrl,
    video_cloudinary_id: videoCloudinaryId,
  });

  res.status(201).json({
    message: "Product created successfully!",
    newProduct,
  });
});

export const readproduct = asynchandler(async (req, res) => {
  const { category } = req.query;
  let filter = {};

  if (category && category !== "All") {
    filter.category = category;
  }

  const readproduct = await Product.find(filter);

  if (!readproduct || readproduct.length === 0) {
    return res.status(404).json({ message: "No products found" });
  }

  res.status(200).json({ success: true, readproduct });
});


export const updateProduct = asynchandler(async (req, res) => {
  const { pname, price, category, removeImageIds, description, instock, discount } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Handle image removal
  if (removeImageIds && removeImageIds.length > 0) {
    try {
      // Delete from Cloudinary
      const deletePromises = removeImageIds.map(id => deleteFromCloudinary(id));
      await Promise.all(deletePromises);

      // Remove from product arrays
      product.cloudinary_ids = product.cloudinary_ids.filter(id => !removeImageIds.includes(id));
      product.images = product.images.filter((_, index) =>
        !removeImageIds.includes(product.cloudinary_ids[index])
      );
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete images", error: error.message });
    }
  }

  // Handle new image uploads
  if (req.files && req.files.images && req.files.images.length > 0) {
    try {
      const uploadResults = await uploadMultipleFromBuffer(req.files.images, "product_uploads");
      const newImageUrls = uploadResults.map(result => result.secure_url);
      const newCloudinaryIds = uploadResults.map(result => result.public_id);

      // Append new images to existing arrays
      product.images = [...product.images, ...newImageUrls];
      product.cloudinary_ids = [...product.cloudinary_ids, ...newCloudinaryIds];
    } catch (error) {
      return res.status(500).json({ message: "Failed to upload new images", error: error.message });
    }
  }

  // Handle new video upload
  if (req.files && req.files.video && req.files.video.length > 0) {
    try {
      // Delete old video if exists
      if (product.video_cloudinary_id) {
        await deleteFromCloudinary(product.video_cloudinary_id);
      }
      const videoResult = await uploadFromBuffer(req.files.video[0].buffer, "product_videos");
      product.video = videoResult.secure_url;
      product.video_cloudinary_id = videoResult.public_id;
    } catch (error) {
      return res.status(500).json({ message: "Failed to upload new video", error: error.message });
    }
  }

  // Update primary image (first in array)
  if (product.images.length > 0) {
    product.image = product.images[0];
    product.cloudinary_id = product.cloudinary_ids[0];
  }

  // Update other fields
  if (pname) product.pname = pname;
  if (price) product.price = price;
  if (category) product.category = category;
  if (description) product.description = description;
  if (instock) product.instock = instock;
  if (discount !== undefined) product.discount = discount;

  const updatedProduct = await product.save();

  res.status(200).json({ message: "Product updated", updatedProduct });
});


export const deleteproduct = asynchandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Delete all images from Cloudinary
  if (product.cloudinary_ids && product.cloudinary_ids.length > 0) {
    try {
      const deletePromises = product.cloudinary_ids.map(id => deleteFromCloudinary(id));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting images from Cloudinary:", error);
    }
  }

  // Delete video from Cloudinary
  if (product.video_cloudinary_id) {
    try {
      await deleteFromCloudinary(product.video_cloudinary_id);
    } catch (error) {
      console.error("Error deleting video from Cloudinary:", error);
    }
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "Product deleted successfully" });
});

export const uploadFile = asynchandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const result = await uploadFromBuffer(req.file.buffer, "my_uploads");

  const file = await Product.create({
    filename: req.file.originalname,
    url: result.secure_url,
    cloudinary_id: result.public_id,
  });

  res.status(201).json({
    message: "File uploaded successfully",
    file,
  });
});

export const getProductById = asynchandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json({ success: true, product });
});

export const getAllFiles = asynchandler(async (req, res) => {
  const files = await Product.find();
  res.status(200).json(files);
});
