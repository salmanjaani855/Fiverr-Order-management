import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken, extractTokenFromCookie } from '@/lib/auth';
import { errorResponse, successResponse, unauthorizedResponse } from '@/lib/api-utils';
import Order from '@/models/Order';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;
    const order = await Order.findOne({ _id: id, userId: decoded.userId });
    if (!order) {
      return errorResponse('Order not found');
    }

    const body = await request.json();
    const { clientName, duration, price, status, description } = body;

    if (clientName !== undefined) order.clientName = clientName;
    if (duration !== undefined) order.duration = duration;
    if (price !== undefined) order.price = price;
    if (status !== undefined) order.status = status;
    if (description !== undefined) order.description = description;

    order.updatedAt = new Date();
    await order.save();

    return successResponse({ order });
  } catch (error) {
    console.error('PUT order error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;
    const order = await Order.findOneAndDelete({ _id: id, userId: decoded.userId });
    if (!order) {
      return errorResponse('Order not found');
    }

    return successResponse({ message: 'Order deleted' });
  } catch (error) {
    console.error('DELETE order error:', error);
    return errorResponse('Internal server error', 500);
  }
}
