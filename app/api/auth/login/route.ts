import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { hashPassword, verifyPassword, createToken } from '@/lib/auth';
import { errorResponse } from '@/lib/api-utils';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse('Email and password are required');
    }

    // const user = await User.findOne({ email });
  const user = await User.findOne({ email }).select('+password');
  
    if (!user) {
      return errorResponse('Invalid credentials');
    }

    // const isValid = await verifyPassword(password, user.password);
    // if (!isValid) {
    //   return errorResponse('Invalid credentials');
    // }


let isValid = false;

try {
  isValid = await verifyPassword(password, user.password);
} catch (err) {
  console.error('Password verify failed:', err);
  return errorResponse('Invalid credentials');
}



    const token = createToken(user._id.toString());

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        userId: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
      },
      token,
    }, { status: 200 });

    // response.cookies.set('auth', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',
    //   maxAge: 7 * 24 * 60 * 60,
    // });
response.cookies.set({
  name: 'auth',
  value: token,
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60,
});







    return response;
  } catch (error) {
    console.error('Login error:', error);

    return errorResponse('Internal server error', 500);
  }
}
