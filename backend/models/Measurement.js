const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    chest: {
        type: Number,
        required: true
    },
    waist: {
        type: Number,
        required: true
    },
    hips: {
        type: Number,
        required: true
    },
    shoulder: {
        type: Number,
        required: true
    },
    length: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Measurement', measurementSchema);
