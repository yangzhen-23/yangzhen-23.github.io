import { describe, expect, it } from 'vitest';
import { PROJECTS } from '../src/data/projects';

describe('project data', () => {
  it('uses unique links to the confirmed GitHub account', () => {
    const urls = PROJECTS.map((project) => project.url);

    expect(PROJECTS).toHaveLength(6);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every((url) => url.startsWith('https://github.com/yangzhen-23/'))).toBe(true);
  });

  it('provides meaningful summaries and tags for every card', () => {
    expect(PROJECTS.every((project) => project.description.length >= 18)).toBe(true);
    expect(PROJECTS.every((project) => project.tags.length >= 2)).toBe(true);
    expect(PROJECTS.filter((project) => project.featured)).toHaveLength(4);
  });
});
