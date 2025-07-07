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
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
