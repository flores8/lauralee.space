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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add New Note</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                required
                className="w-full p-3 border rounded-md resize-none"
                rows={4}
                placeholder="Enter your quote, thought, idea, or insight..."
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'quote' | 'thought' | 'idea' | 'insight' }))}
                required
                className="w-full p-2 border rounded-md"
              >
                <option value="quote">Quote</option>
                <option value="thought">Thought</option>
                <option value="idea">Idea</option>
                <option value="insight">Insight</option>
              </select>
            </div>

            {/* Source and Author */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  placeholder="Book title, article, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.source_author}
                  onChange={(e) => setFormData(prev => ({ ...prev, source_author: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  placeholder="Author name"
                />
              </div>
            </div>

            {/* Page Number and Chapter */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Number
                </label>
                <input
                  type="number"
                  value={formData.page_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, page_number: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  placeholder="Page number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chapter
                </label>
                <input
                  type="text"
                  value={formData.chapter}
                  onChange={(e) => setFormData(prev => ({ ...prev, chapter: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  placeholder="Chapter name/number"
                />
              </div>
            </div>

            {/* Personal Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Note
              </label>
              <textarea
                value={formData.personal_note}
                onChange={(e) => setFormData(prev => ({ ...prev, personal_note: e.target.value }))}
                className="w-full p-2 border rounded-md resize-none"
                rows={2}
                placeholder="Your thoughts and reactions..."
              />
            </div>

            {/* Mood and Context */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mood
                </label>
                <input
                  type="text"
                  value={formData.mood}
                  onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  placeholder="How you felt (inspired, thoughtful, etc.)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Context
                </label>
                <input
                  type="text"
                  value={formData.context}
                  onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  placeholder="Where/when you captured this"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
                className="w-full p-2 border rounded-md"
                placeholder="Type a tag and press Enter"
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
