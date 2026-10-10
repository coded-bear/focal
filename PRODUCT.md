# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, in this order:

1. **The curious first-timer.** Has heard of speed reading or RSVP, arrives once, and needs to understand the technique by seeing it before reading any explanation. Their job: find out what this is and whether it works for them.
2. **The returning reader.** Already knows RSVP and comes back to get through an article, an email or a document faster. Their job: paste a text and read it, with speed and playback under control.

The page must win over the first-timer on load and stay useful as a tool for those who return.

## Product Purpose

Focal is a free, one-page RSVP (Rapid Serial Visual Presentation) speed reader. It shows text one word at a time at a fixed point and highlights each word's optimal recognition point (ORP), so the eye does not travel along a line.

It does two jobs: show the technique (a demo text plays on load at 300 WPM) and let the visitor use it (paste their own text and read it in the same place).

Success is a visitor who watches the demo for a few seconds, pastes something, and keeps reading. Focal is a finished standalone utility: no accounts, no monetisation, no growth goals.

## Positioning

The page explains RSVP by doing it: the demo is the explanation, and the visitor's own text plays in the same spot. The text is processed entirely in the browser and is never stored or sent anywhere.

## Operating Context

- One route, `/[lang]`, in Polish (default) and English; the demo text is written per locale.
- Desktop and mobile browsers; keyboard-driven on desktop (Space, arrows, R, V), touch on mobile.
- Texts come from the visitor's clipboard: articles, emails, anything pasteable.
- Light and dark themes, following the system unless the visitor chooses.

## Capabilities and Constraints

- Reader: tokenising, ORP pivot letter, punctuation-aware timing, play/pause, restart, sentence skip, scrubbing, 100–1000 WPM in steps of 25 (default 300).
- Paste dialog with word count and time estimate; input capped at 200,000 characters.
- Persisted locally: WPM (`focal-wpm`) and theme (`focal-theme`). The pasted text lives in component state only.
- Out of scope: second pages, accounts, backend, analytics, storage of the visitor's text, file upload, URL import, bookmarking, reading history.
- Terminology: RSVP, ORP / pivot letter, WPM (`słów/min` in Polish), "demo" vs "your text".
- The page stays statically prerendered for both locales.
- Undecided: the production domain (`siteConfig.url` is still `https://example.com`).

## Brand Commitments

- **Name and logo.** `Focal`; the lowercase `focal` wordmark drawn as monoline paths, with the `o` (the word's own pivot letter) in red between two ticks. The mark (the `o` with ticks on a dark tile) is for icons only. Sources: `docs/assets/focal-wordmark.svg`, `docs/assets/focal-mark.svg`, `docs/assets/logo-preview.png`.
- **One red thing.** The accent colour is reserved for the pivot letter, the two ticks, the `o` in the logo and the progress fill. Buttons, links, focus rings and icons stay neutral.

## Evidence on Hand

- `docs/BRIEF.md`: the full build brief, including reader rules and the acceptance checklist.
- Demo texts and all UI copy in `src/i18n/dictionaries/pl.json` and `en.json`.
- Logo assets in `docs/assets/`.
- There are no testimonials, user numbers, benchmarks, press or reading-speed claims. Future work must not invent them.

## Product Principles

1. **Show before telling.** The technique is experienced before it is explained.
2. **The visitor's text is theirs.** It never leaves the browser, and nothing asks for an account.
3. **The reader is the page.** Everything else stays out of the way of the word being read.
4. **Two languages, equal care.** Polish and English are both first-class, including diacritics and copy.
5. **Finished, not growing.** Additions must serve reading on this one page, not expand the product.

## Accessibility & Inclusion

Target WCAG 2.2 AA. Product-specific requirements: the autoplaying demo must be pausable by keyboard and must not autoplay under `prefers-reduced-motion`; screen readers get the full text and status changes, not a stream of single words; the pivot is marked by colour and by the ticks, never colour alone.
