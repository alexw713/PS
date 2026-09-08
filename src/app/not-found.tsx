import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl font-bold text-white">Not found</h1>
      <p className="mt-2 text-ink-400">That performer or page does not exist.</p>
      <Link href="/" className="mt-6 inline-block text-pink-300 hover:underline">
        Back home
      </Link>
    </div>
  );
}
