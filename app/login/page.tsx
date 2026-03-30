"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAuth } from "@/components/auth/AuthProvider";
import Image from "next/image";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/parent");
    }
  }, [user, loading, router]);

  async function signIn() {
    try {
      await signInWithPopup(auth, googleProvider);
      router.replace("/parent");
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#101720]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Image
            src="/gwi-logo-on-black.svg"
            alt="GWI"
            width={132}
            height={40}
            className="mx-auto mb-6"
            priority
          />
          <p className="text-[#526482] text-sm leading-relaxed">
            Curated Figma AI and UX video content for GWI teams.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-lg font-semibold text-[#101720] mb-1">Sign in</h2>
          <p className="text-sm text-[#526482] mb-6">
            Use your GWI Google account to access the video dashboard.
          </p>

          <button
            onClick={signIn}
            className="w-full flex items-center justify-center gap-3 border border-[#CED9EB] rounded-xl py-3 px-4 text-[#101720] font-medium hover:bg-[#F7FAFF] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
