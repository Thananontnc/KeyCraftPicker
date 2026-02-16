import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/Schemas';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    await dbConnect();
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: 'Please provide username and password' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // In a real production app, we would issue a JWT or Session Cookie here.
        // For this project scope, returning the user object (minus password) is sufficient for client-side state.
        // Security Note: NextAuth.js is recommended for robust auth, but manual implementation requested.

        return NextResponse.json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                role: user.role,
                avatar: user.avatar,
                bio: user.bio
            }
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
