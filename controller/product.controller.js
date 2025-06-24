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
        if (productId) {
            const productCat = await ProductCategoryModel.findById(productId);
            if (!productCat) return next(new AppError("Invalid Product Category ID", 400));

            // ✅ If subCategory is given, validate it exists within this product category
            if (subCategory && !productCat.subCategory.includes(subCategory)) {
                return next(new AppError("Invalid SubCategory for this Product Category", 400));
            }

            validatedProductId = productId;
        }

        // ✅ Validate brandId
        if (brandId) {
            const brandCat = await BrandModel.findById(brandId);
            if (!brandCat) return next(new AppError("Invalid Brand Category ID", 400));
            validatedBrandId = brandId;
        }

        // ✅ Validate themeId
        if (themeId) {
            const themeCat = await ThemeModel.findById(themeId);
            if (!themeCat) return next(new AppError("Invalid Theme Category ID", 400));
            validatedThemeId = themeId;
        }

        console.log("valid is", validatedProductId, validatedBrandId, validatedThemeId);


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

            productId: validatedProductId,
            brandId: validatedBrandId,
            themeId: validatedThemeId,
            mainPhoto: {
                public_id: "",
                secure_url: ""
            },
            photos: [],

        });



        console.log(req.files);


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
            .select("title mainPhoto rate  discount isStockFull categoryType  categoryId") // only send title and photo
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


const getProductDetail = async (req, res, next) => {
    try {

        const { id } = req.params

        const product = await ProductModel.findById(id)

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

        console.log(existingProduct);

        if (!existingProduct) {
            return next(new AppError("Product not found", 404));
        }


         let validatedProductId = null;
        let validatedBrandId = null;
        let validatedThemeId = null;

        // ✅ Validate productId (ProductCategory)
        if (productId) {
            const productCat = await ProductCategoryModel.findById(productId);
            if (!productCat) return next(new AppError("Invalid Product Category ID", 400));

            // ✅ If subCategory is given, validate it exists within this product category
            if (subCategory && !productCat.subCategory.includes(subCategory)) {
                return next(new AppError("Invalid SubCategory for this Product Category", 400));
            }

            validatedProductId = productId;
        }

        // ✅ Validate brandId
        if (brandId) {
            const brandCat = await BrandModel.findById(brandId);
            if (!brandCat) return next(new AppError("Invalid Brand Category ID", 400));
            validatedBrandId = brandId;
        }

        // ✅ Validate themeId
        if (themeId) {
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



export {
    addProduct,
    getProduct,
    getProductDetail,
    editProduct
}




