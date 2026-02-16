import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

const partSchema = new mongoose.Schema({
    name: String,
    type: { type: String, enum: ['case', 'pcb', 'switch', 'keycap'] },
    price: Number,
    image: String,
    specs: mongoose.Schema.Types.Mixed
});

const Part = mongoose.models.Part || mongoose.model('Part', partSchema);

export async function GET() {
    try {
        await dbConnect();

        // Define our presets by exact Part Name to ensure we get the right items ตรงนี้เอาใว้ใช้ Suggestion 
        const presetsConfig = [
            {
                id: 'creamy-dream',
                title: 'The Creamy Dream ☁️',
                description: 'A 75% gasket-mounted build focused on deep, creamy acoustics.',
                parts: {
                    case: 'MonsGeek M1 - Black',
                    pcb: 'M1 Hot-swap PCB',
                    switch: 'Akko V3 Cream Yellow (10 pcs)',
                    keycap: 'Olivia Pink Base Kit' // Replaced NicePBT Sugarplum
                }
            },
            {
                id: 'thocky-king',
                title: 'The Thocky King 👑',
                description: 'Premium aluminum 75% with heavy linear switches for that deep "thock".',
                parts: {
                    case: 'Keychron Q1 Max',
                    pcb: 'Q1 RGB PCB',
                    switch: 'Gateron Ink Black V2 (10 pcs)',
                    keycap: 'PBTfans WOB Classic' // Replaced Cerakey
                }
            },
            {
                id: 'classic-60',
                title: 'Classic Tofu 🧊',
                description: 'The quintessential 60% tray mount starter. Reliable and clean.',
                parts: {
                    case: 'Tofu60 Redux Case - - Black',
                    pcb: 'DZ60 RGB V2 Hot-swap',
                    switch: 'Drop Holy Panda X (10 pcs)', // Updated name
                    keycap: 'BOW Cherry Profile' // Replaced GMK Minimal
                }
            }
        ];

        const results = [];

        // Helper to escape regex special characters
        const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Collect all part names to fetch in one go (optimization)
        const allPartNames = presetsConfig.flatMap(p => Object.values(p.parts));

        // Use regex for case-insensitive matching to be safer, BUT escape special chars like ()
        const partsDocs = await Part.find({
            name: { $in: allPartNames.map(name => new RegExp(`^${escapeRegex(name)}$`, 'i')) }
        });

        // Map for easy lookup: Lowercase Name -> Doc
        const partsMap = {};
        partsDocs.forEach(doc => {
            partsMap[doc.name.toLowerCase()] = doc;
        });

        for (const preset of presetsConfig) {
            const currentPartsMap = {};
            let totalPrice = 0;
            let missing = false;

            for (const [type, name] of Object.entries(preset.parts)) {
                const partDoc = partsMap[name.toLowerCase()];
                if (partDoc) {
                    currentPartsMap[type] = partDoc;
                    totalPrice += partDoc.price;
                } else {
                    missing = true;
                    console.warn(`Missing part for preset ${preset.id}: ${name}`);
                }
            }

            if (!missing) {
                results.push({
                    id: preset.id,
                    title: preset.title,
                    description: preset.description,
                    parts: currentPartsMap,
                    totalPrice: totalPrice.toFixed(2),
                    image: currentPartsMap.case?.image || '' // Use case image as thumbnail
                });
            }
        }

        return NextResponse.json({ success: true, presets: results });

    } catch (error) {
        console.error('Error fetching presets:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch presets' }, { status: 500 });
    }
}
