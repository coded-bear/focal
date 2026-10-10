# Focal — build brief

Focal is a one-page site for RSVP speed reading. This brief is the single source for building it on top of the starter in this repo. Where it is silent, follow `CLAUDE.md` and `.claude/rules/`.

Assets referenced here are in `docs/assets/`:

| File                 | Use                                                                 |
| -------------------- | ------------------------------------------------------------------- |
| `focal-wordmark.svg` | Source for the `Logo` component (paths only, no font dependency)    |
| `focal-mark.svg`     | Source for `src/app/icon.svg` and the apple icon                    |
| `logo-preview.png`   | Reference render of both on light and dark, at large and small size |

## 1. Product

**RSVP** (Rapid Serial Visual Presentation) shows text one word at a time at a fixed point, so the eye does not travel along a line. One letter in each word, the **ORP** (optimal recognition point), is highlighted and always lands on the same spot.

The page does two jobs:

1. **Show it.** On load, the hero plays a short text about speed reading at 300 WPM. The visitor understands the technique by experiencing it, before reading a single line of explanation.
2. **Let them use it.** The visitor pastes their own text and reads it in the same place, with speed and playback controls.

Success is a visitor who watches the demo for a few seconds, pastes something, and keeps reading.

## 2. Scope

**In**

- One route, `/[lang]`, in Polish (default) and English.
- A full-height hero containing the header, the reader and a one- to two-sentence explanation.
- A thin footer below the fold.
- Light and dark themes, following the system by default.
- Paste-your-own-text dialog.
- Logo, favicon, apple icon, Open Graph image, per-locale metadata.

**Out**

- Any second page, account, backend, analytics or storage of the visitor's text.
- File upload, URL import, bookmarking, reading history.
- Sections below the hero other than the footer.
- New dependencies. `motion`, `next-themes`, `zod` and `react-hook-form` are not needed.

## 3. Design direction

### 3.1 Concept: the reticle

Focal is an instrument, not a marketing page. The whole screen is organised around one optical axis: a word sits on a horizontal band, two short ticks mark the column where the eye rests, and the letter in that column is red. Everything else is quiet, neutral and small.

Rules that follow from this:

- **One red thing.** The accent colour is used only for the pivot letter, the two ticks, the `o` in the logo and the progress fill. Buttons, links, focus rings and icons stay neutral.
- **Nothing moves unless it means something.** The word changes instantly. No fades, no parallax, no decorative animation.
- **Technical, not decorative.** Hairlines, monospace readouts (`300 WPM`, `042 / 090`, `0:14`), generous empty space. No gradients, glows, cards, shadows or illustrations.

### 3.2 Logo

Lowercase `focal`, drawn as monoline geometric paths. The `o` is red with a tick above and below it. By the ORP table in section 5.1, `o` is the actual pivot letter of "focal", so the logo is the product applied to its own name.

- `Logo` renders the wordmark inline as SVG so it follows the theme: neutral strokes use `currentColor`, the pivot group uses the `focal` token (`stroke-focal`) instead of the hex in the source file.
- Header size: 28px tall. The viewBox already includes the ticks, so do not crop it.
- The mark (the `o` with ticks on a dark rounded tile) is for icons only.
- The logo links to the current locale's home and has an accessible name from the dictionary.

### 3.3 Typography

| Role                                   | Font       | Notes                                 |
| -------------------------------------- | ---------- | ------------------------------------- |
| Flashing word, readouts, labels, `kbd` | Geist Mono | Monospace makes pivot alignment exact |
| Prose, dialog text, buttons            | Geist Sans |                                       |

- Both fonts are already loaded in `src/app/[lang]/layout.tsx` with `subsets: ["latin"]`. Change both to `["latin", "latin-ext"]`; Polish diacritics need it.
- The word uses weight 500. Labels and readouts are 12px, uppercase, with wide tracking, in `text-muted-foreground`. Use `tabular-nums` on every number that changes.
- The page heading (`h1`) is styled as one of these small labels, not as a display headline. The flashing word is the visual headline.

### 3.4 Colour and tokens

