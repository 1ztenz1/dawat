"use client";

/* ------------------------------------------------------------------
   MOCK API: frontend-only phase.
   Every function here is async and shaped like the real backend call it
   will become (Supabase Auth, Postgres tables, Stripe). Data lives in
   localStorage so all flows can be clicked through end to end.
   Swap the bodies, keep the signatures.
------------------------------------------------------------------- */

import { frequencies, getProduct, priceLine, productName, describeConfig } from "@/lib/catalog";
import { addDays, deliveryDates, formatDate, fromISO, toISO } from "@/lib/dates";
import { cartStore, cartSummary, lineTotals, type CartLine } from "@/lib/store/cart";
import { createPersistedStore } from "@/lib/store/persisted";
import type { Address, Order, PaymentMethod, SavedCard, Subscription, User } from "./types";

export type * from "./types";

interface Db {
  users: (User & { passwordHash: string })[];
  orders: Order[];
  subscriptions: Subscription[];
  cards: Record<string, SavedCard[]>;
  newsletter: string[];
  resetTokens: Record<string, string>;
}

const db = createPersistedStore<Db>("dhm.mockdb.v1", {
  users: [],
  orders: [],
  subscriptions: [],
  cards: {},
  newsletter: [],
  resetTokens: {},
});

export const sessionStore = createPersistedStore<{ userId: string | null }>("dhm.session.v1", { userId: null });

export class ApiError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
  }
}

const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms + Math.random() * 250));
const id = (p: string) => `${p}_${Math.random().toString(36).slice(2, 10)}`;
const now = () => new Date().toISOString();
const clean = <T extends { passwordHash?: string }>(u: T) => {
  const { passwordHash: _omit, ...rest } = u;
  void _omit;
  return rest as Omit<T, "passwordHash">;
};

