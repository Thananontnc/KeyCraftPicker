import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Build } from '@/models/Schemas';

export async function GET(request, { params }) {
    await dbConnect();
    const { id } = await params;
    try {
        const build = await Build.findById(id).populate('parts.case parts.pcb parts.switch parts.keycap');
        if (!build) return NextResponse.json({ success: false, error: 'Build not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: build }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PUT(request, { params }) {
    await dbConnect();
    const { id } = await params;
    try {
        const data = await request.json();
        const build = await Build.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!build) return NextResponse.json({ success: false, error: 'Build not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: build }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const { id } = await params;
    try {
        const build = await Build.findByIdAndDelete(id);
        if (!build) return NextResponse.json({ success: false, error: 'Build not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
