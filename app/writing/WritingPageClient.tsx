'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { WritingPost } from '@/lib/types';

interface WritingPageClientProps {
  posts: WritingPost[];
}

export default function WritingPageClient({ posts }: WritingPageClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [posts]);

  // Filter posts based on selected tag
  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter(post => post.tags?.includes(selectedTag));
  }, [posts, selectedTag]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  return (
    <div>
      <div className="content-section">
        <h1>Writing</h1>
        <p>Thoughts, essays, and musings in progress.</p>
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
          </div>
        </div>
      )}
      
      {filteredPosts.length > 0 ? (
        <ul className="posts-list">
          {filteredPosts.map((post) => (
            <li key={post.slug}>
              <Link href={`/writing/${post.slug}`} className="post-item">
                <span className="line-top"></span>
                <span className="line-bottom"></span>
                <div className="post-content">
                  <h2 className="post-title">{post.title}</h2>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="posts-empty">
          <div className="empty-icon">✍️</div>
          <p>
            {selectedTag 
              ? `No posts found with the "${selectedTag}" tag.` 
              : 'No posts yet. The first one is brewing...'
            }
          </p>
        </div>
      )}
    </div>
  );
} 