async function hash(pw: string) {
  const data = new TextEncoder().encode("dhm-demo:" + pw);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

function requireUser() {
  const { userId } = sessionStore.get();
  const user = db.get().users.find((u) => u.id === userId);
  if (!user) throw new ApiError("Please log in to continue.");
  return user;
}

/* ---------------- Session hook ---------------- */

export function useUser(): User | null {
  const userId = sessionStore.useStore((s) => s.userId);
  const users = db.useStore((s) => s.users);
  const u = users.find((x) => x.id === userId);
  return u ? (clean(u) as User) : null;
}

/* ---------------- Auth ---------------- */

export const auth = {
  async register(input: { firstName: string; lastName: string; email: string; password: string; phone?: string; marketing?: boolean }) {
    await wait();
    const email = input.email.trim().toLowerCase();
    if (db.get().users.some((u) => u.email === email)) throw new ApiError("An account with this email already exists. Try logging in.", "email");
    if (input.password.length < 8) throw new ApiError("Use at least 8 characters.", "password");
    const user: User & { passwordHash: string } = {
      id: id("usr"),
      email,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      displayName: input.firstName.trim(),
      phone: input.phone ?? "",
      createdAt: now(),
      marketing: !!input.marketing,
      passwordHash: await hash(input.password),
    };
    db.set((s) => ({ ...s, users: [...s.users, user] }));
    sessionStore.set({ userId: user.id });
    return clean(user) as User;
  },

  async login(emailRaw: string, password: string) {
    await wait();
    const email = emailRaw.trim().toLowerCase();
    const user = db.get().users.find((u) => u.email === email);
    if (!user || user.passwordHash !== (await hash(password))) throw new ApiError("Incorrect email or password.");
    sessionStore.set({ userId: user.id });
    return clean(user) as User;
  },

  async logout() {
    sessionStore.set({ userId: null });
  },

  async requestPasswordReset(emailRaw: string) {
    await wait();
    const email = emailRaw.trim().toLowerCase();
    const user = db.get().users.find((u) => u.email === email);
    // Always succeed so accounts can't be enumerated. Demo: expose the token.
    if (!user) return { demoToken: null };
    const token = Math.random().toString(36).slice(2, 12);
    db.set((s) => ({ ...s, resetTokens: { ...s.resetTokens, [token]: user.id } }));
    return { demoToken: token };
  },

  async resetPassword(token: string, password: string) {
    await wait();
    const userId = db.get().resetTokens[token];
    if (!userId) throw new ApiError("This reset link is invalid or has expired.");
    const passwordHash = await hash(password);
    db.set((s) => {
      const resetTokens = { ...s.resetTokens };
      delete resetTokens[token];
      return { ...s, resetTokens, users: s.users.map((u) => (u.id === userId ? { ...u, passwordHash } : u)) };
    });
  },

  async changePassword(current: string, next: string) {
    await wait();
    const user = requireUser();
    if (user.passwordHash !== (await hash(current))) throw new ApiError("Your current password is incorrect.", "current");
    const passwordHash = await hash(next);
    db.set((s) => ({ ...s, users: s.users.map((u) => (u.id === user.id ? { ...u, passwordHash } : u)) }));
  },
};

/* ---------------- Account ---------------- */

export const account = {
  async updateProfile(patch: Partial<Pick<User, "firstName" | "lastName" | "displayName" | "email" | "phone" | "marketing">>) {
    await wait();
    const user = requireUser();
    if (patch.email) {
      const email = patch.email.trim().toLowerCase();
      if (db.get().users.some((u) => u.email === email && u.id !== user.id)) throw new ApiError("That email is already in use.", "email");
      patch.email = email;
    }
    db.set((s) => ({ ...s, users: s.users.map((u) => (u.id === user.id ? { ...u, ...patch } : u)) }));
  },

  async saveAddress(kind: "billing" | "shipping", address: Address) {
    await wait();
    const user = requireUser();
    db.set((s) => ({ ...s, users: s.users.map((u) => (u.id === user.id ? { ...u, [kind]: address } : u)) }));
  },

  useCards(): SavedCard[] {
    const userId = sessionStore.useStore((s) => s.userId);
    const cards = db.useStore((s) => s.cards);
    return (userId && cards[userId]) || EMPTY_CARDS;
  },

  async addCard(card: Omit<SavedCard, "id" | "isDefault">) {
    await wait(700);
    const user = requireUser();
    db.set((s) => {
      const list = s.cards[user.id] ?? [];
      return { ...s, cards: { ...s.cards, [user.id]: [...list, { ...card, id: id("pm"), isDefault: list.length === 0 }] } };
    });
  },

  async removeCard(cardId: string) {
    await wait();
    const user = requireUser();
    db.set((s) => {
      let list = (s.cards[user.id] ?? []).filter((c) => c.id !== cardId);
      if (list.length && !list.some((c) => c.isDefault)) list = list.map((c, i) => ({ ...c, isDefault: i === 0 }));
      return { ...s, cards: { ...s.cards, [user.id]: list } };
    });
  },

  async setDefaultCard(cardId: string) {
    await wait(250);
    const user = requireUser();
    db.set((s) => ({
      ...s,
      cards: { ...s.cards, [user.id]: (s.cards[user.id] ?? []).map((c) => ({ ...c, isDefault: c.id === cardId })) },
    }));
  },
};
const EMPTY_CARDS: SavedCard[] = [];

/* ---------------- Coupons ---------------- */

// Codes advertised on the live site's subscription landing page.
const coupons: Record<string, { type: "percent" | "fixed"; value: number; label: string; requires?: "weekly" | "monthly" }> = {
  WEEKLY5: { type: "fixed", value: 5, label: "$5 off weekly subscription", requires: "weekly" },
  MONTHLY20: { type: "fixed", value: 20, label: "$20 off monthly subscription", requires: "monthly" },
};

export async function validateCoupon(code: string, subtotal: number) {
  await wait(350);
  const key = code.trim().toUpperCase();
  const c = coupons[key];
  if (!c) throw new ApiError("This coupon code isn't valid.");
  if (c.requires) {
    const eligible = cartStore.get().lines.some((l) => {
      const p = getProduct(l.slug);
      return p?.kind === "subscription" && p.frequency === c.requires;
    });
    if (!eligible) throw new ApiError(`${key} only works with a ${c.requires} subscription in your cart.`);
  }
  const discount = c.type === "percent" ? (subtotal * c.value) / 100 : Math.min(c.value, subtotal);
  return { code: key, label: c.label, discount: Math.round(discount * 100) / 100 };
}

/* ---------------- Orders ---------------- */

export interface CheckoutInput {
  email: string;
  billing: Address;
  shipping: Address;
  shipToDifferent: boolean;
  notes: string;
  payment: PaymentMethod;
  cardLabel?: string;
  createAccount?: { password: string; marketing: boolean };
  coupon?: string | null;
}

let orderSeq = 0;
const nextNumber = (prefix: string) => {
  orderSeq = Math.max(orderSeq, db.get().orders.length + db.get().subscriptions.length);
  orderSeq += 1;
  return `${prefix}${(10420 + orderSeq).toString()}`;
};

export const orders = {
  async place(lines: CartLine[], input: CheckoutInput): Promise<Order> {
    await wait(1100);
    if (!lines.length) throw new ApiError("Your cart is empty.");

    let user = db.get().users.find((u) => u.id === sessionStore.get().userId);
    const summary = cartSummary(lines);

    if (!user && summary.hasSubscription && !input.createAccount) {
      throw new ApiError("Subscriptions need an account so you can manage them. Add a password to create one.");
    }
    if (!user && input.createAccount) {
      await auth.register({
        firstName: input.billing.firstName,
        lastName: input.billing.lastName,
        email: input.email,
        password: input.createAccount.password,
        phone: input.billing.phone,
        marketing: input.createAccount.marketing,
      });
      user = db.get().users.find((u) => u.id === sessionStore.get().userId);
    }

    const discount = input.coupon ? (await validateCoupon(input.coupon, summary.subtotal)).discount : 0;
    const orderId = id("ord");
    const paymentLabel = input.payment === "cod" ? "Cash on delivery" : input.cardLabel ?? "Credit / debit card";
    const shipping = input.shipToDifferent ? input.shipping : input.billing;

    const items = lines.map((l) => {
      const t = lineTotals(l)!;
      return { slug: l.slug, name: productName(t.product), qty: l.qty, unit: t.price.unit, total: t.total, config: l.config, details: describeConfig(l.config) };
    });

    const subs: Subscription[] = [];
    if (user) {
      for (const l of lines) {
        const product = getProduct(l.slug);
        if (product?.kind !== "subscription" || l.config.kind !== "subscription") continue;
        for (let i = 0; i < l.qty; i++) {
          const f = frequencies[product.frequency];
          subs.push({
            id: id("sub"),
            number: nextNumber("S"),
            userId: user.id,
            orderId,
            slug: product.slug,
            name: productName(product),
            status: "active",
            price: priceLine(product, l.config).unit,
            renewDays: f.renewDays,
            mealsPerCycle: f.meals,
            startDate: l.config.startDate,
            nextRenewal: toISO(addDays(fromISO(l.config.startDate), f.renewDays)),
            skippedDates: [],
            pausedUntil: null,
            config: l.config,
            payment: { method: input.payment, label: paymentLabel },
            shipping,
            createdAt: now(),
            activity: [{ at: now(), text: "Subscription started" }],
          });
        }
      }
    }

    const order: Order = {
      id: orderId,
      number: nextNumber("#"),
      userId: user?.id ?? null,
      email: input.email.trim().toLowerCase(),
      createdAt: now(),
      status: input.payment === "cod" ? "on-hold" : "processing",
      items,
      subtotal: summary.subtotal,
      discount,
      delivery: 0,
      total: Math.max(0, Math.round((summary.subtotal - discount) * 100) / 100),
      payment: { method: input.payment, label: paymentLabel },
      billing: input.billing,
      shipping,
      notes: input.notes,
      subscriptionIds: subs.map((s) => s.id),
    };

    db.set((s) => ({
      ...s,
      orders: [order, ...s.orders],
      subscriptions: [...subs, ...s.subscriptions],
      users: s.users.map((u) =>
        u.id === user?.id ? { ...u, billing: input.billing, shipping, phone: u.phone || input.billing.phone } : u,
      ),
    }));
    try {
      sessionStorage.setItem("dhm.lastOrder", order.id);
    } catch {}
    return order;
  },

  useMine(): Order[] {
    const userId = sessionStore.useStore((s) => s.userId);
    const all = db.useStore((s) => s.orders);
    return userId ? all.filter((o) => o.userId === userId) : EMPTY_ORDERS;
  },

  useOne(orderId: string | null): Order | undefined {
    const all = db.useStore((s) => s.orders);
    return all.find((o) => o.id === orderId);
  },
};
const EMPTY_ORDERS: Order[] = [];

/* ---------------- Subscriptions ---------------- */

function patchSub(subId: string, fn: (s: Subscription) => Subscription) {
  const user = requireUser();
  db.set((s) => ({
    ...s,
    subscriptions: s.subscriptions.map((x) => (x.id === subId && x.userId === user.id ? fn(x) : x)),
  }));
}
const log = (s: Subscription, text: string): Subscription => ({ ...s, activity: [{ at: now(), text }, ...s.activity] });

export const subscriptionsApi = {
  useMine(): Subscription[] {
    const userId = sessionStore.useStore((s) => s.userId);
    const all = db.useStore((s) => s.subscriptions);
    return userId ? all.filter((s) => s.userId === userId) : EMPTY_SUBS;
  },

  /** Upcoming delivery dates for the current cycle, including skipped ones. */
  upcoming(sub: Subscription, count = 10) {
    const today = toISO(new Date());
    const from = sub.startDate > today ? sub.startDate : today;
    return deliveryDates(from, count);
  },

  async pause(subId: string, until: string) {
    await wait();
    patchSub(subId, (s) => log({ ...s, status: "paused", pausedUntil: until }, `Paused until ${formatDate(until)}`));
  },
  async resume(subId: string) {
    await wait();
    patchSub(subId, (s) => log({ ...s, status: "active", pausedUntil: null }, "Resumed"));
  },
  async cancel(subId: string, reason: string) {
    await wait();
    patchSub(subId, (s) => log({ ...s, status: "pending-cancel" }, `Cancellation requested${reason ? `: ${reason}` : ""}. Active until ${formatDate(s.nextRenewal)}`));
  },
  async reactivate(subId: string) {
    await wait();
    patchSub(subId, (s) => log({ ...s, status: "active" }, "Cancellation withdrawn"));
  },
  async toggleSkip(subId: string, date: string) {
    await wait(250);
    patchSub(subId, (s) => {
      const skipped = s.skippedDates.includes(date);
      return log(
        { ...s, skippedDates: skipped ? s.skippedDates.filter((d) => d !== date) : [...s.skippedDates, date] },
        skipped ? `Restored delivery on ${formatDate(date)}` : `Skipped delivery on ${formatDate(date)}`,
      );
    });
  },
  async updatePreferences(subId: string, patch: Partial<Extract<Subscription["config"], { kind: "subscription" }>>) {
    await wait();
    patchSub(subId, (s) => {
      if (s.config.kind !== "subscription") return s;
      const product = getProduct(s.slug)!;
      const config = { ...s.config, ...patch };
      return log({ ...s, config, price: priceLine(product, config).unit }, "Preferences updated (applies from next renewal)");
    });
  },
  async updateShipping(subId: string, address: Address) {
    await wait();
    patchSub(subId, (s) => log({ ...s, shipping: address }, "Delivery address updated"));
  },
  async updatePayment(subId: string, method: PaymentMethod, label: string) {
    await wait();
    patchSub(subId, (s) => log({ ...s, payment: { method, label } }, `Payment method changed to ${label}`));
  },
};
const EMPTY_SUBS: Subscription[] = [];

/* ---------------- Newsletter & contact ---------------- */

export async function subscribeNewsletter(email: string) {
  await wait();
  db.set((s) => ({ ...s, newsletter: Array.from(new Set([...s.newsletter, email.trim().toLowerCase()])) }));
}

export async function sendContactMessage(_input: { name: string; email: string; phone: string; topic: string; message: string }) {
  void _input;
  await wait(800);
}
