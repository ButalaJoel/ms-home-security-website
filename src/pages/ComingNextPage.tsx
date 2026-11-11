import { Link } from "react-router-dom";
import { Construction } from "lucide-react";

// Holds the place of pages from the feature map that are not built yet, so every menu link works.
export default function ComingNextPage({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-xl px-6 py-24 text-center">
      <Construction className="mx-auto h-10 w-10 text-brand" />
      <h1 className="mt-5 text-3xl font-extrabold">{title}</h1>
      <p className="mt-3 text-ink-soft">This page is being built.</p>
      <Link to="/" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">Back to home</Link>
    </section>
  );
}

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="font-display text-6xl font-extrabold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-extrabold">Page not found</h1>
      <p className="mt-3 text-ink-soft">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">Back to home</Link>
    </section>
  );
}
