export type ContentType = 'writing' | 'reading';

export type BaseContentItem = {
  title: string;
  slug: string;
  date: string;
  type: ContentType;
  published: boolean;
  tags?: string[];
  excerpt?: string;
};

export type WritingPost = BaseContentItem & {
  type: 'writing';
  related_reading?: string[];
  inspired_by?: string[];
};

export type ReadingItem = BaseContentItem & {
  type: 'reading';
  author: string;
  status: 'reading' | 'completed' | 'want-to-read';
  rating?: number;
  related_writing?: string[];
  isbn?: string;
  notes?: string;
};

export type ContentItem = WritingPost | ReadingItem;

export type ContentWithContent = ContentItem & {
  content: string;
};
