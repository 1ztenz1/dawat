# Dawat Halal Meals — website

The new dawathalalmeals.com: a fast, mobile-first rebuild of the WordPress/WooCommerce store in **Next.js 16 (App Router) + React 19 + Tailwind CSS 4**, with light and dark themes.

> **Status: frontend complete, backend mocked.** Every flow works end to end (sign up, order, checkout, manage subscriptions), but data is saved in the visitor's browser (`localStorage`) and no payment is taken. See [Connecting the backend](#connecting-the-backend).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

Requires Node 20.9+.

## Pages

| Area | Routes |
| --- | --- |
| Marketing | `/` home, `/menu` this week's menu, `/about`, `/contact`, `/faq`, `/delivery-areas` (postal code checker), `/subscribe` (offers landing page, codes WEEKLY5 / MONTHLY20) |
| Shop | `/plans` all subscriptions + price matrix, `/thali`, `/trial`, `/shop` (filter & sort), `/product/[slug]` (12 plans + trial, same slugs as the old store) |
| Checkout | `/cart`, `/checkout` (address + postal check, billing, account creation, card / cash on delivery, coupons, recurring totals, terms), `/checkout/order-received` |
| Auth | `/login`, `/register`, `/forgot-password`, `/reset-password` |
| My account | `/account` dashboard, `/account/subscriptions` (+ detail: skip days, pause, cancel, change protein / drop-off / extras / address / payment), `/account/orders` (+ detail, reorder), `/account/addresses`, `/account/payment-methods`, `/account/details` (profile, password, theme) |
| Legal | `/terms` (T&C + refund policy), `/privacy-policy`, `/newsletter` (email preferences) |

Old WordPress URLs (`/about-us`, `/my-account/*`, `/refund_returns`, `/product-category/*`, `/1075-2`, …) redirect to the new pages. See `next.config.ts`.

Site-wide: sticky header with cart drawer, mobile bottom tab bar, dismissible 6 PM ET cutoff banner, WhatsApp chat widget, cookie consent (accept / reject / customize), newsletter signup, SEO metadata, JSON-LD, sitemap, robots, web manifest.

## Where to change things

| What | File |
| --- | --- |
| **Weekly menu** (update every Monday) | `src/lib/menu.ts` + replace `public/weekly-menu-poster.webp` |
| Prices, plans, extras, delivery fees, trial pricing | `src/lib/catalog.ts` |
| Phone, WhatsApp, email, socials, delivery areas, served postal prefixes, FAQs | `src/lib/site.ts` |
| Terms & refund text | `src/lib/legal.ts` |
| Coupons | `src/lib/api/index.ts` (`coupons`) → move to the database |
| Colours (light & dark) | `src/app/globals.css` (`:root` and `[data-theme="dark"]`) |
| Photos | `src/assets/` (imported, so Next.js resizes and serves AVIF/WebP automatically) |

## Connecting the backend

All data access goes through **`src/lib/api/`**. Components never touch storage directly, so the backend work is replacing function bodies while keeping their signatures:

| Mock today | Replace with |
| --- | --- |
| `auth.*` (register, login, reset, change password) | Supabase Auth |
| `orders.place` | Server action → create order in Postgres + Stripe PaymentIntent / Subscription |
| `subscriptionsApi.*` (pause, skip, cancel, preferences) | Postgres + Stripe Billing (pause collection, cancel at period end) |
| `account.addCard` / `CardFields` component | Stripe Payment Element + SetupIntent (never send card numbers to your server) |
| `validateCoupon` | Stripe promotion codes |
| `subscribeNewsletter`, `sendContactMessage` | Resend / email provider |
| `earliestStartDate` (6 PM ET cutoff) | Keep, and also enforce server-side |

## Images

`hero-biryani`, `thali-tray`, `meal-plate`, `dish-chicken`, `dish-rajma`, `dish-rice` are Dawat's own photos from the current site. `dish-curry` ("Chicken curry Trivandrum") and `dish-roti` ("Chapati-1") are CC0 from Wikimedia Commons. Replace them with real kitchen photos when available.

## To confirm with the owner

- WhatsApp business number (currently set to +1 647 237 7313).
- Trial meal pricing: thali −$2 / 16 oz +$5 is applied **per day** (the old plugin wording was ambiguous).
- Exact served postal codes (currently any GTA code starting with M or L).
- Veg plans only offer "Veggie"; the old store also let customers pick chicken on veg products, which looked like a mistake.
