import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind-aware class name joiner. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Resolve a path inside /public against the deployment base URL.
 *
 * Files referenced as "/gallery/x.svg" work when the site is served from the
 * domain root, but 404 when it is served from a sub-path (GitHub Pages project
 * sites). Always build public-asset paths with this helper.
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${path.replace(/^\/+/, '')}`;
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export const range = (n: number) => Array.from({ length: n }, (_, i) => i);
