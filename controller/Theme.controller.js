import slugify from 'slugify'
import ThemeModel from '../models/ThemeCategory.model.js'
import AppError from '../utlis/error.utlis.js'
import cloudinary from 'cloudinary'
import fs from 'cloudinary'


const addThemeCategory=async(req,res,next)=>{
     try{
         
        console.log("hello boss");
        
          const {themeName}=req.body

          console.log(themeName);
          
           
          if(!themeName){
              return(new AppError("Theme Category Required",400))
          }

          const existanceTheme=await ThemeModel.findOne({themeName})

          console.log(existanceTheme);
          

          if(existanceTheme){
             return next(new AppError("Theme Category are Already Exist",400))
          }

          const addThemeCategory=await ThemeModel.create({
             themeName,
             themeSlug:slugify(themeName, { lower: true, strict: true }),
             photo:{
                 public_id:"",
                 secure_url:""
             }
          })

          

         
          if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
              folder: "Category Photo",
            });
            if (result) {
              (addThemeCategory.photo.public_id = result.public_id),
                (addThemeCategory.photo.secure_url = result.secure_url);
            }
            // fs.rm(`uploads/${req.file.filename}`);

          }

          res.status(200).json({
            success:true,
            message:"Theme Category Added Succesfully",
            data:addThemeCategory
          })
     }catch(error){
        console.log(error);
        
         return next(new AppError(error.message,500))
     }
}





export {addThemeCategory}