"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/format";

/* Native <dialog>: focus trap, Esc and top-layer for free.
   Bottom sheet on phones, side drawer or centred modal on larger screens. */
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
        "m-0 max-h-none max-w-none bg-transparent p-0 text-text outline-none backdrop:bg-[#07140f]/60 backdrop:backdrop-blur-[3px]",
        "fixed inset-x-0 bottom-0 top-auto w-full",
        variant === "drawer"
          ? "sm:inset-y-0 sm:left-auto sm:right-0 sm:h-full sm:w-[440px]"
          : "sm:inset-0 sm:m-auto sm:h-fit sm:w-[min(92vw,560px)]",
      )}
    >
      {open && (
        <div
          className={cn(
            "animate-sheet flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[1.75rem] border border-line bg-surface shadow-lift",
            variant === "drawer" ? "sm:h-full sm:max-h-none sm:rounded-none sm:rounded-l-[1.75rem]" : "sm:rounded-[1.75rem]",
            className,
          )}
        >
          <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-line-strong sm:hidden" aria-hidden />
          <header className="flex items-center justify-between gap-3 px-5 pb-3 pt-3 sm:pt-5">
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
