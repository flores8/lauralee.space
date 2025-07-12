'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SideNote } from '@/lib/types';
import AddNoteModal from '@/app/components/AddNoteModal';

export default function SideNotesPage() {
  const [notes, setNotes] = useState<SideNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'source'>('date');

  // Load notes from API
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/side-notes');
        if (response.ok) {
          const data = await response.json();
          setNotes(data);
        } else {
          console.error('Failed to fetch notes');
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleNoteAdded = (newNote: SideNote) => {
    setNotes(prev => [newNote, ...prev]);
  };

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

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading notes...</p>
        </div>
      )}

      {/* Notes Grid */}
      {!isLoading && (
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
              &ldquo;{note.content}&rdquo;
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
      )}

      {!isLoading && sortedNotes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No notes found matching your filters.</p>
        </div>
      )}

      {/* Add Note Button */}
      <div className="fixed bottom-6 right-6">
        <button 
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
          onClick={() => setIsAddModalOpen(true)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Add Note Modal */}
      <AddNoteModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onNoteAdded={handleNoteAdded}
      />
    </div>
  );
}
