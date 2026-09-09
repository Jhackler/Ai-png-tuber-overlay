# Theme (control panel)

OBS `overlay.html` is **transparent** — it has no brand chrome. Theme = `public/control.css` `:root` only.

Same gold/dark family as the creator. Token **names differ** (`--accent` vs creator `--accent-gold`). Retheme by editing this `:root`, not by hunting hex in rules.

| Token | Current | Role |
|-------|---------|------|
| `--bg-primary` | `#1a1a2e` | Page |
| `--bg-card` | `rgba(22, 33, 62, 0.75)` | Cards (glass) |
| `--bg-card-hover` | `#1b2a4a` | Hover step |
| `--bg-input` | `#0f1a30` | Inputs / tab wells |
| `--border` | `rgba(255,255,255,0.08)` | Edges |
| `--border-focus` | `#dbb858` | Focus |
| `--text-primary` | `#e0e0e0` | Body |
| `--text-secondary` | `#8899aa` | Labels |
| `--text-muted` | `#556677` | Quiet |
| `--accent` | `#dbb858` | Brand / primary |
| `--accent-hover` | `#f0d878` | Hover gold |
| `--accent-glow` | `rgba(219, 184, 88, 0.25)` | Glow |
| `--accent-blue` | `#0f3460` | Deep |
| `--accent-teal` | `#5bb5a6` | Secondary |
| `--success` | `#7b9f6e` | Connected / found |
| `--warning` | `#dbb858` | Warning |
| `--danger` | `#c75050` | Error / missing |
| `--meter-smile` | `#7b9f6e` | Smile meter |
| `--meter-frown` | `#5bb5a6` | Frown meter |
| `--meter-surprised` | `#dbb858` | Surprised meter |
| `--meter-eyes` | `#c084fc` | Eyes-closed meter |
| `--radius` | `12px` | Cards |
| `--radius-sm` | `8px` | Controls |
| `--font-display` | Cinzel Decorative | Wordmark |
| `--font-heading` | Cinzel | Card titles |
| `--font-body` | Outfit | UI |
| `--font-mono` | Share Tech Mono | (declared; some inputs use JetBrains Mono) |

Wordmark: gradient `--accent` → `--accent-hover`, clipped to text.

Creator sibling: `png-tube-creator/docs/theme.md` (longer token set, same hexes).
