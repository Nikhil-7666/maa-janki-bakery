
import Interaction from "../models/interaction.model.js";
import Product from "../models/product.models.js";
import fs from "fs";
import path from "path";

// Simple in-memory cache
const cache = {
    similarProducts: {},
    userRecommendations: {},
    cartRecommendations: {},
    expiry: {}
};

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const getFromCache = (type, key) => {
    const entry = cache[type][key];
    if (entry && Date.now() < cache.expiry[type + key]) {
        return entry;
    }
    return null;
};

const setInCache = (type, key, data) => {
    cache[type][key] = data;
    cache.expiry[type + key] = Date.now() + CACHE_DURATION;
};

// Track Interaction
export const trackInteraction = async (req, res) => {
    try {
        const { productId, action } = req.body;
        const userId = req.user?._id || req.user;

        const interaction = new Interaction({
            userId,
            productId,
            action,
        });

        await interaction.save();
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Tracking failed:", error);
        res.status(500).json({ success: false, message: "Tracking failed" });
    }
};

// Get Similar Products (Content-Based)
export const getSimilarProducts = async (req, res) => {
    try {
        const { productId } = req.params;

        const cached = getFromCache("similarProducts", productId);
        if (cached) return res.status(200).json({ success: true, products: cached });

        const matrixPath = path.join("recommendation", "similarity_matrix.json");
        let similarIds = [];

        if (fs.existsSync(matrixPath)) {
            const matrix = JSON.parse(fs.readFileSync(matrixPath, "utf-8"));
            similarIds = matrix[productId] || [];
        }

        let productIds = similarIds.slice(0, 5).map(item => item.id);
        
        // Fallback: If no similar products or fewer than 4, fetch from same category
        if (productIds.length < 4) {
            const currentProduct = await Product.findById(productId);
            if (currentProduct) {
                const categoryProducts = await Product.find({
                    category: currentProduct.category,
                    _id: { $ne: productId, $nin: productIds }
                }).limit(6 - productIds.length);
                
                productIds = [...productIds, ...categoryProducts.map(p => p._id)];
            }
        }

        const products = await Product.find({ _id: { $in: productIds } });

        // Sort products to match similarity order (TF-IDF first, then fallback)
        const sortedProducts = productIds.map(id => products.find(p => p._id.toString() === id.toString())).filter(Boolean);

        setInCache("similarProducts", productId, sortedProducts);
        res.status(200).json({ success: true, products: sortedProducts });
    } catch (error) {
        console.error("Get similar failed:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get Cart Recommendations (Complementary/Content-Based)
export const getCartRecommendations = async (req, res) => {
    try {
        const { productIds } = req.body; // Array of IDs in cart
        if (!productIds || productIds.length === 0) {
            return res.status(200).json({ success: true, products: [] });
        }

        const cacheKey = productIds.sort().join(",");
        const cached = getFromCache("cartRecommendations", cacheKey);
        if (cached) return res.status(200).json({ success: true, products: cached });

        const matrixPath = path.join("recommendation", "similarity_matrix.json");
        const matrix = fs.existsSync(matrixPath) ? JSON.parse(fs.readFileSync(matrixPath, "utf-8")) : {};

        let candidates = {};
        productIds.forEach(pid => {
            const similar = matrix[pid] || [];
            similar.forEach(item => {
                if (!productIds.includes(item.id)) {
                    candidates[item.id] = (candidates[item.id] || 0) + item.score;
                }
            });
        });

        const sortedIds = Object.keys(candidates).sort((a, b) => candidates[b] - candidates[a]).slice(0, 5);
        const products = await Product.find({ _id: { $in: sortedIds } });
        const sortedProducts = sortedIds.map(id => products.find(p => p._id.toString() === id.toString())).filter(Boolean);

        setInCache("cartRecommendations", cacheKey, sortedProducts);
        res.status(200).json({ success: true, products: sortedProducts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get Hybrid User Recommendations
export const getUserRecommendations = async (req, res) => {
    try {
        const userId = req.user?._id || req.user;
        if (!userId) {
            // Cold start: return popular products
            const popular = await Product.find({}).limit(5);
            return res.status(200).json({ success: true, products: popular });
        }

        const cached = getFromCache("userRecommendations", userId);
        if (cached) return res.status(200).json({ success: true, products: cached });

        // Get user interactions
        const interactions = await Interaction.find({ userId }).sort({ timestamp: -1 }).limit(20);
        if (interactions.length === 0) {
            const popular = await Product.find({}).limit(5);
            return res.status(200).json({ success: true, products: popular });
        }

        // Weight interactions
        const weights = { "purchase": 1.0, "add_to_cart": 0.8, "click": 0.4, "view": 0.2 };
        const matrixPath = path.join("recommendation", "similarity_matrix.json");
        const matrix = fs.existsSync(matrixPath) ? JSON.parse(fs.readFileSync(matrixPath, "utf-8")) : {};

        let hybridScores = {};
        
        interactions.forEach(inter => {
            const actionWeight = weights[inter.action] || 0.1;
            const pid = inter.productId.toString();
            
            // Interaction component
            hybridScores[pid] = (hybridScores[pid] || 0) + (actionWeight * 0.4);
            
            // Content component (spreading interest to similar items)
            const similar = matrix[pid] || [];
            similar.forEach(item => {
                hybridScores[item.id] = (hybridScores[item.id] || 0) + (item.score * 0.6 * actionWeight);
            });
        });

        // Filter out items already interacted with (maybe keep them if you want re-purchases)
        // For now, just sort and pick top
        const sortedIds = Object.keys(hybridScores).sort((a, b) => hybridScores[b] - hybridScores[a]).slice(0, 8);
        const products = await Product.find({ _id: { $in: sortedIds } });
        const sortedProducts = sortedIds.map(id => products.find(p => p._id.toString() === id.toString())).filter(Boolean);

        setInCache("userRecommendations", userId, sortedProducts);
        res.status(200).json({ success: true, products: sortedProducts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
