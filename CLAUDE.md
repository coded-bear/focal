<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project

Starter for multilingual websites: Next.js App Router, React, TypeScript, Tailwind CSS v4, shadcn/ui on Base UI (not Radix, so no `asChild`).

# Commands

- Use pnpm on Node.js 22, never npm or yarn. Scripts are in `package.json`.
- There is no test runner and no typecheck script; `pnpm build` is the type check. Do not add tests unless asked.
- Before calling work done, run `pnpm lint` and `pnpm build`. Do not run Prettier yourself; a Stop hook formats changed files.
- `PageProps`, `LayoutProps` and `next/root-params` types are generated into `.next/types/`. If they are reported missing, run `pnpm build`; do not write them by hand.
- For UI changes, run `pnpm dev` and check `http://localhost:3000/pl` and `/en` with `playwright-cli`. Its output goes to `.playwright-cli/`; read those files instead of printing page trees.

# Architecture

- Every route lives under `src/app/[lang]/`. `[lang]/layout.tsx` is the root layout; there is no `src/app/layout.tsx`.
- `src/proxy.ts` redirects paths without a locale to `/pl` or `/en`. Do not add `middleware.ts`.
- All user-facing text lives in `src/i18n/dictionaries/*.json`. `pl.json` defines the `Dictionary` type, so every locale needs the same keys or the build fails.
- `await getDictionary()` works only in Server Components. Pass strings and the locale to Client Components as props.
- A new page needs an entry in `paths` in `src/constants/index.ts`; the sitemap is built from it. Build internal links from `paths` and the current locale, never from a hardcoded URL.
- Tailwind v4 has no `tailwind.config`. Design tokens live in `@theme` in `src/app/globals.css`; merge classes with `cn()`, imported from `@/lib/utils` in your own components. Files in `ui/` stay as the shadcn CLI generates them.
- Add shadcn/ui components with `pnpm dlx shadcn@latest add <name>`, never by hand.

# Structure

Import through the `@/` alias, which points to `src/`. Do not add top-level folders under `src/` without asking.

```
src/
├── app/[lang]/    routes; route-private components in `_components/`
├── components/
│   ├── ui/        shadcn/ui primitives only
│   ├── common/    reusable composites (Logo, LanguageSwitcher)
│   ├── layout/    page frame, used once (Header, Footer)
│   └── sections/  page blocks (HeroSection)
├── i18n/          locale config, `getDictionary`, dictionaries
├── config/        site URL and SEO data
├── constants/     `paths` and other language-independent constants
└── lib/, hooks/, types/
```

Detailed conventions are in `.claude/rules/` and load when you touch matching files. Read the matching one before creating a new component or route.

# Dependencies

Check `package.json` before adding a dependency. When a task needs one, prefer: Zod (validation), React Hook Form (forms), Motion (animation), Lucide (icons), React Email with Resend (email), native `Intl` for dates. Avoid lodash and moment.

# Docs and commits

- For Next.js, read `node_modules/next/dist/docs/` instead of Context7; those docs match the installed version.
- Commit messages use `<emoji> <type>: <description>`; types are in `.claude/commands/commit-message.md`.
