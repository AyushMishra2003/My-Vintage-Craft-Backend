import slugify from "slugify"
import ProductModel from "../models/product.model.js"
import AppError from "../utlis/error.utlis.js"

import cloudinary from 'cloudinary'
import ProductCategoryModel from "../models/productCategory.model.js"
import BrandModel from "../models/Brand.model.js"
import ThemeModel from "../models/ThemeCategory.model.js"
import mongoose from "mongoose"

const addProduct = async (req, res, next) => {
    try {

        const {
            name,
            rate,
            discount,
            description,
            contact,
            faq,
            productCategory,
            subCategory,
            brandCategory,
            themeCategory,
            categoryType,
            categoryId,
            productId,
            brandId,
            themeId,
            
        } = req.body;



        console.log(req.body);
        

   
        


        if (!name || !rate || !discount) {
            return next(new AppError("Name, Rate and Discount are required", 400));
        }

        let categoryType1 = "";
        let categoryId1 = null;

        let validatedProductId = null;
        let validatedBrandId = null;
        let validatedThemeId = null;

        // ✅ Validate productId (ProductCategory)
      if (productId !== undefined && productId !== null && productId !== '') {
            const productCat = await ProductCategoryModel.findById(productId);
            if (!productCat) return next(new AppError("Invalid Product Category ID", 400));

            // ✅ If subCategory is given, validate it exists within this product category
            if (subCategory && !productCat.subCategory.includes(subCategory)) {
                return next(new AppError("Invalid SubCategory for this Product Category", 400));
            }

            validatedProductId = productId;
        }

        // ✅ Validate brandId
        if (brandId!='undefined' && brandId!==null && brandId!== '') {
            const brandCat = await BrandModel.findById(brandId);
            if (!brandCat) return next(new AppError("Invalid Brand Category ID", 400));
            validatedBrandId = brandId;
        }

        // ✅ Validate themeId
        if (themeId!='undefined' && themeId!==null && themeId!== '') {
            const themeCat = await ThemeModel.findById(themeId);
            if (!themeCat) return next(new AppError("Invalid Theme Category ID", 400));
            validatedThemeId = themeId;
        }

        


        // ✅ Prepare base product data
        const newProduct = new ProductModel({
            title: name,
            rate,
            discount,
            description,
            contact,
            faq,
            slugProduct: slugify(name, { lower: true, strict: true }),
            // categoryType: categoryType1,
            // categoryId: categoryId1,
            subCategory,

            productId: validatedProductId,
            brandId: validatedBrandId,
            themeId: validatedThemeId,
            mainPhoto: {
                public_id: "",
                secure_url: ""
            },
            photos: [],

        });






        // ✅ Upload main photo
        if (req.files?.photo?.[0]) {
            const result = await cloudinary.v2.uploader.upload(req.files.photo[0].path, {
                folder: "Product_Photos/Main"
            });

            newProduct.mainPhoto.public_id = result.public_id;
            newProduct.mainPhoto.secure_url = result.secure_url;
        }


        // ✅ Upload additional photos (multiple images)
        if (req.files?.photos?.length > 0) {
            for (const file of req.files.photos) {
                const uploadResult = await cloudinary.v2.uploader.upload(file.path, {
                    folder: "Product_Photos/Extra"
                });

                newProduct.photos.push({
                    public_id: uploadResult.public_id,
                    secure_url: uploadResult.secure_url
                });
            }
        }


        if (req.files && req.files.photos && req.files.photos.length > 0) {
            for (const photo of req.files.photos) {
                const photoResult = await cloudinary.v2.uploader.upload(photo.path, {
                    folder: 'products/photos', // Cloudinary folder for the additional photos
                });

                newProduct.photos.push({
                    public_id: photoResult.public_id,
                    secure_url: photoResult.secure_url,
                });

            }
        }


        // ✅ Save product
        const savedProduct = await newProduct.save();

        res.status(200).json({
            success: true,
            message: "Product added successfully",
            data: savedProduct,
        });

    } catch (error) {
        console.log(error);

        return next(new AppError(error.message, 500));
    }
};


