import slugify from "slugify"
import ProductModel from "../models/product.model.js"
import AppError from "../utlis/error.utlis.js"

import cloudinary from 'cloudinary'
import ProductCategoryModel from "../models/productCategory.model.js"

const addProduct = async (req, res, next) => {
    try {

        const { name, rate, discount ,productCategory,brandCategory,themeCategory} = req.body

        if (!name || !rate || !discount) {
            return next(new AppError("All field are Required", 400))
        }

        const validCategory=await ProductCategoryModel.findById()

        const addProduct = await ProductModel.create({
            name,
            rate,
            discount,
            slugProduct: slugify(name, { lower: true, strict: true }),
            photo: {
                public_id: "",
                secure_url: ""
            }
        })



        if (!addProduct) {
            return next(new AppError("Product Not Added", 400))
        }

        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "Category Photo",
            });
            if (result) {
                (addProduct.photo.public_id = result.public_id),
                    (addProduct.photo.secure_url = result.secure_url);
            }
            // fs.rm(`uploads/${req.file.filename}`);

        }

        res.status(200).json({
            success: true,
            message: "Product added Succesfully",
            data: addProduct

        })

    } catch (error) {
        return next(new AppError(error.message, 500))
    }
}


const getProduct=async(req,res,next)=>{
     try{
           
        const allProduct=await ProductModel.find({})

        if(!allProduct){
             return next(new AppError("Product Not Found",400))
        }

        res.status(200).json({
            success:true,
            message:"Product Are:-",
            data:allProduct
        })

     }catch(error){
        return next(new AppError(error.message,500)) 
     }
}


export {
    addProduct,
    getProduct
}




