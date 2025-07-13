// app/reading/page.tsx
import { Suspense } from 'react';
import { getContentItems } from '@/lib/content';
import { ReadingItem } from '@/lib/types';
import ReadingPageClient from './ReadingPageClient';

function ReadingPageLoading() {
  return (
    <div className="content-section">
      <h1>Reading</h1>
      <p>Books I'm loving and learning from.</p>
      <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--color-muted)' }}>
        Loading books...
      </div>
    </div>
  );
}

export default function ReadingPage() {
  const readingItems = getContentItems('reading') as ReadingItem[];
  
  return (
    <Suspense fallback={<ReadingPageLoading />}>
      <ReadingPageClient readingItems={readingItems} />
    </Suspense>
  );
}
