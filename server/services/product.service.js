import Product from "../models/product.models.js";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

class ProductService {
  async getAllProducts() {
    return await Product.find({});
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async createProduct(productData) {
    const product = new Product(productData);
    const saved = await product.save();
    this.refreshRecommendations();
    return saved;
  }

  async updateProduct(id, updateData) {
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        product[key] = updateData[key];
      }
    });

    const updated = await product.save();
    this.refreshRecommendations();
    return updated;
  }

  async deleteProduct(id) {
    const product = await Product.findById(id);
    if (product) {
      await this.deleteFiles(product.images);
      await Product.findByIdAndDelete(id);
      this.refreshRecommendations();
      return product;
    }
    return null;
  }

  async toggleStock(id, inStock) {
    return await Product.findByIdAndUpdate(id, { inStock }, { new: true });
  }

  async searchProducts(query) {
    if (!query) return [];
    const products = await this.getAllProducts();
    
    const Fuse = (await import("fuse.js")).default;
    const fuse = new Fuse(products, {
      keys: ["name", "category"],
      threshold: 0.4, // Adjust for fuzziness (0 is exact, 1 is anything)
      includeScore: true
    });

    const results = fuse.search(query);
    return results.map(result => result.item);
  }

  async deleteFiles(filenames) {
    if (!filenames || !Array.isArray(filenames)) return;
    
    filenames.forEach(filename => {
      const filePath = path.join(process.cwd(), "products", filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted file: ${filename}`);
        } catch (err) {
          console.error(`Error deleting file ${filename}:`, err);
        }
      }
    });
  }

  refreshRecommendations() {
    const exportScript = path.join(process.cwd(), "export_products.js");
    const tfidfScript = path.join(process.cwd(), "recommendation", "tfidf_engine.py");

    console.log("Refreshing recommendations...");
    const exporter = spawn("node", [exportScript]);

    exporter.on("close", (code) => {
      if (code === 0) {
        const engine = spawn("python", [tfidfScript]);
        engine.on("close", (engineCode) => {
          if (engineCode === 0) {
            console.log("Similarity matrix updated successfully.");
          }
        });
      }
    });
  }
}

export default new ProductService();
