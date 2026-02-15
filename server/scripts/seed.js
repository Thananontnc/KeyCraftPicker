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
    // --- CASES ---
    //60% Case
    { name: 'Tofu60 Redux Case - - Black', type: 'case', price: 89.00, image: 'https://down-th.img.susercontent.com/file/cn-11134207-7r98o-lkninb731ohp10', specs: { layout: '60%', mountingType: 'Tray', supportedLayouts: ['60%'] } },
    { name: 'Bakeneko60 CNC - Lavender', type: 'case', price: 130.00, image: 'https://cannonkeys.com/cdn/shop/products/60-lav.jpg?v=1697755322&width=3000', specs: { layout: '60%', mountingType: 'Gummy O-ring', supportedLayouts: ['60%'] } },
    { name: 'Freebird60 Case - White', type: 'case', price: 95.00, image: 'https://keebsforall.com/cdn/shop/files/fb60white.jpg?v=1731535128&width=3000', specs: { layout: '60%', mountingType: 'Gasket', supportedLayouts: ['60%'] } },

    //75% Case
    { name: 'GMMK Pro Barebone - Slate', type: 'case', price: 169.99, image: 'https://m.media-amazon.com/images/I/71Ay3szj8tL.jpg', specs: { layout: '75%', mountingType: 'Gasket', supportedLayouts: ['75%'] } },
    { name: 'MonsGeek M1 - Black', type: 'case', price: 99.00, image: 'https://mercular.s3.ap-southeast-1.amazonaws.com/images/products/2023/07/Product/Product%20content/Week1/KeyMonsGeek%20M1%20Mechanical%20Keyboard%201.jpg', specs: { layout: '75%', mountingType: 'Gasket', supportedLayouts: ['75%'] } },
    { name: 'Keychron Q1 Max', type: 'case', price: 189.00, image: 'https://content.etilize.com/enhanced-overview/en_us/505633/m6X51u5RDqCMFxmy3ZRg_r8Px1v1Eq1LQdZw', specs: { layout: '75%', mountingType: 'Gasket', supportedLayouts: ['75%'] } },

    //TKL Case
    { name: 'Keychron Q3 Barebone', type: 'case', price: 154.00, image: 'https://www.keyboardco.com/product-images/ansi_q3_carbon_black_rgb_aluminium_barebone_knob_keyboard_large.jpg', specs: { layout: 'TKL', mountingType: 'Gasket', supportedLayouts: ['TKL'] } },
    { name: 'Freebird TKL Case', type: 'case', price: 225.00, image: 'https://keebsforall.com/cdn/shop/products/updatedblue.png?v=1703031654&width=1920', specs: { layout: 'TKL', mountingType: 'Top Mount', supportedLayouts: ['TKL'] } },
    { name: 'MonsGeek M3 - Silver', type: 'case', price: 109.00, image: 'https://www.monsgeek.com/wp-content/uploads/2023/04/M3-QMK-0522-8.jpg', specs: { layout: 'TKL', mountingType: 'Gasket', supportedLayouts: ['TKL'] } },

    //Full-Size Case
    { name: 'MonsGeek M5 - Black', type: 'case', price: 129.00, image: 'https://stackskb.com/wp-content/uploads/2023/11/M5-QMK%E7%89%88%E6%9C%AC-%E9%BB%91%E8%89%B2_%E5%89%8D%E4%BF%AF-1.png', specs: { layout: 'Full', mountingType: 'Gasket', supportedLayouts: ['Full'] } },
    { name: 'Keychron Q6 Max', type: 'case', price: 199.00, image: 'https://www.keychron.co.th/cdn/shop/files/Q6-Max-1_3d821c43-d98d-428f-abd3-e1ddd852681e.jpg?v=1758539897&width=1800', specs: { layout: 'Full', mountingType: 'Gasket', supportedLayouts: ['Full'] } },
    { name: 'Glorious GMMK 2 Full Size 96% - White', type: 'case', price: 119.99, image: 'https://www.kustompcs.co.uk/images/detailed/47/29337.jpg', specs: { layout: 'Full', mountingType: 'Tray', supportedLayouts: ['Full'] } },


    // --- PCBs ---
    // 60% PCBs
    { name: 'DZ60 RGB V2 Hot-swap', type: 'pcb', price: 58.00, image: 'https://kbdfans.com/cdn/shop/products/DZ60RGBANSI-2000.jpg?v=1627521245', specs: { layout: '60%', mountingType: 'Tray', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'Instant60 PCB', type: 'pcb', price: 62.00, image: 'https://cannonkeys.com/cdn/shop/products/instant60-tsangan-top.jpg?v=1709145358&width=1500', specs: { layout: '60%', mountingType: 'Tray', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'BM60 RGB ISO', type: 'pcb', price: 45.00, image: 'https://kprepublic.com/cdn/shop/products/Ha897ea2223f94af8829a92ebd1a771feh.jpg?v=1597062705', specs: { layout: '60%', mountingType: 'Tray', switchSupport: '3-pin', hotSwap: true, socketType: 'Mechanical' } },

    //75 PCBs
    { name: 'GMMK Pro Hot-swap PCB', type: 'pcb', price: 65.00, image: 'https://images.squarespace-cdn.com/content/v1/4f31dc46cb127c78280cc974/1623410989173-XGL9H0F8DT3CJP7FNKQ4/JAS_9895.jpg', specs: { layout: '75%', mountingType: 'Gasket', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'M1 Hot-swap PCB', type: 'pcb', price: 45.00, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEo6hTmWIcd2Alvjd7FozZ6TkUp-tr1s29uA&s', specs: { layout: '75%', mountingType: 'Gasket', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'Q1 RGB PCB', type: 'pcb', price: 60.00, image: 'https://images.mmorpg.com/images/contentImages/382021/Keychron-Q1-PCB-Foam.jpg', specs: { layout: '75%', mountingType: 'Gasket', switchSupport: '3-pin', hotSwap: true, socketType: 'Mechanical' } },

    //TKL PCBs
    { name: 'M5 Full PCB', type: 'pcb', price: 55.00, image: 'https://www.keyboardkustoms.com/cdn/shop/products/Q3_PE_800x.jpg?v=1656693455', specs: { layout: 'TKL', mountingType: 'Gasket', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'Phantom TKL PCB', type: 'pcb', price: 50.00, image: 'https://mechanicalkeyboards.com/cdn/shop/files/1221-MW6R6-Phantom-PCB-Dual-Layer-Tenkeyless-Electrical-Board.jpg?v=1708533351&width=750', specs: { layout: 'TKL', mountingType: 'Universal', switchSupport: '3-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'M3 RGB Hot-swap PCB', type: 'pcb', price: 48.00, image: 'https://mechanicalkeyboards.com/cdn/shop/files/9680_6290fce97360a_MK61-Hotswap-PCB-ANSI-60-RGB-QMK-VIA-compatible.jpg?v=1707264202', specs: { layout: 'TKL', mountingType: 'Gasket', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },

    //Full-Size PCBs
    { name: 'Q3 Hot-swap PCB', type: 'pcb', price: 65.00, image: 'https://img.danawa.com/images/descFiles/6/501/5500501_n8azN0tur7_1703422434070.jpeg', specs: { layout: 'Full', mountingType: 'Gasket', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'Q6 Hot-swap PCB', type: 'pcb', price: 70.00, image: 'https://i.etsystatic.com/35181042/r/il/38b400/7410302391/il_300x300.7410302391_q5hl.jpg', specs: { layout: 'Full', mountingType: 'Gasket', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'M3 RGB Hot-swap PCB', type: 'pcb', price: 38.00, image: 'https://m.media-amazon.com/images/I/513AP38flPL._AC_UF1000,1000_QL80_.jpg', specs: { layout: 'Full', mountingType: 'Tray', switchSupport: '3-pin', hotSwap: true, socketType: 'Mechanical' } },

    // --- SWITCHES ---
    { name: 'Akko V3 Cream Yellow (10 pcs)', type: 'switch', price: 3.50, image: 'https://monsgeek.eu/cdn/shop/files/V3-Cream-Yellow-Pro-Switch-2.png?v=1696825271&width=1500', specs: { brand: 'Akko', switchType: 'Linear', pricePerUnit: 0.75, pinType: '5-pin', technology: 'Mechanical' } },
    { name: 'Gateron Ink Black V2 (10 pcs)', type: 'switch', price: 7.50, image: 'https://divinikey.com/cdn/shop/products/gateron-oil-king-linear-switches-389141.jpg?v=1642045846&width=1214', specs: { brand: 'Gateron', switchType: 'Linear', pricePerUnit: 0.75, pinType: '5-pin', technology: 'Mechanical' } },
    { name: 'Cherry MX Black (10 pcs)', type: 'switch', price: 4.00, image: 'https://images.unsplash.com/photo-1533158388470-9a56699990c6?w=600&q=80', specs: { brand: 'Cherry', switchType: 'Linear', pricePerUnit: 0.40, pinType: '3-pin', technology: 'Mechanical' } },
    { name: 'Cherry MX Blue (10 pcs)', type: 'switch', price: 4.00, image: 'https://images.unsplash.com/photo-1552550186-b4845dc278be?w=600&q=80', specs: { brand: 'Cherry', switchType: 'Clicky', pricePerUnit: 0.40, pinType: '3-pin', technology: 'Mechanical' } },
    { name: 'Cherry MX Brown (10 pcs)', type: 'switch', price: 4.00, image: 'https://images.unsplash.com/photo-1626218174523-9c86927d6d3d?w=600&q=80', specs: { brand: 'Cherry', switchType: 'Tactile', pricePerUnit: 0.40, pinType: '3-pin', technology: 'Mechanical' } },
    { name: 'NovelKeys Cream (10 pcs)', type: 'switch', price: 6.50, image: 'https://divinikey.com/cdn/shop/products/gateron-oil-king-linear-switches-389141.jpg?v=1642045846&width=1214', specs: { brand: 'NovelKeys', switchType: 'Linear', pricePerUnit: 0.65, pinType: '5-pin', technology: 'Mechanical' } },
    { name: 'Tangerine V2 67g (10 pcs)', type: 'switch', price: 6.50, image: 'https://images.unsplash.com/photo-1533158388470-9a56699990c6?w=600&q=80', specs: { brand: 'C³Equalz', switchType: 'Linear', pricePerUnit: 0.65, pinType: '5-pin', technology: 'Mechanical' } },
    { name: 'Banana Split (10 pcs)', type: 'switch', price: 6.50, image: 'https://images.unsplash.com/photo-1552550186-b4845dc278be?w=600&q=80', specs: { brand: 'C³Equalz', switchType: 'Linear', pricePerUnit: 0.65, pinType: '5-pin', technology: 'Mechanical' } },
    { name: 'Holy Panda (10 pcs)', type: 'switch', price: 10.00, image: 'https://images.unsplash.com/photo-1626218174523-9c86927d6d3d?w=600&q=80', specs: { brand: 'Drop', switchType: 'Tactile', pricePerUnit: 1.00, pinType: '3-pin', technology: 'Mechanical' } },
    { name: 'Boba U4T (10 pcs)', type: 'switch', price: 6.50, image: 'https://images.unsplash.com/photo-1615122171546-815869e06184?w=600&q=80', specs: { brand: 'Gazzew', switchType: 'Tactile', pricePerUnit: 0.65, pinType: '5-pin', technology: 'Mechanical' } },
    { name: 'Zealios V2 67g (10 pcs)', type: 'switch', price: 10.00, image: 'https://images.unsplash.com/photo-1533158388470-9a56699990c6?w=600&q=80', specs: { brand: 'Zeal', switchType: 'Tactile', pricePerUnit: 1.00, pinType: '5-pin', technology: 'Mechanical' } },
    { name: 'Tealios V2 (10 pcs)', type: 'switch', price: 10.00, image: 'https://images.unsplash.com/photo-1552550186-b4845dc278be?w=600&q=80', specs: { brand: 'Zeal', switchType: 'Linear', pricePerUnit: 1.00, pinType: '5-pin', technology: 'Mechanical' } },
    { name: 'Kailh Box Jade (10 pcs)', type: 'switch', price: 3.50, image: 'https://images.unsplash.com/photo-1626218174523-9c86927d6d3d?w=600&q=80', specs: { brand: 'Kailh', switchType: 'Clicky', pricePerUnit: 0.35, pinType: '3-pin', technology: 'Mechanical' } },
    { name: 'Kailh Box Navy (10 pcs)', type: 'switch', price: 3.50, image: 'https://images.unsplash.com/photo-1615122171546-815869e06184?w=600&q=80', specs: { brand: 'Kailh', switchType: 'Clicky', pricePerUnit: 0.35, pinType: '3-pin', technology: 'Mechanical' } },
    { name: 'Alpaca V2 (10 pcs)', type: 'switch', price: 5.50, image: 'https://images.unsplash.com/photo-1533158388470-9a56699990c6?w=600&q=80', specs: { brand: 'PrimeKB', switchType: 'Linear', pricePerUnit: 0.55, pinType: '5-pin', technology: 'Mechanical' } },
    { name: 'Durock T1 (10 pcs)', type: 'switch', price: 5.50, image: 'https://images.unsplash.com/photo-1552550186-b4845dc278be?w=600&q=80', specs: { brand: 'Durock', switchType: 'Tactile', pricePerUnit: 0.55, pinType: '5-pin', technology: 'Mechanical' } },

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
