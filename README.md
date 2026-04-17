# RunesSwap.app

[![Release](https://img.shields.io/github/v/release/ropl-btc/RunesSwap.app)](https://github.com/ropl-btc/RunesSwap.app/releases)

A Uniswap‑style swap interface for Bitcoin Runes, built with Next.js, TypeScript, and the SatsTerminal SDK, styled in a classic Windows 98 UI theme.

## Features
- Seamless on‑chain swapping of Bitcoin Runes via SatsTerminal SDK.
- Wallet connection and transaction signing with Laser Eyes (non‑custodial).
- UTXO and Rune balance data fetched securely via Ordiscan.
- Responsive design with dynamic imports, caching, and optimized bundle splitting.
- Windows 98–style UI using CSS Modules and global CSS variables.
- Strict TypeScript safety, Biome linting/formatting, and Git hooks for code quality.

## Tech Stack
- Next.js 16 (App Router) with React 19 Strict Mode
- TypeScript (strict)
- CSS Modules & global CSS variables (Windows 98 theme)
- SatsTerminal swaps SDK (`@satsterminal-sdk/swaps`) & Laser Eyes (`@omnisat/lasereyes`)
- TanStack Query v5 & Zustand
- Supabase (public URL/anon key client‑side only)
- Ordiscan SDK for on‑chain data
- Biome (lint + format), Husky + lint‑staged

## Getting Started
### Prerequisites
- Bun v1.3+
- Node.js v22+ (for runtime/tooling compatibility where needed)

### Environment Variables
Create a `.env.local` file in the project root with:
```dotenv
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
ORDISCAN_API_KEY=<your-ordiscan-api-key>
SATS_TERMINAL_API_KEY=<your-satsterminal-api-key>
LIQUIDIUM_API_URL=<liquidium-server-url>
LIQUIDIUM_API_KEY=<your-liquidium-api-key>
NEXT_PUBLIC_QUOTE_MOCK_ADDRESS=34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo # optional: enables pre-connection quotes
```

`LIQUIDIUM_API_URL` and `LIQUIDIUM_API_KEY` are used on the server only to
authenticate with Liquidium's API. Never expose service keys to the client.
Client-facing third-party requests such as BTC price fetches are proxied
through local API routes where appropriate to reduce browser-side failures.

### Query & Caching Defaults
- Central `QueryClient` in `src/lib/queryClient.ts` with sensible defaults
  (retry, staleTime, gcTime, no refetchOnWindowFocus). Use key factories from
  `src/lib/queryKeys.ts`. Prefer `useSuspenseQuery` for read‑only components
  and wrap with error/suspense boundaries at the tab/page level.

### Logging
Use `src/lib/logger.ts` instead of `console.*`. Add `operation` context in APIs
and avoid PII.

### Installation & Development
```bash
# Clone repository
git clone https://github.com/your-username/runesswap.app.git
cd runesswap.app

# Install dependencies
bun install

# Start development server
bun run dev
```

Visit http://localhost:3000 to explore the app.

## Building & Deployment
```bash
# Build for production
bun run build

# Start the production server
bun run start
```

Deploy on Vercel or any Node.js‑capable host and configure the same environment variables.

## How to Use
1. **Connect Your Wallet**  
   Click **Connect Wallet** and authorize via Laser Eyes. Your Bitcoin address and signature interface will be loaded.
2. **Select Runes to Swap**  
   Choose input and output Runes from the dropdowns, and enter the amount to trade.
3. **Review Swap Details**  
   Confirm rates, fees, and expected output. Adjust slippage tolerance if needed.
4. **Confirm & Approve**  
   Submit the transaction and approve it in your wallet. The swap executes on Bitcoin's blockchain using inscriptions.
5. **Track Your Transactions**  
   View your swap history under **Your TXs**, including pending and completed transactions.

## FAQ
**What are Bitcoin Runes?**  
Bitcoin Runes is a token standard on Bitcoin enabling transfer of fungible assets via inscriptions. Runes maximize efficiency while leveraging Bitcoin's security and decentralization.

**How are Runes different from Ordinals?**  
Ordinals inscribe arbitrary data onto sats, whereas Runes specifically encode fungible token transfers, reducing on‑chain data bloat.

**Are swaps instant?**  
Swaps depend on Bitcoin network confirmations (typically 10 minutes–1 hour). Your wallet will show transaction status once broadcast.

**What fees apply?**  
RunesSwap.app charges no additional fees beyond SatsTerminal network fees and standard Bitcoin miner fees. You receive near‑optimal rates directly on‑chain.

## Liquidium SDK Generation

When Liquidium publishes a new OpenAPI spec, regenerate the typed client:

```bash
bun run gen:liquidium-sdk
```

This reads `liquidium-openapi/liquidium-instant-loan-api.yaml` and outputs the SDK to `src/sdk/liquidium`. Biome and Jest ignore this folder, so no manual changes are required after regeneration.

## Contributing

Contributions are welcome via pull requests. The Git hooks run `lint-staged` on
pre-commit and the full `bun run ai-check` pipeline on pre-push. Please ensure:
- Code builds successfully (`bun run build`).
- Linting & formatting pass (`bun run lint` and `bun run format:check`).
- Dead code checks pass (`bun run knip`).
- New features include tests and documentation updates.

## License

MIT © RunesSwap.app
