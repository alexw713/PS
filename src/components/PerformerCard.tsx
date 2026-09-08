import Image from "next/image";
import Link from "next/link";

type Props = {
  slug: string;
  stageName: string;
  nationality?: string | null;
  bio: string;
  imageUrl?: string | null;
  tags: { name: string }[];
};

export default function PerformerCard({
  slug,
  stageName,
  nationality,
  bio,
  imageUrl,
  tags,
}: Props) {
  return (
    <Link
      href={`/performers/${slug}`}
      className="group flex flex-col rounded-2xl border border-ink-800 bg-ink-900/40 p-5 hover:border-pink-500/40 hover:bg-ink-900/70"
    >
      <div className="relative mb-3 h-14 w-14 overflow-hidden rounded-full bg-gradient-to-br from-pink-500/80 to-purple-600/80">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={stageName}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white">
            {stageName.slice(0, 1)}
          </div>
        )}
      </div>
      <h2 className="text-lg font-semibold text-white group-hover:text-pink-300">{stageName}</h2>
      {nationality ? <p className="mt-0.5 text-xs text-ink-400">{nationality}</p> : null}
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-300">{bio}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {tags.slice(0, 4).map((t) => (
          <span
            key={t.name}
            className="rounded-full bg-ink-800 px-2 py-0.5 text-[11px] text-ink-300"
          >
            {t.name}
          </span>
        ))}
      </div>
    </Link>
  );
}
