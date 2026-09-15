"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container-x section grid place-items-center text-center">
      <p className="eyebrow justify-center">Something went wrong</p>
      <h1 className="text-4xl">We dropped the spoon</h1>
      <p className="mt-3 max-w-md text-text-2">An unexpected error happened. Please try again. If it keeps happening, message us on WhatsApp.</p>
      <div className="mt-8 flex gap-3">
        <button onClick={reset} className="btn btn-primary">Try again</button>
        <Link href="/" className="btn btn-outline">Home</Link>
      </div>
    </section>
  );
}
