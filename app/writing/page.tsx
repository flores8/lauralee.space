// app/writing/page.tsx
import { Suspense } from 'react';
import { getContentItems } from '@/lib/content';
import { WritingPost } from '@/lib/types';
import WritingPageClient from './WritingPageClient';

function WritingPageLoading() {
  return (
    <div className="content-section">
      <h1>Writing</h1>
      <p>Thoughts, essays, and musings in progress.</p>
      <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--color-muted)' }}>
        Loading posts...
      </div>
    </div>
  );
}

export default function WritingPage() {
  const posts = getContentItems('writing') as WritingPost[];
  
  return (
    <Suspense fallback={<WritingPageLoading />}>
      <WritingPageClient posts={posts} />
    </Suspense>
  );
}
