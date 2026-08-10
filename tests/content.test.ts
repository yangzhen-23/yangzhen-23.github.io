import { describe, expect, it } from 'vitest';
import { SITE } from '../src/lib/site';

describe('site identity', () => {
  it('builds links from the confirmed GitHub user identity', () => {
    expect(SITE.url).toBe('https://yangzhen-23.github.io');
    expect(SITE.github).toBe('https://github.com/yangzhen-23');
    expect(SITE.orcid).toBe('https://orcid.org/0009-0004-3322-2117');
    expect(SITE.email).toBe('mailto:yangzhen@stu.ncst.edu.cn');
  });
});
