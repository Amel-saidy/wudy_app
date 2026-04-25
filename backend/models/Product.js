const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    colors: [{
        name: { type: String, required: true },
        image: { type: String, required: false }
    }],
    category: {
        type: String,
        required: true
    },
    is_customizable: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
