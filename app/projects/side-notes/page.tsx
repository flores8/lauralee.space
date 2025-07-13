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

  return (
    <div className="content-section">
      <div className="back-link-container">
        <Link href="/projects" className="back-link">
          ← Back to Projects
        </Link>
      </div>

      <header className="post-header">
        <div className="header-content">
          <span className="header-icon">📝</span>
          <h1 className="post-title">Side Notes</h1>
        </div>
        <p className="post-subtitle">
          A collection of quotes, thoughts, and ideas that have struck a chord with me.
        </p>
      </header>

      {/* Filters */}
      <div className="filter-section">
        <div className="filter-grid">
          <div className="filter-group">
            <label className="filter-label">Type</label>
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="quote">Quotes</option>
              <option value="thought">Thoughts</option>
              <option value="idea">Ideas</option>
              <option value="insight">Insights</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Tag</label>
            <select 
              value={selectedTag} 
              onChange={(e) => setSelectedTag(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as 'date' | 'source')}
              className="filter-select"
            >
              <option value="date">Date Added</option>
              <option value="source">Source</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading notes...</p>
        </div>
      )}

      {/* Notes Grid */}
      {!isLoading && (
        <div className="notes-grid">
          {sortedNotes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <div className="note-meta">
                  <span className="note-icon">{getTypeIcon(note.type)}</span>
                  <div className="note-badges">
                    <span className="note-type-badge">
                      {note.type}
                    </span>
                    {note.mood && (
                      <span className="note-mood-badge">
                        {note.mood}
                      </span>
                    )}
                  </div>
                </div>
                <time className="note-date">
                  {new Date(note.date_added).toLocaleDateString()}
                </time>
              </div>

              <blockquote className="note-content">
                &ldquo;{note.content}&rdquo;
              </blockquote>

              {note.source && (
                <div className="note-source">
                  <p className="source-text">
                    <span className="source-label">Source:</span> {note.source}
                    {note.source_author && ` by ${note.source_author}`}
                    {note.page_number && ` (page ${note.page_number})`}
                    {note.chapter && ` - ${note.chapter}`}
                  </p>
                </div>
              )}

              {note.personal_note && (
                <div className="note-personal">
                  <p className="personal-text">
                    <span className="personal-label">Personal Note:</span> {note.personal_note}
                  </p>
                </div>
              )}

              {note.context && (
                <div className="note-context">
                  <p className="context-text">
                    <span className="context-label">Context:</span> {note.context}
                  </p>
                </div>
              )}

              {note.tags && note.tags.length > 0 && (
                <div className="note-tags">
                  {note.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Related Content */}
              {(note.related_books || note.related_writing) && (
                <div className="note-related">
                  <h4 className="related-title">Connected to:</h4>
                  <div className="related-links">
                    {note.related_books?.map((book) => (
                      <Link 
                        key={book} 
                        href={`/reading/${book}`}
                        className="related-link reading-link"
                      >
                        📚 {book}
                      </Link>
                    ))}
                    {note.related_writing?.map((writing) => (
                      <Link 
                        key={writing} 
                        href={`/writing/${writing}`}
                        className="related-link writing-link"
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
        <div className="empty-state">
          <p className="empty-text">No notes found matching your filters.</p>
        </div>
      )}

      {/* Add Note Button */}
      <div className="add-note-button-container">
        <button 
          className="add-note-button"
          onClick={() => setIsAddModalOpen(true)}
        >
          <svg className="add-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
