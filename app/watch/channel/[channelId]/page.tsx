"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { getSafelist, Channel } from "@/lib/firestore";
import { useVideos } from "@/hooks/useVideos";
import { VideoGrid } from "@/components/watch/VideoGrid";
import { Nav } from "@/components/Nav";

function ChannelContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const uid = searchParams.get("uid");
  const channelId = params.channelId as string;

  const [channels, setChannels] = useState<Channel[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(true);

  useEffect(() => {
    if (!uid) { setLoadingChannels(false); return; }
    getSafelist(uid)
      .then(setChannels)
      .finally(() => setLoadingChannels(false));
  }, [uid]);

  const { videos, loading: loadingVideos, error } = useVideos(
    loadingChannels ? [] : [channelId]
  );

  const channel = channels.find((c) => c.channelId === channelId);

  const base = uid ? `/watch?uid=${uid}` : "/watch";

  if (!uid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Ask a parent to share your watch link.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav
        channels={channels}
        uid={uid}
        activeChannelId={channelId}
        onChannelSelect={(id) => {
          if (!id) window.location.href = base;
          else window.location.href = `/watch/channel/${id}?uid=${uid}`;
        }}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {channel && (
          <div className="flex items-center gap-4 mb-6">
            {channel.thumbnailUrl && (
              <img
                src={channel.thumbnailUrl}
                alt={channel.title}
                className="w-14 h-14 rounded-full"
              />
            )}
            <div>
              <h1 className="font-bold text-gray-900 text-xl">{channel.title}</h1>
              <p className="text-sm text-gray-500">{channel.handle}</p>
            </div>
          </div>
        )}
        <VideoGrid
          videos={videos}
          loading={loadingChannels || loadingVideos}
          error={error}
        />
      </main>
    </div>
  );
}

export default function ChannelPage() {
  return (
    <Suspense fallback={null}>
      <ChannelContent />
    </Suspense>
  );
}
