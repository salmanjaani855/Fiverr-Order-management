// import { NextRequest } from 'next/server';
// import connectDB from '@/lib/db';
// import { verifyToken, extractTokenFromCookie } from '@/lib/auth';
// import { errorResponse, successResponse, unauthorizedResponse } from '@/lib/api-utils';
// import User from '@/models/User';

// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();

//     const token = extractTokenFromCookie(request.headers.get('cookie') || '');
//     if (!token) {
//       return successResponse({ message: 'No token found', debug: true });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return successResponse({ message: 'Invalid token', debug: true });
//     }

//     console.log('DEBUG: User ID from token:', decoded.userId);

//     const user = await User.findById(decoded.userId);
//     console.log('DEBUG: User found:', user);
//     console.log('DEBUG: User clients:', user?.clients);

//     if (!user) {
//       return successResponse({ message: 'User not found', userId: decoded.userId, debug: true });
//     }

//     return successResponse({
//       message: 'Debug info',
//       userId: decoded.userId,
//       userEmail: user.email,
//       clientsCount: user.clients?.length || 0,
//       clients: user.clients,
//       debug: true,
//     });
//   } catch (error) {
//     console.error('Debug endpoint error:', error);
//     return errorResponse('Debug error: ' + String(error), 500);
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();

//     const token = extractTokenFromCookie(request.headers.get('cookie') || '');
//     const decoded = verifyToken(token);

//     const { clientName } = await request.json();

//     console.log('DEBUG POST: Token:', !!token);
//     console.log('DEBUG POST: Decoded:', decoded);
//     console.log('DEBUG POST: ClientName:', clientName);

//     if (!decoded) {
//       return unauthorizedResponse();
//     }

//     const newClient = { id: Date.now(), name: clientName };
//     console.log('DEBUG: Adding client:', newClient);

//     const updatedUser = await User.findByIdAndUpdate(
//       decoded.userId,
//       { $push: { clients: newClient } },
//       { new: true }
//     );

//     console.log('DEBUG: Updated user:', updatedUser);

//     return successResponse({
//       message: 'Client added (debug)',
//       clients: updatedUser?.clients || [],
//       debug: true,
//     });
//   } catch (error) {
//     console.error('Debug POST error:', error);
//     return errorResponse('Debug POST error: ' + String(error), 500);
//   }
// }










import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken, extractTokenFromCookie } from '@/lib/auth';
import { errorResponse, successResponse, unauthorizedResponse } from '@/lib/api-utils';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const cookieHeader = request.headers.get('cookie') || '';
    const token = extractTokenFromCookie(cookieHeader);

    if (!token) {
      return successResponse({ message: 'No token found', debug: true });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return successResponse({ message: 'Invalid token', debug: true });
    }

    console.log('DEBUG: User ID from token:', decoded.userId);

    const user = await User.findById(decoded.userId);

    console.log('DEBUG: User found:', user);
    console.log('DEBUG: User clients:', user?.clients);

    if (!user) {
      return successResponse({
        message: 'User not found',
        userId: decoded.userId,
        debug: true,
      });
    }

    return successResponse({
      message: 'Debug info',
      userId: decoded.userId,
      userEmail: user.email,
      clientsCount: user.clients?.length || 0,
      clients: user.clients,
      debug: true,
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return errorResponse('Debug error: ' + String(error), 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const cookieHeader = request.headers.get('cookie') || '';
    const token = extractTokenFromCookie(cookieHeader);

    const decoded = token ? verifyToken(token) : null;

    const { clientName } = await request.json();

    console.log('DEBUG POST: Token:', !!token);
    console.log('DEBUG POST: Decoded:', decoded);
    console.log('DEBUG POST: ClientName:', clientName);

    if (!decoded) {
      return unauthorizedResponse();
    }

    const newClient = { id: Date.now(), name: clientName };
    console.log('DEBUG: Adding client:', newClient);

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { $push: { clients: newClient } },
      { new: true }
    );

    console.log('DEBUG: Updated user:', updatedUser);

    return successResponse({
      message: 'Client added (debug)',
      clients: updatedUser?.clients || [],
      debug: true,
    });
  } catch (error) {
    console.error('Debug POST error:', error);
    return errorResponse('Debug POST error: ' + String(error), 500);
  }
}