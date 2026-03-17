"use client";

import Image from "next/image";
import { VideoItem } from "@/lib/firestore";

interface Props {
  video: VideoItem;
  onClick: (video: VideoItem) => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export function VideoCard({ video, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(video)}
      className="group text-left w-full rounded-2xl overflow-hidden bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="relative aspect-video bg-gray-100">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 mb-1">
          {video.title}
        </p>
        <p className="text-xs text-gray-500">{video.channelTitle}</p>
        <p className="text-xs text-gray-400 mt-0.5">{timeAgo(video.publishedAt)}</p>
      </div>
    </button>
  );
}
