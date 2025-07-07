// app/writing/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

type Post = {
  title: string;
  date: string;
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
        date: data.date,
      };
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <div>
      <div className="content-section">
        <h1>Writing</h1>
        <p>Thoughts, essays, and musings in progress.</p>
      </div>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/writing/${post.slug}`}>
              <span className="text-xl font-serif">{post.title}</span>
              <div className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