const getProduct = async (req, res, next) => {
    try {
        let { page, limit } = req.query;

        // Default values if not provided
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        const skip = (page - 1) * limit;

        // Fetch products with pagination
        const products = await ProductModel.find()
            
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // For total count and pages
        const total = await ProductModel.countDocuments();
        const totalPages = Math.ceil(total / limit);

        // res.status(200).json({
        //   page,
        //   limit,
        //   total,
        //   totalPages,
        //   products
        // });
        res.status(200).json({
            success: true,
            message: "All Product are",
            data: {
                products,
                page,
                limit,
                totalPages,
            }
        })

    } catch (error) {
        next(error);
    }
};



const getProductWithBrandCategory=async(req,res,next)=>{
      try{

        const {category}=req.params

        console.log(req.params);
        

        const validBrandCategory=await BrandModel.findOne({brandSlug:category})

        if(!validBrandCategory){
             return next(new AppError("Brand Category is not Valid",400))
        }

        const allProducts=await ProductModel.find({brandId:validBrandCategory?._id})

        if(!allProducts){
             return next(new AppError("Product is not Valid",400))
        }

        

  
        

        res.status(200).json({
             success:true,
             message:"all-brand-category",
             data:allProducts
        })

           

      }catch(error){
        console.log(error);
        
         return next(new AppError(error.message,500))
      }
}



const getProductWithThemeCategory=async(req,res,next)=>{
      try{

        const {category}=req.params

        console.log(req.params);
        

        const validThemeCategory=await ThemeModel.findOne({themeSlug:category})

        if(!validThemeCategory){
             return next(new AppError("Theme Category is not Valid",400))
        }

        const allProducts=await ProductModel.find({themeId:validThemeCategory?._id})

        if(!allProducts){
             return next(new AppError("Product is not Valid",400))
        }

          

        res.status(200).json({
             success:true,
             message:"all-brand-category",
             data:allProducts
        })

           

      }catch(error){
        console.log(error);
        
         return next(new AppError(error.message,500))
      }
}


const getProductWithProductCategory=async(req,res,next)=>{
      try{

        const {category,subCategory}=req.params

    
        

        const validProductCategory=await ProductCategoryModel.findOne({categorySlug:category})

        if(!validProductCategory){
             return next(new AppError("Product Category is not Valid",400))
        }

        const validSubcategory=validProductCategory.subCategory.find((val)=>(slugify(val, { lower: true, strict: true }))===subCategory)

        console.log("valid sub",validSubcategory);
        

        const allProducts=await ProductModel.find({subCategory:validSubcategory})

        if(!allProducts){
             return next(new AppError("Product is not Valid",400))
        }

          

        res.status(200).json({
             success:true,
             message:"all-brand-category",
             data:allProducts
        })

           

      }catch(error){
        console.log(error);
        
         return next(new AppError(error.message,500))
      }
}



const getProductDetail = async (req, res, next) => {
    try {

        const { category } = req.params



        const product = await ProductModel.findOne({slugProduct:category})

      

        if (!product) {
            return next(new AppError("Product not Found", 400))
        }

        res.status(200).json({
            success: true,
            message: "Product Details are:-",
            data: product
        })

    } catch (error) {
        return next(new AppError(error.message, 500))
    }
}

