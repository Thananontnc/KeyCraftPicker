import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Build } from '@/models/Schemas';
import { verifyToken } from '@/lib/jwt';

// GET all builds (optionally filter by userId)
export async function GET(request) {
    await dbConnect();

    // Check for JWT
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Allow public access? Or restricted? 
        // For now, let's keep it restricted to ensure security, or allow query param if public sharing is intended.
        // Implementation: Public profile viewing might need query param, but "My Builds" needs token.
        // Let's support both: Token takes precedence.
    }

    const { searchParams } = new URL(request.url);
    let userId = searchParams.get('userId');

    // If token exists, verify it
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        if (decoded) {
            // If the user is requesting their own builds (no specific userId param), use token ID
            if (!userId) {
                userId = decoded.id;
            }
        }
    }

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

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 });
    }

    try {
        const data = await request.json();

        // Force userId to match the token, preventing spoofing
        data.userId = decoded.id;

        const newBuild = await Build.create(data);

        return NextResponse.json({ success: true, data: newBuild }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
