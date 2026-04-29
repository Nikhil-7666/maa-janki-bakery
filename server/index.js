import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/connectDB.js";
import dns from "node:dns";
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();
import userRoutes from "./routes/user.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import { connectCloudinary } from "./config/cloudinary.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import OrderRoutes from "./routes/order.routes.js";
import addressRoutes from "./routes/address.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";



const app = express();


connectDB();
connectCloudinary();
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  process.env.FRONTEND_URL
].filter(Boolean);

//middleware
app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    // allow same-origin requests or if in allowed list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(cookieParser());

//Api Endpoints  


const productsPath = path.join(process.cwd(), "products");
app.use("/products", express.static(productsPath));
app.use("/images", express.static(productsPath));
app.use("/uploads", express.static(productsPath));
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", OrderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/recommend", recommendationRoutes);
app.use("/api/chatbot", chatbotRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); })