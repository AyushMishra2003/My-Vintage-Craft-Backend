import { model, Schema } from "mongoose";

const productSchema = new Schema(
    {
        // Title
        title: {
            type: String,
            required: true,
            trim: true,
        },

        // Main Photo
        mainPhoto: {
            public_id: {
                type: String,
                default: "",
            },
            secure_url: {
                type: String,
                default: "",
            },
        },

        // Multiple Photos
        photos: [
            new Schema({
                public_id: {
                    type: String,
                    default: "",
                },
                secure_url: {
                    type: String,
                    default: "",
                }
            }, { _id: false })
        ],

        // Price and Discount
        rate: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },

        // Stock status
        isStockFull: {
            type: Boolean,
            default: true,
        },

        // Descriptions & Other Info
        description: {
            type: String,
        },
        faq: {
            type: String,
        },
        contact: {
            type: String,
        },
        features: {
            type: String,
        },
        shipingDetail: {
            type: String,
        },

        // Slug for product URL
        slugProduct: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },

        // Reviews: array of objects with name and string review
        reviews: [
            {
                name: { type: String },
                review: { type: String },
            },
        ],

        // Category Type Reference: any of the 3 categories
        categoryType: {
            type: String,
            enum: ["product", "theme", "brand"],
            required: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            required: true,
        },

        // Optional direct references (if needed separately)
        themeCategory: {
            type: Schema.Types.ObjectId,
            ref: "Theme-Category",
        },
        brandCategory: {
            type: Schema.Types.ObjectId,
            ref: "Brand-Category",
        },
        productCategory: {
            type: Schema.Types.ObjectId,
            ref: "ProductCategory",
        },


        subCategory: {
            type: String
        },

        subCategoryId: {
            type: Schema.Types.ObjectId,
            ref: "ProductCategory",
        }

    },
    {
        timestamps: true,
    }
);

const ProductModel = model("ProductDetails", productSchema);
export default ProductModel;
