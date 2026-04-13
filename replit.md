# Mirruba Jewellery Website

## Overview

Luxury jewellery e-commerce website for Mirruba Jewellery, based in Sharjah, UAE (Central Market). Built as a React + Vite frontend with Express API backend that proxies WooCommerce REST API for real product data.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS v4
- **Backend**: Express API server (WooCommerce proxy)
- **Routing**: wouter
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: lucide-react
- **Fonts**: Cormorant Garamond (serif headings), Inter (sans body)
- **State Management**: React Context (Cart)
- **Data Source**: WooCommerce REST API at admin.mirruba-jewellery.com

## Project Structure

- `artifacts/mirruba-jewellery/` — Main website artifact (React + Vite)
  - `src/pages/` — Page components (Home, Shop, ProductDetail, Checkout, Terms)
  - `src/components/` — Shared components (Navbar, Footer, CartDrawer, ProductCard)
  - `src/context/` — Cart context provider
  - `src/data/products.ts` — WooCommerce API client functions and product types
  - `src/components/ui/` — shadcn/ui components
- `artifacts/api-server/` — Express API server (WooCommerce proxy)
  - `src/routes/woocommerce.ts` — Proxy routes for /wc/products, /wc/products/:id, /wc/categories
- `artifacts/mockup-sandbox/` — Design mockup sandbox

## Pages

- `/` — Homepage (hero, about, featured products, logo marquee, contact form)
- `/shop` — Product listing with category filters (Rings, Earrings, Necklaces, Bracelets, Trending, Accessories)
- `/product/:slug` — Product detail page (uses WooCommerce slug)
- `/checkout` — Checkout page with order summary
- `/terms` — Terms of Service (UAE legal content)

## Architecture

- **API Proxy**: Frontend fetches `/api/wc/products` etc., Vite dev server proxies to Express API server on port 8080
- **WooCommerce Integration**: API server uses `WC_CONSUMER_KEY` and `WC_CONSUMER_SECRET` env vars to authenticate with WooCommerce REST API
- **Category Filtering**: Only jewelry categories shown (rings, earrings, necklaces, bracelets, trending, accessories) — demo/test categories (furniture, toys, cooking, clocks, lighting) are filtered out on the frontend
- **WC Store URL**: Set via `WC_STORE_URL` env var (currently admin.mirruba-jewellery.com, will switch to mirruba-jewellery.com for production)

## Environment Variables

- `WC_CONSUMER_KEY` — WooCommerce API consumer key (secret)
- `WC_CONSUMER_SECRET` — WooCommerce API consumer secret (secret)
- `WC_STORE_URL` — WooCommerce store base URL
- `SESSION_SECRET` — Express session secret

## Features

- Shopping cart with slide-over drawer (React Context)
- Real product data from WooCommerce (27 products with images)
- Category filtering on shop page (jewelry only)
- Product detail with image gallery, sale badges, stock status
- Contact form (toast on submit)
- Responsive design with mobile menu
- Scroll animations and hover effects
- Gold/luxury color theme
- AED currency formatting

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/mirruba-jewellery run dev` — run website locally
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Brand Info

- **Brand**: Mirruba Jewellery
- **Location**: Sharjah, Emirates, Central Market
- **Phone**: +971 501 045 496
- **Email**: contact@mirruba-jewellery.com
- **Currency**: AED (UAE Dirham)
