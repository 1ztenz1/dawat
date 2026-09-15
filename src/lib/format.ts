const cad = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol" });

export const money = (n: number) => cad.format(n);

export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export const normalizePhone = (v: string) => v.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
export const isPhone = (v: string) => normalizePhone(v).length === 10;

export const formatPostal = (v: string) => {
  const s = v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  return s.length > 3 ? `${s.slice(0, 3)} ${s.slice(3)}` : s;
};
export const isPostal = (v: string) => /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z] ?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(v.trim());
