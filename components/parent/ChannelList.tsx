"use client";

import { Channel } from "@/lib/firestore";
import { ChannelCard } from "./ChannelCard";

interface Props {
  channels: Channel[];
  onRemove: (channelId: string) => void;
}

export function ChannelList({ channels, onRemove }: Props) {
  if (channels.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p className="text-sm">No channels added yet. Add one above to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {channels.map((channel) => (
        <ChannelCard
          key={channel.channelId}
          channel={channel}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
