"use client";

import Image from "next/image";
import { Channel } from "@/lib/firestore";

interface Props {
  channel: Channel;
  onRemove: (channelId: string) => void;
}

export function ChannelCard({ channel, onRemove }: Props) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-4">
      {channel.thumbnailUrl ? (
        <Image
          src={channel.thumbnailUrl}
          alt={channel.title}
          width={56}
          height={56}
          className="rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{channel.title}</p>
        <p className="text-sm text-gray-500 truncate">{channel.handle}</p>
      </div>
      <button
        onClick={() => onRemove(channel.channelId)}
        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1 rounded-lg hover:bg-red-50"
        aria-label={`Remove ${channel.title}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
