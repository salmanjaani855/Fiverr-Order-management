import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  const response = successResponse({ message: 'Logged out successfully' });
  response.cookies.set('auth', '', { maxAge: 0 });
  return response;
}
