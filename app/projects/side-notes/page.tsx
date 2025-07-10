'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SideNote } from '@/lib/types';

// Sample data - in a real app, this would come from your database
const sampleNotes: SideNote[] = [
  {
    id: '1',
    content: "You do not rise to the level of your goals. You fall to the level of your systems.",
    type: 'quote',
    source: 'Atomic Habits',
    source_author: 'James Clear',
    related_books: ['atomic-habits'],
    related_writing: ['my-first-post'],
    tags: ['productivity', 'systems', 'habits'],
    date_added: '2024-01-15T10:30:00Z',
    page_number: 27,
    personal_note: 'This really resonated with me. It shifts the focus from outcomes to process.',
    mood: 'inspired',
    context: 'Reading during morning coffee'
  },
  {
    id: '2',
    content: "The design of everyday things is not just about making things look pretty. It's about making things work.",
    type: 'thought',
    source: 'The Design of Everyday Things',
    source_author: 'Don Norman',
    related_books: ['design-of-everyday-things'],
    related_writing: ['my-second-post'],
    tags: ['design', 'usability', 'functionality'],
    date_added: '2024-01-20T14:15:00Z',
    page_number: 156,
    personal_note: 'This connects to my experience with designing user interfaces.',
    mood: 'thoughtful',
    context: 'After struggling with a poorly designed door handle'
  },
  {
    id: '3',
    content: "What if we treated our personal knowledge like a garden - something that needs tending, pruning, and connecting?",
    type: 'idea',
    tags: ['knowledge-management', 'personal-growth', 'metaphor'],
    date_added: '2024-01-25T09:45:00Z',
    personal_note: 'This came to me while working on this Side Notes project. The connections between ideas are like pathways in a garden.',
    mood: 'curious',
    context: 'Walking in the morning, thinking about how to organize thoughts'
  }
];

export default function SideNotesPage() {
  const [notes, setNotes] = useState<SideNote[]>(sampleNotes);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'source'>('date');

  const filteredNotes = notes.filter(note => {
    const typeMatch = selectedType === 'all' || note.type === selectedType;
    const tagMatch = selectedTag === 'all' || note.tags?.includes(selectedTag);
    return typeMatch && tagMatch;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date_added).getTime() - new Date(a.date_added).getTime();
    } else {
      return (a.source || '').localeCompare(b.source || '');
    }
  });

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags || [])));

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quote': return '💭';
      case 'thought': return '🤔';
      case 'idea': return '💡';
      case 'insight': return '✨';
      default: return '📝';
    }
  };

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case 'inspired': return 'bg-yellow-100 text-yellow-800';
      case 'thoughtful': return 'bg-blue-100 text-blue-800';
      case 'curious': return 'bg-green-100 text-green-800';
      case 'reflective': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="content-section">
      <div className="mb-6">
        <Link href="/projects" className="text-blue-600 hover:underline text-sm">
          ← Back to Projects
        </Link>
      </div>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">📝</span>
          <h1 className="text-3xl font-bold">Side Notes</h1>
        </div>
        <p className="text-lg text-gray-700">
          A collection of quotes, thoughts, and ideas that have struck a chord with me.
        </p>
      </header>

      {/* Filters */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">All Types</option>
              <option value="quote">Quotes</option>
              <option value="thought">Thoughts</option>
              <option value="idea">Ideas</option>
              <option value="insight">Insights</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
            <select 
              value={selectedTag} 
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as 'date' | 'source')}
              className="w-full p-2 border rounded-md"
            >
              <option value="date">Date Added</option>
              <option value="source">Source</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid gap-6">
        {sortedNotes.map((note) => (
          <div key={note.id} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getTypeIcon(note.type)}</span>
                <div>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                    {note.type}
                  </span>
                  {note.mood && (
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ml-2 ${getMoodColor(note.mood)}`}>
                      {note.mood}
                    </span>
                  )}
                </div>
              </div>
              <time className="text-sm text-gray-500">
                {new Date(note.date_added).toLocaleDateString()}
              </time>
            </div>

            <blockquote className="text-lg text-gray-900 mb-4 italic">
              "{note.content}"
            </blockquote>

            {note.source && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Source:</span> {note.source}
                  {note.source_author && ` by ${note.source_author}`}
                  {note.page_number && ` (page ${note.page_number})`}
                  {note.chapter && ` - ${note.chapter}`}
                </p>
              </div>
            )}

            {note.personal_note && (
              <div className="mb-4 p-3 bg-blue-50 rounded">
                <p className="text-sm text-blue-900">
                  <span className="font-medium">Personal Note:</span> {note.personal_note}
                </p>
              </div>
            )}

            {note.context && (
              <div className="mb-4 p-3 bg-green-50 rounded">
                <p className="text-sm text-green-900">
                  <span className="font-medium">Context:</span> {note.context}
                </p>
              </div>
            )}

            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {note.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Related Content */}
            {(note.related_books || note.related_writing) && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Connected to:</h4>
                <div className="flex flex-wrap gap-2">
                  {note.related_books?.map((book) => (
                    <Link 
                      key={book} 
                      href={`/reading/${book}`}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                    >
                      📚 {book}
                    </Link>
                  ))}
                  {note.related_writing?.map((writing) => (
                    <Link 
                      key={writing} 
                      href={`/writing/${writing}`}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                    >
                      ✍️ {writing}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {sortedNotes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No notes found matching your filters.</p>
        </div>
      )}

      {/* Add Note Button */}
      <div className="fixed bottom-6 right-6">
        <button 
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
          onClick={() => {
            // In a real app, this would open a form to add a new note
            alert('Add note functionality would go here!');
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
