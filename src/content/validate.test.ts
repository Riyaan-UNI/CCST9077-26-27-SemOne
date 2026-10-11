/**
 * Content validation: every public factual claim must carry a source.
 * This test fails the build if any entry in the content layer is malformed
 * or missing a required citation.
 */
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { glossary } from '@/content/glossary';
import { team } from '@/content/team';
import { videos } from '@/data/videos';

const sourceSchema = z.object({
  source: z.string().min(1),
  sourceUrl: z.string().min(1),
  verified: z.boolean(),
});

const glossarySchema = z.object({
  id: z.string().min(1),
  term: z.string().min(1),
  plain: z.string().min(1),
  source: sourceSchema,
});

const confirmedSchema = z.object({
  value: z.string().min(1),
  confirm: z.literal(true),
});

const teamMemberSchema = z.object({
  id: z.string().min(1),
  name: confirmedSchema,
  title: confirmedSchema,
  bio: confirmedSchema,
  contributions: z.array(confirmedSchema).min(1),
  funFact: confirmedSchema,
  deliverables: z.array(z.string()),
  devices: z.array(z.object({ device: z.string(), example: z.string(), note: z.string() })),
});

const videoSlotSchema = z.object({
  id: z.string().min(1),
  episode: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  youtubeId: z.string(),
  status: z.enum(['coming-soon', 'live']),
  transcript: z.string().min(1),
});

describe('glossary entries', () => {
  it('all entries match schema', () => {
    for (const entry of glossary) {
      expect(() => glossarySchema.parse(entry)).not.toThrow();
    }
  });
  it('every public claim has a source', () => {
    for (const entry of glossary) {
      expect(entry.source.source.length).toBeGreaterThan(0);
      expect(entry.source.sourceUrl.length).toBeGreaterThan(0);
    }
  });
});

describe('team members', () => {
  it('all members match schema', () => {
    for (const m of team) {
      expect(() => teamMemberSchema.parse(m)).not.toThrow();
    }
  });
  it('every confirmed field is marked confirm:true', () => {
    for (const m of team) {
      expect(m.name.confirm).toBe(true);
      expect(m.title.confirm).toBe(true);
      expect(m.bio.confirm).toBe(true);
      expect(m.funFact.confirm).toBe(true);
      for (const c of m.contributions) {
        expect(c.confirm).toBe(true);
      }
    }
  });
});

describe('video slots', () => {
  it('all slots match schema', () => {
    for (const v of videos) {
      expect(() => videoSlotSchema.parse(v)).not.toThrow();
    }
  });
  it('there are exactly 5 episodes in Phase 1', () => {
    expect(videos.length).toBe(5);
  });
  it('episode numbers are 1..5 in order', () => {
    for (let i = 0; i < videos.length; i++) {
      expect(videos[i].episode).toBe(i + 1);
    }
  });
});
