# Connected Content Architecture

## Overview
The writing and reading sections are now connected through a unified content system that maintains their distinct identities while enabling cross-referencing and discovery.

## Features Implemented

### 1. Unified Content System
- **Shared Types**: Common `ContentItem` base type with specific `WritingPost` and `ReadingItem` extensions
- **Cross-References**: Writing posts can reference reading items and vice versa
- **Tagging System**: Shared tags enable content discovery across both sections

### 2. Content Structure
```
content/
├── writing/
│   ├── my-first-post.mdx (tags: productivity, learning)
│   └── my-second-post.mdx (tags: design, ux)
└── reading/
    ├── atomic-habits.mdx (tags: productivity, habits, personal-development)
    └── design-of-everyday-things.mdx (tags: design, ux, psychology, usability)
```

### 3. Cross-Reference Types
- **Writing → Reading**: `related_reading` and `inspired_by` fields
- **Reading → Writing**: `related_writing` field
- **Tag-based**: Automatic discovery of content with overlapping tags

### 4. Content Features
- **Reading Status**: Track reading progress (completed, reading, want-to-read)
- **Ratings**: Star ratings for completed books
- **Author Information**: Author attribution for reading items
- **Publication Dates**: Chronological organization
- **Tag Display**: Visual tag representation

### 5. Related Content Discovery
- **Explicit Relations**: Show directly referenced content
- **Tag-based Relations**: Discover content with shared tags
- **Bi-directional Links**: Navigate between writing and reading seamlessly

## Example Connections
- "My First Post" → "Atomic Habits" (via `related_reading`)
- "Atomic Habits" → "My First Post" (via `related_writing`)
- "My Second Post" ↔ "Design of Everyday Things" (via `inspired_by`)
- Tag-based: "productivity" connects writing and reading content

## Technical Implementation
- **Utilities**: `lib/content.ts` - Content parsing and relationship discovery
- **Types**: `lib/types.ts` - TypeScript definitions
- **Pages**: Updated writing and reading pages with cross-references
- **Components**: Related content cards with type indicators

## Benefits
1. **Discoverability**: Users can explore related content across both sections
2. **Context**: See what books inspired writing or what posts discuss specific books
3. **Coherence**: Unified visual language while maintaining section identity
4. **Flexibility**: Easy to add new connection types in the future
