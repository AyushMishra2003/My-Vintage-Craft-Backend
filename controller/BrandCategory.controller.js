import slugify from 'slugify'
import BrandModel from '../models/Brand.model.js'
import AppError from '../utlis/error.utlis.js'



const addBrandCategory=async(req,res,next)=>{
     try{

        const {brandName}=req.body



        if(!brandName){
              return next(new AppError("Brand Name Required",400))
        }

        const addBrand=await BrandModel.create(
            {
               brandName,
               brandSlug:slugify(brandName, { lower: true, strict: true }),
            }
        )

        if(!addBrand){
            return next(new AppError("Brand Not Added",400))
        }

        res.status(200).json({
          success:true,
          message:"Brand Category Added Succesfully",
          data:addBrand
        })

     }catch(error){
          return next(new AppError(error.message,500))
     }
}


const getBrandCategory=async(req,res,next)=>{
      try{

          const allBrand=await BrandModel.find({})

          if(!allBrand){
               return next(new AppError("Brand Category Not Found",400))
          }

          res.status(200).json({
               success:true,
               message:"Get Brand Category",
               data:allBrand
          })

      }catch(error){
           return next(new AppError(error.message,500))
      }
}

const updateBrandCategory=async(req,res,next)=>{
      try{

          const {id}=req.params

          const {brandName}=req.body

          const validBrand=await BrandModel.findById(id)

          if(!validBrand){
                return next(new AppError("Brand Category Not Found",404))
          }

          if(brandName){
                 validBrand.brandName=brandName
                 validBrand.brandSlug=slugify(brandName)
          }

          await validBrand.save()

          res.status(200).json({
                success:true,
                message:"Brand Category Updated Succesfully",
                data:validBrand
          })



      }catch(error){
           return next(new AppError(error.message,500))
      }
}


const deleteBrandCategory=async(req,res,next)=>{
      try{

          const {id}=req.params

         const deleteBrandCategory=await BrandModel.findByIdAndDelete(id)

         if(!deleteBrandCategory){
           return next(new AppError("Brand Category Not Found",404))
         }
       
         res.status(200).json({
          success:true,
          message:"Brand Category Delete Succesfully"
         })

      }catch(error){
            return next(new AppError(error.message,500))
      }
}

export {
     addBrandCategory,
     getBrandCategory,
     updateBrandCategory,
     deleteBrandCategory
}