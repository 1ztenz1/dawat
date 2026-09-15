/* Product catalogue and pricing rules, mirrored from the live WooCommerce
   store. When the backend lands, prices come from the database but these
   types and `priceLine` stay the single source of truth for the UI. */

export type MealSize = "thali" | "regular" | "large";
export type Frequency = "weekly" | "monthly";
export type Diet = "veg" | "nonveg";

export interface SizeInfo {
  id: MealSize;
  name: string;
  tagline: string;
  servingNote: string;
  includes: { amount: string; item: string }[];
  image: "thali" | "plate";
  badge?: string;
}

export const sizes: Record<MealSize, SizeInfo> = {
  thali: {
    id: "thali",
    name: "Thali",
    tagline: "Made to eat on the go",
    servingNote: "Comes in a 3-compartment, microwavable, BPA-free tray.",
    includes: [
      { amount: "6 oz", item: "curry" },
      { amount: "4 oz", item: "sabzi" },
      { amount: "12 oz", item: "rice" },
      { amount: "2", item: "rotis" },
    ],
    image: "thali",
    badge: "Best value",
  },
  regular: {
    id: "regular",
    name: "Regular Meal",
    tagline: "A full plate for one",
    servingNote: "Enough for one hearty meal, or two light eaters.",
    includes: [
      { amount: "12 oz", item: "curry" },
      { amount: "4 oz", item: "sabzi" },
      { amount: "12 oz", item: "rice" },
      { amount: "2", item: "rotis" },
    ],
    image: "plate",
    badge: "Most loved",
  },
  large: {
    id: "large",
    name: "Large Meal",
    tagline: "Two meals' worth",
    servingNote: "Enough for two meals a day for a heavy eater, or two light eaters.",
    includes: [
      { amount: "16 oz", item: "curry" },
      { amount: "8 oz", item: "sabzi" },
      { amount: "12 oz", item: "rice" },
      { amount: "3", item: "rotis" },
    ],
    image: "plate",
  },
};

export const frequencies: Record<Frequency, { label: string; meals: number; renewDays: number; per: string }> = {
  weekly: { label: "Weekly", meals: 5, renewDays: 7, per: "week" },
  monthly: { label: "Monthly", meals: 20, renewDays: 28, per: "4 weeks" },
};

export interface SubscriptionProduct {
  kind: "subscription";
  slug: string;
  size: MealSize;
  frequency: Frequency;
  diet: Diet;
  price: number;
}

export interface TrialProduct {
  kind: "trial";
  slug: "trial-meal";
}

export type Product = SubscriptionProduct | TrialProduct;

const P = (size: MealSize, frequency: Frequency, diet: Diet, price: number, slug: string): SubscriptionProduct => ({
  kind: "subscription",
  size,
  frequency,
  diet,
  price,
  slug,
});

export const subscriptions: SubscriptionProduct[] = [
  P("thali", "weekly", "veg", 49.99, "weekly-subscription-veg-thali"),
  P("thali", "weekly", "nonveg", 54.99, "weekly-subscription-non-veg-thali"),
  P("thali", "monthly", "veg", 199.99, "monthly-subscription-veg-thali"),
  P("thali", "monthly", "nonveg", 219.99, "monthly-subscription-non-veg-thali"),
  P("regular", "weekly", "veg", 64.99, "weekly-subscription-veg-meal-regular-size-12-oz-curry"),
  P("regular", "weekly", "nonveg", 69.99, "weekly-subscription-non-veg-meal-regular-size-12-oz-curry"),
  P("regular", "monthly", "veg", 249.99, "monthly-subscription-veg-meal-regular-size-12-oz-curry"),
  P("regular", "monthly", "nonveg", 279.99, "monthly-subscription-non-veg-meal-regular-size-12-oz-curry"),
  P("large", "weekly", "veg", 74.99, "weekly-subscription-veg-meal-large-size-16-oz-curry"),
  P("large", "weekly", "nonveg", 79.99, "weekly-subscription-non-veg-meal-large-size-16-oz-curry"),
  P("large", "monthly", "veg", 289.99, "monthly-subscription-veg-meal-large-size-16-oz-curry"),
  P("large", "monthly", "nonveg", 319.99, "monthly-subscription-non-veg-meal-large-size-16-oz-curry"),
];

export const trialProduct: TrialProduct = { kind: "trial", slug: "trial-meal" };

export const allProducts: Product[] = [...subscriptions, trialProduct];

export function getProduct(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug);
}

export function findSubscription(size: MealSize, frequency: Frequency, diet: Diet) {
  return subscriptions.find((p) => p.size === size && p.frequency === frequency && p.diet === diet)!;
}

export function productName(p: Product): string {
  if (p.kind === "trial") return "Trial Meal";
  const s = sizes[p.size];
  return `${frequencies[p.frequency].label} ${p.diet === "veg" ? "Veg" : "Non‑Veg"} ${s.name}`;
}

/* ---------------- Options ---------------- */

