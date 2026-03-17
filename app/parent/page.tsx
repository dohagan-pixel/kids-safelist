"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/auth/AuthProvider";
import { useChannels } from "@/hooks/useChannels";
import { getPin, setPin } from "@/lib/firestore";
import { AddChannelForm } from "@/components/parent/AddChannelForm";
import { ChannelList } from "@/components/parent/ChannelList";
import { Nav } from "@/components/Nav";
import { PinModal } from "@/components/PinModal";

export default function ParentPage() {
  const { user } = useAuth();
  const { channels, loading, addChannel, removeChannel } = useChannels(user?.uid ?? null);
  const router = useRouter();

  const [savedPin, setSavedPin] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinMode, setPinMode] = useState<"enter" | "set">("set");
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState("");
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [pendingAdd, setPendingAdd] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) {
      getPin(user.uid).then(setSavedPin);
    }
  }, [user?.uid]);

  const watchUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/watch?uid=${user?.uid}`
      : `/watch?uid=${user?.uid}`;

  async function handleSignOut() {
    await signOut(auth);
    router.replace("/login");
  }

  async function handleAddChannel(input: string): Promise<{ error?: string }> {
    if (savedPin && !pinUnlocked) {
      setPendingAdd(input);
      setPinMode("enter");
      setPinError("");
      setShowPinModal(true);
      return {};
    }
    return addChannel(input);
  }

  async function handlePinConfirm(pin: string) {
    if (pinMode === "set") {
      await setPin(user!.uid, pin);
      setSavedPin(pin);
      setShowPinModal(false);
      setPinSuccess("PIN set successfully!");
      setTimeout(() => setPinSuccess(""), 3000);
    } else {
      if (pin !== savedPin) {
        setPinError("Incorrect PIN. Try again.");
        return;
      }
      setPinUnlocked(true);
      setShowPinModal(false);
      if (pendingAdd) {
        await addChannel(pendingAdd);
        setPendingAdd(null);
      }
    }
  }

  function handleSetPin() {
    setPinMode("set");
    setPinError("");
    setShowPinModal(true);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav channels={channels} uid={user?.uid}>
        {user?.photoURL && (
          <Image
            src={user.photoURL}
            alt={user.displayName ?? "User"}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          Parent
        </span>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          Sign out
        </button>
      </Nav>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Kid watch link */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <h2 className="font-semibold text-blue-900 mb-1">Kid Watch Link</h2>
          <p className="text-sm text-blue-700 mb-3">
            Bookmark this URL on your kid&apos;s device.
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

        {/* PIN management */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-1">Channel PIN</h2>
          <p className="text-sm text-gray-500 mb-3">
            {savedPin
              ? "A PIN is set. Adding channels requires this PIN."
              : "Set a PIN to prevent kids from adding channels."}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSetPin}
              className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {savedPin ? "Change PIN" : "Set PIN"}
            </button>
            {savedPin && (
              <button
                onClick={() => { setPinUnlocked(!pinUnlocked); }}
                className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                  pinUnlocked
                    ? "border-green-300 text-green-700 bg-green-50"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {pinUnlocked ? "🔓 Unlocked" : "🔒 Locked"}
              </button>
            )}
            {pinSuccess && <p className="text-sm text-green-600">{pinSuccess}</p>}
          </div>
        </div>

        {/* Add channel */}
        <AddChannelForm onAdd={handleAddChannel} />

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

      {showPinModal && (
        <PinModal
          mode={pinMode}
          onConfirm={handlePinConfirm}
          onClose={() => { setShowPinModal(false); setPendingAdd(null); }}
          error={pinError}
        />
      )}
    </div>
  );
}
