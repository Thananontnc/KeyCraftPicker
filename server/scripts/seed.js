const mongoose = require('mongoose');

// Define Schema inline for script (or import if using commonjs)
// Since this is a standalone script, we'll redefine quickly or use ES modules if package.json type="module"
// Next.js uses ES modules, but standalone scripts are tricky. Let's make it a simple node script.

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/keycraft';

const partSchema = new mongoose.Schema({
    name: String,
    type: { type: String, enum: ['case', 'pcb', 'switch', 'keycap'] },
    price: Number,
    image: String,
    specs: mongoose.Schema.Types.Mixed
});

const Part = mongoose.model('Part', partSchema);

const parts = [
    {
        name: 'Tofu60 Redux Case',
        type: 'case',
        price: 89.00,
        image: 'https://kbdfans.com/cdn/shop/files/1_3a59880f-960b-46a4-9988-51e6caf0728c.jpg?v=1689230678&width=360',
        specs: {
            layout: '60%',
            mountingType: 'Tray',
            supportedLayouts: ['60%']
        }
    },
    {
        name: 'DZ60RGB V2 Hot-swap PCB',
        type: 'pcb',
        price: 55.00,
        image: 'https://kbdfans.com/cdn/shop/products/DZ60RGB-ANSI-V2_1.jpg?v=1610091836&width=360',
        specs: {
            layout: '60%',
            mountingType: 'Tray',
            switchSupport: '5-pin',
            hotSwap: true
        }
    },
    {
        name: 'Gateron Oil King Linear Switch (10 pcs)',
        type: 'switch',
        price: 6.50,
        image: 'https://cdn.shopify.com/s/files/1/1473/3902/products/GateronOilKings01.jpg?v=1642538183',
        specs: {
            brand: 'Gateron',
            switchType: 'Linear',
            pinType: '5-pin', // Keeping for legacy logic compatibility
            pricePerUnit: 0.65
        }
    },
    {
        name: 'GMK Minimal Keycap Set',
        type: 'keycap',
        price: 110.00,
        image: 'https://cdn.shopify.com/s/files/1/1473/3902/products/3_1_18f2b7f7-3475-4f4d-b65a-0d6118d5314f.jpg?v=1571439265',
        specs: {
            material: 'ABS',
            layoutSupport: ['60%', '65%', 'TKL', 'Full']
        }
    },
    // Incompatible Parts for Testing
    {
        name: 'KBD67 Lite Case',
        type: 'case',
        price: 109.00,
        image: 'https://kbdfans.com/cdn/shop/products/1_2d103323-9c88-469b-8e28-1c3905e3f59d.jpg?v=1610609395',
        specs: {
            layout: '65%',
            mountingType: 'Gasket',
            supportedLayouts: ['65%']
        }
    }
];

async function seed() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    await Part.deleteMany({});
    console.log('Cleared Parts');

    await Part.insertMany(parts);

    mongoose.connection.close();
}

seed();
