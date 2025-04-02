# Todo App

A modern Todo application built with Next.js (App Router), Node.js, Express, and MongoDB.

## Features

- Server-side rendering for better performance
- Paginated todo list
- Real-time todo updates
- Modern UI with Tailwind CSS
- MongoDB integration for data persistence

## Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or Atlas)

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your MongoDB connection string:

   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js App Router pages and API routes
- `/components` - React components
- `/lib` - Utility functions and database connection
- `/public` - Static assets

## API Endpoints

- `GET /api/todos` - Get paginated todos
- `POST /api/todos` - Create a new todo
- `PATCH /api/todos/[id]` - Update a todo
- `DELETE /api/todos/[id]` - Delete a todo

## Technologies Used

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- MongoDB
- Node.js
- Express
