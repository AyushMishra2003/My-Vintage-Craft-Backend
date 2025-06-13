import { Router } from "express";
import { addProductCategory, addProductSubCategory, deleteCategory, editCategory, editProductSubCategory, getProductCategory, getProductSubCategory, removeProductSubCategort } from "../controller/productCategory.controller.js";



const productCategoryRouter=Router()


productCategoryRouter.post("/",addProductCategory)
productCategoryRouter.post("/subcategory/:category",addProductSubCategory)
productCategoryRouter.get("/",getProductCategory)
productCategoryRouter.get("/subcategory/:category",getProductSubCategory)
productCategoryRouter.put("/:id",editCategory)
productCategoryRouter.put("/sub/:name",editProductSubCategory)
productCategoryRouter.delete("/:id",deleteCategory)
productCategoryRouter.delete("/sub/:name",removeProductSubCategort)

export default productCategoryRouter