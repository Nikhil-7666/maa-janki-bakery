import Product from "../models/product.models.js";

// add product :/api/product/add
export const addProduct = async (req, res) => {
  try {
    const { name, price, offerPrice, description, category, isDealOfDay } = req.body;
    // const images = req.files?.map((file) => `/uploads/${file.filename}`);
    const images = req.files?.map((file) => file.filename);
    if (
      !name ||
      !price ||
      !offerPrice ||
      !description ||
      !category ||
      !images ||
      images.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields including images are required",
      });
    }

    const dealFlag = String(isDealOfDay).toLowerCase() === "true";

    // merge into existing product by name+category to avoid duplicates
    const existing = await Product.findOne({ name, category });
    if (existing) {
      existing.price = price;
      existing.offerPrice = offerPrice;
      existing.description = description;
      existing.isDealOfDay = dealFlag;
      existing.images = Array.from(new Set([...(existing.images || []), ...images]));
      const updated = await existing.save();
      return res.status(200).json({
        success: true,
        product: updated,
        message: "Product updated with new images/details",
      });
    }

    const product = new Product({
      name,
      price,
      offerPrice,
      description,
      category,
      isDealOfDay: dealFlag,
      images,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      product: savedProduct,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error in addProduct:", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error while adding product" });
  }
};

// get products :/api/product/get
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// get single product :/api/product/id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// change stock  :/api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, product, message: "Stock updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};