import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export default async function PerformerPage({ params }: Props) {
  const performer = await prisma.performer.findUnique({
    where: { slug: params.slug },
    include: { tags: true },
  });
  if (!performer) notFound();

  const links = [
    { label: "Website", href: performer.websiteUrl },
    { label: "X / Twitter", href: performer.twitterUrl },
    { label: "Instagram", href: performer.instagramUrl },
    { label: "OnlyFans", href: performer.onlyfansUrl },
  ].filter((l) => l.href);

  return (
    <article>
      <Link href="/" className="mb-6 inline-block text-sm text-ink-400 hover:text-pink-300">
        ← Back to browse
      </Link>
      <div className="rounded-2xl border border-ink-800 bg-ink-900/40 p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-start gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-3xl font-bold text-white">
            {performer.stageName.slice(0, 1)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{performer.stageName}</h1>
            <p className="mt-1 text-sm text-ink-400">
              {[performer.nationality, performer.birthYear ? `b. ${performer.birthYear}` : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {performer.tags.map((t) => (
                <Link
                  key={t.id}
                  href={`/?tag=${t.slug}`}
                  className="rounded-full bg-ink-800 px-3 py-1 text-xs text-ink-200 hover:bg-pink-500/20 hover:text-pink-200"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-400">Bio</h2>
        <p className="mb-8 whitespace-pre-wrap text-base leading-relaxed text-ink-200">{performer.bio}</p>

        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-400">
          Public social links
        </h2>
        {links.length === 0 ? (
          <p className="text-sm text-ink-500">No public links on file.</p>
        ) : (
          <ul className="flex flex-wrap gap-3">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-xl border border-ink-700 bg-ink-950 px-4 py-2 text-sm font-medium text-pink-300 hover:border-pink-500/50 hover:bg-ink-900"
                >
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
