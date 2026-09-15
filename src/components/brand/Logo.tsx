import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.webp";
import { cn } from "@/lib/format";

export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Dawat Halal Meals, home"
      className={cn(
        "inline-flex shrink-0 items-center rounded-xl transition-colors",
        // The logo art is built for light backgrounds; give it a paper chip on dark ones.
        onDark ? "bg-[#fffcf5] px-2.5 py-1" : "dark:bg-[#fffcf5] dark:px-2 dark:py-0.5",
        className,
      )}
    >
      <Image src={logo} alt="Dawat Halal Meals" className="h-11 w-auto sm:h-12" sizes="96px" preload />
    </Link>
  );
}
