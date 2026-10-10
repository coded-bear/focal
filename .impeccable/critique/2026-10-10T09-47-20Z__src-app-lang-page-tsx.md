---
target: strona główna (src/app/[lang]/page.tsx)
total_score: 26
max_score: 40
na_heuristics:
p0_count: 0
p1_count: 3
target_identity: "file:/Users/lukaszwarchol/code/focal/src/app/[lang]/page.tsx"
target_fingerprint: "sha256:e3e545cf4c76abf24dc4dde741236bb2c8c1688b86d795a258ad6d4a4d78f05f"
target_path: /Users/lukaszwarchol/code/focal/src/app/[lang]/page.tsx
timestamp: 2026-10-10T09-47-20Z
slug: src-app-lang-page-tsx
---

Method: dual-agent, degraded evidence (A: source and served HTML only, no screenshots; B: detector CLI and URL mode, no browser overlay). Parent took one screenshot round (1440x900 and 390x844, light and dark, dialog, long word, finished state).

## Design Health Score

| #         | Heuristic                       | Score     | Key Issue                                     |
| --------- | ------------------------------- | --------- | --------------------------------------------- |
| 1         | Visibility of System Status     | 3         | Finished state is nearly silent               |
| 2         | Match System / Real World       | 3         | "WPM", "RSVP", "Demo" unexplained             |
| 3         | User Control and Freedom        | 3         | Scrub track is 2px                            |
| 4         | Consistency and Standards       | 2         | Two geometries; duplicate RotateCcw icons     |
| 5         | Error Prevention                | 2         | Stage click toggles play next to a 2px slider |
| 6         | Recognition Rather Than Recall  | 3         | Legend omits R and V                          |
| 7         | Flexibility and Efficiency      | 3         | Speed only in steps of 25                     |
| 8         | Aesthetic and Minimalist Design | 3         | Stock chrome dilutes the concept              |
| 9         | Error Recovery                  | 2         | Error messages look like the stats line       |
| 10        | Help and Documentation          | 2         | One sentence of explanation                   |
| **Total** |                                 | **26/40** | **Acceptable**                                |

## Design Specificity Verdict

Partly authored. The wordmark, pivot axis, mono readouts and red progress fill are specific to the product. Everything interactive is default shadcn: 10-14px radii, a round white slider knob, a dialog with blur and zoom. The stage is square and technical, the controls are soft.

Deterministic scan: `detect --json src/` returned no findings. URL mode reported one `text-overflow` warning on `p.whitespace-pre-line` (Reader.tsx:79) on /en and /pl at 1440 and 390; false positive, it is the sr-only transcript. No browser overlay was produced.

## What's Working

- Pivot letter, ticks and play button share one exact axis.
- "One red thing" is honoured: red appears only on the pivot, ticks, logo and progress fill.
- Readouts are coherent: mono, tabular numerals, zero padding.

## Priority Issues

1. [P1] Word size is unstable and long words vanish. A 32-character word renders at about 11px on a phone, hanging right of the axis (seen in screenshot). On desktop, words with more than 5 characters on one side of the pivot shrink, e.g. "Presentation," to about 58px against 88px (computed). Fix: lower the size cap; chunk very long words with a hyphen. Command: /impeccable typeset.
2. [P1] Mobile paste dialog. Actions are ordered Read, Cancel, Paste from clipboard (seen); no max height, so actions can be covered by the keyboard (from code); privacy line is smallest and last. Command: /impeccable adapt.
3. [P1] Focus and contrast. Focus ring is about 1.5-1.9:1 against the background (computed; barely visible in screenshot). Kbd text in light theme is 4.34:1. Command: /impeccable audit.
4. [P2] The reticle is underpowered. Ticks are 12px in a ~190px band; the white slider knob is the brightest object on the red line in dark theme; logo and footer sit on the viewport edges while the instrument is a 720px island. Command: /impeccable layout.
5. [P2] The end of a text is flat. Last word stays, two identical rotate icons sit side by side. Command: /impeccable delight.

## Persona Red Flags

- Jordan (first-timer): sees "DEMO 012 / 090" and a pause button with no hint of what to do next.
- Casey (one-handed mobile): 2px progress line and tap-to-toggle stage cause accidental pauses; clipboard button is under the keyboard.
- Sam (keyboard, low vision): focus nearly invisible in light theme; current language marked by colour only.

## Minor Observations

- Empty stage shows `000 / 090` for 600ms on load.
- "Back to demo" row wraps at 360px in the custom-text state.
- Logo is 36px tall; the brief says 28px.
- Unused `chart-*` and `sidebar-*` tokens remain in globals.css.

## Questions to Consider

- Should the hairlines span the whole viewport so the page is the instrument?
- Could the control rail dim during playback so the word is alone?
