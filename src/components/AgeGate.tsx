"use client";

import { useEffect, useState } from "react";

const KEY = "ps_age_verified";

export default function AgeGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    setVerified(localStorage.getItem(KEY) === "1");
    setReady(true);
  }, []);

  function accept() {
    localStorage.setItem(KEY, "1");
    setVerified(true);
  }

  function decline() {
    window.location.href = "https://www.google.com";
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink-300">
        Loading…
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-ink-700 bg-ink-900/90 p-8 shadow-2xl backdrop-blur">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-pink-400">
            Age verification
          </p>
          <h1 className="mb-3 text-2xl font-bold text-white">18+ only</h1>
          <p className="mb-6 text-sm leading-relaxed text-ink-300">
            This directory lists adult performers and links to their public social
            profiles. You must be at least 18 years old (or the age of majority in
            your jurisdiction) to continue. No pirated video or torrent content is
            hosted here.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={accept}
              className="flex-1 rounded-xl bg-pink-500 px-4 py-3 text-sm font-semibold text-white hover:bg-pink-400"
            >
              I am 18 or older
            </button>
            <button
              type="button"
              onClick={decline}
              className="flex-1 rounded-xl border border-ink-600 px-4 py-3 text-sm font-semibold text-ink-200 hover:bg-ink-800"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
