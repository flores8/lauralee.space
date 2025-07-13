'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReadingItem } from '@/lib/types';

interface ReadingPageClientProps {
  readingItems: ReadingItem[];
}

export default function ReadingPageClient({ readingItems }: ReadingPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Initialize selected tag from URL parameter
  useEffect(() => {
    const tagParam = searchParams.get('tag');
    setSelectedTag(tagParam);
  }, [searchParams]);

  // Get all unique tags from reading items
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    readingItems.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [readingItems]);

  // Filter reading items based on selected tag
  const filteredItems = useMemo(() => {
    if (!selectedTag) return readingItems;
    return readingItems.filter(item => item.tags?.includes(selectedTag));
  }, [readingItems, selectedTag]);

  const handleTagClick = (tag: string) => {
    const newTag = selectedTag === tag ? null : tag;
    setSelectedTag(newTag);
    
    // Update URL
    if (newTag) {
      router.push(`/reading?tag=${encodeURIComponent(newTag)}`);
    } else {
      router.push('/reading');
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'completed': return '✓';
      case 'reading': return '📖';
      case 'want-to-read': return '📚';
      default: return '📖';
    }
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return null;
    return '⭐'.repeat(rating);
  };

  return (
    <div>
      <div className="content-section">
        <h1>Reading</h1>
        <p>Books I'm loving and learning from.</p>
      </div>
      
      {/* Tag Filter Section */}
      {allTags.length > 0 && (
        <div className="tag-filter-section">
          <div className="tag-filter-container">
            <span className="topics-label">TOPICS</span>
            <div className="topics-separator"></div>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`tag-filter-button ${selectedTag === tag ? 'active' : ''}`}
              >
                {tag}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={() => handleTagClick(selectedTag)}
                className="clear-filter-button"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      )}
      
      {filteredItems.length > 0 ? (
        <ul className="posts-list">
          {filteredItems.map((item) => (
            <li key={item.slug}>
              <Link href={`/reading/${item.slug}`} className="post-item">
                <span className="line-top"></span>
                <span className="line-bottom"></span>
                <div className="post-content">
                  <h2 className="post-title">{item.title}</h2>
                  <p className="post-author">by {item.author}</p>
                  <div className="post-meta">
                    <span className="post-status">
                      {getStatusEmoji(item.status)} {item.status.replace('-', ' ')}
                    </span>
                    {item.rating && (
                      <span className="post-rating">
                        {getRatingStars(item.rating)}
                      </span>
                    )}
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="content-tags">
                      {item.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="posts-empty">
          <div className="empty-icon">📚</div>
          <p>
            {selectedTag 
              ? `No books found with the "${selectedTag}" tag.` 
              : 'No books yet. The reading list is growing...'
            }
          </p>
        </div>
      )}
    </div>
  );
} 