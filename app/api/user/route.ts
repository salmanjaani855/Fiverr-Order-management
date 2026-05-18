import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken, extractTokenFromCookie } from '@/lib/auth';
import { errorResponse, unauthorizedResponse } from '@/lib/api-utils';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromCookie(request.headers.get('cookie') || '');
    if (!token) {
      return unauthorizedResponse();
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return unauthorizedResponse();
    }

    await connectDB();

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return errorResponse('User not found', 404);
    }

    return NextResponse.json({
      user: {
        userId: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
      },
    });
  } catch (error) {
    console.error('GET user error:', error);
    return errorResponse('Internal server error', 500);
  }
}
