// app/reading/page.tsx
import Link from 'next/link';
import { getContentItems } from '@/lib/content';
import { ReadingItem } from '@/lib/types';

export default function ReadingPage() {
  const readingItems = getContentItems('reading') as ReadingItem[];

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
        <p>Books I&apos;m loving and learning from.</p>
      </div>
      
      {readingItems.length > 0 ? (
        <div className="reading-grid">
          {readingItems.map((item) => (
            <div key={item.slug} className="reading-card">
              <div className="reading-card-header">
                <h3 className="reading-title">{item.title}</h3>
                <p className="reading-author">by {item.author}</p>
              </div>
              
              <div className="reading-meta">
                <span className="reading-status">
                  {getStatusEmoji(item.status)} {item.status.replace('-', ' ')}
                </span>
                {item.rating && (
                  <span className="reading-rating">
                    {getRatingStars(item.rating)}
                  </span>
                )}
              </div>
              
              {item.tags && item.tags.length > 0 && (
                <div className="reading-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              
              <Link href={`/reading/${item.slug}`} className="reading-link">
                Read my notes →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="posts-empty">
          <div className="empty-icon">📚</div>
          <p>No books yet. The reading list is growing...</p>
        </div>
      )}
    </div>
  );
}