Keep the starter's neutral palette. Add the following to `src/app/globals.css`; do not use arbitrary values in class names.

```css
:root {
  color-scheme: light;
  --focal: oklch(0.58 0.23 27); /* #e3121e, 4.81:1 on --background */
  --focal-foreground: oklch(0.985 0 0);
}

.dark {
  color-scheme: dark;
  --focal: oklch(0.66 0.22 25); /* #fc4447, 5.73:1 on --background */
  --focal-foreground: oklch(0.145 0 0);
}

@theme inline {
  --color-focal: var(--focal);
  --color-focal-foreground: var(--focal-foreground);
  --text-word: clamp(1.75rem, 8vw, 5.5rem);
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Both accent values pass WCAG AA (4.5:1) against their background.

### 3.5 Motion

- Word changes: instant, no transition.
- Controls, tooltips, dialog: 150–200ms, `ease-out-quint`, opacity and transform only.
- Progress fill: updates per word, no easing (it should tick, not glide).
- Under `prefers-reduced-motion: reduce`, remove the transitions above and do not autoplay (section 5.5).

## 4. Layout

The hero is `min-h-svh` and contains the header. The footer sits directly below it, so on load the visitor sees only the hero.

### 4.1 Desktop (≥ 768px)

```
┌────────────────────────────────────────────────────────────────────┐
│  focal                                              PL · EN    ◐   │  header, 64px
│                                                                    │
│                                                                    │
│                SPEED READING, ONE WORD AT A TIME                   │  h1 as label
│                                                                    │
│  ────────────────────────────────┬───────────────────────────────  │  hairline + tick
│                                                                    │
│                              presentation                          │  word, pivot "s"
│                                 ↑ pivot column = centre            │  on the centre
│  ────────────────────────────────┴───────────────────────────────  │  hairline + tick
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  progress, 2px
│  DEMO   042 / 090                                          0:14    │  readouts
│                                                                    │
│          ↺     ( ▶ )     −  300 WPM  +        [ Paste text ]       │  control rail
│                                                                    │
│      RSVP shows text one word at a time at a fixed point, so       │  explanation,
│      your eyes never travel along a line. The red letter marks     │  max 2 lines,
│      where to look.                                                │  max-w ~56ch
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
   © 2026 Focal · Your text never leaves your browser.   Space ← → ↑ ↓   footer
```

- Content column: `max-w-3xl`, centred, with 24px side padding. The stage hairlines span the column.
- The stage (the band between the hairlines) has a fixed height of about 2.2× the word size, so nothing shifts when words change.
- The block from the heading to the explanation is vertically centred in the space under the header.

### 4.2 Mobile (< 768px)

```
┌──────────────────────────┐
│ focal          PL·EN  ◐  │
│                          │
│  SPEED READING, ONE WORD │
│        AT A TIME         │
│ ────────────┬─────────── │
│        presentation      │
│ ────────────┴─────────── │
│ ▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░ │
│ DEMO 042 / 090      0:14 │
│                          │
│      ↺    ( ▶ )          │
│     −  300 WPM  +        │
│     [ Paste text ]       │
│                          │
│  RSVP shows text one     │
│  word at a time …        │
└──────────────────────────┘
```

- Side padding 16px. The control rail wraps into rows; the paste button is full width.
- The keyboard-shortcut legend in the footer is hidden on touch layouts.
- Check at 360px wide: no horizontal scroll, and the longest demo word fits (section 5.2).

### 4.3 Header and footer

- **Header:** logo left; language switcher and theme toggle right. Transparent, no border, not sticky.
- **Language switcher:** the locale codes in uppercase mono, generated from `locales` (`PL · EN`). The current one is `text-foreground` with `aria-current="true"`, the other `text-muted-foreground`. Each is a `Link` built from `paths.home` and the locale, with `hrefLang`. It can be a Server Component.
- **Theme toggle:** one ghost icon button (Lucide `Sun` / `Moon`), see section 7.
- **Footer:** one line, 12px, muted, top hairline: copyright, the privacy sentence, and on desktop the shortcut legend built with `kbd`.

## 5. Reader

### 5.1 Tokens and the pivot letter

Split the text on whitespace into tokens. Keep punctuation attached to its word for display. Remember which tokens end a sentence and where paragraph breaks (blank lines) fall.

The pivot index is computed on the token's **core**: the token with leading and trailing punctuation stripped, counted in Unicode code points (so `ł`, `ś`, `ż` count as one).

| Core length | Pivot index (0-based) |
| ----------- | --------------------- |
| 1           | 0                     |
| 2–5         | 1                     |
| 6–9         | 2                     |
| 10–13       | 3                     |
| 14+         | 4                     |

Examples: `to` → `o`, `focal` → `o`, `reading` → `a`, `czytanie` → `y`, `presentation` → `s`. Leading punctuation shifts the pivot's position in the displayed string accordingly (`"hello` pivots on `e`).

