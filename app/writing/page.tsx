// app/writing/page.tsx
import Link from 'next/link';
import { getContentItems } from '@/lib/content';
import { WritingPost } from '@/lib/types';

export default function WritingPage() {
  const posts = getContentItems('writing') as WritingPost[];

  return (
    <div>
      <div className="content-section">
        <h1>Writing</h1>
        <p>Thoughts, essays, and musings in progress.</p>
      </div>
      
      {posts.length > 0 ? (
        <ul className="posts-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/writing/${post.slug}`} className="post-item">
                <span className="line-top"></span>
                <span className="line-bottom"></span>
                <div className="post-content">
                  <h2 className="post-title">{post.title}</h2>
                  <div className="post-meta">
                    <span className="post-date">{new Date(post.date).toLocaleDateString()}</span>
                    {post.tags && post.tags.length > 0 && (
                      <div className="post-tags">
                        {post.tags.map((tag) => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="posts-empty">
          <div className="empty-icon">✍️</div>
          <p>No posts yet. The first one is brewing...</p>
        </div>
      )}
    </div>
  );
}
