import { Router } from "express";
import { addBrandCategory, deleteBrandCategory, getBrandCategory, updateBrandCategory } from "../controller/BrandCategory.controller.js";


const brandRouter=Router()


brandRouter.post("/",addBrandCategory)
brandRouter.get("/",getBrandCategory)
brandRouter.put("/:id",updateBrandCategory)
brandRouter.delete("/:id",deleteBrandCategory)




export default brandRouter