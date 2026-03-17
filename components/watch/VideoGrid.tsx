"use client";

import { useState } from "react";
import { VideoItem } from "@/lib/firestore";
import { VideoCard } from "./VideoCard";
import { VideoPlayer } from "./VideoPlayer";

interface Props {
  videos: VideoItem[];
  loading: boolean;
  error: string | null;
}

export function VideoGrid({ videos, loading, error }: Props) {
  const [playing, setPlaying] = useState<VideoItem | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden bg-gray-100 animate-pulse">
            <div className="aspect-video bg-gray-200" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📺</div>
        <p className="text-gray-500 text-lg font-medium">No videos yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Ask a parent to add some YouTube channels.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <VideoCard key={video.videoId} video={video} onClick={setPlaying} />
        ))}
      </div>
      {playing && (
        <VideoPlayer video={playing} onClose={() => setPlaying(null)} />
      )}
    </>
  );
}
