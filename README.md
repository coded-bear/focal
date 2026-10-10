<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/brand/focal-wordmark-dark.svg" />
    <img src="public/brand/focal-wordmark.svg" alt="Focal" width="240" />
  </picture>
</p>

<p align="center">A free, one-page RSVP speed reader.</p>

Focal shows text one word at a time at a fixed point and highlights each word's optimal recognition point (ORP), so the eye does not travel along a line. A demo text plays on load at 300 WPM; paste your own text to read it in the same place. The text is processed entirely in the browser and is never stored or sent anywhere.

- Play/pause, restart, sentence skip, scrubbing, 100–1000 WPM
- Paste dialog with word count and time estimate
- Polish and English, light and dark themes
- No accounts, no backend, no analytics

## Development

Requires Node.js 22 and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Script              | What it does                          |
| ------------------- | ------------------------------------- |
| `pnpm dev`          | Start the dev server                  |
| `pnpm build`        | Production build; also the type check |
| `pnpm start`        | Serve the production build            |
| `pnpm lint`         | Run ESLint                            |
| `pnpm format`       | Format all files with Prettier        |
| `pnpm format:check` | Check formatting without writing      |

### Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui on Base UI.
