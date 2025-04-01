import { model, Schema } from "mongoose";

const BrandSchema=new Schema(
    {
         brandName:{
            type:String,
            require:true,
            unique:true,
            lowercase:true
         },
         brandSlug:{
            type:String,
            require:true,
            lowercase:true,
            unique:true
         }
    },
    {
        timestamps:true
    }
)

const BrandModel=model("Brand-Category",BrandSchema)

export default BrandModel