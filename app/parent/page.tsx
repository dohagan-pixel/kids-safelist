"use client";

import Image from "next/image";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/auth/AuthProvider";
import { useChannels } from "@/hooks/useChannels";
import { AddChannelForm } from "@/components/parent/AddChannelForm";
import { ChannelList } from "@/components/parent/ChannelList";

export default function ParentPage() {
  const { user } = useAuth();
  const { channels, loading, addChannel, removeChannel } = useChannels(user?.uid ?? null);
  const router = useRouter();

  const watchUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/watch?uid=${user?.uid}`
      : `/watch?uid=${user?.uid}`;

  async function handleSignOut() {
    await signOut(auth);
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📺</span>
            <span className="font-bold text-gray-900 text-lg">KidsTube</span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">Parent</span>
          </div>
          <div className="flex items-center gap-3">
            {user?.photoURL && (
              <Image
                src={user.photoURL}
                alt={user.displayName ?? "User"}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Kid watch link */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <h2 className="font-semibold text-blue-900 mb-1">Kid Watch Link</h2>
          <p className="text-sm text-blue-700 mb-3">
            Bookmark this URL on your kid's device. They'll only see videos from your approved channels.
          </p>
          <div className="flex gap-2 items-center">
            <code className="flex-1 bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm text-blue-800 truncate">
              {watchUrl}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(watchUrl)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0"
            >
              Copy
            </button>
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0"
            >
              Open
            </a>
          </div>
        </div>

        {/* Add channel */}
        <AddChannelForm onAdd={addChannel} />

        {/* Channel list */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Approved Channels
            {!loading && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                {channels.length} {channels.length === 1 ? "channel" : "channels"}
              </span>
            )}
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            </div>
          ) : (
            <ChannelList channels={channels} onRemove={removeChannel} />
          )}
        </div>
      </main>
    </div>
  );
}
