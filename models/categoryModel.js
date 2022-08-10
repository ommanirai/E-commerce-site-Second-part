const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps:true})

module.exports = mongoose.model('Category', categorySchema)
// Category - _id, category_name, createdAt, updatedAt