# Setting Up MongoDB Atlas for Production

This guide will help you set up a MongoDB Atlas cluster for your production Todo application.

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (or use your existing account)
3. Choose the free tier (M0) for your cluster

## Step 2: Create a Cluster

1. Click "Build a Database"
2. Select "FREE" tier (M0)
3. Choose a cloud provider (AWS, Google Cloud, or Azure) and a region close to your users
4. Click "Create Cluster"

## Step 3: Configure Database Access

1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter a username and password (save these securely)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

## Step 4: Configure Network Access

1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. For development, you can click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production, you can restrict to Vercel IPs or your specific IP
5. Click "Confirm"

## Step 5: Get Your Connection String

1. In the left sidebar, click "Database"
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user's password
6. Replace `<dbname>` with your database name (e.g., "todo-app")

## Step 6: Use the Connection String in Vercel

1. When deploying to Vercel, add the connection string as an environment variable:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string

## Example Connection String

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/todo-app?retryWrites=true&w=majority
```

## Security Considerations

- Never commit your MongoDB connection string to your repository
- Use environment variables to store sensitive information
- Regularly rotate your database passwords
- Consider using IP whitelisting for additional security

## Troubleshooting

- If you can't connect to your database, check your network access settings
- Verify your username and password are correct
- Ensure your connection string is properly formatted
- Check that your database user has the correct permissions
