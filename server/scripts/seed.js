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

// 2. Define Schema
const partSchema = new mongoose.Schema({
    name: String,
    type: { type: String, enum: ['case', 'pcb', 'switch', 'keycap'] },
    price: Number,
    image: String,
    specs: mongoose.Schema.Types.Mixed
});

const Part = mongoose.models.Part || mongoose.model('Part', partSchema);

// 3. Define 50+ Parts
const parts = [
    // --- CASES (Real Tofu60 Images - Divinikey) ---
    //60% Case
    { name: 'Tofu60 Redux Case - Black', type: 'case', price: 89.00, image: 'https://down-th.img.susercontent.com/file/cn-11134207-7r98o-lkninb731ohp10', specs: { layout: '60%', mountingType: 'Tray', supportedLayouts: ['60%'] } },
    { name: 'Bakeneko60 CNC - Lavender', type: 'case', price: 130.00, image: 'https://cannonkeys.com/cdn/shop/products/60-lav.jpg?v=1697755322&width=3000', specs: { layout: '60%', mountingType: 'Gummy O-ring', supportedLayouts: ['60%'] } },
    { name: 'Freebird60 Case - White', type: 'case', price: 95.00, image: 'https://keebsforall.com/cdn/shop/files/fb60white.jpg?v=1731535128&width=3000', specs: { layout: '60%', mountingType: 'Gasket', supportedLayouts: ['60%'] } },

    { name: 'Tofu65 2.0 Case - Grey', type: 'case', price: 109.00, image: 'https://divinikey.com/cdn/shop/products/kbdfans-tofu60-redux-case-368883.webp?v=1695485072&width=1214', specs: { layout: '65%', mountingType: 'Gasket', supportedLayouts: ['65%'] } },
    { name: 'KBD67 Lite R4 Case - Transparent', type: 'case', price: 109.00, image: 'https://images.unsplash.com/photo-1647228224590-7d34b3f1737e?w=600&q=80', specs: { layout: '65%', mountingType: 'Gasket', supportedLayouts: ['65%'] } },
    { name: 'KBD67 Lite R4 Case - White', type: 'case', price: 109.00, image: 'https://images.unsplash.com/photo-1613589947849-c1920d3caa95?w=600&q=80', specs: { layout: '65%', mountingType: 'Gasket', supportedLayouts: ['65%'] } },
    { name: 'Mode Sonnet - Navy', type: 'case', price: 299.00, image: 'https://images.unsplash.com/photo-1563191911-e65f8655ebf9?w=600&q=80', specs: { layout: '75%', mountingType: 'Isolated Top', supportedLayouts: ['75%'] } },
    { name: 'Mode Sonnet - White', type: 'case', price: 299.00, image: 'https://images.unsplash.com/photo-1626218174523-9c86927d6d3d?w=600&q=80', specs: { layout: '75%', mountingType: 'Isolated Top', supportedLayouts: ['75%'] } },
    { name: 'Mode Envoy - Mirage', type: 'case', price: 199.00, image: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=600&q=80', specs: { layout: '65%', mountingType: 'Lattice Block', supportedLayouts: ['65%'] } },
    { name: 'Zoom75 EE - Milk Tea', type: 'case', price: 189.00, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80', specs: { layout: '75%', mountingType: 'Gasket', supportedLayouts: ['75%'] } },
    { name: 'QK65v2 - Silver', type: 'case', price: 160.00, image: 'https://images.unsplash.com/photo-1587829741301-30c00713b131?w=600&q=80', specs: { layout: '65%', mountingType: 'Gasket', supportedLayouts: ['65%'] } },
    { name: 'Keychron Q1 Pro - Black', type: 'case', price: 179.00, image: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=600&q=80', specs: { layout: '75%', mountingType: 'Gasket', supportedLayouts: ['75%'] } },
    { name: 'Keychron Q2 - Navy', type: 'case', price: 159.00, image: 'https://images.unsplash.com/photo-1629828876413-4da7c9431f4a?w=600&q=80', specs: { layout: '65%', mountingType: 'Gasket', supportedLayouts: ['65%'] } },
    { name: 'GMMK Pro - White', type: 'case', price: 169.99, image: 'https://images.unsplash.com/photo-1613589947849-c1920d3caa95?w=600&q=80', specs: { layout: '75%', mountingType: 'Gasket', supportedLayouts: ['75%'] } },
    { name: 'Wooting 60HE Case', type: 'case', price: 69.00, image: 'https://divinikey.com/cdn/shop/products/kbdfans-tofu60-redux-case-368883.webp?v=1695485072&width=1214', specs: { layout: '60%', mountingType: 'Tray', supportedLayouts: ['60%'] } },

    // --- PCBs (Circuit Boards / Internals) ---
    // 60% PCBs
    { name: 'DZ60 RGB V2 Hot-swap', type: 'pcb', price: 58.00, image: 'https://kbdfans.com/cdn/shop/products/DZ60RGBANSI-2000.jpg?v=1627521245', specs: { layout: '60%', mountingType: 'Tray', switchSupport: '5-pin', hotSwap: true } },
    { name: 'Instant60 PCB', type: 'pcb', price: 62.00, image: 'https://cannonkeys.com/cdn/shop/products/instant60-tsangan-top.jpg?v=1709145358&width=1500', specs: { layout: '60%', mountingType: 'Tray', switchSupport: '5-pin', hotSwap: true } },
    { name: 'BM60 RGB ISO', type: 'pcb', price: 45.00, image: 'https://kprepublic.com/cdn/shop/products/Ha897ea2223f94af8829a92ebd1a771feh.jpg?v=1597062705', specs: { layout: '60%', mountingType: 'Tray', switchSupport: '3-pin', hotSwap: true } },

    { name: 'Mode Sonnet PCB - Hotswap', type: 'pcb', price: 65.00, image: 'https://images.unsplash.com/photo-1618335829731-55950284ddce?w=600&q=80', specs: { layout: '75%', mountingType: 'Isolated Top', switchSupport: '5-pin', hotSwap: true } },
    { name: 'Mode Envoy PCB - Solder', type: 'pcb', price: 45.00, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80', specs: { layout: '65%', mountingType: 'Lattice Block', switchSupport: '5-pin', hotSwap: false } },
    { name: 'Zoom75 Tri-mode PCB', type: 'pcb', price: 75.00, image: 'https://images.unsplash.com/photo-1555617912-436c04516ba6?w=600&q=80', specs: { layout: '75%', mountingType: 'Gasket', switchSupport: '5-pin', hotSwap: true } },
    { name: 'Keychron Q1 PCB', type: 'pcb', price: 49.00, image: 'https://images.unsplash.com/photo-1618335829731-55950284ddce?w=600&q=80', specs: { layout: '75%', mountingType: 'Gasket', switchSupport: '5-pin', hotSwap: true } },
    { name: 'Hineybush h87a', type: 'pcb', price: 55.00, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80', specs: { layout: 'TKL', mountingType: 'Top', switchSupport: '5-pin', hotSwap: false } },
    { name: 'Wilba.tech WT60-D', type: 'pcb', price: 60.00, image: 'https://images.unsplash.com/photo-1555617912-436c04516ba6?w=600&q=80', specs: { layout: '60%', mountingType: 'Tray', switchSupport: '5-pin', hotSwap: false } },
    { name: '1up Keyboards 60% HSE PCB', type: 'pcb', price: 45.00, image: 'https://images.unsplash.com/photo-1618335829731-55950284ddce?w=600&q=80', specs: { layout: '60%', mountingType: 'Tray', switchSupport: '3-pin', hotSwap: true } },

    // --- SWITCHES (Real Oil King Images - Divinikey) ---
    { name: 'Gateron Oil King (10 pcs)', type: 'switch', price: 6.50, image: 'https://divinikey.com/cdn/shop/products/gateron-oil-king-linear-switches-389141.jpg?v=1642045846&width=1214', specs: { brand: 'Gateron', switchType: 'Linear', pricePerUnit: 0.65 } },
    { name: 'Gateron Ink Black V2 (10 pcs)', type: 'switch', price: 7.50, image: 'https://divinikey.com/cdn/shop/products/gateron-oil-king-linear-switches-389141.jpg?v=1642045846&width=1214', specs: { brand: 'Gateron', switchType: 'Linear', pricePerUnit: 0.75 } },
    { name: 'Cherry MX Black (10 pcs)', type: 'switch', price: 4.00, image: 'https://images.unsplash.com/photo-1533158388470-9a56699990c6?w=600&q=80', specs: { brand: 'Cherry', switchType: 'Linear', pricePerUnit: 0.40 } },
    { name: 'Cherry MX Blue (10 pcs)', type: 'switch', price: 4.00, image: 'https://images.unsplash.com/photo-1552550186-b4845dc278be?w=600&q=80', specs: { brand: 'Cherry', switchType: 'Clicky', pricePerUnit: 0.40 } },
    { name: 'Cherry MX Brown (10 pcs)', type: 'switch', price: 4.00, image: 'https://images.unsplash.com/photo-1626218174523-9c86927d6d3d?w=600&q=80', specs: { brand: 'Cherry', switchType: 'Tactile', pricePerUnit: 0.40 } },
    { name: 'NovelKeys Cream (10 pcs)', type: 'switch', price: 6.50, image: 'https://divinikey.com/cdn/shop/products/gateron-oil-king-linear-switches-389141.jpg?v=1642045846&width=1214', specs: { brand: 'NovelKeys', switchType: 'Linear', pricePerUnit: 0.65 } },
    { name: 'Tangerine V2 67g (10 pcs)', type: 'switch', price: 6.50, image: 'https://images.unsplash.com/photo-1533158388470-9a56699990c6?w=600&q=80', specs: { brand: 'C³Equalz', switchType: 'Linear', pricePerUnit: 0.65 } },
    { name: 'Banana Split (10 pcs)', type: 'switch', price: 6.50, image: 'https://images.unsplash.com/photo-1552550186-b4845dc278be?w=600&q=80', specs: { brand: 'C³Equalz', switchType: 'Linear', pricePerUnit: 0.65 } },
    { name: 'Holy Panda (10 pcs)', type: 'switch', price: 10.00, image: 'https://images.unsplash.com/photo-1626218174523-9c86927d6d3d?w=600&q=80', specs: { brand: 'Drop', switchType: 'Tactile', pricePerUnit: 1.00 } },
    { name: 'Boba U4T (10 pcs)', type: 'switch', price: 6.50, image: 'https://images.unsplash.com/photo-1615122171546-815869e06184?w=600&q=80', specs: { brand: 'Gazzew', switchType: 'Tactile', pricePerUnit: 0.65 } },
    { name: 'Zealios V2 67g (10 pcs)', type: 'switch', price: 10.00, image: 'https://images.unsplash.com/photo-1533158388470-9a56699990c6?w=600&q=80', specs: { brand: 'Zeal', switchType: 'Tactile', pricePerUnit: 1.00 } },
    { name: 'Tealios V2 (10 pcs)', type: 'switch', price: 10.00, image: 'https://images.unsplash.com/photo-1552550186-b4845dc278be?w=600&q=80', specs: { brand: 'Zeal', switchType: 'Linear', pricePerUnit: 1.00 } },
    { name: 'Kailh Box Jade (10 pcs)', type: 'switch', price: 3.50, image: 'https://images.unsplash.com/photo-1626218174523-9c86927d6d3d?w=600&q=80', specs: { brand: 'Kailh', switchType: 'Clicky', pricePerUnit: 0.35 } },
    { name: 'Kailh Box Navy (10 pcs)', type: 'switch', price: 3.50, image: 'https://images.unsplash.com/photo-1615122171546-815869e06184?w=600&q=80', specs: { brand: 'Kailh', switchType: 'Clicky', pricePerUnit: 0.35 } },
    { name: 'Alpaca V2 (10 pcs)', type: 'switch', price: 5.50, image: 'https://images.unsplash.com/photo-1533158388470-9a56699990c6?w=600&q=80', specs: { brand: 'PrimeKB', switchType: 'Linear', pricePerUnit: 0.55 } },
    { name: 'Durock T1 (10 pcs)', type: 'switch', price: 5.50, image: 'https://images.unsplash.com/photo-1552550186-b4845dc278be?w=600&q=80', specs: { brand: 'Durock', switchType: 'Tactile', pricePerUnit: 0.55 } },

    // --- KEYCAPS (Real PBTfans Images - Divinikey) ---
    { name: 'GMK Minimal', type: 'keycap', price: 110.00, image: 'https://divinikey.com/cdn/shop/products/pbtfans-bow-keycap-set-doubleshot-pbt-565535.webp?v=1656754402&width=1214', specs: { material: 'ABS', layoutSupport: ['60%', '65%', '75%', 'TKL', 'Full'] } },
    { name: 'GMK Red Samurai', type: 'keycap', price: 120.00, image: 'https://images.unsplash.com/photo-1617300755959-1e17e85c160b?w=600&q=80', specs: { material: 'ABS', layoutSupport: ['60%', '65%', 'TKL'] } },
    { name: 'GMK Olivia++Light', type: 'keycap', price: 130.00, image: 'https://divinikey.com/cdn/shop/products/pbtfans-bow-keycap-set-doubleshot-pbt-565535.webp?v=1656754402&width=1214', specs: { material: 'ABS', layoutSupport: ['60%', '65%', '75%', 'TKL', 'Full'] } },
    { name: 'GMK Botany', type: 'keycap', price: 125.00, image: 'https://images.unsplash.com/photo-1589332560383-e0293a38a956?w=600&q=80', specs: { material: 'ABS', layoutSupport: ['60%', '65%', '75%', 'TKL'] } },
    { name: 'ePBT 9009', type: 'keycap', price: 89.00, image: 'https://divinikey.com/cdn/shop/products/pbtfans-bow-keycap-set-doubleshot-pbt-565535.webp?v=1656754402&width=1214', specs: { material: 'PBT', layoutSupport: ['60%', '65%', '75%', 'TKL', 'Full'] } },
    { name: 'ePBT Sushi', type: 'keycap', price: 79.00, image: 'https://images.unsplash.com/photo-1617300755959-1e17e85c160b?w=600&q=80', specs: { material: 'PBT', layoutSupport: ['60%', '65%', '75%', 'TKL', 'Full'] } },
    { name: 'NicePBT Sugarplum', type: 'keycap', price: 65.00, image: 'https://divinikey.com/cdn/shop/products/pbtfans-bow-keycap-set-doubleshot-pbt-565535.webp?v=1656754402&width=1214', specs: { material: 'PBT', layoutSupport: ['60%', '65%', '75%', 'TKL', 'Full'] } },
    { name: 'Akko Carbon Retro', type: 'keycap', price: 50.00, image: 'https://images.unsplash.com/photo-1589332560383-e0293a38a956?w=600&q=80', specs: { material: 'PBT', layoutSupport: ['60%', '65%', '75%', 'TKL', 'Full'] } },
    { name: 'Drop + MiTo MT3 Cyber', type: 'keycap', price: 95.00, image: 'https://divinikey.com/cdn/shop/products/pbtfans-bow-keycap-set-doubleshot-pbt-565535.webp?v=1656754402&width=1214', specs: { material: 'ABS', layoutSupport: ['60%', '65%', 'TKL'] } },
    { name: 'Drop + Matt3o MT3 Susuwatari', type: 'keycap', price: 95.00, image: 'https://images.unsplash.com/photo-1617300755959-1e17e85c160b?w=600&q=80', specs: { material: 'ABS', layoutSupport: ['60%', '65%', 'TKL', 'Full'] } },
    { name: 'Cerakey Ceramic Keycaps - White', type: 'keycap', price: 120.00, image: 'https://divinikey.com/cdn/shop/products/pbtfans-bow-keycap-set-doubleshot-pbt-565535.webp?v=1656754402&width=1214', specs: { material: 'Ceramic', layoutSupport: ['60%', '65%', 'TKL', 'Full'] } },
    { name: 'PolyCaps Seal', type: 'keycap', price: 65.00, image: 'https://images.unsplash.com/photo-1589332560383-e0293a38a956?w=600&q=80', specs: { material: 'PBT', layoutSupport: ['60%', '65%', '75%', 'TKL', 'Full'] } },
];

async function seed() {
    try {
        console.log('Connecting to MongoDB Atlas at:', MONGODB_URI.split('@')[1]); // Log safe part of URI
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB successfully!');

        console.log('Clearing existing parts...');
        await Part.deleteMany({});
        console.log('Cleared Parts');

        console.log(`Inserting ${parts.length} parts...`);
        await Part.insertMany(parts);
        console.log('Database seeded successfully with sample data!');

        mongoose.connection.close();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
