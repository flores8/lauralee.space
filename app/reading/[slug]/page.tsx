// app/reading/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { getContentItemBySlug, getRelatedContent } from '@/lib/content';
import { ReadingItem } from '@/lib/types';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function getDaysAgo(date: string): string {
  const postDate = new Date(date);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - postDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}

export default async function ReadingDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getContentItemBySlug('reading', slug);
  
  if (!item) {
    notFound();
  }
  
  const readingItem = item as ReadingItem & { content: string };
  const relatedContent = getRelatedContent(readingItem);
  
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
    <div className="content-section">
      <div className="blog-post">
        <div className="post-header">
          <Link href="/reading" className="post-category">
            READING
          </Link>
          <h1 className="post-title">{readingItem.title}</h1>
          <p className="post-subtitle">by {readingItem.author}</p>
          <div className="post-status-rating">
            <span className="post-status">
              {getStatusEmoji(readingItem.status)} {readingItem.status.replace('-', ' ')}
            </span>
            {readingItem.rating && (
              <span className="post-rating">
                {getRatingStars(readingItem.rating)}
              </span>
            )}
          </div>
        </div>
        
        <div className="post-divider"></div>
        
        <div className="post-meta-line">
          <div className="post-tags">
            {readingItem.tags && readingItem.tags.length > 0 && (
              readingItem.tags.map((tag) => (
                <Link key={tag} href={`/reading?tag=${encodeURIComponent(tag)}`} className="tag">
                  {tag}
                </Link>
              ))
            )}
          </div>
          <div className="post-date-ago">
            {getDaysAgo(readingItem.date)}
          </div>
        </div>
        
        <article className="post-content">
          <MDXRemote source={readingItem.content} />
        </article>
        
        {relatedContent.length > 0 && (
          <div className="related-content">
            <h3>Related Content</h3>
            <div className="related-grid">
              {relatedContent.map((related) => (
                <Link 
                  key={related.slug} 
                  href={`/${related.type}/${related.slug}`}
                  className="related-card"
                >
                  <div className="related-type">
                    {related.type === 'writing' ? '✍️' : '📖'} {related.type}
                  </div>
                  <h4>{related.title}</h4>
                  {related.type === 'reading' && (
                    <p className="related-author">by {(related as ReadingItem).author}</p>
                  )}
                  {related.tags && related.tags.length > 0 && (
                    <div className="related-tags">
                      {related.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag-small">{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="card-decoration"></div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
