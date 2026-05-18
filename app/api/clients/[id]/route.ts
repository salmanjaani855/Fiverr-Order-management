import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken, extractTokenFromCookie } from '@/lib/auth';
import { errorResponse, successResponse, unauthorizedResponse } from '@/lib/api-utils';
import Client from '@/models/Client';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const token = extractTokenFromCookie(request.headers.get('cookie') || '');
    if (!token) return unauthorizedResponse();

    const decoded = verifyToken(token);
    if (!decoded) return unauthorizedResponse();

    const { id } = await params;
    const client = await Client.findOneAndDelete({ _id: id, userId: decoded.userId });
    if (!client) return errorResponse('Client not found');

    return successResponse({ message: 'Client deleted' });
  } catch (error) {
    console.error('DELETE client error:', error);
    return errorResponse('Internal server error', 500);
  }
}