Edge cases:

- Split tokens at hyphens, en/em dashes and slashes when the parts are each at least 2 characters, keeping the separator on the first part (`state-of-the-art` → `state-`, `of-`, `the-`, `art`).
- A token that is only punctuation or digits is shown as is, pivot index by the same table.
- Collapse repeated whitespace; ignore empty tokens.

### 5.2 Stage

The word is rendered in three parts: before the pivot, the pivot, after the pivot. Lay them out so the **pivot letter is always horizontally centred on the stage**, for example a three-column grid `1fr auto 1fr` with the first part right-aligned and the last left-aligned. The ticks sit on the same centre line, above and below the word, in the `focal` colour; the pivot letter is `text-focal`.

- Font size is `text-word` (28px at 360px wide, up to 88px).
- If the part before or after the pivot is too long for its half of the stage, scale that word down to fit (compute a scale from the character counts and set it through a CSS variable in `style`). The demo texts never need this at 360px: their longest right-hand part is 9 characters.
- Between loops and before the first word, the stage shows the hairlines and ticks only.
- The stage is `aria-hidden`; see section 9 for the accessible alternative.
- Clicking or tapping the stage toggles play/pause.

### 5.3 Timing

Base delay per word is `60000 / WPM` ms (200ms at 300 WPM). Multiply it for the word being shown:

| Condition                     | Multiplier        |
| ----------------------------- | ----------------- |
| Ends with `,` `;` `:`         | × 1.5             |
| Ends with `.` `!` `?` `…`     | × 2               |
| Core longer than 8 characters | + 0.3             |
| Last word of a paragraph      | × 3 (replaces ×2) |

- Drive playback with `requestAnimationFrame` and accumulated elapsed time, not `setInterval`, so the rate does not drift.
- "300 WPM" is the base rate. The time-remaining readout sums the real delays of the remaining words, so it accounts for the pauses.
- When the tab becomes hidden, stop the clock. On return, the demo resumes by itself; a custom text stays paused.

### 5.4 States

| State    | Stage                | Entered by                                     |
| -------- | -------------------- | ---------------------------------------------- |
| Playing  | Words advancing      | Autoplay (demo), play, text submitted          |
| Paused   | Current word, static | Pause, tab hidden (custom text), dialog opened |
| Finished | Last word, static    | End of a custom text                           |

- **Demo:** autoplays 600ms after mount at 300 WPM. At the end it shows the empty stage for 1200ms and loops. The demo runs about 18s in Polish (74 words) and 20s in English (90 words).
- **Custom text:** after the dialog closes, show the first word for 600ms, then play. At the end, enter Finished: the play button becomes replay. It does not loop.
- Changing WPM applies from the next word. It does not restart the text.
- Opening the paste dialog pauses playback; cancelling the dialog restores the previous state.

### 5.5 Controls

Left to right in the rail:

| Control      | Behaviour                                                                           |
| ------------ | ----------------------------------------------------------------------------------- |
| Restart      | Ghost icon button (`RotateCcw`). Back to the first word, keeps the play/pause state |
| Play / pause | The primary button: round, 48px, `Play` / `Pause` icon (`RotateCcw` when Finished)  |
| Slower       | Ghost icon button (`Minus`). −25 WPM                                                |
| WPM readout  | Mono, `300 WPM`, fixed width so the rail does not shift                             |
| Faster       | Ghost icon button (`Plus`). +25 WPM                                                 |
| Paste text   | Outline button with `ClipboardPaste` icon and a visible label                       |

