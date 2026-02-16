const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// 1. Load .env.local to get the Atlas URI
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    console.log('Loading .env.local...');
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        // Basic parse for KEY=VALUE
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes if any
            process.env[key] = value;
        }
    });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI not found in .env.local');
    process.exit(1);
}

const cleanDB = async () => {
    try {
        console.log(`Connecting to MongoDB Atlas...`);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB successfully!');

        // Get all collections
        const collections = await mongoose.connection.db.collections();

        if (collections.length === 0) {
            console.log('Database is already empty.');
        } else {
            for (const collection of collections) {
                const count = await collection.countDocuments();
                if (count > 0) {
                    console.log(`Clearing collection: ${collection.collectionName} (${count} items)`);
                    await collection.deleteMany({});
                } else {
                    console.log(`Collection ${collection.collectionName} is already empty.`);
                }
            }
            console.log('🎉 Database Cleared Successfully! All collections are empty.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error clearing database:', error);
        process.exit(1);
    }
};

cleanDB();
