import { describe, expect, it } from 'vitest';
import { PROJECTS } from '../src/data/projects';

describe('project data', () => {
  it('supports an extensible set of unique GitHub project links', () => {
    const urls = PROJECTS.map((project) => project.url);

    expect(PROJECTS.length).toBeGreaterThan(0);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every((url) => url.startsWith('https://github.com/yangzhen-23/'))).toBe(true);
  });

  it('provides complete card content and a manageable featured section', () => {
    const featuredCount = PROJECTS.filter((project) => project.featured).length;

    expect(PROJECTS.every((project) => project.description.length >= 18)).toBe(true);
    expect(PROJECTS.every((project) => project.tags.length >= 2)).toBe(true);
    expect(featuredCount).toBeGreaterThan(0);
    expect(featuredCount).toBeLessThanOrEqual(4);
  });
});
