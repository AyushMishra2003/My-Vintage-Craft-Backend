import { model, Schema } from "mongoose";



const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        photo: {
            public_id: {
                type: String,
                default: ""
            },
            secure_url: {
                type: String,
                default: ""
            }
        },
        description: {
            type: String,

        },
        rate: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
        shipingDetail: {
            type: String,
        },
        features: {
            type: String,
        },
        faq: {
            type: String
        },
        reviews: {
            type: String
        },
        slugProduct: {
            type: String
        },
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

        }
    },
    {
        timestamps: true
    }
)


const ProductModel = model("ProductDetails", productSchema)

export default ProductModel