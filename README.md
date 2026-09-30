# Chess Clock

A super simple chess clock that runs in the browser. No build step, no dependencies.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffelix-dolderer%2Fchees-clock)

## Use it

Open `index.html` in a browser (works well on a phone laid flat between the players; White sits at the bottom).

- The first tap starts White's clock. After that, tap your own side to end your turn and start your opponent's clock.
- ⏸ / ▶ pauses and resumes.
- ↺ resets to the selected time control.
- Presets: 1 min, 3+2, 5 min, 10 min, 15+10, 30 min (minutes + seconds increment per move).
- 🎲 turns on **fun mode**: at the start of every turn, White or Black is drawn at random and that side's clock runs 15% faster for the turn. When the side to move is the unlucky one, it gets a ⚡ badge. Toggling it resets the clock.

The clock turns red under 10 seconds and shows tenths of a second.

## Deploy to Vercel

It's a static site, so Vercel serves it with no configuration. Either click the **Deploy with Vercel** button above, or in Vercel choose **Add New → Project**, import this repository and press **Deploy** (framework preset: Other, no build command). Every push to `main` redeploys automatically.
