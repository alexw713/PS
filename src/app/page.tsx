import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import PerformerCard from "@/components/PerformerCard";
import SearchFilters from "@/components/SearchFilters";

export const dynamic = "force-dynamic";

type Props = { searchParams: { q?: string; tag?: string } };

export default async function HomePage({ searchParams }: Props) {
  const q = (searchParams.q || "").trim();
  const tag = (searchParams.tag || "").trim();

  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });

  const performers = await prisma.performer.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { stageName: { contains: q, mode: "insensitive" } },
                { bio: { contains: q, mode: "insensitive" } },
                { nationality: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        tag ? { tags: { some: { slug: tag } } } : {},
      ],
    },
    include: { tags: true },
    orderBy: { stageName: "asc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">Browse performers</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-400">
          Directory of adult performers with bios, tags, and public social links.
          This site does not host, stream, or link to pirated video content.
        </p>
      </div>

      <Suspense fallback={<div className="mb-8 h-14 animate-pulse rounded-2xl bg-ink-900" />}>
        <SearchFilters tags={tags} />
      </Suspense>

      {performers.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink-700 p-10 text-center text-ink-400">
          No performers match your filters.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {performers.map((p) => (
            <PerformerCard
              key={p.id}
              slug={p.slug}
              stageName={p.stageName}
              nationality={p.nationality}
              bio={p.bio}
              tags={p.tags}
            />
          ))}
        </div>
      )}
    </div>
  );
}
