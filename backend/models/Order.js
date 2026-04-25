const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    custom_notes: {
        type: String,
        required: false
    },
    inspiration_image: {
        type: String,
        required: false
    }
});

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [orderItemSchema],
    total_price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Ready', 'Delivered'],
        default: 'Pending'
    },
    shipping_address: {
        type: String,
        required: true
    },
    payment_method: {
        type: String,
        enum: ['Wave', 'Q money', 'Afri money', 'APS'],
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
