export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export interface Bounds {
  width: number;
  height: number;
}

export interface PointerPosition {
  x: number;
  y: number;
  active: boolean;
}

export interface ParticleMotionOptions {
  repulseRadius: number;
  repulseStrength: number;
  maxSpeed: number;
}

const DEFAULT_MOTION: ParticleMotionOptions = {
  repulseRadius: 132,
  repulseStrength: 0.34,
  maxSpeed: 1.35,
};

export function particleCount(width: number, height: number, mobile: boolean): number {
  const divisor = mobile ? 26_000 : 19_000;
  const minimum = mobile ? 14 : 22;
  const maximum = mobile ? 38 : 78;
  const areaCount = Math.round((Math.max(0, width) * Math.max(0, height)) / divisor);

  return Math.max(minimum, Math.min(maximum, areaCount));
}

export function advanceParticle(
  particle: Particle,
  bounds: Bounds,
  pointer: PointerPosition = { x: 0, y: 0, active: false },
  options: ParticleMotionOptions = DEFAULT_MOTION,
): Particle {
  let { vx, vy } = particle;

  if (pointer.active) {
    const dx = particle.x - pointer.x;
    const dy = particle.y - pointer.y;
    const distance = Math.hypot(dx, dy);

    if (distance < options.repulseRadius) {
      const safeDistance = Math.max(distance, 0.001);
      const force = (1 - distance / options.repulseRadius) * options.repulseStrength;
      vx += (distance === 0 ? 1 : dx / safeDistance) * force;
      vy += (distance === 0 ? 0 : dy / safeDistance) * force;
    }
  }

  const speed = Math.hypot(vx, vy);
  if (speed > options.maxSpeed) {
    vx = (vx / speed) * options.maxSpeed;
    vy = (vy / speed) * options.maxSpeed;
  }

  let x = particle.x + vx;
  let y = particle.y + vy;

  if (x > bounds.width) x = 0;
  else if (x < 0) x = bounds.width;

  if (y > bounds.height) y = 0;
  else if (y < 0) y = bounds.height;

  return { ...particle, x, y, vx, vy };
}
