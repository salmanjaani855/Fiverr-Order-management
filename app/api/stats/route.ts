import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken, extractTokenFromCookie } from '@/lib/auth';
import { errorResponse, successResponse, unauthorizedResponse } from '@/lib/api-utils';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = extractTokenFromCookie(request.headers.get('cookie') || '');
    if (!token) {
      return unauthorizedResponse();
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return unauthorizedResponse();
    }

    const orders = await Order.find({ userId: decoded.userId });

    const totalOrders = orders.length;
    const revisions = orders.filter(o => o.status === 'revision').length;
    const totalEarnings = orders.reduce((sum, order) => sum + order.price, 0);

    return successResponse({
      stats: {
        totalOrders,
        revisions,
        totalEarnings,
      },
    });
  } catch (error) {
    console.error('GET stats error:', error);
    return errorResponse('Internal server error', 500);
  }
}
