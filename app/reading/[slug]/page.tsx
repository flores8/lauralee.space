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
    <div className="content-detail">
      <div className="content-header">
        <Link href="/reading" className="back-link">
          ← Back to Reading
        </Link>
        
        <div className="reading-header">
          <h1>{readingItem.title}</h1>
          <p className="reading-author">by {readingItem.author}</p>
          
          <div className="reading-meta">
            <span className="reading-status">
              {getStatusEmoji(readingItem.status)} {readingItem.status.replace('-', ' ')}
            </span>
            {readingItem.rating && (
              <span className="reading-rating">
                {getRatingStars(readingItem.rating)}
              </span>
            )}
            <span className="reading-date">
              {new Date(readingItem.date).toLocaleDateString()}
            </span>
          </div>
          
          {readingItem.tags && readingItem.tags.length > 0 && (
            <div className="content-tags">
              {readingItem.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <article className="content-body">
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
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
