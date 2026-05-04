require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function check() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tailoring_db');
    const products = await Product.find().limit(5);
    console.log(JSON.stringify(products, null, 2));
    process.exit(0);
}
check();
