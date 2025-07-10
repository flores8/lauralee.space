export type ContentType = 'writing' | 'reading' | 'projects';

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

export type ProjectItem = BaseContentItem & {
  type: 'projects';
  project_type: 'interactive' | 'visualization' | 'archive' | 'tool';
  status: 'idea' | 'in-progress' | 'completed' | 'maintained';
  tech_stack?: string[];
  demo_url?: string;
  github_url?: string;
  related_reading?: string[];
  related_writing?: string[];
  inspired_by?: string[];
};

export type ContentItem = WritingPost | ReadingItem | ProjectItem;

export type ContentWithContent = ContentItem & {
  content: string;
};

// Specific types for Side Notes project
export type SideNote = {
  id: string;
  content: string;
  type: 'quote' | 'thought' | 'idea' | 'insight';
  source?: string; // book title, article, etc.
  source_author?: string;
  related_books?: string[]; // slugs from reading content
  related_writing?: string[]; // slugs from writing content
  tags?: string[];
  date_added: string;
  page_number?: number;
  chapter?: string;
  personal_note?: string;
  mood?: string;
  context?: string;
};
