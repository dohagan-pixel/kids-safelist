"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getSafelist, Channel } from "@/lib/firestore";
import { useVideos } from "@/hooks/useVideos";
import { VideoGrid } from "@/components/watch/VideoGrid";
import { Nav } from "@/components/Nav";

function WatchContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  const [channels, setChannels] = useState<Channel[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [channelError, setChannelError] = useState("");
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setChannelError("No family ID provided.");
      setLoadingChannels(false);
      return;
    }
    getSafelist(uid)
      .then(setChannels)
      .catch(() => setChannelError("Could not load channel list."))
      .finally(() => setLoadingChannels(false));
  }, [uid]);

  const channelIds = activeChannelId
    ? [activeChannelId]
    : channels.map((c) => c.channelId);

  const { videos, loading: loadingVideos, error: videoError } = useVideos(
    loadingChannels ? [] : channelIds
  );

  if (!uid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📺</div>
          <p className="text-gray-500">Ask a parent to share your watch link.</p>
        </div>
      </div>
    );
  }

  const activeChannel = channels.find((c) => c.channelId === activeChannelId) ?? null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav
        channels={channels}
        uid={uid}
        activeChannelId={activeChannelId}
        onChannelSelect={setActiveChannelId}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {channelError ? (
          <p className="text-center text-red-500 py-12">{channelError}</p>
        ) : (
          <>
            {activeChannel && (
              <div className="flex items-center gap-3 mb-5">
                {activeChannel.thumbnailUrl && (
                  <img
                    src={activeChannel.thumbnailUrl}
                    alt={activeChannel.title}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <h1 className="font-bold text-gray-900 text-lg">{activeChannel.title}</h1>
                  <p className="text-sm text-gray-500">{activeChannel.handle}</p>
                </div>
              </div>
            )}
            <VideoGrid
              videos={videos}
              loading={loadingChannels || loadingVideos}
              error={videoError}
              onChannelClick={setActiveChannelId}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={null}>
      <WatchContent />
    </Suspense>
  );
}
