# ⚔️ AS Adventurer

**A free, open-source reactive overlay for streamers.** Linux-first hard fork of Angel's Sword Studios' overlay — expression-reactive characters without a full Live2D stack.

Repo: [Jhackler/Ai-png-tuber-overlay](https://github.com/Jhackler/Ai-png-tuber-overlay)

It's not meant to replace VTube Studio or a bounce-PNG tool. If you want a lightweight reactive avatar driven by face + voice, this is the middle path.

Works for **Discord collab reactives** too — drop sprites in a folder and go.

Companion asset pipeline (separate repo, port **3001**): [Jhackler/png-tube-creator](https://github.com/Jhackler/png-tube-creator). This overlay is **port 3000**.

This fork's focus is **Linux** (`launch.sh`) and extras like webcam capture quality. Windows EXEs/bats from upstream still exist; they are not the supported path.

> Built from [Angel's Sword Studios](https://github.com/angelssword) original. Forked for Linux + personal use.

---

## What It Does

Your iPhone (or webcam) tracks your face. AS Adventurer reads your expressions in real time and swaps between different animations on stream:

| Expression | What Triggers It |
|:-----------|:-----------------|
| 😊 Happy | Smiling (cheek + eye squint) |
| 😢 Sad | Frowning (brow + mouth) |
| 😮 Surprised | Wide eyes + raised brows |
| 😑 Eyes Closed | Eyes shut for 1.5+ seconds |
| 🎤 Speaking | Microphone volume |
| ⌨️ Typing | Keyboard activity |

Each state has its own idle and speaking animation. You provide the art — WebM, GIF, PNG, or MP4 — and AS Adventurer handles the rest.

### Emotes

On top of expressions, you can trigger **emotes** from the control panel — one-shot animations, held poses with intro/idle/outro sequences, and even nested sub-animations (e.g., draw sword → ignite → slash). Each emote can have sound effects and multiple variants that play randomly.

---

## Features

- **Face tracking** — VTube Studio (iPhone), iFacialMocap (iPhone), or webcam via MediaPipe
- **Voice detection** — microphone input with adjustable threshold
- **Typing detection** — keyboard activity triggers a typing animation
- **Multiple models** — switch characters on the fly from the control panel
- **Emote system** — one-shot, held, and nested sub-animation emotes with sound effects
- **Tunable thresholds** — smile sensitivity, expression hold, hysteresis, exit bias, transition speed
- **Crossfade / blur-pop transitions** — configurable swap animation between expression states
- **OBS-native** — transparent browser source, no plugins needed
- **Runs on bad computers** — lightweight single-process server, only the active model's assets are loaded
- **Localhost only** — HTTP binds 127.0.0.1; nothing leaves your machine

---

## Quick Start

### Linux (supported)

```bash
git clone https://github.com/Jhackler/Ai-png-tuber-overlay.git
cd Ai-png-tuber-overlay
chmod +x launch.sh
./launch.sh            # install Node + deps if missing, then start
```

Then open:
- **Control Panel** → [http://localhost:3000](http://localhost:3000)
- **OBS Overlay** → `http://localhost:3000/overlay.html` (add as Browser Source)

### Linux launcher

`launch.sh` is a portable TUI launcher for Debian/Ubuntu, Fedora, and Arch (and most other glibc distros). Keep it in the repo root. Double-click from a file manager opens a terminal; close that window (or Ctrl+C) and the server dies with it.

```bash
chmod +x launch.sh
./launch.sh            # install Node + deps if missing, then start
./launch.sh setup      # install only
./launch.sh update     # git pull this clone, reinstall deps, start
./launch.sh start      # start only
```

It uses a system Node.js v18+ if you already have one. Otherwise it downloads an official portable Node runtime into `./runtime/` (no root required). `npm install` is skipped when dependencies are already present.

`npm start` still works if Node is already installed.

### Windows leftovers

Upstream `Start AS Adventurer.bat` / `build-release.js` EXE packaging may still be in the tree. This fork does not target Windows.

---

## Adding Your Character

Drop your animations into `public/assets/` — either at the root for a single model, or in a subfolder for multiple models.

### File Naming

```
public/assets/
  MyCharacter/
    neutral_idle.webm          ← Default resting state
    neutral_speaking.webm      ← Talking, neutral expression
    happy_idle.webm            ← Smiling
    happy_speaking.webm        ← Talking while smiling
    sad_idle.webm              ← Frowning
    sad_speaking.webm          ← Talking while frowning
    surprised_idle.webm        ← Surprised
    surprised_speaking.webm    ← Talking while surprised
    eyes_closed.webm           ← Eyes shut
    typing.webm                ← Keyboard typing
```

Only `neutral_idle` is truly required. Everything else is optional — if a state doesn't have an asset, AS Adventurer falls back gracefully.

**Supported formats:** `.webm` `.mp4` `.webp` `.gif` `.png`

### Emotes

```
public/assets/MyCharacter/emotes/
  wave/
    animation.webm              ← One-shot emote (Type 1)

  sword_draw/
    intro.webm                  ← Plays once on trigger
    idle.webm                   ← Loops while held
    speaking.webm               ← Loops while held + talking
    outro.webm                  ← Plays on release
    intro_sound.mp3             ← Sound on trigger
    outro_sound.mp3             ← Sound on release
    subs/
      ignition/                 ← Sub-animation (nested)
        intro.webm
        idle.webm
        subs/
          slash/
            animation.webm     ← One-shot, returns to parent
            sound.mp3
```

Emotes support **variants** — `intro.webm`, `intro2.webm`, `intro3.webm` play randomly.

---

## Connecting Face Tracking

### VTube Studio (iPhone)
1. Open VTube Studio → Settings → 3rd Party PC Clients → Enable
2. In the Control Panel, enter your iPhone's IP and click **Connect VTS**
3. Phone and PC must be on the same WiFi network

### iFacialMocap (iPhone)
1. Open iFacialMocap on your iPhone
2. In the Control Panel, enter your iPhone's IP and click **Connect iFacial**

### Webcam (MediaPipe)

1. Open the Control Panel webcam tab
2. **Fast** = 640×480 (default, cheaper). **Quality** = 1280×720
3. Start the camera; keep the Control Panel tab open while streaming

Saved in `localStorage` as `webcamQuality`. Implemented in `public/webcam-quality.js` (does not rewrite `control.js`).

### Microphone
1. Select your mic from the dropdown in the Control Panel
2. Click **Enable Microphone**
3. Keep the Control Panel tab open while streaming

---

## OBS Setup

1. Add a **Browser Source** in OBS
2. URL: `http://localhost:3000/overlay.html`
3. Set width/height to match your character dimensions
4. Background is transparent by default

**Debug mode:** Add `?debug=1` to see live expression state → `http://localhost:3000/overlay.html?debug=1`

---

## Ports

| Port | Protocol | Purpose |
|:-----|:---------|:--------|
| 3000 | HTTP/WS | Web server + WebSocket |
| 21412 | UDP | VTube Studio (send) |
| 11125 | UDP | VTube Studio (receive) |
| 49983 | UDP | iFacialMocap |

---

## Building a Release

`node build-release.js` is the upstream Windows EXE packager. Not maintained in this fork.

---

## Tech Stack

- **Server:** Node.js, Express, WebSocket (`ws`)
- **Tracking:** UDP (VTube Studio / iFacialMocap) + webcam blendshapes from the control panel
- **Frontend:** Vanilla HTML/CSS/JS — no frameworks, no build step
- **Linux:** `launch.sh` (TUI + optional portable Node)

---

## License

MIT — free for personal and commercial use. See [LICENSE](LICENSE) for details.

---

## Credits

Upstream: Angel's Sword Studios.

This hard fork: Linux launcher, webcam Fast/Quality (720p), personal-use changes. Windows is not a target.
