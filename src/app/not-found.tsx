import Image from "next/image";
import Link from "next/link";
import { images } from "@/components/plans/images";

export default function NotFound() {
  return (
    <section className="container-x section grid place-items-center text-center">
      <div className="relative size-40 overflow-hidden rounded-full shadow-card">
        <Image src={images.rajma} alt="" sizes="160px" className="size-full object-cover" />
      </div>
      <p className="eyebrow mt-8 justify-center">Error 404</p>
      <h1 className="text-[clamp(2.2rem,1.6rem+2.5vw,3.5rem)]">This page isn&apos;t on the menu</h1>
      <p className="mt-3 max-w-md text-text-2">The page you&apos;re looking for has moved or doesn&apos;t exist. Let&apos;s get you something good to eat instead.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary btn-lg">Back to home</Link>
        <Link href="/plans" className="btn btn-outline btn-lg">See meal plans</Link>
      </div>
    </section>
  );
}
