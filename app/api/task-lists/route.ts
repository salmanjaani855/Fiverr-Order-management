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

    const taskLists = await TaskList.find({ userId: decoded.userId }).sort({ date: 1, createdAt: -1 });

    return successResponse({ taskLists });
  } catch (error) {
    console.error('GET task-lists error:', error);
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
    const { name, date, items } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return errorResponse('List name is required');
    }

    if (!date) {
      return errorResponse('Date is required');
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return errorResponse('Invalid date');
    }

    const normalizedItems = normalizeItems(items);
    const hasAtLeastOneTask = normalizedItems.some((item) => item.text.length > 0);
    if (!hasAtLeastOneTask) {
      return errorResponse('Add at least one task');
    }

    const taskList = new TaskList({
      userId: decoded.userId,
      name: name.trim(),
      date: parsedDate,
      items: normalizedItems,
    });

    await taskList.save();

    return successResponse({ taskList }, 201);
  } catch (error) {
    console.error('POST task-lists error:', error);
    return errorResponse('Internal server error', 500);
  }
}
