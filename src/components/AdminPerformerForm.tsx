"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Tag = { id: string; name: string; slug: string };

type Initial = {
  id?: string;
  stageName: string;
  slug: string;
  realName: string;
  bio: string;
  nationality: string;
  birthYear: string;
  imageUrl: string;
  websiteUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  onlyfansUrl: string;
  tagNames: string;
  active: boolean;
};

const empty: Initial = {
  stageName: "",
  slug: "",
  realName: "",
  bio: "",
  nationality: "",
  birthYear: "",
  imageUrl: "",
  websiteUrl: "",
  twitterUrl: "",
  instagramUrl: "",
  onlyfansUrl: "",
  tagNames: "",
  active: true,
};

export default function AdminPerformerForm({
  allTags,
  initial,
}: {
  allTags: Tag[];
  initial?: Initial;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Initial>(initial || empty);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const editing = Boolean(initial?.id);

  function set<K extends keyof Initial>(key: K, value: Initial[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      stageName: form.stageName,
      slug: form.slug || undefined,
      realName: form.realName || null,
      bio: form.bio,
      nationality: form.nationality || null,
      birthYear: form.birthYear ? Number(form.birthYear) : null,
      imageUrl: form.imageUrl || null,
      websiteUrl: form.websiteUrl || null,
      twitterUrl: form.twitterUrl || null,
      instagramUrl: form.instagramUrl || null,
      onlyfansUrl: form.onlyfansUrl || null,
      active: form.active,
      tags: form.tagNames
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    const res = await fetch(editing ? `/api/performers/${initial!.id}` : "/api/performers", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Save failed");
      return;
    }
    if (!editing) setForm(empty);
    router.push("/admin");
    router.refresh();
  }

  const field = (
    label: string,
    key: keyof Initial,
    opts?: { textarea?: boolean; type?: string; hint?: string }
  ) => (
    <div>
      <label className="mb-1 block text-xs text-ink-400">{label}</label>
      {opts?.textarea ? (
        <textarea
          value={String(form[key])}
          onChange={(e) => set(key, e.target.value as never)}
          rows={4}
          className="w-full rounded-xl border border-ink-700 bg-ink-950 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-pink-500/40"
          required={key === "bio" || key === "stageName"}
        />
      ) : (
        <input
          type={opts?.type || "text"}
          value={String(form[key])}
          onChange={(e) => set(key, e.target.value as never)}
          className="w-full rounded-xl border border-ink-700 bg-ink-950 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-pink-500/40"
          required={key === "stageName"}
        />
      )}
      {opts?.hint ? <p className="mt-1 text-[11px] text-ink-500">{opts.hint}</p> : null}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      {field("Stage name", "stageName")}
      {field("Slug (optional)", "slug", { hint: "Auto-generated from name if blank" })}
      {field("Real name (optional)", "realName")}
      {field("Nationality", "nationality")}
      {field("Birth year", "birthYear", { type: "number" })}
      <div className="flex items-center gap-2 pt-6">
        <input
          id="active"
          type="checkbox"
          checked={form.active}
          onChange={(e) => set("active", e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="active" className="text-sm text-ink-300">
          Active listing
        </label>
      </div>
      <div className="sm:col-span-2">{field("Bio", "bio", { textarea: true })}</div>
      <div className="sm:col-span-2">
        {field("Image URL", "imageUrl", {
          hint: "Local path e.g. /performers/slug.jpg or a remote https URL",
        })}
      </div>
      {field("Website URL", "websiteUrl")}
      {field("X / Twitter URL", "twitterUrl")}
      {field("Instagram URL", "instagramUrl")}
      {field("OnlyFans URL", "onlyfansUrl")}
      <div className="sm:col-span-2">
        {field("Tags (comma-separated)", "tagNames", {
          hint: allTags.length
            ? `Existing: ${allTags.map((t) => t.name).join(", ")}`
            : "e.g. Feature, Director",
        })}
      </div>
      {error ? <p className="sm:col-span-2 text-sm text-red-400">{error}</p> : null}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-pink-400 disabled:opacity-60"
        >
          {loading ? "Saving…" : editing ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
