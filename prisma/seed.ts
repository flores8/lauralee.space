import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.book.create({
    data: {
      title: 'The Creative Act',
      author: 'Rick Rubin',
      status: 'READING',
    },
  });

  await prisma.post.create({
    data: {
      title: 'Welcome to my creative space',
      slug: 'welcome',
      content: 'This is where I get to figure things out.',
      published: true,
    },
  });

  // Create some sample side notes
  await prisma.sideNote.create({
    data: {
      content: 'You do not rise to the level of your goals. You fall to the level of your systems.',
      type: 'QUOTE',
      source: 'Atomic Habits',
      sourceAuthor: 'James Clear',
      relatedBooks: ['atomic-habits'],
      relatedWriting: ['my-first-post'],
      tags: ['productivity', 'systems', 'habits'],
      pageNumber: 27,
      personalNote: 'This really resonated with me. It shifts the focus from outcomes to process.',
      mood: 'inspired',
      context: 'Reading during morning coffee',
    },
  });

  await prisma.sideNote.create({
    data: {
      content: 'The design of everyday things is not just about making things look pretty. It\'s about making things work.',
      type: 'THOUGHT',
      source: 'The Design of Everyday Things',
      sourceAuthor: 'Don Norman',
      relatedBooks: ['design-of-everyday-things'],
      relatedWriting: ['my-second-post'],
      tags: ['design', 'usability', 'functionality'],
      pageNumber: 156,
      personalNote: 'This connects to my experience with designing user interfaces.',
      mood: 'thoughtful',
      context: 'After struggling with a poorly designed door handle',
    },
  });

  await prisma.sideNote.create({
    data: {
      content: 'What if we treated our personal knowledge like a garden - something that needs tending, pruning, and connecting?',
      type: 'IDEA',
      tags: ['knowledge-management', 'personal-growth', 'metaphor'],
      personalNote: 'This came to me while working on this Side Notes project. The connections between ideas are like pathways in a garden.',
      mood: 'curious',
      context: 'Walking in the morning, thinking about how to organize thoughts',
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
