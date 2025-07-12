import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/side-notes - Get all side notes with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const tag = searchParams.get('tag');
    const sortBy = searchParams.get('sortBy') || 'dateAdded';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: Record<string, string | { has: string }> = {};
    
    if (type && type !== 'all') {
      where.type = type.toUpperCase();
    }
    
    if (tag && tag !== 'all') {
      where.tags = {
        has: tag
      };
    }

    // Build orderBy clause
    const orderBy: Record<string, string> = {};
    if (sortBy === 'source') {
      orderBy.source = sortOrder;
    } else {
      orderBy.dateAdded = sortOrder;
    }

    const notes = await prisma.sideNote.findMany({
      where,
      orderBy,
    });

    // Transform the data to match the frontend format
    const transformedNotes = notes.map(note => ({
      id: note.id,
      content: note.content,
      type: note.type.toLowerCase(),
      source: note.source,
      source_author: note.sourceAuthor,
      related_books: note.relatedBooks,
      related_writing: note.relatedWriting,
      tags: note.tags,
      date_added: note.dateAdded.toISOString(),
      page_number: note.pageNumber,
      chapter: note.chapter,
      personal_note: note.personalNote,
      mood: note.mood,
      context: note.context,
    }));

    return NextResponse.json(transformedNotes);
  } catch (error) {
    console.error('Error fetching side notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch side notes' },
      { status: 500 }
    );
  }
}

// POST /api/side-notes - Create a new side note
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.content || !data.type) {
      return NextResponse.json(
        { error: 'Content and type are required' },
        { status: 400 }
      );
    }

    const note = await prisma.sideNote.create({
      data: {
        content: data.content,
        type: data.type.toUpperCase(),
        source: data.source || null,
        sourceAuthor: data.source_author || null,
        relatedBooks: data.related_books || [],
        relatedWriting: data.related_writing || [],
        tags: data.tags || [],
        pageNumber: data.page_number || null,
        chapter: data.chapter || null,
        personalNote: data.personal_note || null,
        mood: data.mood || null,
        context: data.context || null,
      },
    });

    // Transform the response to match frontend format
    const transformedNote = {
      id: note.id,
      content: note.content,
      type: note.type.toLowerCase(),
      source: note.source,
      source_author: note.sourceAuthor,
      related_books: note.relatedBooks,
      related_writing: note.relatedWriting,
      tags: note.tags,
      date_added: note.dateAdded.toISOString(),
      page_number: note.pageNumber,
      chapter: note.chapter,
      personal_note: note.personalNote,
      mood: note.mood,
      context: note.context,
    };

    return NextResponse.json(transformedNote, { status: 201 });
  } catch (error) {
    console.error('Error creating side note:', error);
    return NextResponse.json(
      { error: 'Failed to create side note' },
      { status: 500 }
    );
  }
}
