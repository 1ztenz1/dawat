"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/format";

/* Native <dialog>: focus trap, Esc and top-layer for free.
   "drawer" slides in from the right on every screen size (menu, cart).
   "modal" is a bottom sheet on phones and a centred card on larger screens. */
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
  variant = "modal",
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  variant?: "modal" | "drawer";
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      // Focus the dialog itself, not its first link. The panel is still off-screen
      // while it slides in, and focusing a child would scroll the page behind it.
      d.setAttribute("autofocus", "");
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && d.open) {
      d.close();
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={() => {
        document.documentElement.style.overflow = "";
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "fixed m-0 max-h-none max-w-none bg-transparent p-0 text-text outline-none",
        "backdrop:animate-[fade_0.2s_ease_both] backdrop:bg-[#07140f]/60 backdrop:backdrop-blur-[3px]",
        variant === "drawer"
          ? "inset-y-0 left-auto right-0 h-dvh w-[min(88vw,420px)]"
          : "inset-x-0 bottom-0 top-auto w-full sm:inset-0 sm:m-auto sm:h-fit sm:w-[min(92vw,560px)]",
      )}
    >
      {open && (
        <div
          className={cn(
            "flex flex-col overflow-hidden border border-line bg-surface shadow-lift",
            variant === "drawer"
              ? "animate-drawer h-full rounded-l-[1.75rem] border-r-0"
              : "animate-sheet max-h-[92dvh] rounded-t-[1.75rem] sm:animate-pop-in sm:rounded-[1.75rem]",
            className,
          )}
        >
          {variant === "modal" && <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-line-strong sm:hidden" aria-hidden />}
          <header className={cn("flex items-center justify-between gap-3 px-5 pb-3", variant === "drawer" ? "pt-[max(1.25rem,env(safe-area-inset-top))]" : "pt-3 sm:pt-5")}>
            <h2 className="text-xl">{title}</h2>
            <button onClick={onClose} className="grid size-10 place-items-center rounded-full bg-bg-subtle text-text-2 hover:text-text" aria-label="Close">
              <X size={18} />
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5">{children}</div>
          {footer && <footer className="border-t border-line bg-surface px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</footer>}
        </div>
      )}
    </dialog>
  );
}
