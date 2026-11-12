/**
 * Validate the sourced glossary and the structure of reviewed team content.
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

const teamMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  fullName: z.string().min(1).optional(),
  nickname: z.string().min(1).optional(),
  title: z.string().min(1),
  contributions: z.array(z.string().min(1)).min(1),
  funFact: z.object({
    text: z.string().min(1),
    reviewStatus: z.literal('reviewed'),
    reference: z.object({
      label: z.string().min(1),
      url: z.string().url().refine((url) => url.startsWith('https://')),
    }),
  }),
  deliverables: z.array(z.string()),
});

const videoSlotSchema = z.object({
  id: z.string().min(1),
  episode: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  thumbnail: z.string().min(1),
  youtubeId: z.string(),
  status: z.enum(['coming-soon', 'live']),
  transcript: z.string().min(1).optional(),
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
  it('has four uniquely identified members with one non-placeholder fun fact each', () => {
    expect(team).toHaveLength(4);
    expect(new Set(team.map((member) => member.id)).size).toBe(4);

    for (const member of team) {
      expect(member.funFact.text).not.toMatch(/\[(?:Add|MEMBER_)/i);
      expect(member.funFact.text.trim().length).toBeGreaterThan(0);
    }
  });

  it('all members match schema', () => {
    for (const m of team) {
      expect(() => teamMemberSchema.parse(m)).not.toThrow();
    }
  });
  it('keeps science facts marked reviewed and omits unprovided bios', () => {
    for (const m of team) {
      expect(m.funFact.reviewStatus).toBe('reviewed');
      expect(m).not.toHaveProperty('bio');
    }
  });
});

describe('video slots', () => {
  it('all slots match schema', () => {
    for (const v of videos) {
      expect(() => videoSlotSchema.parse(v)).not.toThrow();
    }
  });
  it('has four episodes with three published videos and one upcoming slot', () => {
    expect(videos.length).toBe(4);
    expect(videos.slice(0, 3).every((video) => video.status === 'live' && video.youtubeId)).toBe(true);
    expect(videos[3].status).toBe('coming-soon');
  });
  it('episode numbers are 1..4 in order', () => {
    for (let i = 0; i < videos.length; i++) {
      expect(videos[i].episode).toBe(i + 1);
    }
  });
});
