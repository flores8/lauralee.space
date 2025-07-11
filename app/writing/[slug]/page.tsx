// app/writing/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { getContentItemBySlug, getRelatedContent } from '@/lib/content';
import { WritingPost, ReadingItem } from '@/lib/types';

interface PageProps {
  params: Promise<{ slug: string }>;
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
    <div className="content-detail">
      <div className="content-header">
        <Link href="/writing" className="back-link">
          ← Back to Writing
        </Link>
        
        <div className="writing-header">
          <h1>{writingPost.title}</h1>
          
          <div className="writing-meta">
            <span className="writing-date">
              {new Date(writingPost.date).toLocaleDateString()}
            </span>
          </div>
          
          {writingPost.tags && writingPost.tags.length > 0 && (
            <div className="content-tags">
              {writingPost.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <article className="content-body">
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
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
