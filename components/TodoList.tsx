"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

interface Todo {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface TodoListProps {
  onSelectTodo: (todo: Todo) => void;
  selectedTodo: Todo | null;
}

export default function TodoList({
  onSelectTodo,
  selectedTodo,
}: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    // Debounce search query
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/todos?search=${debouncedSearch}`);
      const data = await response.json();
      setTodos(data.todos);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col h-[calc(100vh-220px)]">
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search todos..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex-1 overflow-auto pr-2">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {searchQuery
              ? "No todos found matching your search"
              : "No todos yet. Create one to get started!"}
          </div>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <div
                key={todo._id}
                onClick={() => onSelectTodo(todo)}
                className={`p-6 rounded-lg border cursor-pointer transition-all ${
                  selectedTodo?._id === todo._id
                    ? "border-black"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <h3 className="text-lg font-semibold mb-2">{todo.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {todo.description}
                </p>
                <p className="text-gray-400 text-sm">
                  {format(new Date(todo.createdAt), "MMM d, yyyy")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
