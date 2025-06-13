import slugify from "slugify"
import ProductModel from "../models/product.model.js"
import AppError from "../utlis/error.utlis.js"

import cloudinary from 'cloudinary'
import ProductCategoryModel from "../models/productCategory.model.js"
import BrandModel from "../models/Brand.model.js"
import ThemeModel from "../models/ThemeCategory.model.js"

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
            categoryId
        } = req.body;


        console.log(req.body);


        if (!name || !rate || !discount) {
            return next(new AppError("Name, Rate and Discount are required", 400));
        }

        let categoryType1 = "";
        let categoryId1 = null;

        // ✅ Determine which category is selected and validate
        if (categoryType === "product") {
            const valid = await ProductCategoryModel.findById(categoryId);
            if (!valid) return next(new AppError("Invalid Product Category", 400));

            // If subCategory provided, validate it
            if (subCategory && !valid.subCategory.includes(subCategory)) {
                return next(new AppError("Invalid SubCategory for Product Category", 400));
            }

            categoryType1 = "product";
            categoryId1 = categoryId;
        } else if (categoryType === "brand") {
            const valid = await BrandModel.findById(categoryId);
            if (!valid) return next(new AppError("Invalid Brand Category", 400));
            categoryType1 = "brand";
            categoryId1 = categoryId;
        } else if (categoryType === "theme") {
            const valid = await ThemeModel.findById(categoryId);
            if (!valid) return next(new AppError("Invalid Theme Category", 400));
            categoryType1 = "theme";
            categoryId1 = categoryId;
        } else {
            return next(new AppError("Please provide a valid category", 400));
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
            categoryType: categoryType1,
            categoryId: categoryId1,
            productCategory,
            brandCategory,
            themeCategory,
            subCategory,
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

        const allProduct = await ProductModel.find({})

        if (!allProduct) {
            return next(new AppError("Product Not Found", 400))
        }

        res.status(200).json({
            success: true,
            message: "Product Are:-",
            data: allProduct
        })

    } catch (error) {
        return next(new AppError(error.message, 500))
    }
}


export {
    addProduct,
    getProduct
}




