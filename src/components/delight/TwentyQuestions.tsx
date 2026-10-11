import { useState, useCallback } from 'react';
import { HelpCircle, RotateCcw, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

const GRID_SIZE = 8;
const TOTAL_SHIPS = 3;

interface Cell {
  x: number;
  y: number;
  hasShip: boolean;
  questioned: boolean;
  hit: boolean;
}

function createGrid(): Cell[][] {
  const grid: Cell[][] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      row.push({ x, y, hasShip: false, questioned: false, hit: false });
    }
    grid.push(row);
  }

  // Place ships randomly
  let placed = 0;
  while (placed < TOTAL_SHIPS) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    if (!grid[y][x].hasShip) {
      grid[y][x].hasShip = true;
      placed++;
    }
  }
  return grid;
}

/**
 * 20 Questions warm-up (L1 Classical Information).
 * Find hidden ships with yes/no questions. Demonstrates that information
 * is the minimum number of yes/no questions needed to identify a state.
 */
export default function TwentyQuestions() {
  const react = useStore((s) => s.react);
  const [grid, setGrid] = useState(() => createGrid());
  const [questions, setQuestions] = useState(0);
  const [found, setFound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Click a cell to ask: "Is there a ship here?"');

  const ask = useCallback(
    (x: number, y: number) => {
      if (gameOver) return;
      setGrid((g) => {
        const cell = g[y][x];
        if (cell.questioned) return g;
        const next = g.map((row) => row.map((c) => ({ ...c })));
        next[y][x].questioned = true;
        next[y][x].hit = cell.hasShip;
        return next;
      });
      setQuestions((q) => q + 1);

      const cell = grid[y][x];
      if (cell.hasShip) {
        setFound((f) => {
          const nf = f + 1;
          if (nf >= TOTAL_SHIPS) {
            setGameOver(true);
            react('excited', `All ships found in ${questions + 1} questions!`);
            setMessage(`You found all ${TOTAL_SHIPS} ships in ${questions + 1} questions!`);
          } else {
            setMessage('Hit! Keep searching.');
          }
          return nf;
        });
      } else {
        setMessage('Miss. Every no is also information.');
      }
    },
    [gameOver, grid, questions, react],
  );

  const reset = () => {
    setGrid(createGrid());
    setQuestions(0);
    setFound(0);
    setGameOver(false);
    setMessage('Click a cell to ask: "Is there a ship here?"');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{message}</p>
          <p className="mt-1 font-mono text-sm text-neon">
            Questions: {questions} · Found: {found}/{TOTAL_SHIPS}
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm transition hover:border-neon hover:text-neon"
        >
          <RotateCcw size={15} />
          New game
        </button>
      </div>

      {/* grid */}
      <div className="inline-block rounded-2xl border border-line bg-surface p-4">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 2.5rem)` }}
        >
          {grid.map((row, y) =>
            row.map((cell, x) => (
              <button
                key={`${x}-${y}`}
                type="button"
                onClick={() => ask(x, y)}
                disabled={cell.questioned || gameOver}
                className={cn(
                  'grid h-10 w-10 place-items-center rounded-lg border text-sm font-bold transition',
                  cell.questioned
                    ? cell.hit
                      ? 'border-verdict-fact bg-verdict-fact/20 text-verdict-fact'
                      : 'border-line bg-elevated text-muted'
                    : 'border-line bg-surface text-ink-soft hover:border-neon hover:text-neon',
                )}
              >
                {cell.questioned ? (cell.hit ? <Target size={16} /> : '·') : <HelpCircle size={14} />}
              </button>
            )),
          )}
        </div>
      </div>

      {/* explanation */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="ui-label text-neon">Why this matters</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Each yes/no question gives you one bit of information. To find one ship in an 8×8 grid,
          you need at most 6 questions (since 2⁶ = 64). This is the idea Shannon formalised in 1948:
          information is the minimum number of yes/no questions needed to identify a state.
        </p>
      </div>
    </div>
  );
}
