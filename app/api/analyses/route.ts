import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, getCurrentUserId } from 'lyzr-architect';
import getAnalysisModel from '@/models/Analysis';

async function handler(req: NextRequest) {
  try {
    const Model = await getAnalysisModel();

    if (req.method === 'GET') {
      const docs = await Model.find({});
      return NextResponse.json({ success: true, data: docs });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const { title, idea_text, analysis_data, file_url } = body;
      if (!title || !idea_text || !analysis_data) {
        return NextResponse.json({ success: false, error: 'title, idea_text, and analysis_data are required' }, { status: 400 });
      }
      const doc = await Model.create({
        title,
        idea_text,
        analysis_data,
        file_url: file_url || '',
        owner_user_id: getCurrentUserId(),
      });
      return NextResponse.json({ success: true, data: doc });
    }

    if (req.method === 'DELETE') {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      if (!id) {
        return NextResponse.json({ success: false, error: 'id query parameter is required' }, { status: 400 });
      }
      await Model.deleteOne({ _id: id });
      return NextResponse.json({ success: true, data: { deleted: id } });
    }

    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? 'Internal server error' }, { status: 500 });
  }
}

export const GET = authMiddleware(handler);
export const POST = authMiddleware(handler);
export const DELETE = authMiddleware(handler);
