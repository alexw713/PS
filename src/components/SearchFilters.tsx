"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function SearchFilters({ tags }: { tags: { slug: string; name: string }[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [tag, setTag] = useState(params.get("tag") || "");
  const [pending, startTransition] = useTransition();

  function apply(nextQ: string, nextTag: string) {
    const sp = new URLSearchParams();
    if (nextQ.trim()) sp.set("q", nextQ.trim());
    if (nextTag) sp.set("tag", nextTag);
    startTransition(() => {
      router.push(sp.toString() ? `/?${sp}` : "/");
    });
  }

  return (
    <form
      className="mb-8 grid gap-3 rounded-2xl border border-ink-800 bg-ink-900/50 p-4 sm:grid-cols-[1fr_180px_auto]"
      onSubmit={(e) => {
        e.preventDefault();
        apply(q, tag);
      }}
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search performers…"
        className="rounded-xl border border-ink-700 bg-ink-950 px-4 py-2.5 text-sm text-white outline-none ring-pink-500/40 placeholder:text-ink-500 focus:ring-2"
      />
      <select
        value={tag}
        onChange={(e) => {
          setTag(e.target.value);
          apply(q, e.target.value);
        }}
        className="rounded-xl border border-ink-700 bg-ink-950 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-pink-500/40"
      >
        <option value="">All tags</option>
        {tags.map((t) => (
          <option key={t.slug} value={t.slug}>
            {t.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-pink-400 disabled:opacity-60"
      >
        {pending ? "…" : "Search"}
      </button>
    </form>
  );
}
