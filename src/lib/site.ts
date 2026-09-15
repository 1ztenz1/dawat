export const site = {
  name: "Dawat Halal Meals",
  shortName: "Dawat",
  url: "https://dawathalalmeals.com",
  tagline: "Freshly cooked home-style halal meals, delivered daily",
  description:
    "Freshly cooked, home-style North Indian & Pakistani halal meals delivered to your door Monday to Friday across the Greater Toronto Area. Weekly & monthly plans from $49.99.",
  phone: { display: "+1 (647) 237-7313", href: "tel:+16472377313" },
  tollFree: { display: "+1 (888) 776-7860", href: "tel:+18887767860" },
  // TODO: confirm the WhatsApp business number with the owner.
  whatsapp: { number: "16472377313", href: "https://wa.me/16472377313" },
  email: "hello@dawathalalmeals.com",
  social: {
    instagram: "https://www.instagram.com/dawathalalmeals786",
    facebook: "https://www.facebook.com/dawathalalmeals",
  },
  cutoffHourET: 18,
  currency: "CAD",
  stats: { customers: "150+", meals: "10k+" },
} as const;

export const deliveryAreas = [
  "Downtown Toronto",
  "Etobicoke",
  "North York",
  "East York",
  "Scarborough",
  "Port Union",
  "Markham",
  "Richmond Hill",
  "Vaughan",
  "York University",
  "Mississauga",
  "Brampton",
  "Malton",
  "Pickering",
  "Ajax",
  "Whitby",
  "Oshawa",
] as const;

/* First letters of postal codes (FSA) served. Ontario GTA: M = Toronto,
   L = Central Ontario (Peel, York, Durham). Refine per FSA with the owner. */
export const servedPostalPrefixes = ["M", "L"] as const;

export const provinces = [
  ["ON", "Ontario"],
  ["AB", "Alberta"],
  ["BC", "British Columbia"],
  ["MB", "Manitoba"],
  ["NB", "New Brunswick"],
  ["NL", "Newfoundland and Labrador"],
  ["NS", "Nova Scotia"],
  ["PE", "Prince Edward Island"],
  ["QC", "Quebec"],
  ["SK", "Saskatchewan"],
  ["NT", "Northwest Territories"],
  ["NU", "Nunavut"],
  ["YT", "Yukon"],
] as const;

export const faqs: { q: string; a: string }[] = [
  { q: "Which days do you deliver?", a: "Monday to Friday. We don't deliver on Saturday or Sunday, so pick a weekday as your start date." },
  { q: "When will my plan start?", a: "You choose your start date when ordering. Orders placed after 6 PM Eastern are processed the next day, so the earliest date shown already accounts for that." },
  { q: "How do subscriptions renew?", a: "Weekly plans (5 meals) renew every 7 days and monthly plans (20 meals) renew every 28 days. You can pause, skip days or cancel anytime from My Account." },
  { q: "What's the difference between Thali, Regular and Large?", a: "Thali: 6 oz curry, 4 oz sabzi, 12 oz rice and 2 rotis in a 3-compartment tray. Regular: 12 oz curry, 4 oz sabzi, 12 oz rice and 2 rotis. Large: 16 oz curry, 8 oz sabzi, 12 oz rice and 3 rotis, enough for two meals." },
  { q: "How is the food packaged?", a: "Meals come in microwavable, BPA-free containers. Thalis use a 3-compartment tray designed to be eaten on the go." },
  { q: "How can I pay?", a: "All major credit and debit cards through our secure Stripe checkout, or cash on delivery." },
  { q: "Is delivery included?", a: "Yes. Delivery to your front door, back door or condo lobby is included. Delivery to your apartment door is $1.99 per day." },
  { q: "Will I know when my food arrives?", a: "Yes. You'll get delivery updates and a tracking link by text message every delivery day." },
  { q: "Can you accommodate allergies?", a: "Please note allergies when ordering. Our meals commonly contain dairy, eggs, nuts and gluten, and we can't guarantee against cross-contamination, so we can't accommodate dairy, egg, nut or fish allergies." },
  { q: "Can I get a refund?", a: "Because every meal is cooked fresh, there are no refunds on food items. Try a 1–4 day trial first if you're unsure." },
];
