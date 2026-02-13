import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Part } from '@/models/Schemas';

export async function POST(request) {
    await dbConnect();
    try {
        const data = await request.json();
        // Validate specific fields based on type
        const { specs, type } = data;
        const errors = [];

        if (type === 'case') {
            if (!specs.layout) errors.push('Case requires "layout"');
            if (!specs.mountingType) errors.push('Case requires "mountingType"');
            if (!specs.supportedLayouts) errors.push('Case requires "supportedLayouts"');
        } else if (type === 'pcb') {
            if (!specs.layout) errors.push('PCB requires "layout"');
            if (!specs.mountingType) errors.push('PCB requires "mountingType"');
            if (!specs.switchSupport) errors.push('PCB requires "switchSupport" (3-pin/5-pin)');
        } else if (type === 'switch') {
            if (!specs.brand) errors.push('Switch requires "brand"');
            if (!specs.switchType) errors.push('Switch requires "switchType" (Linear/Tactile/Clicky)');
            if (!specs.pricePerUnit) errors.push('Switch requires "pricePerUnit"');
        } else if (type === 'keycap') {
            if (!specs.material) errors.push('Keycap requires "material"');
            if (!specs.layoutSupport) errors.push('Keycap requires "layoutSupport"');
        }

        if (errors.length > 0) {
            return NextResponse.json({ success: false, error: errors.join(', ') }, { status: 400 });
        }

        const newPart = await Part.create(data);
        return NextResponse.json({ success: true, data: newPart }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let query = {};
    if (type) {
        query.type = type;
    }

    try {
        const parts = await Part.find(query);
        return NextResponse.json({ success: true, data: parts }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
