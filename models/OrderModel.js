const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const orderSchema = mongoose.Schema({
    orderItems: [{
        type: ObjectId,
        ref: "OrderItems",
        required: true
    }],
    user: {
        type: ObjectId,
        red: "User",
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
    shipping_address: {
        type: String,
        required: true
    },
    alternate_shipping_address: {
        type: String,
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    zip: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "Pending"
    },
    phone:{
        type:Number,
        required:true
    }
}, { timestamps: true })

module.exports = mongoose.model("Order", orderSchema)
