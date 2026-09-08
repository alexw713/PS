import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminPerformerForm from "@/components/AdminPerformerForm";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default async function EditPerformerPage({ params }: Props) {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin");

  const performer = await prisma.performer.findUnique({
    where: { id: params.id },
    include: { tags: true },
  });
  if (!performer) notFound();

  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin" className="mb-6 inline-block text-sm text-ink-400 hover:text-pink-300">
        ← Back to admin
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-white">Edit {performer.stageName}</h1>
      <div className="rounded-2xl border border-ink-800 bg-ink-900/40 p-6">
        <AdminPerformerForm
          allTags={tags}
          initial={{
            id: performer.id,
            stageName: performer.stageName,
            slug: performer.slug,
            realName: performer.realName || "",
            bio: performer.bio,
            nationality: performer.nationality || "",
            birthYear: performer.birthYear?.toString() || "",
            websiteUrl: performer.websiteUrl || "",
            twitterUrl: performer.twitterUrl || "",
            instagramUrl: performer.instagramUrl || "",
            onlyfansUrl: performer.onlyfansUrl || "",
            tagNames: performer.tags.map((t) => t.name).join(", "),
            active: performer.active,
          }}
        />
      </div>
    </div>
  );
}
