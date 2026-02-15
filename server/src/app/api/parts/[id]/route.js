import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Part } from '@/models/Schemas';

export async function GET(request, { params }) {
    await dbConnect();
    const { id } = params;
    try {
        const part = await Part.findById(id);
        if (!part) return NextResponse.json({ success: false, error: 'Part not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: part }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PUT(request, { params }) {
    await dbConnect();
    const { id } = params;
    try {
        const data = await request.json();
        const part = await Part.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!part) return NextResponse.json({ success: false, error: 'Part not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: part }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const { id } = params;
    try {
        const part = await Part.findByIdAndDelete(id);
        if (!part) return NextResponse.json({ success: false, error: 'Part not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
