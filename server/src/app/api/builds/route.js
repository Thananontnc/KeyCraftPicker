import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Build } from '@/models/Schemas';

// GET all builds (optionally filter by userId)
export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    try {
        const query = userId ? { userId } : {};
        // Populate parts to show details instead of just IDs
        const builds = await Build.find(query).populate('parts.case parts.pcb parts.switch parts.keycap');

        return NextResponse.json({ success: true, data: builds }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// CREATE a new build
export async function POST(request) {
    await dbConnect();
    try {
        const data = await request.json();

        // data should ensure parts structure matches schema
        const newBuild = await Build.create(data);

        return NextResponse.json({ success: true, data: newBuild }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
