const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  {
    name: "Royal Men's Agbada Ensemble",
    price: 18500,
    category: "Men",
    description: "A premium 3-piece traditional Agbada set crafted from the finest polished cotton. Includes the inner tunic, trousers, and the flowing outer robe with intricate hand-embroidered details around the neckline.",
    is_customizable: true,
    colors: [
      { name: "Navy Blue & Silver", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800" },
      { name: "Pure White", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800" }
    ],
    images: []
  },
  {
    name: "Elegant Ankara Peplum Dress",
    price: 12000,
    category: "Women",
    description: "A vibrant and stunning Ankara peplum dress featuring a fitted bodice, flared waist, and elegant puffed sleeves. Perfect for weddings and special occasions. Tailored exactly to your measurements.",
    is_customizable: true,
    colors: [
      { name: "Golden Sunset", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800" },
      { name: "Emerald Mix", image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800" }
    ],
    images: []
  },
  {
    name: "Senegalese Style Kaftan",
    price: 14500,
    category: "Men",
    description: "Sleek, modern Senegalese-style long kaftan with matching slim-fit trousers. Features subtle geometric embroidery and is made from breathable, high-quality linen.",
    is_customizable: true,
    colors: [
      { name: "Charcoal Black", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800" }
    ],
    images: []
  },
  {
    name: "Luxurious Silk Bubu Gown",
    price: 16000,
    category: "Women",
    description: "Flowing, elegant silk Bubu gown that offers ultimate comfort without sacrificing regal style. Adorned with Swarovski stone detailing around the v-neckline.",
    is_customizable: true,
    colors: [
      { name: "Deep Ruby", image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800" },
      { name: "Sapphire Blue", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800" }
    ],
    images: []
  },
  {
    name: "Classic Men's Jallabiya",
    price: 11000,
    category: "Men",
    description: "An elegant, loose-fitting Jallabiya with subtle embroidery around the chest. Perfect for Friday prayers and Eid celebrations.",
    is_customizable: true,
    colors: [
      { name: "Cream White", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800" },
      { name: "Desert Sand", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800" }
    ],
    images: []
  },
  {
    name: "Embroidered Silk Abaya Set",
    price: 18000,
    category: "Women",
    description: "A breathtaking modest Abaya set featuring a matching inner slip, flowing outer robe with gold embroidery, and a complimentary matching Hijab.",
    is_customizable: true,
    colors: [
      { name: "Midnight Black", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800" },
      { name: "Rose Gold", image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800" }
    ],
    images: []
  }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tailoring_db');
        
        // Remove old test products (excluding custom ones made by user maybe)
        await Product.deleteMany({ name: { $in: products.map(p => p.name) } });
        
        await Product.insertMany(products);
        
        console.log('Sample products seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error.message);
        process.exit(1);
    }
};

seedProducts();
