# Homepage and Reading Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add looping typewriter quotations, reorder homepage content and navigation, and provide persistent article reading controls without changing the site's restrained visual identity.

**Architecture:** Keep quote content in a dedicated data module and animation behavior in a pure library with a small Astro DOM wrapper. Keep article controls in one self-contained Astro component that drives data attributes on the article layout and persists validated preferences to local storage.

**Tech Stack:** Astro 7, TypeScript 6, native DOM APIs, CSS, Vitest 4.

## Global Constraints

- Do not add third-party runtime dependencies.
- Preserve a complete static fallback sentence when JavaScript is unavailable.
- Respect `prefers-reduced-motion: reduce` by disabling type/delete loops and smooth scrolling.
- Persist only validated reading preferences in browser `localStorage`.
- Preserve the existing dark, restrained, classic visual language.
- Do not stage or commit the unrelated root-level text file.

---

### Task 1: Quote Data and Typewriter State

**Files:**
- Create: `src/data/quotes.ts`
- Create: `src/lib/typewriter.ts`
- Create: `tests/typewriter.test.ts`

**Interfaces:**
- Produces: `HERO_QUOTES: readonly string[]`, `FEATURE_QUOTES: readonly string[]`.
- Produces: `shuffleWithoutImmediateRepeat<T>(items, previous, random?)`, `nextTypewriterFrame(frame)` and `TYPEWRITER_TIMING`.

- [ ] Write failing tests proving shuffle retains every item, avoids an immediate prior item when possible, and the state machine advances typing → holding → deleting → next phrase.
- [ ] Run `npm test -- tests/typewriter.test.ts` and confirm failures are caused by missing production modules.
- [ ] Implement the two separate quote pools and minimal pure typewriter helpers.
- [ ] Run `npm test -- tests/typewriter.test.ts` and confirm all focused tests pass.

### Task 2: Typewriter Astro Component and Homepage Composition

**Files:**
- Create: `src/components/TypewriterText.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/components/Header.astro`
- Modify: `tests/verify-build.mjs`

**Interfaces:**
- Consumes: quote arrays and timing/state helpers from Task 1.
- Produces: `TypewriterText` props `{ phrases: readonly string[]; class?: string; label: string; multiline?: boolean }`.

- [ ] Extend build verification expectations for the requested navigation order, title without terminal punctuation, typewriter hooks, and article-before-project section order.
- [ ] Run `npm run build && npm run verify` and confirm verification fails on missing hooks/order.
- [ ] Implement the reusable typewriter DOM wrapper with static fallback, randomized character timing, input/hold/delete cycling, reduced-motion fallback, cursor styling, and cleanup.
- [ ] Reorder navigation to 首页、博客、项目、归档、关于、搜索.
- [ ] Remove the homepage title's terminal punctuation and replace both quotation areas with separate typewriter pools.
- [ ] Move the latest-articles section before selected projects.
- [ ] Run `npm run build && npm run verify` and confirm the build contract passes.

### Task 3: Reading Preference Model

**Files:**
- Create: `src/lib/reading-preferences.ts`
- Create: `tests/reading-preferences.test.ts`

**Interfaces:**
- Produces: `ReadingPreferences`, `DEFAULT_READING_PREFERENCES`, `parseReadingPreferences(value)`, and `applyReadingPreferenceChange(current, change)`.

- [ ] Write failing tests for defaults, corrupted storage, invalid values, and valid size/width/TOC/open changes.
- [ ] Run `npm test -- tests/reading-preferences.test.ts` and confirm the module-missing failure.
- [ ] Implement strict parsing and immutable preference updates.
- [ ] Run `npm test -- tests/reading-preferences.test.ts` and confirm all focused tests pass.

### Task 4: Article Reading Toolbar

**Files:**
- Create: `src/components/ReadingToolbar.astro`
- Modify: `src/layouts/BlogPostLayout.astro`
- Modify: `tests/verify-build.mjs`

**Interfaces:**
- Consumes: reading preference types/defaults/parser from Task 3.
- Produces: article-only controls using `data-reading-size`, `data-reading-width`, and `data-reading-toc` attributes on the `.post` element.

- [ ] Extend build verification to require the toolbar, its accessible controls, and its article state hooks.
- [ ] Run `npm run build && npm run verify` and confirm failure on missing toolbar hooks.
- [ ] Implement the compact fixed toolbar, top button, small/medium/large size group, narrow/wide group, TOC toggle, mobile behavior, safe local-storage restoration, and reduced-motion scrolling.
- [ ] Update article layout CSS so sizes visibly differ, wide mode expands the reading region on desktop, and hidden TOC removes the empty column.
- [ ] Run `npm run build && npm run verify` and confirm the article contract passes.

### Task 5: Full Verification and Publication

**Files:**
- Verify all touched source, test, spec, and plan files.

- [ ] Run `npm run validate` and require zero diagnostics, all unit tests passing, all pages built, and build verification passing.
- [ ] Inspect generated homepage and article HTML for requested hooks and section order.
- [ ] Run `git diff --check` and inspect `git status -sb` to ensure the unrelated text file remains unstaged.
- [ ] Commit implementation with a focused message and push `main`.
- [ ] Watch `Deploy to GitHub Pages` to success and verify the public homepage and article page return the new markup.
