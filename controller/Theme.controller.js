import slugify from 'slugify'
import ThemeModel from '../models/ThemeCategory.model.js'
import AppError from '../utlis/error.utlis.js'
import cloudinary from 'cloudinary'


const addThemeCategory=async(req,res,next)=>{
     try{
     
          const {themeName}=req.body
     
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

          console.log(req.file);
          
          if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
              folder: "Category Photo",
            });
            console.log(result);
            
            if (result) {
              (addThemeCategory.photo.public_id = result.public_id),
                (addThemeCategory.photo.secure_url = result.secure_url);
            }
            // fs.rm(`uploads/${req.file.filename}`);

          }

          await addThemeCategory.save()

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


const getAllThemeCategory=async(req,res,next)=>{
    try{
         const result= await ThemeModel.find();
          if(!result){
            return next(new AppError("Not have any theme Category"));
          }else{
            return res.status(200).json({success:true,message:"All theme",data:result});
          }

    }catch(err){
      return next(new AppError(err.message,500));
    }
}

const themeUpdateCategory=async(req,res,next)=>{
       try{
            const{id}=req.params;
            const{themeName}=req.body
            if(!themeName){
              return next(new AppError("Theme is required",400));
            }
            console.log(id)
            const updateTheme=await ThemeModel.findByIdAndUpdate(id,{
                 themeName,
                 themeSlug:slugify(themeName, { lower: true, strict: true }),
        
            })
            console.log(req.fil);
            
              if(req.file){
                 const result=await cloudinary.v2.uploader.upload(req.file.path,{
                  folder:"Category Photo"
                 })
                 if(result){
                  updateTheme.photo.secure_url=result.secure_url,
                  updateTheme.photo.public_id=result.public_id
                 }
              }
              await updateTheme.save()

              return res.status(200).json({success:true,message:"Theme update succefully",updateTheme})

            // console.log(updateTheme);
       }catch(err){
        return next(new AppError(err.message,500));
       }
}

const delete_them=async(req,res,next)=>{
   try{
         const{id}=req.params
         console.log(id);
         const result=await ThemeModel.findByIdAndDelete(id);
         if(result){
            return res.status(200).json({success:true, message:"Theme delete successfully"})
         }else{
          return res.status(400).json({success:false,message:"Theme all ready delete"});
         }

         console.log(result);
   }catch(err){
     return next(new AppError(err.message,500))
   }
}


export {addThemeCategory,getAllThemeCategory,themeUpdateCategory,delete_them}