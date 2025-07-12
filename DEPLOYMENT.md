# Deployment Guide

## Prerequisites

- [Vercel](https://vercel.com) account
- [Neon](https://neon.tech) database (already set up)
- Environment variables configured

## Environment Variables

Make sure these are set in your Vercel project settings:

```env
DATABASE_URL="your-neon-database-url"
```

## Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Deploy from your project directory
vercel

# Follow the prompts to connect to your Vercel account
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

## Database Migration

After deployment, you'll need to run the database migration:

```bash
# Run this from your local machine (already done)
npx prisma migrate deploy
```

## Seed Data

The database should already be seeded with sample data. If you need to re-seed:

```bash
npx prisma db seed
```

## Verify Deployment

1. Check that your site loads at your Vercel URL
2. Visit `/projects/side-notes` to verify the Side Notes functionality
3. Try adding a new note to test the API endpoints
4. Verify filtering and sorting work correctly

## Troubleshooting

### Database Connection Issues
- Double-check your `DATABASE_URL` in Vercel environment variables
- Ensure Neon database is running and accessible

### Build Errors
- Check the Vercel build logs
- Verify all TypeScript types are correct
- Ensure all dependencies are in `package.json`

### API Route Issues
- Check Vercel function logs
- Verify Prisma client is properly configured
- Test API endpoints individually

## Next Steps

1. Set up custom domain (optional)
2. Configure analytics (optional)
3. Add more content to your reading/writing sections
4. Expand the Side Notes functionality with more features
