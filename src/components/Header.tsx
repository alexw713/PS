import Link from "next/link";

export default function Header() {
  const name = process.env.NEXT_PUBLIC_APP_NAME || "PS Performer Directory";
  return (
    <header className="border-b border-ink-800/80 bg-ink-950/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="group">
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-pink-300">
            {name}
          </span>
          <span className="ml-2 rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-pink-300">
            18+
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-ink-300">
          <Link href="/" className="hover:text-white">
            Browse
          </Link>
          <Link href="/admin" className="hover:text-white">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
