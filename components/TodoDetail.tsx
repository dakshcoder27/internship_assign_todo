"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import {
  formatText,
  setFontSize,
  setTextColor,
  setBackgroundColor,
} from "@/lib/richTextEditor";

interface Todo {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface TodoDetailProps {
  todo?: Todo | null;
  isNew?: boolean;
  onUpdate?: () => void;
  onCancel?: () => void;
}

export default function TodoDetail({
  todo,
  isNew,
  onUpdate,
  onCancel,
}: TodoDetailProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [fontSize, setFontSizeState] = useState("16px");
  const [editorContent, setEditorContent] = useState("");
  const [activeFormatting, setActiveFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
      setEditorContent(todo.description);
      if (editorRef.current) {
        editorRef.current.innerHTML = todo.description;
      }
    } else {
      // Reset the editor for new todos
      setTitle("");
      setDescription("");
      setEditorContent("");
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    }
  }, [todo]);

  const handleEditorChange = () => {
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML);
      // Update active formatting states
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const parentElement = range.commonAncestorContainer.parentElement;
        if (parentElement) {
          setActiveFormatting({
            bold: document.queryCommandState("bold"),
            italic: document.queryCommandState("italic"),
            underline: document.queryCommandState("underline"),
          });
        }
      }
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !editorContent.trim()) return;

    setIsSaving(true);
    try {
      const url = isNew ? "/api/todos" : `/api/todos/${todo?._id}`;
      const method = isNew ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description: editorContent,
        }),
      });

      if (response.ok) {
        // Reset the form
        setTitle("");
        setDescription("");
        setEditorContent("");
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
        }

        // Call onUpdate to refresh the todo list
        if (onUpdate) {
          onUpdate();
        }

        // Call onCancel to close the detail view
        if (onCancel) {
          onCancel();
        }
      }
    } catch (error) {
      console.error("Error saving todo:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!todo || !confirm("Are you sure you want to delete this todo?")) return;

    try {
      const response = await fetch(`/api/todos/${todo._id}`, {
        method: "DELETE",
      });

      if (response.ok && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleFontSizeChange = (size: string) => {
    setFontSizeState(size);
    setFontSize(size);
  };

  const openColorPicker = (type: "text" | "background") => {
    const input = document.createElement("input");
    input.type = "color";
    input.onchange = (e) => {
      if (type === "text") {
        setTextColor((e.target as HTMLInputElement).value);
      } else {
        setBackgroundColor((e.target as HTMLInputElement).value);
      }
    };
    input.click();
  };

  const isSaveDisabled = () => {
    if (isSaving) return true;
    if (!title.trim()) return true;
    if (!editorContent.trim()) return true;
    return false;
  };

  if (!todo && !isNew) {
    return (
      <div className="text-center text-gray-500 mt-20">
        Select a todo to view details
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {isNew ? "New Additions" : "Edit Todo"}
        </h2>
        {!isNew && (
          <button
            onClick={handleDelete}
            className="text-gray-600 hover:text-red-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 p-0"
          />
        </div>

        <div className="border-t border-b py-4">
          <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
            {/* Text Style */}
            <div className="flex space-x-1 border-r pr-2">
              <button
                onClick={() => formatText("bold")}
                className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 data-[active=true]:bg-gray-300 data-[active=true]:text-blue-600"
                title="Bold"
                data-active={activeFormatting.bold}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6V4zm8 4a2 2 0 00-2-2H8v4h4a2 2 0 002-2zm-8 6h9a4 4 0 014 4 4 4 0 01-4 4H6v-8zm9 6a2 2 0 002-2 2 2 0 00-2-2H8v4h7z"
                  />
                </svg>
              </button>
              <button
                onClick={() => formatText("italic")}
                className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 data-[active=true]:bg-gray-300 data-[active=true]:text-blue-600"
                title="Italic"
                data-active={activeFormatting.italic}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M10 4v2h2.21l-3.42 12H6v2h8v-2h-2.21l3.42-12H18V4z"
                  />
                </svg>
              </button>
              <button
                onClick={() => formatText("underline")}
                className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 data-[active=true]:bg-gray-300 data-[active=true]:text-blue-600"
                title="Underline"
                data-active={activeFormatting.underline}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"
                  />
                </svg>
              </button>
            </div>

            {/* Alignment */}
            <div className="flex space-x-1 border-r pr-2">
              <button
                onClick={() => formatText("justifyLeft")}
                className="p-2 hover:bg-gray-200 rounded"
                title="Left Align"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M3 3h18v2H3V3zm0 8h12v2H3v-2zm0 8h18v2H3v-2zm0-4h12v2H3v-2zm0-8h12v2H3V7z"
                  />
                </svg>
              </button>
              <button
                onClick={() => formatText("justifyCenter")}
                className="p-2 hover:bg-gray-200 rounded"
                title="Center Align"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M3 3h18v2H3V3zm4 8h10v2H7v-2zm-4 8h18v2H3v-2zm4-4h10v2H7v-2zm-4-8h18v2H3V7z"
                  />
                </svg>
              </button>
              <button
                onClick={() => formatText("justifyRight")}
                className="p-2 hover:bg-gray-200 rounded"
                title="Right Align"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M3 3h18v2H3V3zm6 8h12v2H9v-2zm-6 8h18v2H3v-2zm6-4h12v2H9v-2zm-6-8h18v2H3V7z"
                  />
                </svg>
              </button>
              <button
                onClick={() => formatText("justifyFull")}
                className="p-2 hover:bg-gray-200 rounded"
                title="Justify"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M3 3h18v2H3V3zm0 8h18v2H3v-2zm0 8h18v2H3v-2zm0-4h18v2H3v-2zm0-8h18v2H3V7z"
                  />
                </svg>
              </button>
            </div>

            {/* Lists */}
            <div className="flex space-x-1 border-r pr-2">
              <button
                onClick={() => formatText("insertUnorderedList")}
                className="p-2 hover:bg-gray-200 rounded"
                title="Bullet List"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"
                  />
                </svg>
              </button>
              <button
                onClick={() => formatText("insertOrderedList")}
                className="p-2 hover:bg-gray-200 rounded"
                title="Numbered List"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"
                  />
                </svg>
              </button>
            </div>

            {/* Font Size */}
            <div className="flex items-center space-x-2 border-r pr-2">
              <select
                value={fontSize}
                onChange={(e) => handleFontSizeChange(e.target.value)}
                className="p-1 bg-transparent border rounded"
              >
                <option value="12px">12</option>
                <option value="14px">14</option>
                <option value="16px">16</option>
                <option value="18px">18</option>
                <option value="20px">20</option>
                <option value="24px">24</option>
              </select>
            </div>

            {/* Color */}
            <div className="flex space-x-1">
              <button
                onClick={() => openColorPicker("text")}
                className="p-2 hover:bg-gray-200 rounded"
                title="Text Color"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L12 5.67 14.38 12H9.62z"
                  />
                </svg>
              </button>
              <button
                onClick={() => openColorPicker("background")}
                className="p-2 hover:bg-gray-200 rounded"
                title="Background Color"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorChange}
            className="w-full min-h-[200px] bg-transparent focus:outline-none p-0"
            style={{ fontSize }}
          />
        </div>

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isSaveDisabled()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : isNew ? "Create" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
