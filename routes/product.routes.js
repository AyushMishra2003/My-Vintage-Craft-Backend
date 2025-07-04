import { Router } from "express";
import upload from "../middleware/multer.middleware.js";
import { addProduct, editProduct, getProduct, getProductDetail, getProductWithBrandCategory, getProductWithProductCategory, getProductWithThemeCategory, seedRepeatedProducts } from "../controller/product.controller.js";


const productRouter=Router()


productRouter.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 1 },            // Main photo
    { name: "photos", maxCount: 10 },          // Multiple additional photos
  ]),
  addProduct
);

productRouter.post("/seed/product",seedRepeatedProducts)
productRouter.get("/",getProduct)
productRouter.get("/brand/:category",getProductWithBrandCategory)
productRouter.get("/theme/:category",getProductWithThemeCategory)
  productRouter.get("/category/:category/:subCategory",getProductWithProductCategory)
productRouter.get("/detail/:category",getProductDetail)
productRouter.put("/:id",  upload.fields([
    { name: "photo", maxCount: 1 },            // Main photo
    { name: "photos", maxCount: 10 },          // Multiple additional photos
  ]),editProduct)


export default productRouter