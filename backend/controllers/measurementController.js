const Measurement = require('../models/Measurement');

const saveMeasurements = async (req, res) => {
    try {
        const { chest, waist, hips, shoulder, length } = req.body;
        
        let measurement = await Measurement.findOne({ user_id: req.user._id });
        
        if (measurement) {
            measurement.chest = chest;
            measurement.waist = waist;
            measurement.hips = hips;
            measurement.shoulder = shoulder;
            measurement.length = length;
            await measurement.save();
        } else {
            measurement = await Measurement.create({
                user_id: req.user._id,
                chest, waist, hips, shoulder, length
            });
        }
        
        res.status(201).json(measurement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyMeasurements = async (req, res) => {
    try {
        const measurement = await Measurement.findOne({ user_id: req.user._id });
        res.json(measurement || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserMeasurements = async (req, res) => {
    try {
        const measurement = await Measurement.findOne({ user_id: req.params.id });
        if (measurement) {
            res.json(measurement);
        } else {
            res.status(404).json({ message: 'Measurements not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { saveMeasurements, getMyMeasurements, getUserMeasurements };
