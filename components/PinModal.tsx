"use client";

import { useState } from "react";

interface Props {
  mode: "enter" | "set";
  onConfirm: (pin: string) => void;
  onClose: () => void;
  error?: string;
}

export function PinModal({ mode, onConfirm, onClose, error }: Props) {
  const [pin, setPin] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-xl">
        <h2 className="font-bold text-lg mb-1">
          {mode === "set" ? "Set a PIN" : "Enter PIN"}
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          {mode === "set"
            ? "Choose a 4-digit PIN to protect channel management."
            : "Enter your 4-digit PIN to continue."}
        </p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center text-3xl tracking-[0.5em] mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="····"
          autoFocus
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(pin)}
            disabled={pin.length < 4}
            className="flex-1 bg-blue-600 text-white rounded-xl py-2.5 text-sm font-medium disabled:opacity-40 hover:bg-blue-700 transition-colors"
          >
            {mode === "set" ? "Set PIN" : "Unlock"}
          </button>
        </div>
      </div>
    </div>
  );
}
