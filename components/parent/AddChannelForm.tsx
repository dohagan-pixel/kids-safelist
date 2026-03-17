"use client";

import { useState } from "react";

interface ResolvedChannel {
  channelId: string;
  handle: string;
  title: string;
  thumbnailUrl: string;
}

interface Props {
  onAdd: (input: string) => Promise<{ error?: string }>;
}

export function AddChannelForm({ onAdd }: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    const result = await onAdd(input.trim());

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Channel added!");
      setInput("");
      setTimeout(() => setSuccess(""), 3000);
    }

    setLoading(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Add a Channel</h2>
      <p className="text-sm text-gray-500 mb-4">
        Paste a YouTube channel URL or @handle (e.g. youtube.com/@nasa or @NASA)
      </p>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="youtube.com/@channelname"
          disabled={loading}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
    </div>
  );
}
