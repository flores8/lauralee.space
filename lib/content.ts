import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ContentItem, ContentWithContent, WritingPost, ReadingItem, ContentType } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function getContentItems(type: ContentType): ContentItem[] {
  const contentDir = path.join(CONTENT_DIR, type);
  
  if (!fs.existsSync(contentDir)) {
    return [];
  }
  
  const files = fs.readdirSync(contentDir);
  
  return files
    .filter(file => file.endsWith('.mdx'))
    .map((filename) => {
      const filePath = path.join(contentDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);
      
      return {
        ...data,
        type,
      } as ContentItem;
    })
    .filter((item) => item.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getContentItemBySlug(type: ContentType, slug: string): ContentWithContent | null {
  const filePath = path.join(CONTENT_DIR, type, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  
  return {
    ...data,
    type,
    content,
  } as ContentWithContent;
}

export function getAllContentItems(): ContentItem[] {
  const writing = getContentItems('writing');
  const reading = getContentItems('reading');
  
  return [...writing, ...reading]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getRelatedContent(item: ContentItem): ContentItem[] {
  const allContent = getAllContentItems();
  const related: ContentItem[] = [];
  
  if (item.type === 'writing') {
    const writingPost = item as WritingPost;
    
    // Find related reading items
    if (writingPost.related_reading) {
      const relatedReading = allContent.filter(
        content => content.type === 'reading' && 
        writingPost.related_reading?.includes(content.slug)
      );
      related.push(...relatedReading);
    }
    
    // Find items this post was inspired by
    if (writingPost.inspired_by) {
      const inspirationSources = allContent.filter(
        content => writingPost.inspired_by?.includes(content.slug)
      );
      related.push(...inspirationSources);
    }
  } else {
    const readingItem = item as ReadingItem;
    
    // Find related writing posts
    if (readingItem.related_writing) {
      const relatedWriting = allContent.filter(
        content => content.type === 'writing' && 
        readingItem.related_writing?.includes(content.slug)
      );
      related.push(...relatedWriting);
    }
  }
  
  // Also find items with overlapping tags
  if (item.tags && item.tags.length > 0) {
    const tagRelated = allContent.filter(
      content => 
        content.slug !== item.slug && 
        content.tags && 
        content.tags.some(tag => item.tags?.includes(tag))
    );
    related.push(...tagRelated);
  }
  
  // Remove duplicates and return
  return related.filter((item, index, self) => 
    index === self.findIndex(t => t.slug === item.slug)
  );
}

export function getContentByTag(tag: string): ContentItem[] {
  const allContent = getAllContentItems();
  
  return allContent.filter(item => 
    item.tags && item.tags.includes(tag)
  );
}

export function getAllTags(): string[] {
  const allContent = getAllContentItems();
  const tags = new Set<string>();
  
  allContent.forEach(item => {
    if (item.tags) {
      item.tags.forEach(tag => tags.add(tag));
    }
  });
  
  return Array.from(tags).sort();
}
