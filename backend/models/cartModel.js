import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  quantity: {
    type: Number,
    default: 1
  },

  image: {
    type: String
  },

  
  size: {
    type: String,
   
  }
})

export default mongoose.model("cart", cartSchema)