const editProduct = async (req, res, next) => {
    try {
        const {
            name,
            rate,
            discount,
            description,
            contact,
            faq,
            productCategory,
            subCategory,
            brandCategory,
            themeCategory,
            categoryType,
            categoryId,
           productId,
            brandId,
            themeId,
     
        } = req.body;

        const id = req.params.id;


    


        const existingProduct = await ProductModel.findById(id);


      
        
       

        if (!existingProduct) {
            return next(new AppError("Product not found", 404));
        }


         let validatedProductId = null;
        let validatedBrandId = null;
        let validatedThemeId = null;

        // ✅ Validate productId (ProductCategory)
        if (productId && productId!='null') {
            const productCat = await ProductCategoryModel.findById(productId);
            if (!productCat) return next(new AppError("Invalid Product Category ID", 400));

            // ✅ If subCategory is given, validate it exists within this product category
            if (subCategory && !productCat.subCategory.includes(subCategory)) {
                return next(new AppError("Invalid SubCategory for this Product Category", 400));
            }

            validatedProductId = productId;
        }

        // ✅ Validate brandId
        if (brandId && brandId!='null') {
            const brandCat = await BrandModel.findById(brandId);
            if (!brandCat) return next(new AppError("Invalid Brand Category ID", 400));
            validatedBrandId = brandId;
        }

        // ✅ Validate themeId
        if (themeId && themeId!='null') {
            const themeCat = await ThemeModel.findById(themeId);
            if (!themeCat) return next(new AppError("Invalid Theme Category ID", 400));
            validatedThemeId = themeId;
        }

        // ✅ Update base product details
        existingProduct.title = name;
        existingProduct.rate = rate;
        existingProduct.discount = discount;
        existingProduct.description = description;
        existingProduct.contact = contact;
        existingProduct.faq = faq;
        existingProduct.slugProduct = slugify(name, { lower: true, strict: true });

        existingProduct.productId = validatedProductId;
        existingProduct.brandId =  validatedBrandId;
        existingProduct.themeId = validatedThemeId;
        // existingProduct.subCategory = subCategory;

        console.log(req.files);

        // ✅ Replace main photo if new one provided
        if (req.files?.photo?.[0]) {
            if (existingProduct.mainPhoto?.public_id) {
                await cloudinary.v2.uploader.destroy(existingProduct.mainPhoto.public_id);
            }

            const result = await cloudinary.v2.uploader.upload(req.files.photo[0].path, {
                folder: "Product_Photos/Main"
            });

            existingProduct.mainPhoto = {
                public_id: result.public_id,
                secure_url: result.secure_url
            };
        }

        // ✅ Replace additional photos if new ones provided
        if (req.files?.photos?.length > 0) {
            // Delete existing photos from Cloudinary
            for (const photo of existingProduct.photos) {
                await cloudinary.v2.uploader.destroy(photo.public_id);
            }

            existingProduct.photos = [];

            for (const file of req.files.photos) {
                const uploadResult = await cloudinary.v2.uploader.upload(file.path, {
                    folder: "Product_Photos/Extra"
                });

                existingProduct.photos.push({
                    public_id: uploadResult.public_id,
                    secure_url: uploadResult.secure_url
                });
            }
        }

        const updatedProduct = await existingProduct.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });

    } catch (error) {
        console.log(error);
        return next(new AppError(error.message, 500));
    }
};


const seedRepeatedProducts = async () => {
  try {
    // 1. Fetch 2 base products
    const baseProducts = await ProductModel.find().limit(2);

    if (baseProducts.length < 2) {
      return { success: false, message: "Need at least 2 products in DB." };
    }

    // 2. Prepare 30 repeated products
    const repeatedProducts = [];

    for (let i = 0; i < 30; i++) {
      const product = baseProducts[i % 2]; // alternate between 2
      repeatedProducts.push({
        ...product.toObject(),
        _id: undefined, // ensures MongoDB creates new ID
        name: `${product.name} Copy ${i + 1}` // optional: make name unique
      });
    }

    // 3. Insert into DB
    const inserted = await ProductModel.insertMany(repeatedProducts);

    return {
      success: true,
      message: `${inserted.length} products inserted successfully.`,
      data: inserted
    };
  } catch (error) {
    console.error("Seeding error:", error);
    return { success: false, message: "Server error while seeding products." };
  }
};


export {
    addProduct,
    getProduct,
    getProductDetail,
    editProduct,
    seedRepeatedProducts,
    getProductWithBrandCategory,
    getProductWithThemeCategory,
    getProductWithProductCategory
}




