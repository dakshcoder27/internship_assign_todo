# MongoDB Atlas Connection Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (or use your existing account)
3. Choose the FREE tier (M0) for your cluster

## Step 2: Create a Cluster

1. Click "Build a Database"
2. Select "FREE" tier (M0)
3. Choose a cloud provider (AWS, Google Cloud, or Azure)
4. Select a region closest to your users
5. Click "Create Cluster"

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
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production, you can restrict to specific IPs:
   - Vercel IPs: Add `0.0.0.0/0` (allows all IPs)
   - Or specific IPs: Add your application's IP addresses

## Step 5: Get Your Connection String

1. In the left sidebar, click "Database"
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Choose "Node.js" as your driver
5. Copy the connection string

## Step 6: Format Your Connection String

Replace the placeholders in the connection string:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
```

Example:

```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/todo-app?retryWrites=true&w=majority
```

## Step 7: Set Up Environment Variables

### For Local Development (.env.local):

```
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/todo-app?retryWrites=true&w=majority
```

### For Production (Vercel/Render):

1. Go to your deployment platform's dashboard
2. Add environment variable:
   - Name: `MONGODB_URI`
   - Value: Your formatted connection string

## Security Best Practices

1. **Never commit connection strings to Git**

   - Always use environment variables
   - Keep .env.local in .gitignore

2. **Use Strong Passwords**

   - Include uppercase and lowercase letters
   - Include numbers and special characters
   - Minimum 8 characters

3. **IP Whitelisting**

   - For development: Allow all IPs (0.0.0.0/0)
   - For production: Restrict to your application's IPs

4. **Database User Permissions**
   - Use the principle of least privilege
   - Only grant necessary permissions

## Troubleshooting Connection Issues

1. **Connection Timeout**

   - Check your IP whitelist settings
   - Verify network connectivity
   - Check if your IP is blocked

2. **Authentication Failed**

   - Verify username and password
   - Check if special characters are properly encoded
   - Ensure the database user exists

3. **Database Not Found**
   - Verify the database name in the connection string
   - Check if the database exists
   - Ensure proper permissions


   mongodb+srv://daksh:<daksh>@cluster0.i12psq3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

## Example Connection Code

```typescript
// lib/mongodb.ts
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db();
  return { db, client };
}
```

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver Documentation](https://docs.mongodb.com/drivers/node/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
