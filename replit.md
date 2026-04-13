# Mirruba Jewellery Website

## Overview

Luxury jewellery e-commerce website for Mirruba Jewellery, based in Sharjah, UAE (Central Market). Built as a React + Vite frontend-only application with no backend required.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS v4
- **Routing**: wouter
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: lucide-react
- **Fonts**: Cormorant Garamond (serif headings), Inter (sans body)
- **State Management**: React Context (Cart)

## Project Structure

- `artifacts/mirruba-jewellery/` — Main website artifact (React + Vite)
  - `src/pages/` — Page components (Home, Shop, ProductDetail, Checkout)
  - `src/components/` — Shared components (Navbar, Footer, CartDrawer, ProductCard)
  - `src/context/` — Cart context provider
  - `src/data/` — Hardcoded product data and helpers
  - `src/components/ui/` — shadcn/ui components
- `artifacts/api-server/` — Express API server (unused for this project)
- `artifacts/mockup-sandbox/` — Design mockup sandbox

## Pages

- `/` — Homepage (hero, about, featured products, logo marquee, contact form)
- `/shop` — Product listing with category filters (Rings, Earrings, Necklaces, Bracelets)
- `/product/:id` — Product detail page
- `/checkout` — Checkout page with order summary

## Features

- Shopping cart with slide-over drawer (React Context)
- Category filtering on shop page
- Contact form (toast on submit)
- Responsive design with mobile menu
- Scroll animations and hover effects
- Gold/luxury color theme

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/mirruba-jewellery run dev` — run website locally

## Brand Info

- **Brand**: Mirruba Jewellery
- **Location**: Sharjah, Emirates, Central Market
- **Phone**: +971 501 045 496
- **Email**: contact@mirruba-jewellery.com
- **Currency**: AED (UAE Dirham)
