import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { QubiMood } from '@/store/useStore';

export type { QubiMood };

interface QubiProps {
  mood?: QubiMood;
  /** Pixel text rendered on Qubi's screen. */
  message?: string;
  className?: string;
  /** Rendered width in px. The SVG scales fluidly. */
  size?: number;
  float?: boolean;
  label?: string;
}

/* ------------------------------------------------------------------ *
 * Face parts — the screen is always dark, so the face is theme-proof.
 * ------------------------------------------------------------------ */

function Eyes({ mood }: { mood: QubiMood }) {
  const neon = 'var(--neon)';
  const common = { fill: neon, filter: 'url(#qubiGlow)' } as const;

  switch (mood) {
    case 'happy':
    case 'excited':
      return (
        <g {...common}>
          <path d="M62 74 q10 -12 20 0" stroke={neon} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M118 74 q10 -12 20 0" stroke={neon} strokeWidth="5" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'thinking':
      return (
        <g {...common}>
          <rect x="60" y="70" width="24" height="6" rx="3" />
          <rect x="116" y="70" width="24" height="6" rx="3" />
        </g>
      );
    case 'dizzy':
      return (
        <g stroke={neon} strokeWidth="5" strokeLinecap="round">
          <path d="M62 66 l20 20 M82 66 l-20 20" />
          <path d="M118 66 l20 20 M138 66 l-20 20" />
        </g>
      );
    case 'surprised':
      return (
        <g {...common}>
          <circle cx="72" cy="74" r="10" />
          <circle cx="128" cy="74" r="10" />
        </g>
      );
    case 'curious':
      return (
        <g {...common}>
          <circle cx="72" cy="74" r="7" />
          <circle cx="128" cy="74" r="11" />
        </g>
      );
    default:
      return (
        <g {...common}>
          <rect x="63" y="66" width="18" height="18" rx="4" />
          <rect x="119" y="66" width="18" height="18" rx="4" />
        </g>
      );
  }
}

function Mouth({ mood }: { mood: QubiMood }) {
  const neon = 'var(--neon)';
  const stroke = { stroke: neon, strokeWidth: 5, fill: 'none', strokeLinecap: 'round' } as const;

  switch (mood) {
    case 'happy':
    case 'excited':
      return <path d="M80 96 q20 18 40 0" {...stroke} />;
    case 'surprised':
      return <ellipse cx="100" cy="100" rx="9" ry="11" {...stroke} />;
    case 'curious':
      return <circle cx="100" cy="99" r="6" {...stroke} />;
    case 'thinking':
      return <path d="M84 100 q8 -7 16 0 q8 7 16 0" {...stroke} />;
    case 'dizzy':
      return <path d="M82 102 q9 -10 18 0 q9 10 18 0" {...stroke} />;
    default:
      return <path d="M86 98 q14 10 28 0" {...stroke} />;
  }
}

export default function Qubi({
  mood = 'idle',
  message,
  className,
  size = 200,
  float = true,
  label = 'Qubi, the qubit terminal mascot',
}: QubiProps) {
  const screenText = message ?? (mood === 'idle' ? 'HI' : '');

  return (
    <motion.div
      className={cn('relative select-none', className)}
      style={{ width: size }}
      animate={float ? { y: [0, -10, 0] } : undefined}
      transition={float ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : undefined}
      role="img"
      aria-label={label}
    >
      {/* Sizing comes from CSS, not attributes: `height="auto"` is not a valid
          SVG length and browsers log an error for it. */}
      <svg viewBox="0 0 200 190" className="h-auto w-full overflow-visible">
        <defs>
          <filter id="qubiGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="qubiShell" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--elevated)" />
            <stop offset="100%" stopColor="var(--surface)" />
          </linearGradient>
          <clipPath id="qubiScreenClip">
            <rect x="46" y="36" width="108" height="90" rx="9" />
          </clipPath>
        </defs>

        {/* antenna */}
        <line x1="100" y1="24" x2="100" y2="8" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="100" cy="7" r="5.5" fill="var(--neon)" filter="url(#qubiGlow)" />
        {float && (
          <circle cx="100" cy="7" r="5.5" fill="none" stroke="var(--neon)" strokeWidth="2" className="animate-pulse-ring" />
        )}

        {/* arms */}
        <rect x="12" y="72" width="22" height="13" rx="6.5" fill="var(--elevated)" stroke="var(--ink)" strokeWidth="3.5" />
        <rect x="166" y="72" width="22" height="13" rx="6.5" fill="var(--elevated)" stroke="var(--ink)" strokeWidth="3.5" />
        <circle cx="14" cy="78" r="9" fill="var(--cream)" stroke="var(--ink)" strokeWidth="3.5" />
        <circle cx="186" cy="78" r="9" fill="var(--cream)" stroke="var(--ink)" strokeWidth="3.5" />

        {/* feet */}
        <rect x="56" y="146" width="30" height="14" rx="7" fill="var(--elevated)" stroke="var(--ink)" strokeWidth="3.5" />
        <rect x="114" y="146" width="30" height="14" rx="7" fill="var(--elevated)" stroke="var(--ink)" strokeWidth="3.5" />

        {/* shell */}
        <rect
          x="30"
          y="22"
          width="140"
          height="124"
          rx="18"
          fill="url(#qubiShell)"
          stroke="var(--ink)"
          strokeWidth="4.5"
        />

        {/* screen */}
        <rect x="46" y="36" width="108" height="90" rx="9" fill="#070b09" stroke="var(--ink)" strokeWidth="3.5" />
        <g clipPath="url(#qubiScreenClip)">
          <rect x="46" y="36" width="108" height="90" fill="#070b09" />
          <rect x="46" y="36" width="108" height="90" className="crt-lines" opacity="0.5" />
          {/* ambient green wash */}
          <ellipse cx="100" cy="120" rx="70" ry="40" fill="var(--neon)" opacity="0.08" />

          {screenText ? (
            <text
              x="100"
              y="92"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="34"
              fill="var(--neon)"
              filter="url(#qubiGlow)"
              letterSpacing="2"
            >
              {screenText}
            </text>
          ) : (
            <>
              <Eyes mood={mood} />
              <Mouth mood={mood} />
            </>
          )}
        </g>

        {/* HKU badge */}
        <g>
          <rect x="132" y="126" width="34" height="15" rx="4" fill="var(--hku)" />
          <text
            x="149"
            y="137.5"
            textAnchor="middle"
            fontFamily="var(--font-sans)"
            fontSize="11"
            fontWeight="700"
            fill="var(--cream)"
            letterSpacing="0.6"
          >
            HKU
          </text>
        </g>

        {/* speaker grille */}
        <g fill="var(--ink)" opacity="0.55">
          <circle cx="44" cy="134" r="2" />
          <circle cx="52" cy="134" r="2" />
          <circle cx="60" cy="134" r="2" />
        </g>
      </svg>
    </motion.div>
  );
}
