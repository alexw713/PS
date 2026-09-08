"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePerformerButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    setLoading(true);
    const res = await fetch(`/api/performers/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) router.refresh();
    else alert("Delete failed");
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={loading}
      className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/30 disabled:opacity-60"
    >
      {loading ? "…" : "Delete"}
    </button>
  );
}
