'use client';

import { useState } from 'react';
import { SideNote } from '@/lib/types';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteAdded: (note: SideNote) => void;
}

export default function AddNoteModal({ isOpen, onClose, onNoteAdded }: AddNoteModalProps) {
  const [formData, setFormData] = useState({
    content: '',
    type: 'thought' as 'quote' | 'thought' | 'idea' | 'insight',
    source: '',
    source_author: '',
    related_books: [] as string[],
    related_writing: [] as string[],
    tags: [] as string[],
    page_number: '',
    chapter: '',
    personal_note: '',
    mood: '',
    context: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/side-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          page_number: formData.page_number ? parseInt(formData.page_number) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      const newNote = await response.json();
      onNoteAdded(newNote);
      onClose();
      
      // Reset form
      setFormData({
        content: '',
        type: 'thought',
        source: '',
        source_author: '',
        related_books: [],
        related_writing: [],
        tags: [],
        page_number: '',
        chapter: '',
        personal_note: '',
        mood: '',
        context: '',
      });
      setTagInput('');
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Add new note</h2>
          <button
            onClick={onClose}
            className="modal-close-button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="modal-form">
            {/* Content */}
            <div className="form-group">
              <label className="form-label">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                required
                className="form-textarea"
                rows={4}
                placeholder="Enter your quote, thought, idea, or insight..."
              />
            </div>

            {/* Type */}
            <div className="form-group">
              <label className="form-label">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'quote' | 'thought' | 'idea' | 'insight' }))}
                required
                className="form-select"
              >
                <option value="quote">Quote</option>
                <option value="thought">Thought</option>
                <option value="idea">Idea</option>
                <option value="insight">Insight</option>
              </select>
            </div>

            {/* Source and Author */}
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Source
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  className="form-input"
                  placeholder="Book title, article, etc."
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.source_author}
                  onChange={(e) => setFormData(prev => ({ ...prev, source_author: e.target.value }))}
                  className="form-input"
                  placeholder="Author name"
                />
              </div>
            </div>

            {/* Page Number and Chapter */}
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Page number
                </label>
                <input
                  type="number"
                  value={formData.page_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, page_number: e.target.value }))}
                  className="form-input"
                  placeholder="Page number"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Chapter
                </label>
                <input
                  type="text"
                  value={formData.chapter}
                  onChange={(e) => setFormData(prev => ({ ...prev, chapter: e.target.value }))}
                  className="form-input"
                  placeholder="Chapter name/number"
                />
              </div>
            </div>

            {/* Personal Note */}
            <div className="form-group">
              <label className="form-label">
                Personal note
              </label>
              <textarea
                value={formData.personal_note}
                onChange={(e) => setFormData(prev => ({ ...prev, personal_note: e.target.value }))}
                className="form-textarea"
                rows={2}
                placeholder="Your thoughts and reactions..."
              />
            </div>

            {/* Mood and Context */}
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Mood
                </label>
                <input
                  type="text"
                  value={formData.mood}
                  onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value }))}
                  className="form-input"
                  placeholder="How you felt (inspired, thoughtful, etc.)"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Context
                </label>
                <input
                  type="text"
                  value={formData.context}
                  onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                  className="form-input"
                  placeholder="Where/when you captured this"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="form-group">
              <label className="form-label">
                Tags
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
                className="form-input"
                placeholder="Type a tag and press Enter"
              />
              {formData.tags.length > 0 && (
                <div className="tag-list">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="tag-item"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="tag-remove-button"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            {isSubmitting ? 'Adding...' : 'Add note'}
          </button>
        </div>
      </div>
    </div>
  );
}
