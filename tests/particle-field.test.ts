import { describe, expect, it } from 'vitest';
import { advanceParticle, particleCount } from '../src/lib/particle-field';

describe('particleCount', () => {
  it('caps desktop density and lowers the same viewport density on mobile', () => {
    expect(particleCount(1920, 1080, false)).toBe(78);
    expect(particleCount(390, 844, true)).toBeLessThan(particleCount(390, 844, false));
  });
});

describe('advanceParticle', () => {
  it('wraps particles that pass the right viewport boundary', () => {
    const next = advanceParticle(
      { x: 101, y: 50, vx: 1, vy: 0, radius: 1 },
      { width: 100, height: 100 },
    );

    expect(next.x).toBe(0);
    expect(next.y).toBe(50);
  });

  it('pushes a nearby particle away from the pointer', () => {
    const next = advanceParticle(
      { x: 60, y: 50, vx: 0, vy: 0, radius: 1 },
      { width: 100, height: 100 },
      { x: 50, y: 50, active: true },
    );

    expect(next.x).toBeGreaterThan(60);
    expect(next.y).toBe(50);
  });

  it('leaves velocity unchanged when the pointer is outside the repulse radius', () => {
    const next = advanceParticle(
      { x: 10, y: 10, vx: 0.4, vy: -0.2, radius: 1 },
      { width: 500, height: 500 },
      { x: 400, y: 400, active: true },
      { repulseRadius: 100, repulseStrength: 0.3, maxSpeed: 1.2 },
    );

    expect(next.vx).toBeCloseTo(0.4);
    expect(next.vy).toBeCloseTo(-0.2);
  });
});
