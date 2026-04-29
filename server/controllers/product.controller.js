import productService from "../services/product.service.js";
import { v2 as cloudinary } from "cloudinary";

// Helper: upload a single file buffer to Cloudinary, returns secure_url
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "maa-janki-bakery/products" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(file.buffer);
  });
};

// add product :/api/product/add
export const addProduct = async (req, res) => {
  try {
    const { name, price, offerPrice, description, category, isDealOfDay, tags, stock, stockThreshold } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "All fields including images are required" });
    }

    // Upload all images to Cloudinary
    const images = await Promise.all(req.files.map(uploadToCloudinary));

    if (!name || !price || !offerPrice || !description || !category || !images || images.length === 0) {
      return res.status(400).json({ success: false, message: "All fields including images are required" });
    }

    const dealFlag = String(isDealOfDay).toLowerCase() === "true";
    const tagList = Array.isArray(tags) ? tags : (tags ? tags.split(",").map(t => t.trim()) : []);

    const product = await productService.createProduct({
      name,
      price,
      offerPrice,
      description,
      category,
      isDealOfDay: dealFlag,
      images,
      tags: tagList,
      stock: stock ? Number(stock) : 0,
      stockThreshold: stockThreshold ? Number(stockThreshold) : 10
    });

    return res.status(201).json({ success: true, product, message: "Product added successfully" });
  } catch (error) {
    console.error("Error in addProduct:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// update product :/api/product/update/:id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, offerPrice, description, category, isDealOfDay, inStock, tags, keepImages, stock, stockThreshold } = req.body;

    // Upload any newly added images to Cloudinary
    const newImages = req.files && req.files.length > 0
      ? await Promise.all(req.files.map(uploadToCloudinary))
      : [];

    const product = await productService.getProductById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const updateData = {};
    if (name) updateData.name = name;
    if (price) updateData.price = price;
    if (offerPrice) updateData.offerPrice = offerPrice;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (isDealOfDay !== undefined) updateData.isDealOfDay = String(isDealOfDay).toLowerCase() === "true";
    if (inStock !== undefined) updateData.inStock = String(inStock).toLowerCase() === "true";
    if (stock !== undefined) updateData.stock = Number(stock);
    if (stockThreshold !== undefined) updateData.stockThreshold = Number(stockThreshold);
    
    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags) ? tags : (tags ? tags.split(",").map(t => t.trim()) : []);
    }

    // Image logic: keepImages (existing Cloudinary URLs to retain) + newImages
    let imagesToKeep = [];
    if (keepImages) {
        try {
            imagesToKeep = JSON.parse(keepImages);
        } catch (e) {
            imagesToKeep = Array.isArray(keepImages) ? keepImages : [keepImages];
        }
    }

    // Identify removed Cloudinary URLs for cleanup
    const removedImages = product.images.filter(img => !imagesToKeep.includes(img));
    
    updateData.images = [...imagesToKeep, ...newImages];

    const updatedProduct = await productService.updateProduct(id, updateData);
    
    // Delete removed images from Cloudinary
    if (removedImages.length > 0) {
        await productService.deleteFiles(removedImages);
    }

    res.status(200).json({ success: true, message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// delete product :/api/product/delete/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await productService.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// get products :/api/product/get
export const getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// get single product :/api/product/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// change stock :/api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await productService.toggleStock(id, inStock);
    res.status(200).json({ success: true, product, message: "Stock updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// search products :/api/products/search?q=...
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json({ success: true, products: [] });
    const products = await productService.searchProducts(q);
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};