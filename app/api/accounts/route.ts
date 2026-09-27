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
    const defaultAccountNames = ['Ena', 'Lyric Craft', 'Sam', 'Lyric Studio', 'Flux Studio', 'Umer'];
    const existingNames = new Set(accounts.map((account) => account.name.trim().toLowerCase()));
    const missingAccounts = defaultAccountNames
      .filter((name) => !existingNames.has(name.toLowerCase()))
      .map((name) => ({ userId: decoded.userId, name }));

    if (missingAccounts.length > 0) {
      await Account.insertMany(missingAccounts);
      accounts = await Account.find({ userId: decoded.userId }).sort({ createdAt: -1 });
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
