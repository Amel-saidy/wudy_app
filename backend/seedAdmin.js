const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tailoring_db');

        const adminExists = await User.findOne({ email: 'admin@wudytailoring.com' });

        if (adminExists) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const adminUser = new User({
            name: 'Wudy Admin',
            email: 'admin@wudytailoring.com',
            password: 'password123', // User model hooks will hash this automatically
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
