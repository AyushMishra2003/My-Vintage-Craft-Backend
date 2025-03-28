import { model, Schema } from "mongoose";


const productCategorySchema = new Schema(
    {
        category: {
            type: String,
            required:true
        },
        subCategory: [
            {
                type: String
            }
        ]
    },
    {

    }
)



const ProductCategoryModel=model("ProductCategory",productCategorySchema)

export default ProductCategoryModel