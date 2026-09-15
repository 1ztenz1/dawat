import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

export function WhatsAppIcon({ size = 20, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .78.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.25-.12-1.47-.72-1.7-.8-.23-.09-.4-.13-.56.12-.17.25-.64.8-.79.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-3.34-2.92c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.43l-.76-1.83c-.2-.48-.4-.41-.56-.42h-.47a.9.9 0 0 0-.66.3 2.8 2.8 0 0 0-.86 2.07 4.8 4.8 0 0 0 1 2.56 11 11 0 0 0 4.23 3.74c1.57.68 2.19.74 2.98.62.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.23-.17-.48-.29Z" />
    </svg>
  );
}

export function InstagramIcon({ size = 20, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ size = 20, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...p}>
      <path d="M14 8.5V6.8c0-.8.5-1 .9-1H17V2.1L14.1 2C10.9 2 10.2 4.4 10.2 6v2.5H8V12h2.2v10H14V12h2.7l.4-3.5Z" />
    </svg>
  );
}

export function VisaMark() {
  return <span className="inline-grid h-6 min-w-9 place-items-center rounded-md bg-[#1a1f71] px-1.5 text-[10px] font-extrabold italic tracking-wide text-white">VISA</span>;
}
export function MastercardMark() {
  return (
    <span className="inline-flex h-6 min-w-9 items-center justify-center rounded-md bg-[#252525] px-1.5" aria-label="Mastercard">
      <span className="size-3.5 rounded-full bg-[#eb001b]" />
      <span className="-ml-1.5 size-3.5 rounded-full bg-[#f79e1b] mix-blend-screen" />
    </span>
  );
}
export function AmexMark() {
  return <span className="inline-grid h-6 min-w-9 place-items-center rounded-md bg-[#2e77bc] px-1.5 text-[9px] font-extrabold tracking-wide text-white">AMEX</span>;
}
