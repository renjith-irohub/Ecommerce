import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  pname: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    require: true,
  },
  filename: {
    type: String,
  },

  url: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
  cloudinary_ids: {
    type: [String],
    default: [],
  },
  uploadedAt: { type: Date, default: Date.now },


  soldcount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  instock: {
    type: Number,
    default: 0,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  video: {
    type: String,
  },
  video_cloudinary_id: {
    type: String,
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.virtual('discountPercentage').get(function () {
  if (this.price > 0 && this.discount > 0 && this.discount < this.price) {
    return Math.round(((this.price - this.discount) / this.price) * 100);
  }
  return 0;
});

export default mongoose.model("product", productSchema);
