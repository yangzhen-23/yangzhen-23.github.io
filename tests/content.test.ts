import { describe, expect, it } from 'vitest';
import {
  isPublished,
  sortPosts,
  uniqueCategories,
  uniqueTags,
  type PostLike,
} from '../src/lib/content';
import { SITE } from '../src/lib/site';

function fakePost(
  id: string,
  publishedAt: string,
  options: Partial<PostLike['data']> = {},
): PostLike {
  return {
    id,
    data: {
      publishedAt: new Date(publishedAt),
      draft: false,
      category: '论文笔记',
      tags: ['具身智能', '无人机'],
      ...options,
    },
  };
}

describe('site identity', () => {
  it('builds links from the confirmed GitHub user identity', () => {
    expect(SITE.url).toBe('https://yangzhen-23.github.io');
    expect(SITE.github).toBe('https://github.com/yangzhen-23');
    expect(SITE.orcid).toBe('https://orcid.org/0009-0004-3322-2117');
    expect(SITE.email).toBe('mailto:yangzhen@stu.ncst.edu.cn');
  });
});

describe('content helpers', () => {
  it('sorts posts newest first without mutating the input', () => {
    const posts = [fakePost('old', '2026-01-01'), fakePost('new', '2026-03-01')];

    expect(sortPosts(posts).map((post) => post.id)).toEqual(['new', 'old']);
    expect(posts.map((post) => post.id)).toEqual(['old', 'new']);
  });

  it('excludes drafts and posts dated after the current time', () => {
    const now = new Date('2026-08-11T00:00:00Z');

    expect(isPublished(fakePost('ready', '2026-08-10'), now)).toBe(true);
    expect(isPublished(fakePost('draft', '2026-08-10', { draft: true }), now)).toBe(false);
    expect(isPublished(fakePost('future', '2026-08-12'), now)).toBe(false);
  });

  it('builds counted, alphabetized tag and category facets', () => {
    const posts = [
      fakePost('one', '2026-08-10'),
      fakePost('two', '2026-08-09', { category: '学习笔记', tags: ['无人机', 'VLA'] }),
    ];

    expect(uniqueTags(posts)).toEqual([
      { label: 'VLA', slug: 'vla', count: 1 },
      { label: '具身智能', slug: '%E5%85%B7%E8%BA%AB%E6%99%BA%E8%83%BD', count: 1 },
      { label: '无人机', slug: '%E6%97%A0%E4%BA%BA%E6%9C%BA', count: 2 },
    ]);
    expect(uniqueCategories(posts)).toEqual([
      { label: '学习笔记', slug: '%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0', count: 1 },
      { label: '论文笔记', slug: '%E8%AE%BA%E6%96%87%E7%AC%94%E8%AE%B0', count: 1 },
    ]);
  });
});
