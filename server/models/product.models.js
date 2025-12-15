import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true,
  },
  price: {
    type: String, 
    required: true,
  },
  description: {
    type: String, 
    required: true,
  },
  offerPrice: {
    type: String, 
    required: true,
  },
  images: {
    type: Array,  // array of strings for image URLs
    required: true,
  },
  category: {
    type: String, 
    required: true,
  },
  isDealOfDay:{
    type:Boolean,
    default:false,
  },
  inStock: {
    type: Boolean, 
    default: true,   // no need for required if default is set
  },
}, { timestamps: true });  // optional: createdAt & updatedAt

const Product = mongoose.model("Product", productSchema); // capitalized convention
export default Product;
