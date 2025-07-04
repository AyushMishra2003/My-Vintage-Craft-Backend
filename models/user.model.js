import { model, Schema } from "mongoose";


const userSchema = new Schema(
    {

        name: {
            type: String
        },
        email: {
            type: String
        },
        phoneNumber: {
            type: String
        },
        orderDetail: [
            {
                type: Schema.Types.ObjectId,
                ref: "VinOrder",
            }
        ]
    },
    {
        timestamps: true
    }
)

const UserModel = model("Vintage-User", userSchema)

export default UserModel