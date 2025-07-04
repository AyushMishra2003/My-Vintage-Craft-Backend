import { model, Schema } from "mongoose";


const OrderSchema = new Schema(
    {

        name: {
            type: String
        },
        email: {
            type: String
        },
        streetAddress: {
            type: String
        },
        apartment: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        pincode: {
            type: String
        },
        phone: {
            type: String
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "ProductDetails",
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "Vintage-User",
        }

    },
    {
        timestamps: true
    }
)


const OrderModel = model("VinOrder", OrderSchema)

export default OrderModel