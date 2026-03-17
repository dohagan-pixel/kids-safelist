"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Channel,
  addChannelToSafelist,
  removeChannelFromSafelist,
} from "@/lib/firestore";

export function useChannels(userId: string | null) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setChannels([]);
      setLoading(false);
      return;
    }

    const ref = doc(db, "safelists", userId);
    const unsubscribe = onSnapshot(ref, (snap) => {
      setChannels(snap.exists() ? snap.data().channels ?? [] : []);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  async function addChannel(input: string): Promise<{ error?: string }> {
    if (!userId) return { error: "Not logged in" };

    const res = await fetch("/api/channels/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.error ?? "Could not find channel" };
    }

    const channel = await res.json();

    // Prevent duplicates
    if (channels.some((c) => c.channelId === channel.channelId)) {
      return { error: "Channel already in safelist" };
    }

    await addChannelToSafelist(userId, channel);
    return {};
  }

  async function removeChannel(channelId: string) {
    if (!userId) return;
    await removeChannelFromSafelist(userId, channelId);
  }

  return { channels, loading, addChannel, removeChannel };
}
