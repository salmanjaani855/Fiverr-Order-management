import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken, extractTokenFromCookie } from '@/lib/auth';
import { errorResponse, successResponse, unauthorizedResponse } from '@/lib/api-utils';
import Account from '@/models/Account';
import { sortAccounts } from '@/lib/account-order';

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

    let accounts = await Account.find({ userId: decoded.userId }).sort({ createdAt: -1 });

    // Create default accounts if none exist
    if (accounts.length === 0) {
      const defaultAccounts = [
        { userId: decoded.userId, name: 'Ena' },
        { userId: decoded.userId, name: 'Lyric Craft' },
        { userId: decoded.userId, name: 'Sam' },
        { userId: decoded.userId, name: 'Lyric Studio' },
      ];

      const created = await Account.insertMany(defaultAccounts);
      accounts = created;
    }

    return successResponse({ accounts: sortAccounts(accounts) });
  } catch (error) {
    console.error('GET accounts error:', error);
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
    const { name } = body;

    if (!name) {
      return errorResponse('Account name is required');
    }

    const account = new Account({
      userId: decoded.userId,
      name,
    });

    await account.save();

    return successResponse({ account }, 201);
  } catch (error) {
    console.error('POST account error:', error);
    return errorResponse('Internal server error', 500);
  }
}
