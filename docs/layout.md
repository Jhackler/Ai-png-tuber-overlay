# Layout & UX

Control panel structure. Colors: `docs/theme.md`. The OBS layer (`overlay.html`) is a transparent stack of asset layers — keep it chrome-free.

Vanilla HTML/CSS/JS. No new framework.

## Control panel (`index.html`)

1. **Header** — logo + wordmark + tagline left; WS status dot right.
2. **Two columns** (`.main-grid`) — tracking/sources left-ish, models/emotes/assets the other. Collapse to one column at **800px**.
3. **Cards** — header row + body. Highlighted card = gold border, not a second layout system.
4. **Source tabs** — VTS / iFacial / Webcam as a segmented control inside the tracking card (Fast/Quality lives on the webcam panel).
5. **Meters** — compact bars under the current expression; don’t turn them into a graph widget.

Max width ~1100px, centered, 20px page padding.

## Overlay (`overlay.html`)

- Full viewport, `background: transparent`.
- Layers absolutely stacked, bottom-anchored character.
- Default swap is **blur-pop**, not opacity crossfade (OBS ghosting). Duration from control panel (`--swap-duration`).
- Debug HUD only with `?debug=1`.

## UX rules

- Tooltips on non-obvious controls (webcam quality already has one).
- Connection errors in the card, not a toast-only dead end.
- Keep the control tab open while streaming (mic + webcam live there).
- Don’t put settings behind a hamburger. Cards on one page.

## What not to do

- Don’t theme the OBS overlay with gold panels.
- Don’t add a creator-style ①②③④ tab pipeline here — this app is a control surface, not a wizard.
- Don’t rewrite `control.js` for one-off UI (webcam quality is a sidecar script on purpose).
