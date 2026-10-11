import { useCallback, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Send } from 'lucide-react';
import { measurePairAtAngles, sameProbability } from '@/quantum/simulator';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

const ANGLES = [
  { deg: 0, label: '0°' },
  { deg: 45, label: '45°' },
  { deg: 90, label: '90°' },
  { deg: 135, label: '135°' },
];

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export default function EntanglementLab() {
  const reduceMotion = useStore((s) => s.reduceMotion);
  const react = useStore((s) => s.react);
  const [aliceDeg, setAliceDeg] = useState(0);
  const [bobDeg, setBobDeg] = useState(45);
  const [trials, setTrials] = useState(0);
  const [sameCount, setSameCount] = useState(0);
  const [bobResults, setBobResults] = useState<number[]>([]);
  const [messagingMode, setMessagingMode] = useState(false);

  const pSame = useMemo(() => sameProbability(toRad(aliceDeg), toRad(bobDeg)), [aliceDeg, bobDeg]);
  const correlation = useMemo(() => 2 * pSame - 1, [pSame]);

  const run = useCallback(
    (n = 100) => {
      let same = 0;
      const aOut: number[] = [];
      const bOut: number[] = [];
      for (let i = 0; i < n; i++) {
        const agree = measurePairAtAngles(toRad(aliceDeg), toRad(bobDeg));
        // Alice is a random bit; Bob matches with probability pSame
        const a = Math.random() < 0.5 ? 0 : 1;
        const b = agree ? a : 1 - a;
        aOut.push(a);
        bOut.push(b);
        if (a === b) same++;
      }
      setTrials((t) => t + n);
      setSameCount((s) => s + same);
        setBobResults((prev) => [...prev, ...bOut].slice(-200));
      react('curious', `${n} entangled pairs measured.`);
    },
    [aliceDeg, bobDeg, react],
  );

  const reset = () => {
    setTrials(0);
    setSameCount(0);
    setBobResults([]);
    setMessagingMode(false);
  };

  return (
    <div className="space-y-6">
      {/* angle selectors */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="ui-label text-neon">Alice · measurement angle</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {ANGLES.map((a) => (
              <button
                key={a.deg}
                type="button"
                onClick={() => setAliceDeg(a.deg)}
                className={cn(
                  'rounded-xl border px-4 py-2 text-sm transition',
                  aliceDeg === a.deg
                    ? 'border-neon bg-neon text-neon-ink'
                    : 'border-line text-ink-soft hover:border-line-strong',
                )}
              >
                {a.label}
              </button>
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={180}
            step={1}
            value={aliceDeg}
            onChange={(e) => setAliceDeg(Number(e.target.value))}
            className="mt-4 w-full accent-neon"
            aria-label="Alice angle slider"
          />
          <p className="mt-2 font-mono text-sm text-muted">{aliceDeg}°</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="ui-label text-neon">Bob · measurement angle</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {ANGLES.map((a) => (
              <button
                key={a.deg}
                type="button"
                onClick={() => setBobDeg(a.deg)}
                className={cn(
                  'rounded-xl border px-4 py-2 text-sm transition',
                  bobDeg === a.deg
                    ? 'border-neon bg-neon text-neon-ink'
                    : 'border-line text-ink-soft hover:border-line-strong',
                )}
              >
                {a.label}
              </button>
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={180}
            step={1}
            value={bobDeg}
            onChange={(e) => setBobDeg(Number(e.target.value))}
            className="mt-4 w-full accent-neon"
            aria-label="Bob angle slider"
          />
          <p className="mt-2 font-mono text-sm text-muted">{bobDeg}°</p>
        </div>
      </div>

      {/* correlation meter */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="ui-label text-neon">Correlation</p>
            <p className="mt-1 text-sm text-muted">
              P(same) = cos²({aliceDeg}° − {bobDeg}°) = {pSame.toFixed(4)}
            </p>
          </div>
          <div className="font-mono text-3xl text-neon">
            {correlation.toFixed(3)}
          </div>
        </div>
        <div className="relative mt-4 h-3 overflow-hidden rounded-full bg-elevated">
          <motion.div
            className="absolute inset-y-0 left-1/2 rounded-full bg-neon"
            animate={{
              width: `${Math.abs(correlation) * 50}%`,
              left: correlation >= 0 ? '50%' : `${50 - Math.abs(correlation) * 50}%`,
            }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.4 }}
          />
          <div className="absolute inset-y-0 left-1/2 w-px bg-ink/40" />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>−1 (always different)</span>
          <span>0 (uncorrelated)</span>
          <span>+1 (always same)</span>
        </div>
      </div>

      {/* controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => run(100)}
          className="inline-flex items-center gap-2 rounded-xl bg-neon px-5 py-3 font-semibold text-neon-ink transition hover:brightness-110"
        >
          <Play size={17} aria-hidden="true" />
          Run 100 pairs
        </button>
        <button
          type="button"
          onClick={() => run(1000)}
          className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-5 py-3 font-semibold text-ink transition hover:border-neon hover:text-neon"
        >
          Run 1,000
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={trials === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm text-ink-soft transition hover:border-neon hover:text-neon disabled:opacity-40"
        >
          <RotateCcw size={15} aria-hidden="true" />
          Reset
        </button>
        <span className="font-mono text-xs text-muted">{trials.toLocaleString()} pairs measured</span>
      </div>

      {/* tallies */}
      {trials > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-elevated p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">Same outcome</p>
            <p className="mt-1 font-mono text-2xl text-neon">{sameCount}</p>
            <p className="text-sm text-muted">{((sameCount / trials) * 100).toFixed(1)}%</p>
          </div>
          <div className="rounded-xl border border-line bg-elevated p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">Different</p>
            <p className="mt-1 font-mono text-2xl text-neon">{trials - sameCount}</p>
            <p className="text-sm text-muted">{(((trials - sameCount) / trials) * 100).toFixed(1)}%</p>
          </div>
          <div className="rounded-xl border border-line bg-elevated p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">Expected same</p>
            <p className="mt-1 font-mono text-2xl text-neon">{(pSame * 100).toFixed(1)}%</p>
            <p className="text-sm text-muted">cos²({aliceDeg}° − {bobDeg}°)</p>
          </div>
        </div>
      )}

      {/* try to send a message */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center gap-3">
          <Send size={18} className="text-hype-amber" aria-hidden="true" />
          <h3 className="text-lg">Try to send a message</h3>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Alice chooses her angle to try to signal Bob. But whatever she does, Bob's outcomes stay
          50/50 random. He cannot tell what angle Alice picked just by looking at his own results.
        </p>
        <button
          type="button"
          onClick={() => {
            setMessagingMode(true);
            run(500);
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-hype-amber px-5 py-3 text-sm font-semibold text-hype-amber transition hover:bg-hype-amber/10"
        >
          Run 500 rounds in "messaging" mode
        </button>
        {messagingMode && trials > 0 && (
          <div className="mt-4 rounded-xl border border-line bg-elevated p-4" aria-live="polite">
            <p className="text-sm text-ink-soft">
              <strong>Bob's stream:</strong>{' '}
              {bobResults.slice(-20).map((b) => b).join(' ')} …
            </p>
            <p className="mt-2 text-sm text-muted">
              Bob sees roughly as many 0s as 1s — no pattern reveals Alice's angle. This is why
              entanglement does <em>not</em> allow faster-than-light messaging.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