- WPM range is 100–1000 in steps of 25, default 300. Disable the stepper buttons at the limits. Persist the value in `localStorage` under `focal-wpm`; read it after mount so the server render always shows 300.
- **Progress:** a 2px track directly under the stage, filled in `focal`. It is a slider (shadcn `slider`): dragging or clicking scrubs to that word and pauses while dragging. Arrow keys on the focused slider move one word.
- **Readouts** under the track: source (`DEMO` or `YOUR TEXT`), position (`042 / 090`, zero-padded to the total's width), and time remaining (`0:14`) on the right.
- When the source is a custom text, a small "Back to demo" text button appears next to the source label.
- Every icon-only button has a tooltip with its label and shortcut.
- Use the existing `Button` from `src/components/ui/button.tsx`. Its largest size is 36px; set the play button's size with a class on the instance, do not edit the file in `ui/`.

### 5.6 Keyboard shortcuts

| Key       | Action                                |
| --------- | ------------------------------------- |
| `Space`   | Play / pause                          |
| `←` / `→` | Start of the previous / next sentence |
| `↑` / `↓` | Faster / slower by 25 WPM             |
| `R`       | Restart                               |
| `V`       | Open the paste dialog                 |
| `Esc`     | Close the dialog                      |

- Ignore shortcuts while the dialog is open, while focus is in a text field, and when Ctrl, Alt or Meta is held (so `Cmd+V` and `Cmd+R` keep their browser meaning).
- `Space` on a focused button must activate that button once, not also toggle playback.
- `←` within the first 3 words of a sentence goes to the previous sentence; otherwise to the start of the current one.

### 5.7 Reduced motion

With `prefers-reduced-motion: reduce`, do not autoplay. Show the first word of the demo, paused, with the play button ready. Once the visitor presses play, the reader behaves normally: the changing word is the function they asked for.

## 6. Paste dialog

Opened by the "Paste text" button or `V`. Built from shadcn `dialog` and `textarea`.

```
┌────────────────────────────────────────────────┐
│ Read your own text                          ✕  │
│ Paste an article, an email, anything.          │
│                                                │
│ ┌────────────────────────────────────────────┐ │
│ │ Paste or type your text here…              │ │
│ │                                            │ │
│ │                                            │ │
│ └────────────────────────────────────────────┘ │
│ Words: 1 284 · about 4:32 at 300 WPM           │
│                                                │
│ [ Paste from clipboard ]      Cancel  [ Read ] │
│ Your text never leaves your browser.           │
└────────────────────────────────────────────────┘
```

- The textarea is focused on open and has a visible label (the dialog title can label it). About 8 rows, vertically resizable, capped at 60% of the viewport height.
- **Paste from clipboard** calls `navigator.clipboard.readText()` and puts the result in the textarea. If the API is missing or permission is denied, show the inline hint from the dictionary (`paste.clipboardDenied`) and leave focus in the textarea. Hide the button entirely when `navigator.clipboard?.readText` does not exist.
- The word count and estimate update as the text changes; the estimate uses the current WPM and the timing rules from section 5.3. Format numbers with `Intl.NumberFormat` for the locale.
- **Read** is disabled until there is at least one word. On submit: close the dialog, switch the source to the custom text, start from the first word.
- Limit input to 200,000 characters (`maxLength`) and show the dictionary notice when the limit is reached.
- `Cmd/Ctrl+Enter` in the textarea submits.
- Reopening the dialog shows the current custom text so it can be edited.
- The text lives in component state only. Do not write it to `localStorage`, a cookie or the URL, and do not send it anywhere.
- On mobile the dialog is full width with 16px margins and the action buttons stack.

## 7. Theme and language

### Theme

- Dark mode is the existing `.dark` class on `<html>` (see `@custom-variant dark` in `globals.css`). Keep that mechanism.
- Default is the system preference. A manual choice is stored in `localStorage` under `focal-theme` as `light` or `dark`.
- Apply the theme before first paint with a small inline script in the root layout and `suppressHydrationWarning` on `<html>`, as described in `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md` ("Themes"). The guide's example sets a `data-theme` attribute; here the script must add or remove the `dark` class instead. Do not read a cookie in the layout: it would opt the page out of static prerendering.
- `ThemeToggle` is a small client component: it reads the class from `document.documentElement` after mount, flips it, and stores the choice. Its accessible name states the action ("Switch to dark theme"). While no choice is stored, follow live changes of the system preference.
- Do not add `next-themes`.

### Language

- Locales come from `src/i18n/config.ts`. Never compare against a `"pl"` or `"en"` literal.
- The server page reads the dictionary with `getDictionary()` and the locale with `lang()` from `next/root-params`, and passes strings and the locale down as props. Client components never import either.
- Switching language is a normal navigation to the other locale's URL. Theme and WPM survive it (they are in `localStorage`); a pasted text does not, which is acceptable.

## 8. Content

All of this goes into `src/i18n/dictionaries/pl.json` and `en.json` with identical keys, replacing the current `home.title`. Placeholders in braces are filled by a small helper (for example `src/lib/interpolate.ts`). Strings are written to avoid plural forms, so no plural logic is needed.

| Key                       | English                                                                                                                          | Polski                                                                                                                                   |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `metadata.title`          | Focal: RSVP speed reader                                                                                                         | Focal: szybkie czytanie metodą RSVP                                                                                                      |
| `metadata.description`    | Read faster with RSVP. Focal shows text one word at a time at a fixed point and highlights the letter your eye should rest on.   | Czytaj szybciej metodą RSVP. Focal wyświetla tekst słowo po słowie w jednym punkcie i podświetla literę, na której zatrzymuje się wzrok. |
| `metadata.ogAlt`          | The Focal logo: the word focal with a red letter o between two tick marks                                                        | Logo Focal: słowo focal z czerwoną literą o między dwoma znacznikami                                                                     |
| `header.home`             | Focal, home                                                                                                                      | Focal, strona główna                                                                                                                     |
| `header.language`         | Language                                                                                                                         | Język                                                                                                                                    |
| `header.languages.pl`     | Polski                                                                                                                           | Polski                                                                                                                                   |
| `header.languages.en`     | English                                                                                                                          | English                                                                                                                                  |
| `header.themeToDark`      | Switch to dark theme                                                                                                             | Włącz ciemny motyw                                                                                                                       |
| `header.themeToLight`     | Switch to light theme                                                                                                            | Włącz jasny motyw                                                                                                                        |
| `hero.title`              | Speed reading, one word at a time                                                                                                | Szybkie czytanie, słowo po słowie                                                                                                        |
| `hero.description`        | RSVP shows text one word at a time at a fixed point, so your eyes never travel along a line. The red letter marks where to look. | RSVP wyświetla tekst słowo po słowie w jednym punkcie, więc wzrok nie wędruje po linijce. Czerwona litera wskazuje, gdzie patrzeć.       |
| `hero.demoText`           | See below                                                                                                                        | See below                                                                                                                                |
| `reader.play`             | Play                                                                                                                             | Odtwórz                                                                                                                                  |
| `reader.pause`            | Pause                                                                                                                            | Wstrzymaj                                                                                                                                |
| `reader.replay`           | Read again                                                                                                                       | Czytaj ponownie                                                                                                                          |
| `reader.restart`          | Restart                                                                                                                          | Od początku                                                                                                                              |
| `reader.slower`           | Slower                                                                                                                           | Wolniej                                                                                                                                  |
| `reader.faster`           | Faster                                                                                                                           | Szybciej                                                                                                                                 |
| `reader.wpm`              | {value} WPM                                                                                                                      | {value} słów/min                                                                                                                         |
| `reader.speed`            | Reading speed                                                                                                                    | Tempo czytania                                                                                                                           |
| `reader.progress`         | Position in text                                                                                                                 | Pozycja w tekście                                                                                                                        |
| `reader.position`         | {current} / {total}                                                                                                              | {current} / {total}                                                                                                                      |
| `reader.timeLeft`         | Time left: {time}                                                                                                                | Pozostało: {time}                                                                                                                        |
| `reader.sourceDemo`       | Demo                                                                                                                             | Demo                                                                                                                                     |
| `reader.sourceCustom`     | Your text                                                                                                                        | Twój tekst                                                                                                                               |
| `reader.backToDemo`       | Back to demo                                                                                                                     | Wróć do demo                                                                                                                             |
| `reader.paste`            | Paste text                                                                                                                       | Wklej tekst                                                                                                                              |
| `reader.statusPlaying`    | Playing                                                                                                                          | Odtwarzanie                                                                                                                              |
| `reader.statusPaused`     | Paused                                                                                                                           | Wstrzymano                                                                                                                               |
| `reader.statusFinished`   | Finished                                                                                                                         | Koniec tekstu                                                                                                                            |
| `reader.transcript`       | Full text                                                                                                                        | Pełny tekst                                                                                                                              |
| `paste.title`             | Read your own text                                                                                                               | Czytaj własny tekst                                                                                                                      |
| `paste.description`       | Paste an article, an email, anything.                                                                                            | Wklej artykuł, e-mail, cokolwiek.                                                                                                        |
| `paste.placeholder`       | Paste or type your text here…                                                                                                    | Wklej lub wpisz tekst…                                                                                                                   |
| `paste.fromClipboard`     | Paste from clipboard                                                                                                             | Wklej ze schowka                                                                                                                         |
| `paste.clipboardDenied`   | The browser blocked clipboard access. Paste with {shortcut} instead.                                                             | Przeglądarka zablokowała dostęp do schowka. Wklej skrótem {shortcut}.                                                                    |
| `paste.stats`             | Words: {count} · about {time} at {wpm} WPM                                                                                       | Słowa: {count} · około {time} przy {wpm} słów/min                                                                                        |
| `paste.limit`             | Limit reached: the text was cut at {count} characters.                                                                           | Osiągnięto limit: tekst został ucięty do {count} znaków.                                                                                 |
| `paste.submit`            | Read                                                                                                                             | Czytaj                                                                                                                                   |
| `paste.cancel`            | Cancel                                                                                                                           | Anuluj                                                                                                                                   |
| `paste.close`             | Close                                                                                                                            | Zamknij                                                                                                                                  |
| `paste.privacy`           | Your text never leaves your browser.                                                                                             | Twój tekst nie opuszcza przeglądarki.                                                                                                    |
| `footer.copyright`        | © {year} Focal                                                                                                                   | © {year} Focal                                                                                                                           |
| `footer.privacy`          | Your text never leaves your browser.                                                                                             | Twój tekst nie opuszcza przeglądarki.                                                                                                    |
| `footer.shortcuts`        | Shortcuts                                                                                                                        | Skróty                                                                                                                                   |
| `footer.shortcutPlay`     | play / pause                                                                                                                     | start / pauza                                                                                                                            |
| `footer.shortcutSentence` | sentence                                                                                                                         | zdanie                                                                                                                                   |
| `footer.shortcutSpeed`    | speed                                                                                                                            | tempo                                                                                                                                    |

`{shortcut}` is `⌘V` on Apple platforms and `Ctrl+V` elsewhere. Key names in the footer legend (`Space`, arrows) are symbols, not translated text.

### Demo text, English (90 words)

> Speed reading means taking in text faster without losing the thread. On a normal page your eyes do not glide. They hop from point to point, pause, and sometimes hop back. RSVP, short for Rapid Serial Visual Presentation, takes the hopping away. Words arrive one at a time in a single fixed spot, so your gaze can rest. One letter in every word is marked in red. It sits at the optimal recognition point, the place where a word is recognised fastest. Paste your own text below and keep going.

### Demo text, Polish (74 words)

> Szybkie czytanie to przyswajanie tekstu w krótszym czasie bez gubienia wątku. Na zwykłej stronie wzrok nie sunie płynnie. Przeskakuje z punktu do punktu, zatrzymuje się, a czasem wraca. RSVP, czyli Rapid Serial Visual Presentation, usuwa te skoki. Słowa pojawiają się pojedynczo w jednym stałym miejscu, więc oko może odpocząć. W każdym słowie jedna litera jest czerwona. Wyznacza punkt optymalnego rozpoznania, czyli miejsce, w którym wyraz rozpoznajemy najszybciej. Wklej poniżej własny tekst i czytaj dalej.

## 9. Accessibility and performance

Target WCAG 2.2 AA.

- **Pause control (2.2.2):** the demo autoplays for more than 5 seconds, so the pause button must be reachable by keyboard and visible without scrolling. It is.
- **Screen readers:** the stage is `aria-hidden`. Next to it, render the full current text in a visually hidden paragraph labelled by `reader.transcript`. For the demo this is server-rendered, which also puts the text in the HTML for search engines.
- **Status:** announce Playing, Paused and Finished through a polite live region. Do not announce individual words.
- **Names:** every control has an accessible name from the dictionary. The slider exposes its value as text (`42 / 90`).
- **Not colour alone:** the pivot is marked by colour and by the ticks.
- **Focus:** visible focus ring on every interactive element; the dialog traps focus and returns it to the paste button on close.
- **Targets:** at least 24×24px with 8px between them (2.5.8); the play button is 48px.
- **Contrast:** text and the accent meet 4.5:1 in both themes (values in section 3.4). Check `text-muted-foreground` labels at 12px in both themes.
- **Zoom:** usable at 200% zoom and at 320px width without horizontal scrolling.

Performance:

- The page stays statically prerendered for both locales (`generateStaticParams` is already in the layout).
- Only the reader, the theme toggle and the dialog are client code. Header, footer, logo, language switcher and the hero frame are Server Components.
- Updating the word must not re-render the control rail: keep the current index in the smallest component that needs it.
- No layout shift when words, the WPM value or the readouts change.

## 10. SEO and metadata

- Replace the static `metadata` export in `src/app/[lang]/layout.tsx` with `generateMetadata`, reading `metadata.title` and `metadata.description` from the dictionary.
- Set `metadataBase` from `siteConfig.url`, `alternates.canonical` for the current locale and `alternates.languages` for every locale (plus `x-default` pointing at the default locale).
- Open Graph and Twitter: title, description, locale, `siteConfig.name` as site name, and the generated image.
- `src/config/site.ts`: add `name: "Focal"`. The `url` is still the `https://example.com` placeholder; the real domain is an open question (section 13).
- Icons: delete the placeholder `src/app/favicon.ico`; add `src/app/icon.svg` (copy of `docs/assets/focal-mark.svg`) and `src/app/apple-icon.tsx` (180×180, generated with `ImageResponse`, same drawing).
- `src/app/[lang]/opengraph-image.tsx`: 1200×630, background `#0a0a0a`, the wordmark centred at about 420px wide with the `o` in `#fc4447`, and `hero.title` below it in small light text. Draw the wordmark from its SVG paths so no font file is needed for it. `params` is a promise; `await` it. Export `alt` from the dictionary (`metadata.ogAlt`).
- `sitemap.ts` and `robots.ts` already work from `paths` and `locales`; leave them.
- Rename the package in `package.json` from `nextjs-website-starter` to `focal`.

Read the matching files in `node_modules/next/dist/docs/` before writing these (see section 12).

## 11. File map

```
src/
├── app/
│   ├── icon.svg                         new (from docs/assets/focal-mark.svg)
│   ├── apple-icon.tsx                   new
│   ├── favicon.ico                      delete
│   ├── globals.css                      add tokens (section 3.4)
│   └── [lang]/
│       ├── layout.tsx                   generateMetadata, latin-ext, theme script
│       ├── page.tsx                     thin: dictionary → Header, HeroSection, Footer
│       ├── opengraph-image.tsx          new
│       └── _components/
│           ├── HeroSection/             server; heading, Reader, explanation
│           └── Reader/                  client island
│               ├── Reader.tsx           composition and state
│               ├── Reader.types.ts
│               ├── ReaderStage.tsx      word, pivot, ticks
│               ├── ReaderControls.tsx   rail
│               ├── ReaderProgress.tsx   slider and readouts
│               ├── ReaderPasteDialog.tsx
│               ├── useReader.ts         playback engine
│               ├── useReaderShortcuts.ts
│               └── index.ts
├── components/
│   ├── common/
│   │   ├── Logo/
│   │   ├── LanguageSwitcher/
│   │   └── ThemeToggle/                 client
│   ├── layout/
│   │   ├── Header/
│   │   └── Footer/
│   └── ui/                              dialog, textarea, tooltip, slider, kbd (CLI)
├── config/site.ts                       add name
├── i18n/dictionaries/{pl,en}.json       section 8
└── lib/
    ├── rsvp.ts                          tokenize, pivotIndex, wordDelay, sentence starts
    └── interpolate.ts                   "{name}" placeholders
```

- `HeroSection` and `Reader` are used by one route, so they live in `src/app/[lang]/_components/` per `.claude/rules/components-conventions.md`. Each component is a folder with an `index.ts`.
- `src/lib/rsvp.ts` is pure (no React, no DOM), so the pivot and timing rules can be checked in isolation.
- Add primitives with `pnpm dlx shadcn@latest add dialog textarea tooltip slider kbd`. They are Base UI based: there is no `asChild`.
- Keep files near 150 lines; that is why the reader is split as above.
- No new top-level folders under `src/`.

## 12. Build order

1. Read `.claude/rules/*.md` and these bundled docs: `01-app/01-getting-started/13-fonts.md`, `01-app/02-guides/preventing-flash-before-hydration.md`, `01-app/03-api-reference/03-file-conventions/01-metadata/app-icons.md` and `opengraph-image.md`, `01-app/03-api-reference/04-functions/next-root-params.md`.
2. Tokens in `globals.css`; `latin-ext`; `siteConfig.name`; dictionaries.
3. `src/lib/rsvp.ts` and `interpolate.ts`.
4. `Logo`, `LanguageSwitcher`, `ThemeToggle` with the pre-paint script, `Header`, `Footer`.
5. `ReaderStage` and `useReader` with the demo only; get the pivot alignment and timing right before adding anything else.
6. Controls, progress, shortcuts.
7. Paste dialog.
8. Metadata, icons, Open Graph image.
9. `pnpm lint`, `pnpm build`, then check `/pl` and `/en` with `playwright-cli` in both themes at 360px and 1440px.

## 13. Acceptance checklist

- [ ] `/` redirects to `/pl` or `/en`; both render, and the switcher moves between them.
- [ ] On load the demo plays at 300 WPM in the page's language and loops.
- [ ] The pivot letter is red and stays on the same x position for every word; the ticks line up with it.
- [ ] No layout shift while words change, at 360px and 1440px.
- [ ] Play/pause, restart, slower/faster, scrubbing and every shortcut in section 5.6 work.
- [ ] `Cmd/Ctrl+V` and `Cmd/Ctrl+R` are not hijacked.
- [ ] Pasting a text plays it in the hero; "Back to demo" restores the demo.
- [ ] Clipboard denial shows the hint and does not break the dialog.
- [ ] Theme follows the system, toggles, persists across reloads and language switches, and does not flash on load.
- [ ] With reduced motion enabled, nothing plays until the visitor presses play.
- [ ] The whole page is operable by keyboard; a screen reader gets the full text and status changes, not a stream of single words.
- [ ] The hero fills the viewport; the footer is below it.
- [ ] The accent colour appears only on the pivot letter, the ticks, the logo and the progress fill.
- [ ] Title, description, canonical, `hreflang` alternates, icon and Open Graph image are present for both locales.
- [ ] No user-facing string is hardcoded in a component; `pl.json` and `en.json` have the same keys.
- [ ] `pnpm lint` and `pnpm build` pass.

**Open question:** the production domain for `siteConfig.url` (canonical URLs, sitemap and Open Graph depend on it).
