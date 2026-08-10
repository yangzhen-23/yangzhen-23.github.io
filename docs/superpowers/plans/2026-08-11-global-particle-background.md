# Global Particle Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a restrained, pointer-repelling particle network behind every site page.

**Architecture:** Keep simulation math in a pure TypeScript module and place browser lifecycle/rendering in one Astro component mounted by `BaseLayout`. The component draws on a fixed non-interactive Canvas while all site content remains in a higher stacking layer.

**Tech Stack:** Astro 7, TypeScript 6, Canvas 2D, Vitest 4, CSS

## Global Constraints

- Use no third-party particle runtime.
- Render on every page without intercepting pointer clicks.
- Disable animation for `prefers-reduced-motion: reduce`.
- Reduce density on viewports narrower than 760 px.
- Preserve the existing dark navy/indigo visual system and readable article surfaces.
- Do not add click-to-spawn or a settings panel.

---

### Task 1: Particle simulation helpers

**Files:**
- Create: `tests/particle-field.test.ts`
- Create: `src/lib/particle-field.ts`

**Interfaces:**
- Produces: `Particle`, `PointerPosition`, `particleCount(width, height, mobile)`, `advanceParticle(particle, bounds, pointer, options)`.
- Consumes: no browser globals; functions remain directly testable in Node.

- [ ] **Step 1: Write failing behavior tests**

```ts
import { describe, expect, it } from 'vitest';
import { advanceParticle, particleCount } from '../src/lib/particle-field';

describe('particleCount', () => {
  it('caps desktop density and lowers it on mobile', () => {
    expect(particleCount(1920, 1080, false)).toBeLessThanOrEqual(78);
    expect(particleCount(390, 844, true)).toBeLessThan(particleCount(390, 844, false));
  });
});

describe('advanceParticle', () => {
  it('wraps particles across viewport bounds', () => {
    const next = advanceParticle({ x: 101, y: 50, vx: 1, vy: 0, radius: 1 }, { width: 100, height: 100 });
    expect(next.x).toBe(0);
  });

  it('pushes a nearby particle away from the pointer', () => {
    const next = advanceParticle(
      { x: 60, y: 50, vx: 0, vy: 0, radius: 1 },
      { width: 100, height: 100 },
      { x: 50, y: 50, active: true },
    );
    expect(next.x).toBeGreaterThan(60);
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- tests/particle-field.test.ts`

Expected: FAIL because `src/lib/particle-field.ts` does not exist.

- [ ] **Step 3: Implement the minimal pure simulation API**

```ts
export interface Particle { x: number; y: number; vx: number; vy: number; radius: number }
export interface Bounds { width: number; height: number }
export interface PointerPosition { x: number; y: number; active: boolean }

export function particleCount(width: number, height: number, mobile: boolean) {
  const divisor = mobile ? 26000 : 19000;
  return Math.max(mobile ? 14 : 22, Math.min(mobile ? 38 : 78, Math.round((width * height) / divisor)));
}

export function advanceParticle(
  particle: Particle,
  bounds: Bounds,
  pointer: PointerPosition = { x: 0, y: 0, active: false },
  options = { repulseRadius: 132, repulseStrength: 0.34, friction: 0.985 },
): Particle {
  // Copy state, add repulsion inside the radius, apply friction and velocity,
  // then wrap x/y to the opposite viewport edge.
}
```

- [ ] **Step 4: Run the focused and full tests**

Run: `npm test -- tests/particle-field.test.ts && npm test`

Expected: all particle tests and the existing six tests PASS.

- [ ] **Step 5: Commit the simulation unit**

```bash
git add tests/particle-field.test.ts src/lib/particle-field.ts
git commit -m "feat: add particle field simulation"
```

### Task 2: Global Canvas renderer and layout integration

**Files:**
- Create: `src/components/ParticleBackground.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`
- Modify: `tests/verify-build.mjs`

**Interfaces:**
- Consumes: `Particle`, `PointerPosition`, `particleCount`, and `advanceParticle` from Task 1.
- Produces: one decorative global `<canvas data-particle-background aria-hidden="true">` mounted once per page.

- [ ] **Step 1: Add a failing build-contract assertion**

Extend `tests/verify-build.mjs` so every generated HTML file must contain `data-particle-background` and report `missing particle background: <path>` when absent.

- [ ] **Step 2: Run build verification and verify RED**

Run: `npm run build && npm run verify`

Expected: FAIL because generated pages do not contain the Canvas marker.

- [ ] **Step 3: Create the Canvas component**

The component must:

```astro
<canvas class="particle-background" data-particle-background aria-hidden="true"></canvas>
<script>
  import { advanceParticle, particleCount, type Particle, type PointerPosition } from '../lib/particle-field';
  // Exit when reduced motion is requested.
  // Scale backing pixels by min(devicePixelRatio, 2).
  // Seed low-speed blue/purple particles.
  // Draw distance-faded connecting lines and circles each animation frame.
  // Update pointer from window pointermove/pointerleave without taking click events.
  // Pause on document.hidden and rebuild on resize.
</script>
```

- [ ] **Step 4: Mount globally and establish stacking layers**

Import `ParticleBackground` in `BaseLayout.astro`, render it immediately after the skip link, and update global CSS:

```css
.particle-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.site-header,
#main-content,
.site-footer,
.skip-link {
  position: relative;
  z-index: 1;
}
```

Use translucent existing surfaces where necessary so particles remain visible but never reduce text contrast.

- [ ] **Step 5: Run focused verification and full validation**

Run: `npm run build && npm run verify && npm run validate`

Expected: build contract PASS; Astro reports zero errors/warnings; all tests PASS; 15 pages build.

- [ ] **Step 6: Perform visual QA**

Run the production preview, capture desktop screenshots of `/` and `/blog/huge-bench-high-level-uav-vla/`, plus a narrow viewport screenshot of `/projects/`. Confirm visible low-contrast particles, readable content, pointer-safe controls, and no horizontal overflow.

- [ ] **Step 7: Commit the global renderer**

```bash
git add src/components/ParticleBackground.astro src/layouts/BaseLayout.astro src/styles/global.css tests/verify-build.mjs
git commit -m "feat: add global interactive particle background"
```

### Task 3: Publish and verify production

**Files:**
- No source changes expected.

**Interfaces:**
- Consumes: clean validated `main` branch.
- Produces: deployed GitHub Pages revision matching the local HEAD.

- [ ] **Step 1: Confirm clean scope and push**

Run: `git status -sb && git push origin main`

Expected: clean `main` tracking `origin/main`; push advances the remote without force.

- [ ] **Step 2: Verify deployment and live pages**

Check the newest `Deploy to GitHub Pages` workflow for `completed/success`, then request `/`, `/projects/`, and `/blog/huge-bench-high-level-uav-vla/` and confirm HTTP 200 plus the Canvas marker.

- [ ] **Step 3: Report outcome**

Provide the live site, workflow URL, validation counts, and the local files that control particle density/appearance.

