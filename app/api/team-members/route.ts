import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken, extractTokenFromCookie } from '@/lib/auth';
import { errorResponse, successResponse, unauthorizedResponse } from '@/lib/api-utils';
import TeamMember from '@/models/TeamMember';

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

    const teamMembers = await TeamMember.find({ userId: decoded.userId }).sort({ createdAt: -1 });

    return successResponse({ teamMembers });
  } catch (error) {
    console.error('GET team members error:', error);
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
    const { name, project, clientName, backgroundLyrics, assignedMembers } = body;

    if (!name || !project || !clientName) {
      return errorResponse('Missing required fields');
    }

    const teamMember = new TeamMember({
      userId: decoded.userId,
      name,
      project,
      clientName,
      backgroundLyrics: backgroundLyrics || '',
      assignedMembers: assignedMembers || [],
    });

    await teamMember.save();

    return successResponse({ teamMember }, 201);
  } catch (error) {
    console.error('POST team member error:', error);
    return errorResponse('Internal server error', 500);
  }
}
