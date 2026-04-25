const mongoose = require('mongoose');

const customRequestSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    style: { type: String, required: true },
    fabric: { type: String },
    notes: { type: String, required: true },
    image: { type: String, required: true }, 
    status: { type: String, enum: ['Pending', 'Reviewed', 'Quote Sent', 'Accepted', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('CustomRequest', customRequestSchema);
