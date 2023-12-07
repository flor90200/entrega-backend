import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    email:{
        type: String,
        require: true,
        unique: true
    },
    products: {
     type: [{
        _id: false,
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        },
        quantity: {type: Number }
     }],
     default: []
    }
})

mongoose.set('strictQuery', false)
const cartModel = mongoose.model('carts', cartSchema)

export default cartModel