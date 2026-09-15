# AgroConnect

A responsive marketplace connecting Nigerian farmers directly with buyers, built from the
Figma screens in [`design/`](design).

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build (`vite build`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over `src/` |

## Trying it out

The app opens on the splash screen and walks through Welcome → Role selection →
Create account → OTP. Any 6-digit code is accepted.

To skip straight in, the login screen has **Login as Farmer** and **Login as Buyer**
buttons that sign you into pre-seeded accounts:

- **Farmer** — Aliu, Musa of Musa Field Farm: 11 listings, 5 orders, earnings and
  withdrawal history, a verified profile scoring 99%.
- **Buyer** — Sarah Agada: order history across every status, a part-filled cart and
  three chat threads.

Signing in with the farmer's seeded phone number (`07036303238`) also lands on the
farmer app; any other valid Nigerian number signs in as the buyer.

## What works

Everything is wired to a local data layer — no backend required, and state survives a
reload.

- **Marketplace** — browse by category, search, product detail with reviews, favourites.
- **Cart & checkout** — quantity steppers, live subtotal/delivery/total, placing an
  order assigns the next order number and a delivery estimate.
- **Orders** — buyers track status and rate the farmer (the review lands on the
  product); farmers accept, cancel and advance orders through to delivered, which
  credits earnings.
- **Listings** — farmers add, edit and toggle stock on produce; a new listing appears
  in the buyer's marketplace immediately.
- **Earnings** — analytics charts by period, withdrawals against a real available
  balance.
- **Verification** — an eight-step flow (profile, identity, address, farming, bank,
  security, review, approved). File pickers show the chosen file, bank account numbers
  resolve to an account name, and the verification score recomputes as steps complete.
- **Chat** — message threads with read receipts and a simulated farmer reply.
- **Harvest tracker** — calendar with harvest days and a weather widget.

## Layout

| Breakpoint | Navigation | Layout |
| --- | --- | --- |
| `< 768px` | Bottom tab bar | Single column |
| `768–1023px` | Bottom tab bar | Two-column grids |
| `≥ 1024px` | Left sidebar | Multi-column dashboards, split auth and chat views |

## Structure

```
src/
├── components/   layout shell, UI primitives, marketplace/cart/order/chat/farmer pieces
├── context/      Auth, Product, Cart, Order, Chat, Verification, Toast providers
├── data/seed.js  catalog, people, orders, conversations, harvests
├── lib/          types, formatting helpers, localStorage wrapper
└── pages/        auth, farmer (+ verification), buyer, shared
```

### Swapping in a backend

Every provider reads and writes through [`src/lib/storage.js`](src/lib/storage.ts) and
seeds from [`src/data/seed.ts`](src/data/seed.ts). Point those two at an API client and
the component tree is unchanged.

## Assets

The produce photography, category tiles, avatars, logo, map and hero images in
`public/img/` were extracted from the Figma exports in `design/` so the build matches
the mockups exactly. `design/` is not part of the bundle.
