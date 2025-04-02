"use client";

import { useState, useCallback } from "react";
import TodoList from "@/components/TodoList";
import TodoDetail from "@/components/TodoDetail";
import Image from "next/image";

export default function Home() {
  const [selectedTodo, setSelectedTodo] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleCreateTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        setIsCreating(false);
        // Reset the form
        e.currentTarget.reset();
        // Trigger a refresh of the todo list
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-96 h-full border-r bg-white">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-emerald-400 rounded-lg" />
            <h1 className="text-2xl font-bold">TODO</h1>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 mb-8"
          >
            <span className="text-lg">+</span>
            <span>TODO</span>
          </button>

          <TodoList
            key={refreshKey}
            onSelectTodo={setSelectedTodo}
            selectedTodo={selectedTodo}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {isCreating ? (
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => setIsCreating(false)}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back
                </button>
              </div>
              <TodoDetail
                isNew={true}
                onCancel={() => setIsCreating(false)}
                onUpdate={handleRefresh}
              />
            </div>
          ) : (
            <TodoDetail todo={selectedTodo} onUpdate={handleRefresh} />
          )}
        </div>
      </div>
    </div>
  );
}
