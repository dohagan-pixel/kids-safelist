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
          <Link href={base} className="flex items-center">
            <Image
              src="/gwi-logo.svg"
              alt="GWI"
              width={66}
              height={20}
              priority
            />
          </Link>
          <div className="flex items-center gap-3">
            {children}
            {!children && (
              <Link
                href="/parent"
                className="text-gray-400 hover:text-gray-700 transition-colors"
                title="Parent settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Channel strip */}
        {channels.length > 0 && (
          <div className="flex items-center gap-2 pb-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={handleAll}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !activeChannelId
                  ? "bg-[#FF0077] text-white"
                  : "bg-[#EBF1FB] text-[#526482] hover:bg-[#DFE7F5]"
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
                    ? "bg-[#FF0077] text-white"
                    : "bg-[#EBF1FB] text-[#526482] hover:bg-[#DFE7F5]"
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
