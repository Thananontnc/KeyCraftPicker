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

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'User already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            password: hashedPassword,
            role: 'user', // Default role
        });

        return NextResponse.json({ success: true, data: { username: user.username, role: user.role } }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
