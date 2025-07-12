// app/writing/page.tsx
import { getContentItems } from '@/lib/content';
import { WritingPost } from '@/lib/types';
import WritingPageClient from './WritingPageClient';

export default function WritingPage() {
  const posts = getContentItems('writing') as WritingPost[];
  
  return <WritingPageClient posts={posts} />;
}
