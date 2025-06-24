import { Router } from "express";
import upload from "../middleware/multer.middleware.js";
import { addProduct, editProduct, getProduct, getProductDetail } from "../controller/product.controller.js";


const productRouter=Router()


productRouter.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 1 },            // Main photo
    { name: "photos", maxCount: 10 },          // Multiple additional photos
  ]),
  addProduct
);
productRouter.get("/",getProduct)
productRouter.get("/detail/:id",getProductDetail)
productRouter.put("/:id",  upload.fields([
    { name: "photo", maxCount: 1 },            // Main photo
    { name: "photos", maxCount: 10 },          // Multiple additional photos
  ]),editProduct)


export default productRouter