# SYNTAX SQUAD — Learn C Basics

A cinematic superhero game that teaches first-year CSE students the very basics of C — and **why** every line exists.
No login, no backend, no build step. Plain HTML + CSS + JavaScript. Progress is saved in each player's browser.

## Missions (≈ 75 minutes)

| # | Mission | Hero | Teaches | Time |
|---|---|---|---|---|
| 1 | The Missing Toolbox | HEADER | `#include`, `main()`, `{ }`, `return 0;`, `\n` (discover-by-error) | 10 min |
| 2 | Semicolon Hunt | FULLSTOP | Spot the bug + pick the fix, streak multipliers | 10 min |
| 3 | Code Jigsaw | ARCHITECT | Put program lines in the right order | 10 min |
| 4 | Memory Boxes | VAULT | `int` / `float` / `char`, `%d %f %c` | 10 min |
| 5 | Courier Mission | BLINK | `scanf` and why `&` is needed | 10 min |
| 6 | Predict the Output | SEER | 15-second rapid-fire quiz | 8 min |
| Boss | SEGFAULT | — | Write a full program from scratch | 10 min |

Every concept unlocks a **Why Card** (plain explanation + everyday analogy + exam definition). All cards collect in **My C Notebook**, which students can print or save as PDF.

## Deploy on GitHub Pages (free)

1. Create a new **public** repository on GitHub (e.g. `syntax-squad`).
2. Click **Add file → Upload files**, drag in **everything inside this folder** (`index.html`, `css/`, `js/`, `.nojekyll`, `README.md`) and commit.
   `index.html` must be at the top level of the repo, not inside another folder.
3. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. Wait 1–2 minutes. Your site will be live at `https://<your-username>.github.io/syntax-squad/`.

**Alternative (Netlify):** go to app.netlify.com/drop and drag this folder onto the page. You get a link instantly.

## Running the event

- Share the link (or a QR code of it) on the projector. Students play on phones or laptops — no sign-up.
- **Host panel:** tap ⚙ (top right), PIN **2026**. It unlocks every mission, toggles timers and resets progress — on that device only.
  Change the PIN in `js/content.js` (`SQ.HOST_PIN`). Note: it's a convenience lock, not real security.
- Each student has 1 Hint, 1 50-50 and 1 Skip for the whole game.
- At the end, ask students to show their **Victory screen** score — use it for prizes.

## Editing content

All questions, explanations, timers and hero text live in **`js/content.js`**. Edit, commit, and GitHub Pages updates automatically.
Inside JS strings, write a C newline as `\\n`.

## Files

```
index.html        page shell
css/style.css     base layout (mobile-first)
css/comic.css     comic-book theme layer
js/content.js     all game content (edit this)
js/app.js         game engine
js/guard.js       blocks copy/paste (delete this file + its script tag to re-enable)
js/art.js         original comic-style hero artwork
.nojekyll         tells GitHub Pages to serve files as-is
```

All characters and artwork are original and drawn in code (SVG), so the site is safe to host publicly.
