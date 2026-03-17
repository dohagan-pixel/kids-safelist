import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { VideoItem } from "@/lib/firestore";
import { Timestamp } from "firebase-admin/firestore";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YT_BASE = "https://www.googleapis.com/youtube/v3";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function fetchVideosFromYouTube(channelId: string): Promise<VideoItem[]> {
  const url = new URL(`${YT_BASE}/search`);
  url.searchParams.set("key", YOUTUBE_API_KEY!);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("channelId", channelId);
  url.searchParams.set("type", "video");
  url.searchParams.set("order", "date");
  url.searchParams.set("maxResults", "12");

  const res = await fetch(url.toString());
  const data = await res.json();

  if (!data.items) return [];

  return data.items.map((item: {
    id: { videoId: string };
    snippet: {
      title: string;
      thumbnails: { medium?: { url: string }; default?: { url: string } };
      publishedAt: string;
      channelId: string;
      channelTitle: string;
    };
  }) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    thumbnailUrl:
      item.snippet.thumbnails?.medium?.url ??
      item.snippet.thumbnails?.default?.url ??
      "",
    publishedAt: item.snippet.publishedAt,
    channelId: item.snippet.channelId,
    channelTitle: item.snippet.channelTitle,
  }));
}

async function getVideosForChannel(channelId: string): Promise<VideoItem[]> {
  const cacheRef = getAdminDb().collection("videoCache").doc(channelId);
  const cacheSnap = await cacheRef.get();

  if (cacheSnap.exists) {
    const data = cacheSnap.data()!;
    const fetchedAt: Timestamp = data.fetchedAt;
    const ageMs = Date.now() - fetchedAt.toMillis();
    if (ageMs < CACHE_TTL_MS) {
      return data.videos ?? [];
    }
  }

  const videos = await fetchVideosFromYouTube(channelId);
  await cacheRef.set({ videos, fetchedAt: Timestamp.now() });
  return videos;
}

export async function GET(req: NextRequest) {
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ error: "YouTube API not configured" }, { status: 500 });
  }

  const channels = req.nextUrl.searchParams.get("channels");
  if (!channels) {
    return NextResponse.json({ videos: [] });
  }

  const channelIds = channels.split(",").filter(Boolean).slice(0, 50);

  const results = await Promise.allSettled(
    channelIds.map((id) => getVideosForChannel(id))
  );

  const allVideos: VideoItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      allVideos.push(...result.value);
    }
  }

  allVideos.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return NextResponse.json({ videos: allVideos });
}
