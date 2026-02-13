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
    // --- CASES (12 items) ---
    { name: 'Tofu60 Redux Case - Black', type: 'case', price: 89.00, image: 'https://kbdfans.com/cdn/shop/files/1_3a59880f-960b-46a4-9988-51e6caf0728c.jpg', specs: { layout: '60%', mountingType: 'Tray', supportedLayouts: ['60%'] } },
    { name: 'Tofu60 Redux Case - E-White', type: 'case', price: 99.00, image: 'https://kbdfans.com/cdn/shop/files/1_3a59880f-960b-46a4-9988-51e6caf0728c.jpg', specs: { layout: '60%', mountingType: 'Tray', supportedLayouts: ['60%'] } },
    { name: 'Tofu60 Redux Case - Burgundy', type: 'case', price: 89.00, image: 'https://kbdfans.com/cdn/shop/files/1_3a59880f-960b-46a4-9988-51e6caf0728c.jpg', specs: { layout: '60%', mountingType: 'Tray', supportedLayouts: ['60%'] } },
    { name: 'Tofu65 2.0 Case - Grey', type: 'case', price: 109.00, image: 'https://kbdfans.com/cdn/shop/products/1_2d103323-9c88-469b-8e28-1c3905e3f59d.jpg', specs: { layout: '65%', mountingType: 'Gasket', supportedLayouts: ['65%'] } },
    { name: 'KBD67 Lite R4 Case - Transparent', type: 'case', price: 109.00, image: 'https://kbdfans.com/cdn/shop/products/1_2d103323-9c88-469b-8e28-1c3905e3f59d.jpg', specs: { layout: '65%', mountingType: 'Gasket', supportedLayouts: ['65%'] } },
    { name: 'KBD67 Lite R4 Case - White', type: 'case', price: 109.00, image: 'https://kbdfans.com/cdn/shop/products/1_2d103323-9c88-469b-8e28-1c3905e3f59d.jpg', specs: { layout: '65%', mountingType: 'Gasket', supportedLayouts: ['65%'] } },
    { name: 'Mode Sonnet - Navy', type: 'case', price: 299.00, image: 'https://modedesigns.com/cdn/shop/files/Sonnet-Navy-Top-Copper-Bottom-1.jpg', specs: { layout: '75%', mountingType: 'Isolated Top', supportedLayouts: ['75%'] } },
    { name: 'Mode Sonnet - White', type: 'case', price: 299.00, image: 'https://modedesigns.com/cdn/shop/files/Sonnet-Navy-Top-Copper-Bottom-1.jpg', specs: { layout: '75%', mountingType: 'Isolated Top', supportedLayouts: ['75%'] } },
    { name: 'Mode Envoy - Mirage', type: 'case', price: 199.00, image: 'https://modedesigns.com/cdn/shop/products/Envoy-Mirage-1.jpg', specs: { layout: '65%', mountingType: 'Lattice Block', supportedLayouts: ['65%'] } },
    { name: 'Zoom75 EE - Milk Tea', type: 'case', price: 189.00, image: 'https://meletrix.com/cdn/shop/files/Zoom75_Milk_Tea_1.jpg', specs: { layout: '75%', mountingType: 'Gasket', supportedLayouts: ['75%'] } },
    { name: 'QK65v2 - Silver', type: 'case', price: 160.00, image: 'https://www.qwertykeys.com/cdn/shop/files/QK65v2_Silver_1.jpg', specs: { layout: '65%', mountingType: 'Gasket', supportedLayouts: ['65%'] } },
    { name: 'Keychron Q1 Pro - Black', type: 'case', price: 179.00, image: 'https://cdn.shopify.com/s/files/1/0059/0630/1017/files/Keychron-Q1-Pro-QMK-VIA-Wireless-Custom-Mechanical-Keyboard-Carbon-Black-Knob-for-Mac-Windows-Linux_1800x1800.jpg', specs: { layout: '75%', mountingType: 'Gasket', supportedLayouts: ['75%'] } },
    { name: 'Keychron Q2 - Navy', type: 'case', price: 159.00, image: 'https://cdn.shopify.com/s/files/1/0059/0630/1017/products/Keychron-Q2-QMK-Custom-Mechanical-Keyboard-Navy-Blue-Knob_1800x1800.jpg', specs: { layout: '65%', mountingType: 'Gasket', supportedLayouts: ['65%'] } },
    { name: 'GMMK Pro - White', type: 'case', price: 169.99, image: 'https://cdn.shopify.com/s/files/1/0549/2681/products/gmmk-pro-white-ice-top-down_1200x.jpg', specs: { layout: '75%', mountingType: 'Gasket', supportedLayouts: ['75%'] } },
    { name: 'Wooting 60HE Case', type: 'case', price: 69.00, image: 'https://wooting.io/assets/images/60he/wooting-60he-module-iso.png', specs: { layout: '60%', mountingType: 'Tray', supportedLayouts: ['60%'] } },

    // --- PCBs (10 items) ---
    { name: 'DZ60RGB V2 Hot-swap PCB', type: 'pcb', price: 55.00, image: 'https://kbdfans.com/cdn/shop/products/DZ60RGB-ANSI-V2_1.jpg', specs: { layout: '60%', mountingType: 'Tray', switchSupport: '5-pin', hotSwap: true } },
    { name: 'DZ60 Solder PCB', type: 'pcb', price: 38.00, image: 'https://kbdfans.com/cdn/shop/products/DZ60_REV3.0_1.jpg', specs: { layout: '60%', mountingType: 'Tray', switchSupport: '5-pin', hotSwap: false } },
    { name: 'KBD67 Mark II RGB PCB', type: 'pcb', price: 58.00, image: 'https://kbdfans.com/cdn/shop/products/KBD67_MKII_RGB_V3_PCB.jpg', specs: { layout: '65%', mountingType: 'Top', switchSupport: '5-pin', hotSwap: true } },
    { name: 'Mode Sonnet PCB - Hotswap', type: 'pcb', price: 65.00, image: 'https://modedesigns.com/cdn/shop/products/Sonnet-PCB-Hotswap.jpg', specs: { layout: '75%', mountingType: 'Isolated Top', switchSupport: '5-pin', hotSwap: true } },
    { name: 'Mode Envoy PCB - Solder', type: 'pcb', price: 45.00, image: 'https://modedesigns.com/cdn/shop/products/Envoy-PCB-Solder.jpg', specs: { layout: '65%', mountingType: 'Lattice Block', switchSupport: '5-pin', hotSwap: false } },
    { name: 'Zoom75 Tri-mode PCB', type: 'pcb', price: 75.00, image: 'https://meletrix.com/cdn/shop/files/Zoom75_PCB.jpg', specs: { layout: '75%', mountingType: 'Gasket', switchSupport: '5-pin', hotSwap: true } },
    { name: 'Keychron Q1 PCB', type: 'pcb', price: 49.00, image: 'https://cdn.shopify.com/s/files/1/0059/0630/1017/products/Keychron-Q1-PCB_1800x1800.jpg', specs: { layout: '75%', mountingType: 'Gasket', switchSupport: '5-pin', hotSwap: true } },
    { name: 'Hineybush h87a', type: 'pcb', price: 55.00, image: 'https://hineybush.com/cdn/shop/products/h87a_1.jpg', specs: { layout: 'TKL', mountingType: 'Top', switchSupport: '5-pin', hotSwap: false } },
    { name: 'Wilba.tech WT60-D', type: 'pcb', price: 60.00, image: 'https://novelkeys.com/cdn/shop/products/wt60-d.jpg', specs: { layout: '60%', mountingType: 'Tray', switchSupport: '5-pin', hotSwap: false } },
    { name: '1up Keyboards 60% HSE PCB', type: 'pcb', price: 45.00, image: 'https://1upkeyboards.com/wp-content/uploads/2018/06/1upkeyboards-60-hse-pcb-front.jpg', specs: { layout: '60%', mountingType: 'Tray', switchSupport: '3-pin', hotSwap: true } },

    // --- SWITCHES (16 items) ---
    { name: 'Gateron Oil King (10 pcs)', type: 'switch', price: 6.50, image: 'https://cdn.shopify.com/s/files/1/1473/3902/products/GateronOilKings01.jpg', specs: { brand: 'Gateron', switchType: 'Linear', pricePerUnit: 0.65 } },
    { name: 'Gateron Ink Black V2 (10 pcs)', type: 'switch', price: 7.50, image: 'https://cdn.shopify.com/s/files/1/1473/3902/products/GateronInkBlackV2.jpg', specs: { brand: 'Gateron', switchType: 'Linear', pricePerUnit: 0.75 } },
    { name: 'Cherry MX Black (10 pcs)', type: 'switch', price: 4.00, image: 'https://cdn.shopify.com/s/files/1/1473/3902/products/CherryMXBlack.jpg', specs: { brand: 'Cherry', switchType: 'Linear', pricePerUnit: 0.40 } },
    { name: 'Cherry MX Blue (10 pcs)', type: 'switch', price: 4.00, image: 'https://cdn.shopify.com/s/files/1/1473/3902/products/CherryMXBlue.jpg', specs: { brand: 'Cherry', switchType: 'Clicky', pricePerUnit: 0.40 } },
    { name: 'Cherry MX Brown (10 pcs)', type: 'switch', price: 4.00, image: 'https://cdn.shopify.com/s/files/1/1473/3902/products/CherryMXBrown.jpg', specs: { brand: 'Cherry', switchType: 'Tactile', pricePerUnit: 0.40 } },
    { name: 'NovelKeys Cream (10 pcs)', type: 'switch', price: 6.50, image: 'https://novelkeys.com/cdn/shop/products/nk_cream_switch_1.jpg', specs: { brand: 'NovelKeys', switchType: 'Linear', pricePerUnit: 0.65 } },
    { name: 'Tangerine V2 67g (10 pcs)', type: 'switch', price: 6.50, image: 'https://thekey.company/cdn/shop/products/Tangerine_Switch_1.jpg', specs: { brand: 'C³Equalz', switchType: 'Linear', pricePerUnit: 0.65 } },
    { name: 'Banana Split (10 pcs)', type: 'switch', price: 6.50, image: 'https://thekey.company/cdn/shop/products/BananaSplit_Switch_1.jpg', specs: { brand: 'C³Equalz', switchType: 'Linear', pricePerUnit: 0.65 } },
    { name: 'Holy Panda (10 pcs)', type: 'switch', price: 10.00, image: 'https://drop.com/cdn/shop/products/drop-holy-panda-x-mechanical-switches-mdu-1_1.jpg', specs: { brand: 'Drop', switchType: 'Tactile', pricePerUnit: 1.00 } },
    { name: 'Boba U4T (10 pcs)', type: 'switch', price: 6.50, image: 'https://cdn.shopify.com/s/files/1/0275/3416/4040/products/boba-u4t.jpg', specs: { brand: 'Gazzew', switchType: 'Tactile', pricePerUnit: 0.65 } },
    { name: 'Zealios V2 67g (10 pcs)', type: 'switch', price: 10.00, image: 'https://zealpc.net/cdn/shop/products/Zealios_V2.jpg', specs: { brand: 'Zeal', switchType: 'Tactile', pricePerUnit: 1.00 } },
    { name: 'Tealios V2 (10 pcs)', type: 'switch', price: 10.00, image: 'https://zealpc.net/cdn/shop/products/Tealios_V2.jpg', specs: { brand: 'Zeal', switchType: 'Linear', pricePerUnit: 1.00 } },
    { name: 'Kailh Box Jade (10 pcs)', type: 'switch', price: 3.50, image: 'https://cdn.shopify.com/s/files/1/1473/3902/products/KailhBoxJade.jpg', specs: { brand: 'Kailh', switchType: 'Clicky', pricePerUnit: 0.35 } },
    { name: 'Kailh Box Navy (10 pcs)', type: 'switch', price: 3.50, image: 'https://cdn.shopify.com/s/files/1/1473/3902/products/KailhBoxNavy.jpg', specs: { brand: 'Kailh', switchType: 'Clicky', pricePerUnit: 0.35 } },
    { name: 'Alpaca V2 (10 pcs)', type: 'switch', price: 5.50, image: 'https://primekb.com/cdn/shop/products/alpaca_switch.jpg', specs: { brand: 'PrimeKB', switchType: 'Linear', pricePerUnit: 0.55 } },
    { name: 'Durock T1 (10 pcs)', type: 'switch', price: 5.50, image: 'https://divinikey.com/cdn/shop/products/durock-t1-tactile-switches.jpg', specs: { brand: 'Durock', switchType: 'Tactile', pricePerUnit: 0.55 } },

    // --- KEYCAPS (12 items) ---
    { name: 'GMK Minimal', type: 'keycap', price: 110.00, image: 'https://cdn.shopify.com/s/files/1/1473/3902/products/3_1_18f2b7f7-3475-4f4d-b65a-0d6118d5314f.jpg', specs: { material: 'ABS', layoutSupport: ['60%', '65%', '75%', 'TKL', 'Full'] } },
    { name: 'GMK Red Samurai', type: 'keycap', price: 120.00, image: 'https://drop.com/cdn/shop/products/gmk_red_samurai_base.jpg', specs: { material: 'ABS', layoutSupport: ['60%', '65%', 'TKL'] } },
    { name: 'GMK Olivia++Light', type: 'keycap', price: 130.00, image: 'https://novelkeys.com/cdn/shop/products/olivia_light.jpg', specs: { material: 'ABS', layoutSupport: ['60%', '65%', '75%', 'TKL', 'Full'] } },
    { name: 'GMK Botany', type: 'keycap', price: 125.00, image: 'https://omnitype.com/cdn/shop/products/gmk-botany-render.jpg', specs: { material: 'ABS', layoutSupport: ['60%', '65%', '75%', 'TKL'] } },
    { name: 'ePBT 9009', type: 'keycap', price: 89.00, image: 'https://kbdfans.com/cdn/shop/products/ePBT_9009.jpg', specs: { material: 'PBT', layoutSupport: ['60%', '65%', '75%', 'TKL', 'Full'] } },
    { name: 'ePBT Sushi', type: 'keycap', price: 79.00, image: 'https://kbdfans.com/cdn/shop/products/ePBT_Sushi.jpg', specs: { material: 'PBT', layoutSupport: ['60%', '65%', '75%', 'TKL', 'Full'] } },
    { name: 'NicePBT Sugarplum', type: 'keycap', price: 65.00, image: 'https://cannonkeys.com/cdn/shop/products/NicePBT_Sugarplum.jpg', specs: { material: 'PBT', layoutSupport: ['60%', '65%', '75%', 'TKL', 'Full'] } },
    { name: 'Akko Carbon Retro', type: 'keycap', price: 50.00, image: 'https://en.akkogear.com/wp-content/uploads/2021/08/Carbon-Retro-Keycaps-01.jpg', specs: { material: 'PBT', layoutSupport: ['60%', '65%', '75%', 'TKL', 'Full'] } },
    { name: 'Drop + MiTo MT3 Cyber', type: 'keycap', price: 95.00, image: 'https://drop.com/cdn/shop/products/mt3_cyber_base.jpg', specs: { material: 'ABS', layoutSupport: ['60%', '65%', 'TKL'] } },
    { name: 'Drop + Matt3o MT3 Susuwatari', type: 'keycap', price: 95.00, image: 'https://drop.com/cdn/shop/products/mt3_susuwatari_base.jpg', specs: { material: 'ABS', layoutSupport: ['60%', '65%', 'TKL', 'Full'] } },
    { name: 'Cerakey Ceramic Keycaps - White', type: 'keycap', price: 120.00, image: 'https://cerakey.com/cdn/shop/products/Cerakey_White_Set.jpg', specs: { material: 'Ceramic', layoutSupport: ['60%', '65%', 'TKL', 'Full'] } },
    { name: 'PolyCaps Seal', type: 'keycap', price: 65.00, image: 'https://kineticlabs.com/cdn/shop/products/polycaps-seal-keycaps.jpg', specs: { material: 'PBT', layoutSupport: ['60%', '65%', '75%', 'TKL', 'Full'] } },
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
