"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getSafelist, Channel } from "@/lib/firestore";
import { useVideos } from "@/hooks/useVideos";
import { VideoGrid } from "@/components/watch/VideoGrid";

function WatchContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  const [channels, setChannels] = useState<Channel[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [channelError, setChannelError] = useState("");

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

  const channelIds = channels.map((c) => c.channelId);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-2">
          <span className="text-2xl">📺</span>
          <span className="font-bold text-gray-900 text-lg">KidsTube</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {channelError ? (
          <p className="text-center text-red-500 py-12">{channelError}</p>
        ) : (
          <VideoGrid
            videos={videos}
            loading={loadingChannels || loadingVideos}
            error={videoError}
          />
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
