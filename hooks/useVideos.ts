"use client";

import { useEffect, useState } from "react";
import { VideoItem } from "@/lib/firestore";

export function useVideos(channelIds: string[]) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (channelIds.length === 0) {
      setVideos([]);
      return;
    }

    setLoading(true);
    setError(null);

    const ids = channelIds.join(",");
    fetch(`/api/videos?channels=${encodeURIComponent(ids)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setVideos(data.videos ?? []);
        }
      })
      .catch(() => setError("Failed to load videos"))
      .finally(() => setLoading(false));
  }, [channelIds.join(",")]);

  return { videos, loading, error };
}
