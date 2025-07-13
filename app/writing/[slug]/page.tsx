// app/writing/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { getContentItemBySlug, getRelatedContent } from '@/lib/content';
import { WritingPost, ReadingItem } from '@/lib/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function getDaysAgo(date: string): string {
  const postDate = new Date(date);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - postDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getContentItemBySlug('writing', slug);
  
  if (!item) {
    notFound();
  }
  
  const writingPost = item as WritingPost & { content: string };
  const relatedContent = getRelatedContent(writingPost);

  return (
    <div className="content-section">
      <div className="blog-post">
        <div className="post-header">
          <Link href="/writing" className="post-category">
            WRITING
          </Link>
          <h1 className="post-title">{writingPost.title}</h1>
          {writingPost.excerpt && (
            <p className="post-subtitle">{writingPost.excerpt}</p>
          )}
        </div>
        
        <div className="post-divider"></div>
        
        <div className="post-meta-line">
          <div className="post-tags">
            {writingPost.tags && writingPost.tags.length > 0 && (
              writingPost.tags.map((tag) => (
                <Link key={tag} href={`/writing?tag=${encodeURIComponent(tag)}`} className="tag">
                  {tag}
                </Link>
              ))
            )}
          </div>
          <div className="post-date-ago">
            {getDaysAgo(writingPost.date)}
          </div>
        </div>
        
        <article className="post-content">
          <MDXRemote source={writingPost.content} />
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