export const deliverySpots = [
  { id: "front", label: "Front door", hint: "House / townhouse", perDay: 0 },
  { id: "back", label: "Back door", hint: "House / townhouse", perDay: 0 },
  { id: "lobby", label: "Lobby", hint: "Condo", perDay: 0 },
  { id: "apartment", label: "Apartment door", hint: "+$1.99 / day", perDay: 1.99 },
] as const;
export type DeliverySpot = (typeof deliverySpots)[number]["id"];

export const proteins = {
  veg: [{ id: "veggie", label: "Veggie" }],
  nonveg: [
    { id: "chicken", label: "Chicken" },
    { id: "beef-chicken", label: "Beef + Chicken" },
  ],
} as const;
export type Protein = "veggie" | "chicken" | "beef-chicken";

export const extras = [
  { id: "rice", label: "Extra rice", detail: "16 oz", perDay: 1.99, max: 1 },
  { id: "curry12", label: "Extra curry", detail: "12 oz", perDay: 5.99, max: 5 },
  { id: "curry16", label: "Extra curry", detail: "16 oz", perDay: 7.99, max: 5 },
  { id: "roti", label: "Extra roti", detail: "per roti", perDay: 0.99, max: 10 },
] as const;
export type ExtraId = (typeof extras)[number]["id"];
export type ExtrasSelection = Record<ExtraId, number>;
export const noExtras: ExtrasSelection = { rice: 0, curry12: 0, curry16: 0, roti: 0 };

export const trialVariants = [
  { id: "veggie", label: "Veggie" },
  { id: "chicken", label: "White meat", hint: "Chicken" },
  { id: "beef", label: "Red meat", hint: "Veal / Beef" },
] as const;
export type TrialVariant = (typeof trialVariants)[number]["id"];

export const trialTypes = [
  { id: "thali", label: "Thali meal", adjust: -2 },
  { id: "12oz", label: "12 oz meal", adjust: 0 },
  { id: "16oz", label: "16 oz meal", adjust: 5 },
] as const;
export type TrialType = (typeof trialTypes)[number]["id"];

export const TRIAL_PER_DAY = 15;
export const TRIAL_MAX_DAYS = 4;
export const trialSpots = deliverySpots.filter((s) => s.id !== "apartment");

export interface SubscriptionConfig {
  kind: "subscription";
  startDate: string; // YYYY-MM-DD
  spot: DeliverySpot;
  protein: Protein;
  allergies: string;
  extras: ExtrasSelection;
}

export interface TrialConfig {
  kind: "trial";
  startDate: string;
  spot: DeliverySpot;
  variant: TrialVariant;
  type: TrialType;
  days: number;
}

export type LineConfig = SubscriptionConfig | TrialConfig;

export interface PriceBreakdown {
  base: number;
  options: number;
  unit: number;
  perMeal: number;
  meals: number;
}

const round = (n: number) => Math.round(n * 100) / 100;

export function priceLine(product: Product, config: LineConfig): PriceBreakdown {
  if (product.kind === "trial" && config.kind === "trial") {
    const days = Math.min(Math.max(config.days, 1), TRIAL_MAX_DAYS);
    const adjust = trialTypes.find((t) => t.id === config.type)?.adjust ?? 0;
    const unit = round((TRIAL_PER_DAY + adjust) * days);
    return { base: TRIAL_PER_DAY * days, options: round(adjust * days), unit, perMeal: round(unit / days), meals: days };
  }
  if (product.kind === "subscription" && config.kind === "subscription") {
    const meals = frequencies[product.frequency].meals;
    const spot = deliverySpots.find((s) => s.id === config.spot)?.perDay ?? 0;
    const extra = extras.reduce((sum, e) => sum + e.perDay * (config.extras[e.id] ?? 0), 0);
    const options = round((spot + extra) * meals);
    const unit = round(product.price + options);
    return { base: product.price, options, unit, perMeal: round(unit / meals), meals };
  }
  throw new Error("Product and configuration kinds do not match");
}

/** Savings of a monthly plan versus four weekly renewals. */
export function monthlySavings(size: MealSize, diet: Diet) {
  const weekly = findSubscription(size, "weekly", diet).price * 4;
  const monthly = findSubscription(size, "monthly", diet).price;
  return round(weekly - monthly);
}

export function describeConfig(config: LineConfig): string[] {
  if (config.kind === "trial") {
    return [
      `${trialTypes.find((t) => t.id === config.type)?.label} · ${config.days} ${config.days > 1 ? "days" : "day"}`,
      trialVariants.find((v) => v.id === config.variant)?.label ?? "",
      `Drop-off: ${deliverySpots.find((s) => s.id === config.spot)?.label}`,
    ];
  }
  const lines = [
    [...proteins.veg, ...proteins.nonveg].find((p) => p.id === config.protein)?.label ?? "",
    `Drop-off: ${deliverySpots.find((s) => s.id === config.spot)?.label}`,
  ];
  const ex = extras
    .filter((e) => config.extras[e.id] > 0)
    .map((e) => (e.max === 1 ? `${e.label} (${e.detail})` : `${config.extras[e.id]}× ${e.label} ${e.detail === "per roti" ? "" : e.detail}`.trim()));
  if (ex.length) lines.push(ex.join(", "));
  if (config.allergies.trim()) lines.push(`Note: ${config.allergies.trim()}`);
  return lines;
}
