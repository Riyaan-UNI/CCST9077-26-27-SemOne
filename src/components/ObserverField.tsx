import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  hue: number;
  collapse: number;
}

interface ObserverFieldProps {
  className?: string;
  /** Particles per 10,000 px² of canvas. */
  density?: number;
  /** Radius, in px, within which particles collapse. */
  radius?: number;
}

/**
 * The Observer Field.
 *
 * A custom canvas effect — no particle library — because the signature
 * behaviour is unusual: particles exist as diffuse "superpositions" until the
 * cursor (the observer) comes near, at which point they *collapse* into sharp,
 * definite points, and entangled pairs between collapsed neighbours light up.
 *
 * Move the cursor away and they decohere back into a blur.
 */
export default function ObserverField({ className, density = 0.9, radius = 150 }: ObserverFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const observerMode = useStore((s) => s.observerMode);
  const reduceMotion = useStore((s) => s.reduceMotion);
  const observerModeRef = useRef(observerMode);
  const reduceMotionRef = useRef(reduceMotion);

  useEffect(() => {
    observerModeRef.current = observerMode;
  }, [observerMode]);

  useEffect(() => {
    reduceMotionRef.current = reduceMotion;
  }, [reduceMotion]);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctxEl = canvasEl.getContext('2d', { alpha: true });
    if (!ctxEl) return;
    // Re-bind as non-nullable locals so nested closures keep the narrowing.
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctxEl;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;
    const pointer = { x: -9999, y: -9999, active: false };

    const css = getComputedStyle(document.documentElement);
    const readColor = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;

    let neon = readColor('--neon', '#39ff14');
    let cyan = readColor('--cyan', '#5be3ff');

    const random = (a: number, b: number) => a + Math.random() * (b - a);

    function build() {
      const target = Math.round(((width * height) / 10000) * density);
      const count = Math.max(28, Math.min(190, target));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: random(-0.16, 0.16),
        vy: random(-0.16, 0.16),
        r: random(1.1, 2.6),
        phase: Math.random() * Math.PI * 2,
        hue: Math.random(),
        collapse: 0,
      }));
    }

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    const smoothstep = (t: number) => {
      const x = Math.min(1, Math.max(0, t));
      return x * x * (3 - 2 * x);
    };

    function draw(time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const observing = observerModeRef.current && pointer.active;
      const R = radius;

      // Update + draw particles
      for (const p of particles) {
        p.phase += 0.014;

        if (!reduceMotionRef.current) {
          p.x += p.vx + Math.cos(p.phase) * 0.06;
          p.y += p.vy + Math.sin(p.phase * 0.8) * 0.06;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        let targetCollapse = 0;
        if (observing) {
          const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
          targetCollapse = 1 - smoothstep(d / R);
        }
        p.collapse += (targetCollapse - p.collapse) * 0.12;

        const c = p.collapse;
        const color = p.hue > 0.72 ? cyan : neon;

        if (c > 0.02) {
          // Diffuse superposition: a soft, wide, low-alpha blob.
          const blobR = p.r * (7 - 5 * c);
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, blobR);
          g.addColorStop(0, hexToRgba(color, 0.16 * (1 - c) + 0.04));
          g.addColorStop(1, hexToRgba(color, 0));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, blobR, 0, Math.PI * 2);
          ctx.fill();
        }

        if (c > 0.05) {
          // Collapsed: a sharp, definite point.
          ctx.fillStyle = hexToRgba(color, 0.25 + 0.75 * c);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * (0.7 + 0.5 * c), 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = hexToRgba(color, 0.5 * c);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + 3 + Math.sin(time / 500 + p.phase) * 1.6, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillStyle = hexToRgba(color, 0.35);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.55, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Entanglement links between nearby collapsed particles.
      if (observing) {
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
          const a = particles[i];
          if (a.collapse < 0.35) continue;
          for (let j = i + 1; j < particles.length; j++) {
            const b = particles[j];
            if (b.collapse < 0.35) continue;
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < 96) {
              ctx.strokeStyle = hexToRgba(neon, (1 - d / 96) * 0.34 * a.collapse * b.collapse);
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }
    }

    function hexToRgba(color: string, alpha: number) {
      const value = color.trim();
      if (value.startsWith('#')) {
        let hex = value.slice(1);
        if (hex.length === 3) hex = hex.split('').map((ch) => ch + ch).join('');
        const num = Number.parseInt(hex, 16);
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      return `rgba(57, 255, 20, ${alpha})`;
    }

    function loop(time: number) {
      if (!running) return;
      draw(time);
      raf = requestAnimationFrame(loop);
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    }
    function onPointerLeave() {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    }
    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    }

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);

    raf = requestAnimationFrame(loop);

    // Re-read palette when the theme flips.
    const themeObserver = new MutationObserver(() => {
      const next = getComputedStyle(document.documentElement);
      neon = next.getPropertyValue('--neon').trim() || neon;
      cyan = next.getPropertyValue('--cyan').trim() || cyan;
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density, radius]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    />
  );
}
