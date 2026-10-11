/**
 * Global brand + feature configuration.
 *
 * BRAND_MODE
 *  - 'hku'     : full HKU name + crest may appear (requires written permission
 *                from the course staff — do NOT flip this until confirmed).
 *  - 'generic' : the mascot's tee shows a "Q", and NO HKU name or crest appears
 *                anywhere in the UI. This is the safe default.
 *
 * Override at build time with VITE_BRAND_MODE=hku for an authorised build.
 */
export type BrandMode = 'hku' | 'generic';

export const BRAND_MODE: BrandMode =
  (import.meta.env.VITE_BRAND_MODE as BrandMode) || 'generic';

export const isHkuBrand = BRAND_MODE === 'hku';

/**
 * One-line feature flags. Toggling a phase on/off here keeps the rest of the
 * codebase readable. Phase 1 is live; later phases render a "coming soon"
 * placeholder until their build lands.
 */
export const FEATURES = {
  lab: true,
  videos: true,
  team: true,
  timeline: true,
  gallery: true,
  glossary: true,
  courseMap: false,
  computer: false,
} as const;
