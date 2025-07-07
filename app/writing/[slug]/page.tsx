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
    <article className="prose max-w-none">
      <h1 className="font-serif text-3xl mb-2">{data.title}</h1>
      <div className="text-sm text-gray-500 mb-6">{new Date(data.date).toLocaleDateString()}</div>
      <MDXRemote source={content} />
    </article>
  );
}
