const mongoose = require('mongoose');

// Hardcoded URI from .env.local to avoid dotenv dependency in script
// Note: In production code, always use env vars. This is a one-off maintenance script.
const MONGODB_URI = 'mongodb+srv://thananonza123_db_user:XPlaizaX%241412@cluster0.h7qceit.mongodb.net/keycraft';

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
            for (let collection of collections) {
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
