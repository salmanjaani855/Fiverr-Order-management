// import { NextRequest } from 'next/server';
// import connectDB from '@/lib/db';
// import { verifyToken, extractTokenFromCookie } from '@/lib/auth';
// import { errorResponse, successResponse, unauthorizedResponse } from '@/lib/api-utils';
// import Client from '@/models/Client';

// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();

//     const token = extractTokenFromCookie(request.headers.get('cookie') || '');
//     if (!token) {
//       return unauthorizedResponse();
//     }

//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return unauthorizedResponse();
//     }

//     console.log('Fetching clients for user:', decoded.userId);

//     const clients = await Client.find({ userId: decoded.userId }).sort({ createdAt: -1 });

//     console.log('Fetched clients:', clients);
//     return successResponse({ clients });
//   } catch (error) {
//     console.error('GET clients error:', error);
//     return errorResponse('Internal server error', 500);
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();

//     const token = extractTokenFromCookie(request.headers.get('cookie') || '');
//     if (!token) {
//       console.error('No token found');
//       return unauthorizedResponse();
//     }

//     const decoded = verifyToken(token);
//     if (!decoded) {
//       console.error('Invalid token');
//       return unauthorizedResponse();
//     }

//     const { name } = await request.json();

//     if (!name?.trim()) {
//       return errorResponse('Client name required', 400);
//     }

//     console.log('Adding client for user:', decoded.userId, 'Name:', name);

//     const client = new Client({
//       userId: decoded.userId,
//       name: name.trim(),
//     });

//     await client.save();

//     console.log('Client saved successfully:', client);

//     const allClients = await Client.find({ userId: decoded.userId }).sort({ createdAt: -1 });

//     return successResponse({ clients: allClients }, 201);
//   } catch (error) {
//     console.error('POST client error:', error);
//     return errorResponse('Internal server error: ' + String(error), 500);
//   }
// }

// export async function DELETE(request: NextRequest) {
//   try {
//     await connectDB();

//     const token = extractTokenFromCookie(request.headers.get('cookie') || '');
//     if (!token) {
//       return unauthorizedResponse();
//     }

//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return unauthorizedResponse();
//     }

//     const { clientId } = await request.json();

//     console.log('Deleting client:', clientId, 'for user:', decoded.userId);

//     await Client.findByIdAndDelete(clientId);

//     const allClients = await Client.find({ userId: decoded.userId }).sort({ createdAt: -1 });

//     console.log('Client deleted successfully');

//     return successResponse({ clients: allClients });
//   } catch (error) {
//     console.error('DELETE client error:', error);
//     return errorResponse('Internal server error', 500);
//   }
// }








import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken, extractTokenFromCookie } from '@/lib/auth';
import { errorResponse, successResponse, unauthorizedResponse } from '@/lib/api-utils';
import Client from '@/models/Client';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const cookieHeader = request.headers.get('cookie') || '';
    const token = extractTokenFromCookie(cookieHeader);

    if (!token) {
      return unauthorizedResponse();
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return unauthorizedResponse();
    }

    console.log('Fetching clients for user:', decoded.userId);

    const clients = await Client.find({ userId: decoded.userId }).sort({ createdAt: -1 });

    console.log('Fetched clients:', clients);
    return successResponse({ clients });
  } catch (error) {
    console.error('GET clients error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const cookieHeader = request.headers.get('cookie') || '';
    const token = extractTokenFromCookie(cookieHeader);

    if (!token) {
      console.error('No token found');
      return unauthorizedResponse();
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.error('Invalid token');
      return unauthorizedResponse();
    }

    const { name } = await request.json();

    if (!name?.trim()) {
      return errorResponse('Client name required', 400);
    }

    console.log('Adding client for user:', decoded.userId, 'Name:', name);

    const client = new Client({
      userId: decoded.userId,
      name: name.trim(),
    });

    await client.save();

    console.log('Client saved successfully:', client);

    const allClients = await Client.find({ userId: decoded.userId }).sort({ createdAt: -1 });

    return successResponse({ clients: allClients }, 201);
  } catch (error) {
    console.error('POST client error:', error);
    return errorResponse('Internal server error: ' + String(error), 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const cookieHeader = request.headers.get('cookie') || '';
    const token = extractTokenFromCookie(cookieHeader);

    if (!token) {
      return unauthorizedResponse();
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return unauthorizedResponse();
    }

    const { clientId } = await request.json();

    console.log('Deleting client:', clientId, 'for user:', decoded.userId);

    await Client.findByIdAndDelete(clientId);

    const allClients = await Client.find({ userId: decoded.userId }).sort({ createdAt: -1 });

    console.log('Client deleted successfully');

    return successResponse({ clients: allClients });
  } catch (error) {
    console.error('DELETE client error:', error);
    return errorResponse('Internal server error', 500);
  }
}