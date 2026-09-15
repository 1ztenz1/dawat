import type { LineConfig } from "@/lib/catalog";

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  buzzer?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phone: string;
  createdAt: string;
  billing?: Address;
  shipping?: Address;
  marketing: boolean;
}

export interface SavedCard {
  id: string;
  brand: "visa" | "mastercard" | "amex";
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export type PaymentMethod = "card" | "cod";
export type OrderStatus = "processing" | "completed" | "on-hold" | "cancelled";

export interface OrderItem {
  slug: string;
  name: string;
  qty: number;
  unit: number;
  total: number;
  config: LineConfig;
  details: string[];
}

export interface Order {
  id: string;
  number: string;
  userId: string | null;
  email: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  payment: { method: PaymentMethod; label: string };
  billing: Address;
  shipping: Address;
  notes: string;
  subscriptionIds: string[];
}

export type SubscriptionStatus = "active" | "paused" | "cancelled" | "pending-cancel";

export interface Subscription {
  id: string;
  number: string;
  userId: string;
  orderId: string;
  slug: string;
  name: string;
  status: SubscriptionStatus;
  price: number;
  renewDays: number;
  mealsPerCycle: number;
  startDate: string;
  nextRenewal: string;
  skippedDates: string[];
  pausedUntil: string | null;
  config: LineConfig;
  payment: { method: PaymentMethod; label: string };
  shipping: Address;
  createdAt: string;
  activity: { at: string; text: string }[];
}
