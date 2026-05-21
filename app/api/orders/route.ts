import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken, extractTokenFromCookie } from '@/lib/auth';
import { errorResponse, successResponse, unauthorizedResponse } from '@/lib/api-utils';
import Order from '@/models/Order';
import Account from '@/models/Account';

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

    const orders = await Order.find({ userId: decoded.userId })
      .populate('accountId')
      .sort({ createdAt: -1 });

    return successResponse({ orders });
  } catch (error) {
    console.error('GET orders error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { accountId, clientName, duration, price, status, description } = body;

    if (!accountId || !clientName || duration === undefined || price === undefined) {
      return errorResponse('Missing required fields');
    }

    const account = await Account.findOne({ _id: accountId, userId: decoded.userId });
    if (!account) {
      return errorResponse('Account not found');
    }

    const order = new Order({
      userId: decoded.userId,
      accountId,
      clientName,
      duration,
      price,
      status: status || 'in-progress',
      description: description || '',
    });

    await order.save();

    const saved = await Order.findById(order._id).populate('accountId');
    return successResponse({ order: saved }, 201);
  } catch (error) {
    console.error('POST order error:', error);
    return errorResponse('Internal server error', 500);
  }
}
