// app/writing/[slug]/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content/writing', `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContent);

  return (
    <div>
      <div className="content-section">
        <h1>{data.title}</h1>
      </div>
      
      <div className="post-meta">
        <time className="post-date" dateTime={data.date}>
          {new Date(data.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
      </div>
      
      <article className="blog-post">
        <div className="post-content">
          <MDXRemote source={content} />
        </div>
        
        <footer className="post-footer">
          <div className="post-divider">
            <span className="divider-line"></span>
            <span className="divider-ornament">✦</span>
            <span className="divider-line"></span>
          </div>
        </footer>
      </article>
    </div>
  );
}
