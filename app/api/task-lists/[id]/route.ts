import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken, extractTokenFromCookie } from '@/lib/auth';
import { errorResponse, successResponse, unauthorizedResponse } from '@/lib/api-utils';
import TaskList from '@/models/TaskList';

function normalizeItems(items: unknown) {
  const raw = Array.isArray(items) ? items : [];
  return Array.from({ length: 6 }, (_, i) => {
    const item = raw[i];
    if (item && typeof item === 'object') {
      const obj = item as { text?: string; completed?: boolean };
      return {
        text: typeof obj.text === 'string' ? obj.text.trim() : '',
        completed: Boolean(obj.completed),
      };
    }
    return { text: '', completed: false };
  });
}

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
    const taskList = await TaskList.findOne({ _id: id, userId: decoded.userId });
    if (!taskList) {
      return errorResponse('Task list not found');
    }

    const body = await request.json();
    const { name, date, items } = body;

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return errorResponse('List name is required');
      }
      taskList.name = name.trim();
    }

    if (date !== undefined) {
      const parsedDate = new Date(date);
      if (Number.isNaN(parsedDate.getTime())) {
        return errorResponse('Invalid date');
      }
      taskList.date = parsedDate;
    }

    if (items !== undefined) {
      taskList.items = normalizeItems(items);
    }

    await taskList.save();

    return successResponse({ taskList });
  } catch (error) {
    console.error('PUT task-list error:', error);
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
    const taskList = await TaskList.findOneAndDelete({ _id: id, userId: decoded.userId });
    if (!taskList) {
      return errorResponse('Task list not found');
    }

    return successResponse({ message: 'Task list deleted' });
  } catch (error) {
    console.error('DELETE task-list error:', error);
    return errorResponse('Internal server error', 500);
  }
}
