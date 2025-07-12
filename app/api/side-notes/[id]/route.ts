import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/side-notes/[id] - Get a specific side note
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const note = await prisma.sideNote.findUnique({
      where: { id },
    });

    if (!note) {
      return NextResponse.json(
        { error: 'Side note not found' },
        { status: 404 }
      );
    }

    // Transform the data to match the frontend format
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

    return NextResponse.json(transformedNote);
  } catch (error) {
    console.error('Error fetching side note:', error);
    return NextResponse.json(
      { error: 'Failed to fetch side note' },
      { status: 500 }
    );
  }
}

// PUT /api/side-notes/[id] - Update a specific side note
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.content || !data.type) {
      return NextResponse.json(
        { error: 'Content and type are required' },
        { status: 400 }
      );
    }

    const note = await prisma.sideNote.update({
      where: { id },
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

    return NextResponse.json(transformedNote);
  } catch (error) {
    console.error('Error updating side note:', error);
    return NextResponse.json(
      { error: 'Failed to update side note' },
      { status: 500 }
    );
  }
}

// DELETE /api/side-notes/[id] - Delete a specific side note
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.sideNote.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Side note deleted successfully' });
  } catch (error) {
    console.error('Error deleting side note:', error);
    return NextResponse.json(
      { error: 'Failed to delete side note' },
      { status: 500 }
    );
  }
}
