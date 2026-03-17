"use client";

import Image from "next/image";
import Link from "next/link";
import { Channel } from "@/lib/firestore";

interface Props {
  channels: Channel[];
  uid?: string;
  activeChannelId?: string | null;
  onChannelSelect?: (channelId: string | null) => void;
  children?: React.ReactNode; // right-side slot (sign out, user photo, etc.)
}

export function Nav({ channels, uid, activeChannelId, onChannelSelect, children }: Props) {
  const base = uid ? `/watch?uid=${uid}` : "/watch";

  function handleAll() {
    if (onChannelSelect) onChannelSelect(null);
  }

  function handleChannel(channelId: string) {
    if (onChannelSelect) onChannelSelect(channelId);
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top row */}
        <div className="flex items-center justify-between py-3">
          <Link href={base} className="flex items-center gap-2">
            <span className="text-2xl">📺</span>
            <span className="font-bold text-gray-900 text-lg">KidsTube</span>
          </Link>
          {children && <div className="flex items-center gap-3">{children}</div>}
        </div>

        {/* Channel strip */}
        {channels.length > 0 && (
          <div className="flex items-center gap-2 pb-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={handleAll}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !activeChannelId
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {channels.map((ch) => (
              <button
                key={ch.channelId}
                onClick={() => handleChannel(ch.channelId)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeChannelId === ch.channelId
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {ch.thumbnailUrl && (
                  <Image
                    src={ch.thumbnailUrl}
                    alt={ch.title}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                )}
                <span className="max-w-[120px] truncate">{ch.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
