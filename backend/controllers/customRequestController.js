const CustomRequest = require('../models/CustomRequest');

const createCustomRequest = async (req, res) => {
    try {
        console.log('Incoming Custom Request:', req.body);
        const { style, fabric, notes, image } = req.body;
        const customRequest = await CustomRequest.create({
            user_id: req.user._id,
            style,
            fabric,
            notes,
            image
        });
        console.log('Custom Request created:', customRequest._id);
        res.status(201).json(customRequest);
    } catch (error) {
        console.error('Error in createCustomRequest:', error);
        res.status(500).json({ message: error.message });
    }
};

const getMyCustomRequests = async (req, res) => {
    try {
        const requests = await CustomRequest.find({ user_id: req.user._id });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllCustomRequests = async (req, res) => {
    try {
        const requests = await CustomRequest.find({}).populate('user_id', 'name email');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCustomRequestStatus = async (req, res) => {
    try {
        const request = await CustomRequest.findById(req.params.id);
        if (request) {
            request.status = req.body.status || request.status;
            const updatedRequest = await request.save();
            res.json(updatedRequest);
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createCustomRequest, getMyCustomRequests, getAllCustomRequests, updateCustomRequestStatus };
