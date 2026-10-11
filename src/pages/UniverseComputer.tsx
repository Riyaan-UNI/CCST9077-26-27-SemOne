import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import Page from '@/components/Page';
import Section from '@/components/Section';

/* ------------------------------------------------------------------ *
 * Conway's Game of Life (canvas, no Web Worker for Phase 4)
 * ------------------------------------------------------------------ */

const GRID_W = 80;
const GRID_H = 50;
const CELL = 10;

function createGrid(): boolean[][] {
  return Array.from({ length: GRID_H }, () => Array(GRID_W).fill(false));
}

function randomGrid(): boolean[][] {
  return Array.from({ length: GRID_H }, () =>
    Array.from({ length: GRID_W }, () => Math.random() < 0.25),
  );
}

function nextGen(grid: boolean[][]): boolean[][] {
  const h = grid.length;
  const w = grid[0].length;
  const next = createGrid();
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let alive = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ny = (y + dy + h) % h;
          const nx = (x + dx + w) % w;
          if (grid[ny][nx]) alive++;
        }
      }
      next[y][x] = grid[y][x] ? alive === 2 || alive === 3 : alive === 3;
    }
  }
  return next;
}

function gliderGun(): boolean[][] {
  const g = createGrid();
  const set = (x: number, y: number) => {
    if (x < GRID_W && y < GRID_H) g[y][x] = true;
  };
  // Gosper glider gun (top-left placement)
  const cells = [
    [5, 1], [5, 2], [6, 1], [6, 2],
    [5, 11], [6, 11], [7, 11], [4, 12], [8, 12], [3, 13], [9, 13], [3, 14], [9, 14], [6, 15], [4, 16], [8, 16], [5, 17], [6, 17], [7, 17], [6, 18],
    [3, 21], [4, 21], [5, 21], [3, 22], [4, 22], [5, 22], [2, 23], [6, 23], [1, 25], [2, 25], [6, 25], [7, 25],
    [3, 35], [4, 35], [3, 36], [4, 36],
  ];
  cells.forEach(([x, y]) => set(x, y));
  return g;
}

function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState(() => randomGrid());
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [generation, setGeneration] = useState(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const draw = useCallback((g: boolean[][]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#070b09';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#39ff14';
    for (let y = 0; y < GRID_H; y++) {
      for (let x = 0; x < GRID_W; x++) {
        if (g[y][x]) {
          ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
        }
      }
    }
  }, []);

  useEffect(() => {
    draw(grid);
  }, [grid, draw]);

  useEffect(() => {
    if (!running) return;
    const loop = (time: number) => {
      if (time - lastTimeRef.current > speed) {
        lastTimeRef.current = time;
        setGrid((g) => {
          const n = nextGen(g);
          draw(n);
          return n;
        });
        setGeneration((g) => g + 1);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, speed, draw]);

  const reset = (preset: 'random' | 'glider' | 'empty') => {
    setRunning(false);
    setGeneration(0);
    const g = preset === 'random' ? randomGrid() : preset === 'glider' ? gliderGun() : createGrid();
    setGrid(g);
    draw(g);
  };

  const step = () => {
    setGrid((g) => {
      const n = nextGen(g);
      draw(n);
      return n;
    });
    setGeneration((g) => g + 1);
  };

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={GRID_W * CELL}
        height={GRID_H * CELL}
        className="w-full max-w-full rounded-xl border border-line"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="flex flex-wrap items-center gap-6">
        {/* Play / Pause cluster */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="inline-flex items-center gap-2 rounded-xl bg-neon px-4 py-2.5 font-semibold text-neon-ink transition hover:brightness-110"
          >
            {running ? <Pause size={15} /> : <Play size={15} />}
            {running ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={step}
            className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm transition hover:border-neon hover:text-neon"
          >
            <SkipForward size={15} />
            Step
          </button>
        </div>
        {/* Preset cluster */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => reset('random')}
            className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm transition hover:border-neon hover:text-neon"
          >
            <RotateCcw size={15} />
            Random
          </button>
          <button
            type="button"
            onClick={() => reset('glider')}
            className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm transition hover:border-neon hover:text-neon"
          >
            Glider gun
          </button>
          <button
            type="button"
            onClick={() => reset('empty')}
            className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm transition hover:border-neon hover:text-neon"
          >
            Clear
          </button>
        </div>
        {/* Speed / Gen cluster */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-muted">
            Speed:
            <input
              type="range"
              min={20}
              max={500}
              step={10}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-24 accent-neon"
            />
            <span className="font-mono text-xs">{speed}ms</span>
          </label>
          <span className="font-mono text-xs text-muted">Gen {generation}</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function UniverseComputer() {
  return (
    <Page>
      <Section
        eyebrow="L11"
        title="The Universe as a Quantum Computer"
        lead="From clockwork to computation. If the universe is made of information, what is its clock speed?"
      >
        {/* Game of Life */}
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="ui-label text-neon">Conway's Game of Life</p>
              <p className="mt-1 text-sm text-muted">
                Simple rules produce complex, emergent behaviour. The universe may be like this:
                simple laws at the bottom, rich structure at the top.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <GameOfLife />
          </div>
        </div>

        {/* cards — varied layouts: quote, stat, definition */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {/* Quote card */}
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="ui-label text-era-codes">Turing 1936</p>
            <p className="mt-4 font-display text-lg italic leading-snug text-ink-soft">
              "A single abstract machine could compute anything computable."
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Alan Turing proved this in 1936. The idea that the universe itself might be a kind of
              computer follows naturally: if physics is rule-based, perhaps it is computation all
              the way down.
            </p>
          </div>

          {/* Stat card */}
          <div className="rounded-2xl border border-line bg-surface p-5 text-center">
            <p className="ui-label text-era-algorithms">Lloyd 2000</p>
            <p className="mt-4 font-mono text-5xl text-neon">10⁵⁰</p>
            <p className="mt-1 text-sm font-medium text-ink-soft">ops/sec</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Seth Lloyd asked: what is the maximum computational power of a 1-kilogram, 1-litre
              computer? The answer — limited by the speed of light, quantum mechanics, and
              thermodynamics.
            </p>
          </div>

          {/* Definition card */}
          <div className="rounded-2xl border-2 border-line-strong bg-elevated p-5">
            <p className="ui-label text-era-hardware">Bekenstein bound</p>
            <p className="mt-4 font-display text-2xl text-ink">Black holes as hard drives</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              The maximum information a region can hold is proportional to its{' '}
              <em>surface area</em>, not its volume. A black hole is the densest possible hard
              drive: <span className="font-mono text-neon">2.67 × 10⁴²</span> bits per m² of event
              horizon.
            </p>
          </div>
        </div>

        {/* closing thought */}
        <div className="mt-8 rounded-2xl border border-neon/30 bg-surface p-6">
          <p className="text-sm leading-relaxed text-ink-soft">
            <strong className="text-ink">The computational universe hypothesis</strong> asks:
            what if the laws of physics are not just described by mathematics, but actually
            <em> are</em> computation? Every particle interaction, every field fluctuation —
            each is an operation in a cosmic program. We do not know if this is true. But the
            question is now a genuine research program, not just philosophy.
          </p>
        </div>
      </Section>
    </Page>
  );
}
