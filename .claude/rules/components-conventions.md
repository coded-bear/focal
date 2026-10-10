---
paths:
  - "src/components/**"
  - "src/app/**/_components/**"
  - "src/app/**/*.tsx"
  - "src/app/globals.css"
---

# Component conventions

## Where a component goes

- Used by one route only: `src/app/[lang]/<route>/_components/`.
- Used by more than one route: `src/components/`, in the category listed in `CLAUDE.md` (`common/`, `sections/`, `layout/`).
- `ui/` holds shadcn/ui primitives only; keep the files flat and named as the CLI generates them.
- Import direction: `common/` may import from `ui/`; `layout/` and `sections/` may import from both; never the other way round.
- Section components end with `Section` (`HeroSection`, `PricingSection`).

## One folder per component

Applies to every component outside `ui/`. The folder, the component file and the types file share one PascalCase name, identical to the exported component name.

```
UserProfile/
├── UserProfile.tsx        ← export const UserProfile = ...
├── UserProfile.types.ts   ← only when types go beyond the main Props interface
├── UserProfile.schema.ts  ← only for forms: Zod schema shared by the form and the action
├── UserProfile.actions.ts ← only for forms: "use server" Server Actions
└── index.ts               ← export { UserProfile } from "./UserProfile"
```

- Import a component through its folder: `@/components/common/UserProfile`.
- Private sub-components and component-scoped hooks live in the same folder and take the parent's name as a prefix (`UserProfileAvatar.tsx`, `useUserProfile.ts`). Do not export them from `index.ts`.
- When a second parent needs a sub-component, move it to its own folder. A hook used by more than one component goes to `src/hooks/`.

## Styling

- Use tokens (`bg-background`), not arbitrary values (`bg-[#0a0a0a]`); add a token to `@theme` in `src/app/globals.css` first.

## Server and Client Components

- Components are Server Components by default. Add `"use client"` only for hooks, event handlers or browser APIs, and on the smallest component that needs it: everything it imports becomes client code too.
- Load heavy client-only components (maps, players, carousels) with `next/dynamic`.

## Images

- Import local files statically so width, height and the blur placeholder are set for you; remote images need `width` and `height`, or `fill` inside a sized parent.
- Set `sizes` on every image that is responsive or uses `fill`.

## Accessibility (WCAG 2.2 AA)

- Images need `alt` text taken from the dictionary; decorative images use `alt=""`.
