# RunesSwap Coding Guide

This file provides instructions for automated coding agents (Codex or Claude) working with the **RunesSwap.app** repository.

## Overview

RunesSwap.app is a TanStack Start application written in **TypeScript**. It offers a swap and borrowing interface for Bitcoin Runes with a Windows‑98 style theme. The app integrates several external services:

* **Ordiscan** for on‑chain UTXO and Rune data
* **SatsTerminal** for swap execution and PSBT handling
* **Liquidium** for borrowing and loan management
* **Supabase** for storage of rune information and market data
* **mempool.space** for BTC price data
* **mempool.space** for fetching recommended Bitcoin fee rates

The main source code lives in `src/` and uses TanStack Router.
API handlers under `src/server/api` act as a thin backend to proxy and cache requests to the above services. Server data is fetched with React Query, and client state is handled by Zustand. Type definitions are organised under `src/types`.

## Repository Layout

```text
/ (repo root)
├── src/                 # Application source code
│   ├── routes/          # TanStack Router pages and server route adapters
│   ├── server/api/      # API business handlers
│   ├── app/             # Shared providers, styles, and error UI
│   │   ├── globals.css  # Global styles (Win98 theme)
│   │   └── ...
│   ├── components/      # React components (SwapTab, BorrowTab, etc.)
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # API client utilities, data helpers
│   │   └── api/         # Service-specific API modules
│   ├── store/           # Zustand stores
│   ├── types/           # Shared TypeScript types
│   └── utils/           # Helper functions
├── public/              # Static assets and fonts
└── ...                  # Config files and scripts
```

A `.env.example` file shows all environment variables needed for development. Important variables include:

* `SATS_TERMINAL_API_KEY`
* `ORDISCAN_API_KEY`
* `RUNES_FLOOR_API_KEY`
* `LIQUIDIUM_API_KEY` (server-side only)
* `SUPABASE_URL`
* `SUPABASE_ANON_KEY`

**Security Note:** Never use `VITE_` prefix for sensitive API keys as it exposes them to the client-side. Use server-side environment variables for authentication tokens.

## Numeric Precision

For precise financial calculations involving Bitcoin runes and large token amounts, use **big.js**:

* **When to use**: Any calculations involving token amounts, prices, or financial values that require decimal precision
* **Where to use**: Token amount formatting, price calculations, portfolio calculations
* **Import**: `import Big from 'big.js';`
* **Examples**: `FormattedRuneAmount.tsx`, portfolio calculations, swap amount processing

## Development

Install dependencies and start the development server with **bun**:

```bash
bun install
bun run dev
```

The app runs at `http://localhost:3000`.
To build and run in production mode:

```bash
bun run build
bun run start
```

## Testing and Linting

* Unit tests use **Jest** with `@swc/jest` and a jsdom environment that exposes native Request and Response objects:

  ```bash
  bun run test
  ```
* Linting and formatting use **Biome**:

  ```bash
  bun run lint
  ```

The pre-commit hook runs `lint-staged`; the pre-push hook runs the full `ai-check` pipeline. Use Conventional Commits for commit messages.

## Architecture Notes

* Uses **TanStack Router** file routes and TanStack Start server handlers.
* API routes wrap external services and return standardized responses via helpers in `src/lib/apiUtils.ts`.
* API client methods are organized into modules under `src/lib/api/`.
* React components under `src/components` implement the swap, borrow, portfolio and info tabs.
* State is managed with React Query (server data) and Zustand (client state); shared contexts live in `src/context`.
* Path alias `@/*` resolves to `./src/*` (configured in `tsconfig.json` and Jest).
* Styles use CSS Modules plus global variables for the Windows 98 theme.
* The README is rendered through `src/routes/docs.tsx` for in‑app documentation.

## Data Flows

### Typical Data Flow

1. A UI component fetches data using React Query.
2. The query calls a helper from the matching service module in `src/lib/api/` (e.g. `ordiscan.ts`, `liquidium.ts`, `satsTerminal.ts`), imported directly.
3. The client sends a request to a TanStack Start API route under `src/server/api`.
4. The API route fetches data from Ordiscan, SatsTerminal, or Liquidium, optionally caching results in Supabase, and returns a standardized JSON response.
5. The UI updates based on the React Query result.

### Swap Flow

1. User selects input/output assets and amount.
2. A quote is fetched from SatsTerminal.
3. The user confirms and signs the PSBT with the LaserEyes wallet.
4. The transaction is broadcast to the Bitcoin network.

### Borrow Flow

1. User chooses a Rune for collateral.
2. User enters amount and loan terms.
3. A quote is fetched from Liquidium.
4. After confirmation and signing, the loan is issued on‑chain.

## Component Guidelines

Stateful logic lives in custom hooks under `src/hooks`; reusable UI pieces live in `src/components`. Keep files in `src/` at 250 lines or fewer (`bun run lint:architecture` enforces it): split a growing component into a hook plus smaller components. `usePriceChart` + `TimeframeSelector`/`PriceTooltip` and `useAssetSearch` + `AssetSelectorDropdown` are examples of this split.

# API Reference

Read [the API reference](docs/agent-api-reference.md) when working on the documented API routes, request/response shapes, or their consumers.

# General Instructions
* Consult current official documentation when introducing or changing library/API integration behavior, upgrading dependencies, or resolving uncertain or version-sensitive behavior. Use Context7 when available, otherwise official documentation directly. Routine edits that preserve an established local pattern do not require a fresh lookup. Do not guess APIs.
* Keep solutions simple and avoid duplicating logic (KISS, DRY).
* Run `bun run ai-check` after every bigger change.
* Use the supabase tools to interact with our database!
* SatsTerminal SDK is very aggressive with rate-limiting, we shouldn't increase the amount of queries we're doing to SatsTerminal!
* Changelog discipline: For any noticeable change (new feature, significant refactor, important fix), add an entry under `## [Unreleased]` in `CHANGELOG.md`.
  * If `[Unreleased]` does not exist, create it at the top and use Keep a Changelog categories (Added/Changed/Fixed/Removed/Security).
  * If it exists, append your items under the relevant category.
  * Do not bump the version or convert `Unreleased` to a dated release in feature PRs — that happens in the release PR.
