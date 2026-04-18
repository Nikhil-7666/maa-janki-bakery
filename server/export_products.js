import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Product from "./models/product.models.js";

dotenv.config();

const exportProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for export");

        const products = await Product.find({});
        const recommendationDir = path.join(process.cwd(), "recommendation");
        if (!fs.existsSync(recommendationDir)) {
            fs.mkdirSync(recommendationDir);
        }
        const outputPath = path.join(recommendationDir, "products.json");

        fs.writeFileSync(outputPath, JSON.stringify(products, null, 4));
        console.log(`Exported ${products.length} products to ${outputPath}`);

        await mongoose.connection.close();
    } catch (error) {
        console.error("Export failed:", error);
        process.exit(1);
    }
};

exportProducts();
