import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

// Validation Schema with Yup
const productValidationSchema = Yup.object({
  pname: Yup.string()
    .required("Product name is required")
    .min(3, "Name must be at least 3 characters"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive")
    .min(1, "Price must be at least 1"),
  category: Yup.string()
    .required("Category is required"),
  soldcount: Yup.number()
    .min(0, "Sold count cannot be negative")
    .default(0),
  // File validation
  images: Yup.array()
    .max(5, "Maximum 5 images allowed")
    .test("fileSize", "Each file must be less than 5MB", (files) => {
      if (!files || files.length === 0) return true;
      return files.every(file => file.size <= 5 * 1024 * 1024);
    })
    .test("fileType", "Only JPEG, PNG, and WEBP images are allowed", (files) => {
      if (!files || files.length === 0) return true;
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      return files.every(file => allowedTypes.includes(file.type));
    }),
  discount: Yup.number()
    .min(0, "Discount cannot be negative")
    .test("discountLess", "Discount must be less than original price", function (value) {
      const { price } = this.parent;
      if (value && price) {
        return value < price;
      }
      return true;
    })
});

function ProductEdit() {
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch all products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/v1/product/all");
      return res.data.readproduct;
    }
  });

  // Create Product Mutation
  const createProductMutation = useMutation({
    mutationFn: async (formData) => {
      return axios.post(
        "http://localhost:5000/api/v1/product/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      formik.resetForm();
      resetFileInputs();
      alert("Product created successfully!");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to create product");
    }
  });

  // Update Product Mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      return axios.put(
        `http://localhost:5000/api/v1/product/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      formik.resetForm();
      resetFileInputs();
      setEditingId(null);
      alert("Product updated successfully!");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to update product");
    }
  });

  // Delete Product Mutation
  const deleteProductMutation = useMutation({
    mutationFn: (id) => {
      return axios.delete(
        `http://localhost:5000/api/v1/product/delete/${id}`,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      alert("Product deleted successfully!");
    }
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      pname: "",
      price: "",
      category: "",
      soldcount: 0,
      discount: 0,
      images: []
    },
    validationSchema: productValidationSchema,
    onSubmit: (values) => {
      const formData = new FormData();

      // Append text fields
      formData.append("pname", values.pname);
      formData.append("price", values.price);
      formData.append("category", values.category);
      formData.append("soldcount", values.soldcount);
      formData.append("discount", values.discount);

      // Append multiple image files
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Append video file
      if (selectedVideo) {
        formData.append("video", selectedVideo);
      }

      // Submit based on mode (create or update)
      if (editingId) {
        updateProductMutation.mutate({ id: editingId, formData });
      } else {
        createProductMutation.mutate(formData);
      }
    }
  });

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file count
    if (files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    // Set files for Formik validation
    formik.setFieldValue("images", files);
    setSelectedFiles(files);

    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  // Handle video selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) { // 20MB limit
        alert("Video must be less than 20MB");
        return;
      }
      setSelectedVideo(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Remove specific preview image
  const removePreviewImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);

    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
    formik.setFieldValue("images", newFiles);
  };

  // Reset file inputs
  const resetFileInputs = () => {
    setSelectedFiles([]);
    setPreviewUrls([]);
    setSelectedVideo(null);
    setVideoPreviewUrl("");
    formik.setFieldValue("images", []);
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingId(product._id);
    formik.setValues({
      pname: product.pname,
      price: product.price,
      category: product.category,
      soldcount: product.soldcount || 0,
      discount: product.discount || 0,
      images: []
    });

    // Show existing product images as previews
    if (product.images && product.images.length > 0) {
      setPreviewUrls(product.images);
    } else if (product.image) {
      setPreviewUrls([product.image]);
    }

    // Show existing video as preview
    if (product.video) {
      setVideoPreviewUrl(product.video);
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    formik.resetForm();
    resetFileInputs();
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-center text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Product Management 🛍️
      </h1>

      {/* Product Form */}
      <form onSubmit={formik.handleSubmit} className="bg-white border rounded-2xl p-6 shadow-lg mb-8">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "Update Product" : "Add New Product"}
        </h2>

        <div className="grid gap-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input
              type="text"
              name="pname"
              placeholder="Enter product name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formik.values.pname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.pname && formik.errors.pname && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.pname}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              placeholder="Enter price"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.price && formik.errors.price && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.price}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select category</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
            {formik.touched.category && formik.errors.category && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.category}</p>
            )}
          </div>

          {/* Sold Count */}
          <div>
            <label className="block text-sm font-medium mb-1">Sold Count</label>
            <input
              type="number"
              name="soldcount"
              placeholder="Sold count"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formik.values.soldcount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.soldcount && formik.errors.soldcount && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.soldcount}</p>
            )}
          </div>
          {/* Discount Price */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Discount Price (Sale Price)</label>
              {formik.values.price > 0 && formik.values.discount > 0 && formik.values.discount < formik.values.price && (
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {Math.round(((formik.values.price - formik.values.discount) / formik.values.price) * 100)}% OFF
                </span>
              )}
            </div>
            <input
              type="number"
              name="discount"
              placeholder="Enter discount price (optional)"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formik.values.discount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.discount && formik.errors.discount && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.discount}</p>
            )}
          </div>

          {/* Multiple Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Images (Max 5)
            </label>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: JPEG, PNG, WEBP. Max size: 5MB per image.
            </p>
            {formik.touched.images && formik.errors.images && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.images}</p>
            )}
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Video (Optional)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: MP4, WebM. Max size: 20MB.
            </p>
          </div>

          {/* Video Preview */}
          {videoPreviewUrl && (
            <div className="mt-2">
              <label className="block text-sm font-medium mb-2">Video Preview</label>
              <div className="relative group w-full max-w-md">
                <video
                  src={videoPreviewUrl}
                  controls
                  className="w-full h-auto rounded-lg border-2 border-gray-200"
                />
                {selectedVideo && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVideo(null);
                      setVideoPreviewUrl("");
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Image Previews */}
          {previewUrls.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Image Previews</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    {selectedFiles.length > 0 && (
                      <button
                        type="button"
                        onClick={() => removePreviewImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    )}
                    <p className="text-xs text-center mt-1 text-gray-600">
                      {index === 0 ? "Primary" : `Image ${index + 1}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={createProductMutation.isPending || updateProductMutation.isPending}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createProductMutation.isPending || updateProductMutation.isPending
                ? "Processing..."
                : editingId
                  ? "Update Product"
                  : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 bg-gray-400 text-white py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Products List */}
      <div>
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">All Products</h2>

        {products.length === 0 ? (
          <p className="text-center py-10 text-gray-400">No products found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Product Images */}
                <div className="relative h-48 bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.pname}
                      className="w-full h-full object-cover"
                    />
                  ) : product.image ? (
                    <img
                      src={product.image}
                      alt={product.pname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  {product.images && product.images.length > 1 && (
                    <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      +{product.images.length - 1} more
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">{product.pname}</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-indigo-600 font-bold text-xl">₹{product.discount > 0 ? product.discount : product.price}</p>
                    {product.discount > 0 && (
                      <>
                        <p className="text-gray-400 text-sm line-through">₹{product.price}</p>
                        <span className="text-green-600 text-xs font-bold">({product.discountPercentage}% OFF)</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{product.category}</p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this product?")) {
                          deleteProductMutation.mutate(product._id);
                        }
                      }}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductEdit;
