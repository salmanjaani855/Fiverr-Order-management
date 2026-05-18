import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { errorResponse, successResponse } from '@/lib/api-utils';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password) {
      return errorResponse('Email and password are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse('User already exists');
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({
      email,
      password: hashedPassword,
      firstName: firstName || '',
      lastName: lastName || '',
      clients: [],
    });

    await user.save();

    return successResponse(
      { message: 'User created successfully', userId: user._id },
      201
    );
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse('Internal server error', 500);
  }
}
