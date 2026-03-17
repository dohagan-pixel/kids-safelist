import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from "firebase/firestore";

export interface Channel {
  channelId: string;
  handle: string;
  title: string;
  thumbnailUrl: string;
  addedAt: Timestamp;
}

export interface VideoItem {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  channelId: string;
  channelTitle: string;
}

export async function getSafelist(userId: string): Promise<Channel[]> {
  const ref = doc(db, "safelists", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];
  return snap.data().channels ?? [];
}

export async function addChannelToSafelist(
  userId: string,
  channel: Omit<Channel, "addedAt">
) {
  const ref = doc(db, "safelists", userId);
  const snap = await getDoc(ref);
  const newChannel: Channel = {
    ...channel,
    addedAt: Timestamp.now(),
  };
  if (!snap.exists()) {
    await setDoc(ref, { channels: [newChannel] });
  } else {
    await updateDoc(ref, { channels: arrayUnion(newChannel) });
  }
}

export async function removeChannelFromSafelist(
  userId: string,
  channelId: string
) {
  const ref = doc(db, "safelists", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const channels: Channel[] = snap.data().channels ?? [];
  const updated = channels.filter((c) => c.channelId !== channelId);
  await updateDoc(ref, { channels: updated });
}
