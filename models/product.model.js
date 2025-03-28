import { model, Schema } from "mongoose";



const productSchema=new Schema(
    {
        title:{
            type:String,
            required:true
        },
        photo:{
            public_id:{
                type:String,
                default:""
            },
            secure_url:{
                type:String,
                default:""
            }
        },
        description:{
            type:String,
            required:true
        },
        rate:{
            type:Number,
            required:true
        },
        discount:{
            type:Number,
            required:true
        },
        shipingDetail:{
            type:String,
        },
        features:{
            type:String,
        },
        faq:{
            type:String
        },
        reviews:{
            type:String
        }
    },
    {
        timestamps:true
    }
)


const ProductModel=model("ProductDetails",productSchema)

export default ProductModel