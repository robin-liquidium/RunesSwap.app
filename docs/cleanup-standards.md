# Cleanup Standards

This document captures architecture constraints introduced in the cleanup refactor.

## Routing

- Use canonical routes for tabs:
  - `/swap`
  - `/borrow`
  - `/runes-info`
  - `/your-txs`
  - `/portfolio`
- Do not use query-param-driven tab navigation.
- Do not use custom browser events for cross-tab navigation.

## Imports

- Do not import from internal barrel paths:
  - `@/lib/api`
  - `@/components/swap`
- Import directly from the concrete module path instead.

## Query Keys

- Use centralized `queryKeys` factory from `@/lib/queryKeys`.
- Avoid ad-hoc string query keys in hooks/components.

## File Size

- Keep TypeScript modules below 250 lines unless explicitly waived.
- Temporary waivers must include `@architecture-waiver oversized` in the file.

## Checks

- Run `bun run lint:architecture` locally before opening PRs.
- CI enforces this rule set on `pull_request` and `main` builds.
