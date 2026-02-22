import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Build } from '@/models/Schemas';
import { verifyToken } from '@/lib/jwt';

// POST — Toggle like on a build
export async function POST(request, { params }) {
    await dbConnect();

    // Require authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ success: false, error: 'Login required to like builds' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
        return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 });
    }

    const { id } = await params;
    const userId = decoded.id;

    try {
        const build = await Build.findById(id);
        if (!build) {
            return NextResponse.json({ success: false, error: 'Build not found' }, { status: 404 });
        }

        // Toggle like
        const likeIndex = build.likes.indexOf(userId);
        if (likeIndex > -1) {
            // Already liked — remove like
            build.likes.splice(likeIndex, 1);
        } else {
            // Not liked yet — add like
            build.likes.push(userId);
        }

        await build.save();

        return NextResponse.json({
            success: true,
            liked: likeIndex === -1, // true if we just added a like
            likesCount: build.likes.length
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
