# ShopScoop — Amazon Affiliate Showcase & Admin Portal

A responsive, high-converting Amazon affiliate showcase web application built with modern HTML5, Tailwind CSS, modular Vanilla JavaScript, and Firebase Firestore / Analytics.

## Features

- **Storefront & Catalog**:
  - Curated deals with deal of the day highlight.
  - Multi-category filtering and real-time live search.
  - Formatted in Indian Rupees (₹ INR) with standard Indian numbering.
  - Amazon-styled call-to-action buttons with click tracking.
  - Social proof badges (*Trending*, *Editor's Choice*, *Best Value*, *Best Seller*, *New Arrival*).
  - Compliant Amazon Associates earnings disclaimer.

- **Admin Portal (`/#/admin`)**:
  - Secure credential-based login.
  - In-depth **Analytics & Revenue** dashboard:
    - Total Traffic & Estimated Conversions.
    - Gross Sales Volume (GMV) & Estimated Commissions in ₹.
    - Category Traffic Distribution progress bars.
    - Social proof badge engagement matrix.
    - Product-by-product performance ranking table.
    - One-click CSV analytics report export.
  - Product management (Add, In-line Edit, Delete with confirmation).
  - Real-time Amazon affiliate URL tag validation (`tag=`).
  - Interactive live preview card before publishing.
  - Multi-admin management with self-deletion prevention.

- **Dual-Mode Persistence Layer**:
  - **Firebase Firestore**: Cloud synchronization and real-time snapshot listeners.
  - **Local Demo Fallback**: Works offline with `localStorage` if cloud credentials are not active.
  - **Firebase Analytics**: Tracks affiliate link clicks (`select_item`).

## Tech Stack

- **HTML5 & Vanilla JavaScript**: Modular architecture with IIFE modules (`Store`, `Components`, `Admin`, `App`).
- **Tailwind CSS v4 & Vanilla CSS**: Modern dark theme, glassmorphism, micro-animations, and skeleton loading states.
- **Firebase**: Firestore Database, Google Analytics, and Firebase Hosting.
- **Lucide Icons**: Crisp vector UI icons.

## Quick Start

1. Open `index.html` in any browser or run a local server:
   ```bash
   npx -y serve@latest -l 3000
   ```
2. Navigate to `http://localhost:3000/#/`.
3. Access the Admin Portal at `http://localhost:3000/#/admin`.

## Deploy to Firebase Hosting

```bash
# 1. Log in to Firebase
firebase login

# 2. Deploy to hosting
firebase deploy --only hosting
```
