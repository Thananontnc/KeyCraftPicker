import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Build } from '@/models/Schemas';

// GET all public builds for the community showcase
export async function GET(request) {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'newest';
    const search = searchParams.get('search') || '';

    try {
        // Only fetch builds marked as public
        const query = { isPublic: true };

        // Search filter
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Sort options
        let sortOption = {};
        switch (sort) {
            case 'popular':
                // Sort by number of likes (we'll use aggregation or sort after)
                sortOption = { createdAt: -1 }; // fallback, we'll sort in JS
                break;
            case 'price-high':
                sortOption = { totalPrice: -1 };
                break;
            case 'price-low':
                sortOption = { totalPrice: 1 };
                break;
            case 'newest':
            default:
                sortOption = { createdAt: -1 };
                break;
        }

        let builds = await Build.find(query)
            .populate('parts.case parts.pcb parts.switch parts.keycap')
            .populate('userId', 'username avatar')
            .sort(sortOption)
            .lean();

        // If sorting by popular, sort by likes count
        if (sort === 'popular') {
            builds.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        }

        return NextResponse.json({ success: true, data: builds }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
