const mongoose = require('mongoose');
const Product = require('./models/Product');

const updateImages = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/tailoring_db');
    
    // Update Jallabiya
    const jallabiya = await Product.findOne({ name: "Classic Men's Jallabiya" });
    if (jallabiya) {
        jallabiya.colors[0].image = '/uploads/cream_haftan.png';
        jallabiya.colors[1].image = '/uploads/sand_haftan.png';
        await jallabiya.save();
    }

    // Update Abaya
    const abaya = await Product.findOne({ name: "Embroidered Silk Abaya Set" });
    if (abaya) {
        abaya.colors[0].image = '/uploads/black_abaya.png';
        abaya.colors[1].image = '/uploads/gold_abaya.png';
        await abaya.save();
    }

    console.log('Images updated successfully');
    process.exit(0);
};
updateImages();
