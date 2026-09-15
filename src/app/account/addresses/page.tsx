"use client";

import { MapPin, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { AddressBlock } from "@/components/account/OrderDetails";
import { AddressFields, emptyAddress, validateAddress } from "@/components/checkout/AddressFields";
import { SubmitButton } from "@/components/ui/form";
import { Sheet } from "@/components/ui/Sheet";
import { toast } from "@/components/ui/toast";
import { account, useUser, type Address } from "@/lib/api";

export default function AddressesPage() {
  const user = useUser()!;
  const [editing, setEditing] = useState<null | "billing" | "shipping">(null);

  return (
    <div>
      <h1 className="text-3xl">Addresses</h1>
      <p className="mt-2 text-text-2">These addresses are used by default at checkout.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {(["shipping", "billing"] as const).map((kind) => {
          const a = user[kind];
          return (
            <section key={kind} className="card flex flex-col p-5 sm:p-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg"><MapPin size={18} className="text-accent-text" /> {kind === "shipping" ? "Delivery address" : "Billing address"}</h2>
                <button onClick={() => setEditing(kind)} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-brand-text hover:bg-brand-soft">
                  {a ? <><Pencil size={14} /> Edit</> : <><Plus size={14} /> Add</>}
                </button>
              </div>
              {a ? <AddressBlock a={a} /> : <p className="text-muted">You haven&apos;t set up this address yet.</p>}
            </section>
          );
        })}
      </div>
      {editing && (
        <EditSheet
          kind={editing}
          initial={user[editing] ?? { ...emptyAddress, firstName: user.firstName, lastName: user.lastName, phone: user.phone }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function EditSheet({ kind, initial, onClose }: { kind: "billing" | "shipping"; initial: Address; onClose: () => void }) {
  const [a, setA] = useState(initial);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  return (
    <Sheet
      open
      onClose={onClose}
      title={kind === "shipping" ? "Delivery address" : "Billing address"}
      footer={
        <SubmitButton
          type="button"
          pending={pending}
          className="btn-primary btn-block"
          onClick={async () => {
            const e = validateAddress(a, { phone: kind === "shipping" });
            setErrors(e);
            if (Object.keys(e).length) return;
            setPending(true);
            await account.saveAddress(kind, a);
            setPending(false);
            toast("Address saved");
            onClose();
          }}
        >
          Save address
        </SubmitButton>
      }
    >
      <AddressFields prefix={kind} value={a} onChange={setA} errors={errors} showPhone={kind === "shipping"} deliveryCheck={kind === "shipping"} />
    </Sheet>
  );
}
