import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";


// 📦 Place a new order
export const placeOrder = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      streetAddress,
      apartment,
      city,
      state,
      pincode,
      productIds, // ⬅️ this should be an array of product IDs
    } = req.body;

   console.log(req.body);
   

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ success: false, message: "No products provided" });
    }

    // 🔍 Check if all products exist
    const products = await ProductModel.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return res.status(404).json({
        success: false,
        message: "One or more products not found",
      });
    }

    // 🔍 Find or create user
    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({
        name,
        email,
        phoneNumber: phone,
        orderDetail: [],
      });
    }

    const createdOrders = [];

    for (const product of products) {
      const order = await OrderModel.create({
        name,
        email,
        phone,
        streetAddress,
        apartment,
        city,
        state,
        pincode,
        productId: product._id,
        userId: user._id,
      });

      user.orderDetail.push(order._id);
      createdOrders.push(order);
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: "Orders placed successfully",
      orders: createdOrders,
    });
  } catch (error) {
    console.error("placeMultipleOrders error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




// 📄 Get all orders by userId
export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await OrderModel.find({ userId })
      .populate("productId")
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("getOrdersByUserId error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// 🔍 Get single order by order ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findById(orderId).populate("productId");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("getOrderById error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
