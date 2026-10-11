# Content Guide for Non-Coders

This file explains how to edit the site without touching React code.
Everything lives in plain text files inside `/src/content` and `/src/data`.
If you can edit a Word document, you can edit these.

## How to add a video

1. Open `src/data/videos.ts`.
2. Find the placeholder for the episode you want to publish.
3. Replace the empty `youtubeId: ''` with the real YouTube video id (the part after `v=`).
4. Change `status: 'coming-soon'` to `status: 'live'`.
5. Update the `transcript` field if you have one.
6. Save and commit.

> If you are not sure of the id, open the YouTube page and copy the letters after `v=`.

## How to add a timeline event

1. Open `src/data/timeline.ts`.
2. Add a new object to the `timeline` array.
3. Required fields: `id` (one word), `year` (number), `era` (`codes`, `theory`, `algorithms` or `hardware`), `title` (short), `blurb` (one paragraph), `qubiSays` (a one-line Qubi comment).
4. Save and commit.

## How to add a hype-check item

1. Open `src/data/hypeCheck.ts`.
2. Add an entry to the array with `id`, `claim`, `verdict` (`myth`, `fact` or `nuance`) and `explanation`.
3. Save and commit.

## How to edit a team bio

1. Open `src/content/team.ts`.
2. Find the member whose bio you want to change.
3. Edit the `value` inside the `bio`, `contributions` or `funFact` fields.
4. Keep `confirm: true` on every line you are confident about.
5. Save and commit.

## How to edit glossary terms

1. Open `src/content/glossary.ts`.
2. Add or edit an entry. Every term needs:
   - `id` (one word, no spaces)
   - `term` (the word shown to the visitor)
   - `plain` (one plain-English sentence)
   - `source` (who said it, and a URL)
3. Save and commit.

## How to change the brand mode

By default the site runs in **generic** mode (no HKU name or crest anywhere).
If you receive written permission from the course staff to show HKU branding,
set the environment variable `VITE_BRAND_MODE=hku` at build time.

## Need help?

Ask the team member who built the site. They can walk you through it in five minutes.
