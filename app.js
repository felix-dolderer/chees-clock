const WHITE = 0;
const BLACK = 1;

const players = [
  { el: document.getElementById('white'), ms: 0, moves: 0 },
  { el: document.getElementById('black'), ms: 0, moves: 0 },
];
const presetEl = document.getElementById('preset');
const funEl = document.getElementById('fun');
const pauseEl = document.getElementById('pause');
const resetEl = document.getElementById('reset');

const LOW_TIME_MS = 10_000;
const FUN_PENALTY = 1.15; // the unlucky side's clock runs 15% faster

let incrementMs = 0;
let active = null;    // WHITE or BLACK while a game is on, null before the first move
let paused = true;
let flagged = false;
let lastTick = 0;
let funMode = false;
let penalized = null; // in fun mode, the side drawn for this turn

function format(ms) {
  const total = Math.max(0, ms);
  if (total < LOW_TIME_MS) return (total / 1000).toFixed(1);
  const s = Math.ceil(total / 1000);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function render() {
  players.forEach((p, i) => {
    p.el.querySelector('.time').textContent = format(p.ms);
    p.el.querySelector('.moves').textContent = `Moves: ${p.moves}`;
    p.el.classList.toggle('active', i === active && !paused);
    p.el.classList.toggle('low', p.ms < LOW_TIME_MS);
    p.el.classList.toggle('flagged', p.ms <= 0);
    p.el.classList.toggle('penalized', funMode && i === active && i === penalized && !flagged);
  });
  pauseEl.textContent = paused ? '▶' : '⏸';
  pauseEl.disabled = active === null || flagged;
  funEl.classList.toggle('on', funMode);
  funEl.setAttribute('aria-pressed', String(funMode));
}

function tick(now) {
  if (paused || active === null) return;
  const p = players[active];
  const rate = funMode && active === penalized ? FUN_PENALTY : 1;
  p.ms -= (now - lastTick) * rate;
  lastTick = now;
  if (p.ms <= 0) {
    p.ms = 0;
    flagged = true;
    paused = true;
    if (navigator.vibrate) navigator.vibrate(500);
  }
  render();
  if (!paused) requestAnimationFrame(tick);
}

function start() {
  paused = false;
  lastTick = performance.now();
  requestAnimationFrame(tick);
}

function beginTurn(side) {
  active = side;
  penalized = Math.random() < 0.5 ? WHITE : BLACK;
  lastTick = performance.now();
}

// Tapping your own side ends your turn and starts your opponent's clock.
function press(i) {
  if (flagged) return;
  if (active === null) {
    // First tap (by either player) starts White's clock.
    beginTurn(WHITE);
    start();
  } else if (i === active && !paused) {
    players[i].ms += incrementMs;
    players[i].moves += 1;
    beginTurn(1 - i);
  }
  render();
}

function reset() {
  const [secs, inc] = presetEl.value.split('|').map(Number);
  incrementMs = inc * 1000;
  players.forEach(p => { p.ms = secs * 1000; p.moves = 0; });
  active = null;
  paused = true;
  flagged = false;
  penalized = null;
  render();
}

players.forEach((p, i) => p.el.addEventListener('pointerdown', () => press(i)));
pauseEl.addEventListener('click', () => {
  if (active === null || flagged) return;
  paused ? start() : (paused = true);
  render();
});
funEl.addEventListener('click', () => {
  funMode = !funMode;
  reset();
});
resetEl.addEventListener('click', reset);
presetEl.addEventListener('change', reset);

reset();
