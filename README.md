# Next.js Website Starter

A starter for multilingual websites built on the Next.js App Router.

## What's included

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4 with a `cn()` helper
- shadcn/ui on Base UI
- i18n: `pl` (default) and `en`, routes under `/[lang]`, JSON dictionaries, redirect based on `Accept-Language`
- Generated `/sitemap.xml` and `/robots.txt`
- ESLint, Prettier and GitHub Actions CI
- Agent setup: `CLAUDE.md`, Claude Code settings, Impeccable

## Getting started

Requires Node.js 22 and pnpm.

```bash
pnpm dlx degit coded-bear/nextjs-website-starter my-site
cd my-site
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). It redirects to `/pl` or `/en` depending on your browser language.

Other scripts: `pnpm build`, `pnpm start`, `pnpm lint`, `pnpm format`, `pnpm format:check`.

## How to

- **Add text**: add the key to every file in `src/i18n/dictionaries/`, then read it with `getDictionary()`.
- **Add a page**: create `src/app/[lang]/<route>/page.tsx` and add the path to `paths` in `src/constants/index.ts`. The sitemap is built from that list.
- **Add a locale**: add a JSON file in `src/i18n/dictionaries/`, then register it in `src/i18n/config.ts` and `src/i18n/dictionaries.ts`.

The folder layout is in [CLAUDE.md](CLAUDE.md); the detailed conventions are in `.claude/rules/`.

## Agent setup

These tools are used by `CLAUDE.md` but are not declared in this repo, so install them once:

- **Context7** (user-level MCP server): `claude mcp add --scope user --transport http context7 https://mcp.context7.com/mcp`
- **playwright-cli** (browser testing): `npm install -g @playwright/cli@latest`
- **shadcn skill** (user-level agent skill): `pnpm dlx skills add shadcn/ui --skill shadcn --agent claude-code -g`
- **Impeccable** (Claude Code plugin, declared in `.claude/settings.json`): Claude Code offers to install it when you trust this folder. Manual fallback: `/plugin marketplace add pbakaus/impeccable`, then `/plugin` → Discover → Impeccable. Update from the `/plugin` menu. Do not also run `npx impeccable install` here: it duplicates the skill. Run the detector without an agent with `npx impeccable detect src/`.

## Before going live

Replace the placeholders: `siteConfig.url` in `src/config/site.ts`, `metadata` in `src/app/[lang]/layout.tsx`, `src/app/favicon.ico` and `name` in `package.json`.

## CI

GitHub Actions runs `pnpm format:check`, `pnpm lint` and `pnpm build` on every pull request and on pushes to `main`.
