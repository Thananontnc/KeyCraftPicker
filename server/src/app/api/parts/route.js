import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Part } from '@/models/Schemas';

export async function POST(request) {
    await dbConnect();
    try {
        const data = await request.json();
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
