import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YT_BASE = "https://www.googleapis.com/youtube/v3";

async function ytGet(endpoint: string, params: Record<string, string>) {
  const url = new URL(`${YT_BASE}/${endpoint}`);
  url.searchParams.set("key", YOUTUBE_API_KEY!);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  return res.json();
}

function extractFromUrl(input: string) {
  try {
    const url = new URL(input.startsWith("http") ? input : `https://${input}`);
    const pathname = url.pathname;

    // @handle — youtube.com/@mkbhd
    const handleMatch = pathname.match(/^\/@([\w.-]+)/);
    if (handleMatch) return { type: "handle", value: handleMatch[1] };

    // /channel/UCxxxxxx
    const channelMatch = pathname.match(/^\/channel\/(UC[\w-]{22})/);
    if (channelMatch) return { type: "id", value: channelMatch[1] };

    // /user/username
    const userMatch = pathname.match(/^\/user\/([\w.-]+)/);
    if (userMatch) return { type: "user", value: userMatch[1] };

    // /c/customname
    const customMatch = pathname.match(/^\/c\/([\w.-]+)/);
    if (customMatch) return { type: "handle", value: customMatch[1] };
  } catch {
    // Not a URL — could be a raw handle like @mkbhd or channel ID
  }

  const raw = input.trim().replace(/^@/, "");
  if (raw.startsWith("UC") && raw.length === 24) return { type: "id", value: raw };
  return { type: "handle", value: raw };
}

async function resolveToChannel(input: string) {
  const extracted = extractFromUrl(input);

  if (extracted.type === "id") {
    const data = await ytGet("channels", {
      part: "snippet",
      id: extracted.value,
    });
    return data.items?.[0] ?? null;
  }

  if (extracted.type === "user") {
    const data = await ytGet("channels", {
      part: "snippet",
      forUsername: extracted.value,
    });
    return data.items?.[0] ?? null;
  }

  // Handle type — use search (costs 100 quota units)
  const data = await ytGet("search", {
    part: "snippet",
    type: "channel",
    q: extracted.value,
    maxResults: "1",
  });
  if (data.items?.length > 0) {
    const channelId = data.items[0].snippet.channelId;
    const channelData = await ytGet("channels", {
      part: "snippet",
      id: channelId,
    });
    return channelData.items?.[0] ?? null;
  }

  return null;
}

export async function POST(req: NextRequest) {
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ error: "YouTube API not configured" }, { status: 500 });
  }

  const body = await req.json();
  const input: string = body.input?.trim();

  if (!input) {
    return NextResponse.json({ error: "No input provided" }, { status: 400 });
  }

  const channel = await resolveToChannel(input);

  if (!channel) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }

  const snippet = channel.snippet;
  return NextResponse.json({
    channelId: channel.id,
    handle: snippet.customUrl ?? snippet.title,
    title: snippet.title,
    thumbnailUrl:
      snippet.thumbnails?.high?.url ??
      snippet.thumbnails?.default?.url ??
      "",
  });
}
