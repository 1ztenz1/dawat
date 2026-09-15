"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import { TextField } from "@/components/ui/form";
import type { Address } from "@/lib/api";
import { formatPostal, isPostal } from "@/lib/format";
import { deliveryAreas, provinces, servedPostalPrefixes } from "@/lib/site";

export const emptyAddress: Address = { firstName: "", lastName: "", company: "", address1: "", address2: "", city: "", province: "ON", postalCode: "", phone: "", buzzer: "" };

export function validateAddress(a: Address, opts: { phone?: boolean } = {}) {
  const e: Partial<Record<keyof Address, string>> = {};
  if (!a.firstName.trim()) e.firstName = "Required";
  if (!a.lastName.trim()) e.lastName = "Required";
  if (!a.address1.trim()) e.address1 = "Enter your street address";
  if (!a.city.trim()) e.city = "Enter your city";
  if (!isPostal(a.postalCode)) e.postalCode = "Enter a valid postal code, e.g. M5V 2T6";
  if (opts.phone && a.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a 10-digit phone number";
  return e;
}

export function servesPostal(code: string) {
  return isPostal(code) && servedPostalPrefixes.some((p) => code.toUpperCase().startsWith(p));
}

export function AddressFields({
  prefix,
  value,
  onChange,
  errors = {},
  showPhone = true,
  deliveryCheck = false,
}: {
  prefix: string;
  value: Address;
  onChange: (a: Address) => void;
  errors?: Partial<Record<keyof Address, string>>;
  showPhone?: boolean;
  deliveryCheck?: boolean;
}) {
  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange({ ...value, [k]: e.target.value });
  const ac = (t: string) => `${prefix === "billing" ? "billing" : "shipping"} ${t}`;
  const postalOk = isPostal(value.postalCode);

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
      <TextField label="First name" name={`${prefix}-first`} autoComplete={ac("given-name")} value={value.firstName} onChange={set("firstName")} error={errors.firstName} />
      <TextField label="Last name" name={`${prefix}-last`} autoComplete={ac("family-name")} value={value.lastName} onChange={set("lastName")} error={errors.lastName} />
      <TextField wrapClass="col-span-2" label="Company" optional name={`${prefix}-company`} autoComplete={ac("organization")} value={value.company} onChange={set("company")} />
      <TextField wrapClass="col-span-2" label="Street address" name={`${prefix}-address1`} autoComplete={ac("address-line1")} placeholder="House number and street name" value={value.address1} onChange={set("address1")} error={errors.address1} />
      <TextField label="Apt, suite, unit" optional name={`${prefix}-address2`} autoComplete={ac("address-line2")} value={value.address2} onChange={set("address2")} />
      <TextField label="Buzzer code" optional name={`${prefix}-buzzer`} autoComplete="off" value={value.buzzer} onChange={set("buzzer")} />
      <div className="col-span-2 sm:col-span-1">
        <TextField label="City" name={`${prefix}-city`} list={`${prefix}-cities`} autoComplete={ac("address-level2")} value={value.city} onChange={set("city")} error={errors.city} />
        <datalist id={`${prefix}-cities`}>
          {deliveryAreas.map((a) => <option key={a} value={a} />)}
        </datalist>
      </div>
      <div>
        <label className="label" htmlFor={`${prefix}-province`}>Province</label>
        <select id={`${prefix}-province`} className="input" autoComplete={ac("address-level1")} value={value.province} onChange={set("province")}>
          {provinces.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
        </select>
      </div>
      <div>
        <TextField
          label="Postal code"
          name={`${prefix}-postal`}
          autoComplete={ac("postal-code")}
          inputMode="text"
          autoCapitalize="characters"
          maxLength={7}
          value={value.postalCode}
          onChange={(e) => onChange({ ...value, postalCode: formatPostal(e.target.value) })}
          error={errors.postalCode}
        />
      </div>
      {showPhone && (
        <TextField wrapClass="col-span-2 sm:col-span-1" label="Phone" type="tel" inputMode="tel" name={`${prefix}-phone`} autoComplete={ac("tel")} placeholder="For delivery updates by SMS" value={value.phone} onChange={set("phone")} error={errors.phone} />
      )}
      {deliveryCheck && postalOk && !errors.postalCode && (
        <p className={`col-span-2 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${servesPostal(value.postalCode) ? "bg-success-soft text-success" : "bg-warning-soft text-accent-text"}`}>
          {servesPostal(value.postalCode) ? <CircleCheck size={18} /> : <CircleAlert size={18} />}
          {servesPostal(value.postalCode) ? "Great news, we deliver to your area." : "This postal code may be outside our delivery zone. We'll confirm with you before your first delivery."}
        </p>
      )}
    </div>
  );
}
