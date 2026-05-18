import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken, extractTokenFromCookie } from '@/lib/auth';
import { errorResponse, successResponse, unauthorizedResponse } from '@/lib/api-utils';
import TeamMember from '@/models/TeamMember';

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
    const teamMember = await TeamMember.findOne({ _id: id, userId: decoded.userId });
    if (!teamMember) {
      return errorResponse('Team member not found');
    }

    const body = await request.json();
    const { name, project, clientName, backgroundLyrics, assignedMembers } = body;

    if (name !== undefined) teamMember.name = name;
    if (project !== undefined) teamMember.project = project;
    if (clientName !== undefined) teamMember.clientName = clientName;
    if (backgroundLyrics !== undefined) teamMember.backgroundLyrics = backgroundLyrics;
    if (assignedMembers !== undefined) teamMember.assignedMembers = assignedMembers;

    await teamMember.save();

    return successResponse({ teamMember });
  } catch (error) {
    console.error('PUT team member error:', error);
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
    const teamMember = await TeamMember.findOneAndDelete({ _id: id, userId: decoded.userId });
    if (!teamMember) {
      return errorResponse('Team member not found');
    }

    return successResponse({ message: 'Team member deleted' });
  } catch (error) {
    console.error('DELETE team member error:', error);
    return errorResponse('Internal server error', 500);
  }
}
