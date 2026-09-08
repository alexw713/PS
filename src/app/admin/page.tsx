import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminLoginForm from "@/components/AdminLoginForm";
import AdminPerformerForm from "@/components/AdminPerformerForm";
import DeletePerformerButton from "@/components/DeletePerformerButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return (
      <div className="mx-auto max-w-md">
        <h1 className="mb-2 text-2xl font-bold text-white">Admin login</h1>
        <p className="mb-6 text-sm text-ink-400">Sign in to manage the performer directory.</p>
        <AdminLoginForm />
      </div>
    );
  }

  const performers = await prisma.performer.findMany({
    include: { tags: true },
    orderBy: { stageName: "asc" },
  });
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin</h1>
          <p className="text-sm text-ink-400">{performers.length} performers</p>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="rounded-xl border border-ink-600 px-4 py-2 text-sm text-ink-200 hover:bg-ink-800"
          >
            Log out
          </button>
        </form>
      </div>

      <section className="rounded-2xl border border-ink-800 bg-ink-900/40 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Add performer</h2>
        <AdminPerformerForm allTags={tags} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">Existing</h2>
        <div className="overflow-x-auto rounded-2xl border border-ink-800">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-ink-900 text-ink-400">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Tags</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {performers.map((p) => (
                <tr key={p.id} className="border-t border-ink-800">
                  <td className="px-4 py-3">
                    <Link href={`/performers/${p.slug}`} className="font-medium text-pink-300 hover:underline">
                      {p.stageName}
                    </Link>
                    <div className="text-xs text-ink-500">{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-ink-300">
                    {p.tags.map((t) => t.name).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/edit/${p.id}`}
                        className="rounded-lg bg-ink-800 px-3 py-1.5 text-xs hover:bg-ink-700"
                      >
                        Edit
                      </Link>
                      <DeletePerformerButton id={p.id} name={p.stageName} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
