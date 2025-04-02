import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search") || "";

    const { db } = await connectToDatabase();

    // Create search query
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // If page and limit are provided, use pagination
    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Get total count for pagination
      const total = await db.collection("todos").countDocuments(query);

      // Get todos with pagination
      const todos = await db
        .collection("todos")
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .toArray();

      return NextResponse.json({ todos, total });
    } else {
      // Get all todos without pagination
      const todos = await db
        .collection("todos")
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      return NextResponse.json({ todos });
    }
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();
    const { db } = await connectToDatabase();

    const todo = {
      title,
      description,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("todos").insertOne(todo);
    const createdTodo = {
      _id: result.insertedId,
      ...todo,
    };

    return NextResponse.json(createdTodo, { status: 201 });
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
