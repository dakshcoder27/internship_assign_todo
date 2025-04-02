#!/bin/bash

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
vercel whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo "You are not logged in to Vercel. Please log in first."
    vercel login
fi

# Prompt for MongoDB URI
read -p "Enter your MongoDB Atlas connection string: " MONGODB_URI

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

# Add environment variable
echo "Adding MongoDB URI as environment variable..."
vercel env add MONGODB_URI

echo "Deployment complete! Your app should be live at the URL provided by Vercel." 