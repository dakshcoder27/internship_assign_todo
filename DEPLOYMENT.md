# Deploying Todo App to Vercel

This guide will walk you through deploying your Todo application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (you can sign up with GitHub)
2. A [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas/register) for your production database
3. Your code pushed to a GitHub repository

## Step 1: Set up MongoDB Atlas

1. Create a new cluster in MongoDB Atlas
2. Set up a database user with appropriate permissions
3. Configure network access to allow connections from anywhere (or restrict to Vercel IPs)
4. Get your MongoDB connection string from the "Connect" button
5. Replace `localhost:27017` with your actual connection string

## Step 2: Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
5. Add Environment Variables:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:

   ```bash
   vercel login
   ```

3. Deploy your project:

   ```bash
   vercel
   ```

4. Follow the prompts to configure your project
5. Add your environment variables:
   ```bash
   vercel env add MONGODB_URI
   ```

## Step 3: Verify Deployment

1. Once deployment is complete, Vercel will provide you with a URL
2. Visit the URL to verify your application is working correctly
3. Test creating, reading, updating, and deleting todos

## Troubleshooting

- If you encounter database connection issues, check your MongoDB Atlas configuration
- Ensure your environment variables are correctly set in Vercel
- Check Vercel deployment logs for any build errors

## Continuous Deployment

Vercel automatically sets up continuous deployment. Any changes pushed to your main branch will trigger a new deployment.

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
