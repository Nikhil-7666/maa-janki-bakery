import Order from "../models/order.model.js";
import Product from "../models/product.models.js";
import mongoose from "mongoose";

// Place order COD: /api/order/place

export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address } = req.body;
    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }

    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        amount += product.offerPrice * item.quantity;
      }
    }

    // Add tax charge 5% (consistent with Cart.jsx)
    amount += (amount * 5) / 100;

    await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "COD",
      isPaid: false,
    });

    res
      .status(201)
      .json({ message: "Order placed successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// oredr details for individual user :/api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user;
    let orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    // Manually populate address if it's a string (ID)
    orders = await Promise.all(orders.map(async (order) => {
      if (typeof order.address === 'string' && mongoose.Types.ObjectId.isValid(order.address)) {
        order = order.toObject();
        order.address = await mongoose.model("Address").findById(order.address);
      }
      return order;
    }));

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get all orders for admin :/api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address userId")
      .sort({ createdAt: -1 });

    console.log("Orders API response - Count:", orders.length);
    // Log first order for debugging data structure
    if (orders.length > 0) {
      console.log("First Order Item Product Sample:", orders[0].items[0]?.product ? "Populated" : "Not Populated");
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update order status: /api/order/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    const updateData = { status };
    
    // If status is "Delivered", we can assume it's paid for COD
    if (status === "Delivered") {
        updateData.isPaid = true;
    }

    const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true });
    
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};