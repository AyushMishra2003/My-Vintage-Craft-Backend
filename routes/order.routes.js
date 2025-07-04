import { Router } from "express";
import { getOrderById, getOrdersByUserId, placeOrder } from "../controller/order.controller.js";


const orderRoute=Router()


orderRoute.post("/",placeOrder)
orderRoute.get("/user/:userId", getOrdersByUserId);
orderRoute.get("/:orderId", getOrderById);


export default orderRoute
