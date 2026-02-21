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
    { name: 'KBD67 Lite R4 Case', type: 'case', price: 65.00, image: 'https://kbdfans.com/cdn/shop/products/8b9cc7c9808a81fc8db0eaf67a4d79d7_0e0b21b4-6501-4e7a-8c2f-56fc8ab6317f.jpg?v=1651812468', specs: { layout: '60%', mountingType: 'Gasket', supportedLayouts: ['60%'] } },
    { name: 'Blade60 Aluminum Case - Grey', type: 'case', price: 99.00, image: 'https://upgradekeyboards.com/cdn/shop/products/blade60-acrylic_1000x.jpg?v=1654984762', specs: { layout: '60%', mountingType: 'Tray', supportedLayouts: ['60%'] } },

    //75% Case
    { name: 'GMMK Pro Barebone - Slate', type: 'case', price: 169.99, image: 'https://m.media-amazon.com/images/I/71Ay3szj8tL.jpg', specs: { layout: '75%', mountingType: 'Gasket', supportedLayouts: ['75%'] } },
    { name: 'MonsGeek M1 - Black', type: 'case', price: 99.00, image: 'https://mercular.s3.ap-southeast-1.amazonaws.com/images/products/2023/07/Product/Product%20content/Week1/KeyMonsGeek%20M1%20Mechanical%20Keyboard%201.jpg', specs: { layout: '75%', mountingType: 'Gasket', supportedLayouts: ['75%'] } },
    { name: 'Keychron Q1 Max', type: 'case', price: 189.00, image: 'https://content.etilize.com/enhanced-overview/en_us/505633/m6X51u5RDqCMFxmy3ZRg_r8Px1v1Eq1LQdZw', specs: { layout: '75%', mountingType: 'Gasket', supportedLayouts: ['75%'] } },
    { name: 'Zoom75 Essential Edition', type: 'case', price: 179.00, image: 'https://meletrix.com/cdn/shop/files/Zoom75_EEWildGreen_PVDGold.jpg?v=1701948402&width=2560', specs: { layout: '75%', mountingType: 'Gasket', supportedLayouts: ['75%'] } },
    { name: 'Mode Sonnet - Heritage', type: 'case', price: 299.00, image: 'https://imboldn.com/wp-content/uploads/2022/04/Mode-Designs-Sonnet-01-800x450.jpg', specs: { layout: '75%', mountingType: 'Isolated Top Mount', supportedLayouts: ['75%'] } },

    //TKL Case
    { name: 'Keychron Q3 Barebone', type: 'case', price: 154.00, image: 'https://www.keyboardco.com/product-images/ansi_q3_carbon_black_rgb_aluminium_barebone_knob_keyboard_large.jpg', specs: { layout: 'TKL', mountingType: 'Gasket', supportedLayouts: ['TKL'] } },
    { name: 'Freebird TKL Case', type: 'case', price: 225.00, image: 'https://keebsforall.com/cdn/shop/products/updatedblue.png?v=1703031654&width=1920', specs: { layout: 'TKL', mountingType: 'Top Mount', supportedLayouts: ['TKL'] } },
    { name: 'MonsGeek M3 - Silver', type: 'case', price: 109.00, image: 'https://www.monsgeek.com/wp-content/uploads/2023/04/M3-QMK-0522-8.jpg', specs: { layout: 'TKL', mountingType: 'Gasket', supportedLayouts: ['TKL'] } },
    { name: 'Frog TKL Case - Navy', type: 'case', price: 280.00, image: 'https://cdn.shopify.com/s/files/1/0477/8210/1155/files/915cb3ef-8397-49ce-a49f-de6bbac28991_rw_1920_600x600.jpg?v=1652785631', specs: { layout: 'TKL', mountingType: 'Tadpole', supportedLayouts: ['TKL'] } },
    { name: 'Tiger 80 Lite Case - Purple', type: 'case', price: 68.00, image: 'https://divinikey.com/cdn/shop/products/kbdfans-tiger-lite-tkl-keyboard-kit-294719.webp?v=1670953801&width=1214', specs: { layout: 'TKL', mountingType: 'Gasket', supportedLayouts: ['TKL'] } },

    //Full-Size Case
    { name: 'MonsGeek M5 - Black', type: 'case', price: 129.00, image: 'https://stackskb.com/wp-content/uploads/2023/11/M5-QMK%E7%89%88%E6%9C%AC-%E9%BB%91%E8%89%B2_%E5%89%8D%E4%BF%AF-1.png', specs: { layout: 'Full', mountingType: 'Gasket', supportedLayouts: ['Full'] } },
    { name: 'Keychron Q6 Max', type: 'case', price: 199.00, image: 'https://www.keychron.co.th/cdn/shop/files/Q6-Max-1_3d821c43-d98d-428f-abd3-e1ddd852681e.jpg?v=1758539897&width=1800', specs: { layout: 'Full', mountingType: 'Gasket', supportedLayouts: ['Full'] } },
    { name: 'Glorious GMMK 2 Full Size 96% - White', type: 'case', price: 119.99, image: 'https://www.kustompcs.co.uk/images/detailed/47/29337.jpg', specs: { layout: 'Full', mountingType: 'Tray', supportedLayouts: ['Full'] } },
    { name: 'Ducky One 3 Full Case - Daybreak', type: 'case', price: 79.00, image: 'https://www.caseking.de/dw/image/v2/BKRR_PRD/on/demandware.static/-/Sites-master-catalog-caseking/default/dw2f6f89c1/images/data/product/GATA/GATA-1580/GATA-1580_7ec7ba9c3bd487d94a5f1eda6c69c5d6d8e09759.jpg?sw=672', specs: { layout: 'Full', mountingType: 'Tray', supportedLayouts: ['Full'] } },
    { name: 'GMMK 2 Full-Size Barebone - Pink', type: 'case', price: 119.99, image: 'https://x-tremesolution.com/cdn/shop/products/GMMK2_65_Pink_Persp_BB_1024x1024.jpg?v=1654235867', specs: { layout: 'Full', mountingType: 'Tray', supportedLayouts: ['Full'] } },


    // --- PCBs ---
    // 60% PCBs
    { name: 'DZ60 RGB V2 Hot-swap', type: 'pcb', price: 58.00, image: 'https://kbdfans.com/cdn/shop/products/DZ60RGBANSI-2000.jpg?v=1627521245', specs: { layout: '60%', mountingType: 'Tray', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'Instant60 PCB', type: 'pcb', price: 62.00, image: 'https://cannonkeys.com/cdn/shop/products/instant60-tsangan-top.jpg?v=1709145358&width=1500', specs: { layout: '60%', mountingType: 'Tray', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'BM60 RGB ISO', type: 'pcb', price: 45.00, image: 'https://kprepublic.com/cdn/shop/products/Ha897ea2223f94af8829a92ebd1a771feh.jpg?v=1597062705', specs: { layout: '60%', mountingType: 'Tray', switchSupport: '3-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'KBD67 RGB Hot-swap PCB', type: 'pcb', price: 55.00, image: 'https://ae01.alicdn.com/kf/H7de2908159684fed9e6d5d7303b2a90as.jpg', specs: { layout: '60%', mountingType: 'Tray', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'XD64 RGB Hot-swap PCB', type: 'pcb', price: 42.00, image: 'https://mickcara.com/cdn/shop/products/8015e6d013feadd5dcab174d28fa6a35_1024x1024.jpg?v=1652860507', specs: { layout: '60%', mountingType: 'Tray', switchSupport: '3-pin', hotSwap: true, socketType: 'Mechanical' } },

    //75% PCBs
    { name: 'GMMK Pro Hot-swap PCB', type: 'pcb', price: 65.00, image: 'https://images.squarespace-cdn.com/content/v1/4f31dc46cb127c78280cc974/1623410989173-XGL9H0F8DT3CJP7FNKQ4/JAS_9895.jpg', specs: { layout: '75%', mountingType: 'Gasket', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'M1 Hot-swap PCB', type: 'pcb', price: 45.00, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEo6hTmWIcd2Alvjd7FozZ6TkUp-tr1s29uA&s', specs: { layout: '75%', mountingType: 'Gasket', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'Q1 RGB PCB', type: 'pcb', price: 60.00, image: 'https://images.mmorpg.com/images/contentImages/382021/Keychron-Q1-PCB-Foam.jpg', specs: { layout: '75%', mountingType: 'Gasket', switchSupport: '3-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'Zoom75 Multi-layout PCB', type: 'pcb', price: 68.00, image: 'https://sc04.alicdn.com/kf/H2f2ce3fe05604ed4b5b5eadb745a2e72d.jpg', specs: { layout: '75%', mountingType: 'Gasket', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'Sonnet Hot-swap PCB', type: 'pcb', price: 75.00, image: 'https://modedesigns.com/cdn/shop/files/sixtyfive-pcb-hs-front.jpg?v=1763067150&width=1920', specs: { layout: '75%', mountingType: 'Top Mount', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },

    //TKL PCBs
    { name: 'M5 Full PCB', type: 'pcb', price: 55.00, image: 'https://www.keyboardkustoms.com/cdn/shop/products/Q3_PE_800x.jpg?v=1656693455', specs: { layout: 'TKL', mountingType: 'Gasket', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'Phantom TKL PCB', type: 'pcb', price: 50.00, image: 'https://mechanicalkeyboards.com/cdn/shop/files/1221-MW6R6-Phantom-PCB-Dual-Layer-Tenkeyless-Electrical-Board.jpg?v=1708533351&width=750', specs: { layout: 'TKL', mountingType: 'Universal', switchSupport: '3-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'M3 RGB Hot-swap PCB', type: 'pcb', price: 48.00, image: 'https://mechanicalkeyboards.com/cdn/shop/files/9680_6290fce97360a_MK61-Hotswap-PCB-ANSI-60-RGB-QMK-VIA-compatible.jpg?v=1707264202', specs: { layout: 'TKL', mountingType: 'Gasket', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'Galatea TKL PCB (Solder)', type: 'pcb', price: 45.00, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGskGeIbFyoBpbgefpiKvHAOWLdamx0x6LEA&s', specs: { layout: 'TKL', mountingType: 'Universal', switchSupport: '5-pin', hotSwap: false, socketType: 'Mechanical' } },
    { name: 'Tiger 80 RGB PCB', type: 'pcb', price: 52.00, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZsfkUpGZDgyxlUkvgr01Mh27K0cvVJkhLZQ&s', specs: { layout: 'TKL', mountingType: 'Gasket', switchSupport: '5-pin', hotSwap: false, socketType: 'Mechanical' } },

    //Full-Size PCBs
    { name: 'Q3 Hot-swap PCB', type: 'pcb', price: 65.00, image: 'https://img.danawa.com/images/descFiles/6/501/5500501_n8azN0tur7_1703422434070.jpeg', specs: { layout: 'Full', mountingType: 'Gasket', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'Q6 Hot-swap PCB', type: 'pcb', price: 70.00, image: 'https://i.etsystatic.com/35181042/r/il/38b400/7410302391/il_300x300.7410302391_q5hl.jpg', specs: { layout: 'Full', mountingType: 'Gasket', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'M3 RGB Hot-swap PCB', type: 'pcb', price: 38.00, image: 'https://m.media-amazon.com/images/I/513AP38flPL._AC_UF1000,1000_QL80_.jpg', specs: { layout: 'Full', mountingType: 'Tray', switchSupport: '3-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'Ducky Full-size Hot-swap PCB', type: 'pcb', price: 49.00, image: 'https://s.alicdn.com/@sc04/kf/Hf5642a957eb34dada468d5f2dda20dbdi/Professional-for-Keyboard-PCB-Board-FR-4-Material-1.0mm-Thickness-Low-Power-Consumption-Multi-Device-Connectivity-for.jpg', specs: { layout: 'Full', mountingType: 'Tray', switchSupport: '3-pin', hotSwap: true, socketType: 'Mechanical' } },
    { name: 'GMMK 2 Full PCB', type: 'pcb', price: 59.00, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO9udPftXcp2qT8w-HdFBLzkbb1_H6-CObfQ&s', specs: { layout: 'Full', mountingType: 'Tray', switchSupport: '5-pin', hotSwap: true, socketType: 'Mechanical' } },

    // --- SWITCHES ---
    { name: 'Gateron Ink Black V2 (10 pcs)', type: 'switch', price: 7.50, image: 'https://www.maxgaming.com/img/bilder/artiklar/21267.jpg?m=1647532073&w=720', specs: { brand: 'Gateron', switchType: 'Linear', pricePerUnit: 0.75, pinType: '5-pin', technology: 'Mechanical' } },
    { name: 'Gateron Milky Yellow Pro (10 pcs)', type: 'switch', price: 3.00, image: 'https://img.advice.co.th/images_nas/pic_product4/A0171940/A0171940OK_ORI_1.jpg', specs: { brand: 'Gateron', switchType: 'Linear', pricePerUnit: 0.30, pinType: '5-pin', technology: 'Mechanical' } },
    { name: 'Gateron Oil King (10 pcs)', type: 'switch', price: 7.50, image: 'https://mercular.s3.ap-southeast-1.amazonaws.com/images/products/2022/05/Product/gateron-oil-king-5-pin-switch-set-linear-10-pieces-black.jpg', specs: { brand: 'Gateron', switchType: 'Linear', pricePerUnit: 0.75, pinType: '5-pin', technology: 'Mechanical' } },
    { name: 'Akko V3 Cream Yellow (10 pcs)', type: 'switch', price: 3.50, image: 'https://monsgeek.eu/cdn/shop/files/V3-Cream-Yellow-Pro-Switch-2.png?v=1696825271&width=1500', specs: { brand: 'Akko', switchType: 'Linear', pricePerUnit: 0.35, pinType: '3-pin', technology: 'Mechanical' } },
    { name: 'Akko V3 Cream Blue (10 pcs)', type: 'switch', price: 3.50, image: 'https://en.akkogear.com/wp-content/uploads/2023/04/V3-Cream-Blue-Pro.jpg', specs: { brand: 'Akko', switchType: 'Tactile', pricePerUnit: 0.35, pinType: '3-pin', technology: 'Mechanical' } },
    { name: 'Gazzew Boba U4T (10 pcs)', type: 'switch', price: 8.50, image: 'https://ae01.alicdn.com/kf/Sc353b7c4a0664ee28d06e7cb37f42f99X.jpg?has_lang=1&ver=2', specs: { brand: 'Gazzew', switchType: 'Tactile', pricePerUnit: 0.85, pinType: '5-pin', technology: 'Mechanical' } },
    { name: 'C3 Tangerine (10 pcs)', type: 'switch', price: 7.00, image: 'https://www.keycrox.co.uk/products/NNOUOD8I_apj.webp?v=uodate2020', specs: { brand: 'C3Equalz', switchType: 'Linear', pricePerUnit: 0.70, pinType: '5-pin', technology: 'Mechanical' } },
    { name: 'Drop Holy Panda X (10 pcs)', type: 'switch', price: 11.00, image: 'https://m.media-amazon.com/images/I/715S94Hkn8L.jpg', specs: { brand: 'Drop', switchType: 'Tactile', pricePerUnit: 1.10, pinType: '5-pin', technology: 'Mechanical' } },
    { name: 'Kailh Box White (10 pcs)', type: 'switch', price: 4.50, image: 'https://m.media-amazon.com/images/I/61WAz0mZBVL._AC_.jpg', specs: { brand: 'Kailh', switchType: 'Clicky', pricePerUnit: 0.45, pinType: '3-pin', technology: 'Mechanical' } },
    { name: 'Kailh Box Jade (10 pcs)', type: 'switch', price: 5.00, image: 'https://m.media-amazon.com/images/I/71+zNOn+UNL._AC_UF1000,1000_QL80_.jpg', specs: { brand: 'Kailh', switchType: 'Clicky', pricePerUnit: 0.50, pinType: '3-pin', technology: 'Mechanical' } },
    { name: 'Kailh Box Navy (10 pcs)', type: 'switch', price: 5.00, image: 'https://m.media-amazon.com/images/I/51LyOCqPodL._AC_UF894,1000_QL80_.jpg', specs: { brand: 'Kailh', switchType: 'Clicky', pricePerUnit: 0.50, pinType: '3-pin', technology: 'Mechanical' } },
    { name: 'Alpaca V2 (10 pcs)', type: 'switch', price: 6.80, image: 'https://images.unsplash.com/photo-1533158388470-9a56699990c6?w=600&q=80', specs: { brand: 'PrimeKB', switchType: 'Linear', pricePerUnit: 0.68, pinType: '5-pin', technology: 'Mechanical' } },
    { name: 'Cherry MX Brown (10 pcs)', type: 'switch', price: 5.50, image: 'https://m.media-amazon.com/images/I/51T84asCoTL._AC_UF1000,1000_QL80_.jpg', specs: { brand: 'Cherry', switchType: 'Tactile', pricePerUnit: 0.55, pinType: '3-pin', technology: 'Mechanical' } },

    // --- KEYCAPS ---
    { name: 'Honey Milk PBT Set', type: 'keycap', price: 35.00, image: 'https://down-th.img.susercontent.com/file/cn-11134207-7r98o-lu7ivxqasgas6c', specs: { material: 'PBT', layoutSupport: ['60%', '75%', 'TKL', 'Full'] } },
    { name: 'Modern Dolch Dark', type: 'keycap', price: 45.00, image: 'https://i.redd.it/9f98yscnzr251.jpg', specs: { material: 'PBT', layoutSupport: ['60%', '75%', 'TKL'] } },
    { name: 'GMK Laser Custom', type: 'keycap', price: 115.00, image: 'https://massdrop-s3.imgix.net/product-images/drop-mito-gmk-laser-custom-keycap-set/FP/spxHEVgTzWv9DwpBFceU_PC.png?auto=format&fm=jpg&fit=crop&w=600&h=315&dpr=1&bg=f0f0f0', specs: { material: 'ABS', layoutSupport: ['60%', 'TKL'] } },
    { name: 'Botanical Garden PBT', type: 'keycap', price: 39.00, image: 'https://kprepublic.com/cdn/shop/products/Ghost-Judges-GJ-Botanical-Garden-Colorway-Cherry-PBT-Doubleshot-keycap-for-mx-keyboard-60-65-87_dd1695d4-35c3-44fb-9969-7d323eec2e6e.jpg?v=1665814548', specs: { material: 'PBT', layoutSupport: ['60%', '75%', 'TKL', 'Full'] } },
    { name: 'Japanese Root White', type: 'keycap', price: 32.00, image: 'https://i.ebayimg.com/images/g/ymAAAOSwJPtkMiFT/s-l400.jpg', specs: { material: 'PBT', layoutSupport: ['60%', 'TKL'] } },
    { name: 'Retro Carbon Set', type: 'keycap', price: 38.00, image: 'https://down-th.img.susercontent.com/file/599393dbe5c44a7d7bf152f6efe2b526', specs: { material: 'PBT', layoutSupport: ['60%', 'TKL', 'Full'] } },
    { name: 'Matcha Tea XDA', type: 'keycap', price: 34.00, image: 'https://ae01.alicdn.com/kf/Hb2c9104cc9de4ac9aa3a1221ec1041e7H.jpg', specs: { material: 'PBT', layoutSupport: ['60%', '75%'] } },
    { name: 'PBTfans WOB Classic', type: 'keycap', price: 75.00, image: 'https://kbdfans.com/cdn/shop/products/wob_2f8fada9-3a28-4f4f-9294-eb23eec22a7a.jpg?v=1704245794', specs: { material: 'PBT', layoutSupport: ['60%', '75%', 'TKL', 'Full'] } },
    { name: 'PBTfans Neon Tripleshot', type: 'keycap', price: 95.00, image: 'https://ae01.alicdn.com/kf/S2ae0baa38eab45e19f544f8119f1b5a5K.jpg', specs: { material: 'PBT', layoutSupport: ['60%', '75%', 'TKL', 'Full'] } },
    { name: 'Olivia Pink Base Kit', type: 'keycap', price: 42.00, image: 'https://novelkeys.com/cdn/shop/products/PBT_Olivia_Tile_1200x.jpg?v=1672246856', specs: { material: 'ABS', layoutSupport: ['60%', 'TKL'] } },
    { name: 'Marrs Green Akko Set', type: 'keycap', price: 49.00, image: 'https://en.akkogear.com/wp-content/uploads/2022/12/Marrs-Green-SP2.jpg', specs: { material: 'PBT', layoutSupport: ['60%', '75%', 'TKL', 'Full'] } },
    { name: 'Meow Kitty MOA', type: 'keycap', price: 40.00, image: 'https://curiositycaps.in/cdn/shop/files/Screenshot_20241206_013521_Amazon.jpg?v=1764169201', specs: { material: 'PBT', layoutSupport: ['60%', '75%'] } },
    { name: 'BOW Cherry Profile', type: 'keycap', price: 36.00, image: 'https://cdn.shopify.com/s/files/1/0059/0630/1017/t/5/assets/keycapsonblackframedkeyboard-1661940723116.jpg?v=1661940725', specs: { material: 'PBT', layoutSupport: ['60%', '75%', 'TKL', 'Full'] } },
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
