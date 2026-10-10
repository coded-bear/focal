---
paths:
  - "src/**/*.{ts,tsx}"
  - "src/i18n/**"
---

# Code conventions

## TypeScript

- Never write `any`, neither as an annotation nor through `as any`, even when the TypeScript or ESLint config would accept it. Use `unknown` and narrow it, a generic, or the type the library exports.
- Do not silence the type checker: no `@ts-ignore`. `@ts-expect-error` is allowed only with a comment saying why.
- Narrow with a type guard instead of casting, as `hasLocale` in `src/i18n/config.ts` does.
- Derive types from values: declare the data `as const` and take the type from it (`locales` → `Locale`, `pl.json` → `Dictionary`). Do not write a union by hand next to the list it describes.
- Import types with `import type` or an inline `type` specifier.
- A type used by more than one module goes to `src/types/index.ts`; a type used by one module stays in it.

## Naming and exports

- Files: PascalCase for components, camelCase for everything else (`utils.ts`, `formatDate.ts`). Route folders are kebab-case, since they become URL segments.
- Variables, functions and constant objects: camelCase (`paths`, `siteConfig`, `defaultLocale`). Types and interfaces: PascalCase.
- Use named exports. Default exports only where Next.js requires them (`page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts`).
- Do not add barrel files that re-export a whole category (`components/common/index.ts`). The per-component `index.ts` is the only re-export.

## Imports

- Order: external packages, `@/` modules, relative imports, styles.
- Use relative imports only for files in the same folder (`./config`); reach everything else through `@/`.

## Routing and pages

- `page.tsx` and `layout.tsx` stay thin: read the dictionary, compose sections, pass strings down.
- Type route props with the global `PageProps<"/[lang]/...">` and `LayoutProps<"/[lang]/...">` helpers and `await` `params`, as `src/app/[lang]/layout.tsx` does.
- Get the current locale with `await lang()` from `next/root-params`. It works only in Server Components; pass the locale to Client Components and Server Actions as a prop or argument.
- Mutations (contact form, newsletter signup) are Server Actions and validate their input on the server. Route Handlers are only for webhooks and endpoints called from outside the site.

## SEO and metadata

- Use the Metadata API, never manual `<head>` tags. Titles and descriptions are user-facing text, so they come from the dictionary through `generateMetadata`, not a static `metadata` object.
- Every page has its own `title` and `description` in every locale; shareable pages also set Open Graph title, description and image.
- Every page sets `alternates.canonical` and `alternates.languages` for all locales; the root layout sets `metadataBase` from `siteConfig.url`.
- Language-independent SEO values (site URL, social handles) live in `src/config/site.ts`.

## i18n

- User-facing text never goes into components, `config/` or `constants/`.
- `getDictionary()` from `@/i18n/dictionaries` takes no arguments; the locale comes from `next/root-params`.
- Locales: `pl` (default) and `en`. Adding a locale means one new JSON file, an entry in `i18n/config.ts` and an entry in the `dictionaries` map in `i18n/dictionaries.ts`.
- Keys are camelCase and grouped by page or section (`home.title`).
- Never compare against a `"pl"` or `"en"` literal; use `locales`, `defaultLocale` and `hasLocale` from `@/i18n/config`.

## File size

- Split a file when it does more than one job. Around 150 lines is the signal to check.
