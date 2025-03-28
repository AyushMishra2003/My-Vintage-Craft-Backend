import ProductCategoryModel from '../models/productCategory.model'
import AppError from '../utlis/error.utlis.js'

const addProductCategory=async(req,res,next)=>{
  try{

    const {category}=req.body

    if(!category){
          return next(new AppError("Category is Required",400))
    }

    const addCategory=await ProductCategoryModel.create({
          category
    })


    await addCategory.save()

    res.status(200).json({
        success:true,
        message:"Product Category Added Succesfully",
        data:addCategory
    })


  }catch(error){
      return next(new AppError(error.message,500))
  }
}


const getProductCategory=async(req,res,next)=>{
     try{

        const allProductCategory=await ProductCategoryModel.find({})

        if(!allProductCategory){
             return next(new AppError("Product Category Not Found",400))
        }

        res.status(200).json({
            success:true,
            message:"Product Category Found",
            data:allProductCategory
        })

     }catch(error){
         return next(new AppError(error.message,500))
     }
}


const editCategory=async(req,res,next)=>{
   
  
}