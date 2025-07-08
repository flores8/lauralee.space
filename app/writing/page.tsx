// app/writing/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

type Post = {
  title: string;
  slug: string;
};

export default function WritingPage() {
  const postsDir = path.join(process.cwd(), 'content/writing');
  const files = fs.readdirSync(postsDir);

  const posts: Post[] = files
    .map((filename) => {
      const filePath = path.join(postsDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);
      
      return {
        title: data.title,
        slug: data.slug,
      };
    })
    .sort((a, b) => {
      // Sort by title alphabetically since we're not showing dates
      return a.title.localeCompare(b.title);
    });

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
                <h2 className="post-title">{post.title}</h2>
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
