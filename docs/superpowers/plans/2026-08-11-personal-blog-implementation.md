# YangZhen Personal Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify a classic dark Chinese personal site and Markdown blog for `yangzhen-23`, ready for deployment at `https://yangzhen-23.github.io/`.

**Architecture:** Astro 7 pre-renders all routes from local data and a type-safe Markdown content collection. Focused components provide navigation, cards, metadata, article reading aids, and progressive-enhancement search; GitHub Actions builds and deploys the static output to GitHub Pages.

**Tech Stack:** Node.js 24, Astro 7, TypeScript, Astro Content Collections, Vitest, `@astrojs/rss`, `@astrojs/sitemap`, `remark-math`, `rehype-katex`, CSS, GitHub Actions.

## Global Constraints

- Site URL is exactly `https://yangzhen-23.github.io/`; the user site repository has no path base.
- The primary language is Chinese; project names and standard technical terms may remain English.
- The visual style is classic, restrained dark navy with muted indigo accents and minimal motion.
- Confirmed identity only: `YangZhen`, `yangzhen-23`, `yangzhen@stu.ncst.edu.cn`, ORCID `0009-0004-3322-2117`.
- Do not invent education, employment, awards, publications, or personal experiences.
- Core reading and navigation must work without client JavaScript.
- Blog metadata is validated at build time; posts use Markdown or MDX.
- The HUGE-Bench article must separate reported evidence, interpretation, and first-person opinion.

---

## Planned File Structure

```text
.
├── .github/workflows/deploy.yml       # GitHub Pages build and deployment
├── astro.config.mjs                   # Site URL, sitemap, Markdown plugins
├── package.json                       # Commands and dependencies
├── tsconfig.json                      # Strict Astro TypeScript config
├── public/
│   ├── favicon.svg                    # Local brand mark
│   ├── robots.txt                     # Crawl policy and sitemap location
│   └── images/huge-bench/             # Selected paper figures
├── src/
│   ├── components/
│   │   ├── ArticleCard.astro          # Reusable article summary
│   │   ├── Footer.astro               # Identity and external links
│   │   ├── Header.astro               # Desktop/mobile navigation
│   │   ├── ProjectCard.astro          # Project summary
│   │   ├── SearchPanel.astro          # Progressive client-side search
│   │   └── TableOfContents.astro      # Article heading navigation
│   ├── content/blog/
│   │   └── huge-bench-high-level-uav-vla.md
│   ├── content.config.ts              # Blog collection loader and schema
│   ├── data/projects.ts               # Curated public repositories
│   ├── layouts/
│   │   ├── BaseLayout.astro           # Document shell, metadata, CSP-safe head
│   │   └── BlogPostLayout.astro       # Reading layout and post navigation
│   ├── lib/
│   │   ├── content.ts                 # Sorting, facets, draft filtering
│   │   └── site.ts                    # Confirmed site identity and links
│   ├── pages/
│   │   ├── 404.astro
│   │   ├── about.astro
│   │   ├── archive.astro
│   │   ├── blog/[...id].astro
│   │   ├── blog/index.astro
│   │   ├── categories/[category].astro
│   │   ├── categories/index.astro
│   │   ├── index.astro
│   │   ├── projects.astro
│   │   ├── rss.xml.ts
│   │   ├── search.astro
│   │   ├── search-index.json.ts
│   │   ├── tags/[tag].astro
│   │   └── tags/index.astro
│   └── styles/global.css               # Tokens, layout, prose, responsive styles
├── tests/
│   ├── content.test.ts                 # Content helper unit tests
│   ├── projects.test.ts                # Project data integrity tests
│   └── verify-build.mjs                # Required output/link checks
└── README.md                            # Beginner writing and deployment guide
```

### Task 1: Astro Foundation and Typed Site Configuration

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/lib/site.ts`
- Create: `src/content.config.ts`
- Create: `public/favicon.svg`
- Create: `public/robots.txt`
- Test: `tests/content.test.ts`

**Interfaces:**
- Produces: `SITE` readonly object with `title`, `name`, `description`, `url`, `github`, `email`, `orcid`, and `avatar` strings.
- Produces: `blog` collection entries with `title`, `description`, `publishedAt`, optional `updatedAt`, `category`, `tags`, optional `cover`, and `draft`.

- [ ] **Step 1: Create the package manifest and strict Astro configuration**

Use scripts `dev`, `check`, `test`, `build`, `verify`, and `validate`, with `validate` running check, tests, build, and build verification in order. Configure `site: 'https://yangzhen-23.github.io'`, `trailingSlash: 'always'`, sitemap integration, `remark-math`, and `rehype-katex`.

- [ ] **Step 2: Install current compatible production and test dependencies**

Run:

```powershell
npm install astro@latest @astrojs/rss@latest @astrojs/sitemap@latest katex@latest rehype-katex@latest remark-math@latest
npm install --save-dev @astrojs/check@latest typescript@latest vitest@latest
```

Expected: Node is 24, `package-lock.json` is created, and no dependency installation error remains.

- [ ] **Step 3: Write the failing schema and identity test**

```ts
import { describe, expect, it } from 'vitest';
import { SITE } from '../src/lib/site';

describe('site identity', () => {
  it('uses the GitHub user site URL and confirmed public identity', () => {
    expect(SITE.url).toBe('https://yangzhen-23.github.io');
    expect(SITE.github).toBe('https://github.com/yangzhen-23');
    expect(SITE.orcid).toContain('0009-0004-3322-2117');
  });
});
```

- [ ] **Step 4: Run the test and verify the missing module failure**

Run: `npm test -- tests/content.test.ts`

Expected: FAIL because `src/lib/site.ts` does not exist.

- [ ] **Step 5: Implement `SITE` and the blog collection schema**

```ts
export const SITE = {
  title: "YangZhen's Space",
  name: 'YangZhen',
  description: '记录技术、研究与持续探索。',
  url: 'https://yangzhen-23.github.io',
  github: 'https://github.com/yangzhen-23',
  email: 'mailto:yangzhen@stu.ncst.edu.cn',
  orcid: 'https://orcid.org/0009-0004-3322-2117',
  avatar: 'https://avatars.githubusercontent.com/u/272827252?v=4',
} as const;
```

Define the Astro 7 collection using `glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' })` and `z` from `astro/zod`. Require non-empty title/description/category, at least one tag, and coerce dates.

- [ ] **Step 6: Run the unit test and Astro check**

Run: `npm test -- tests/content.test.ts` and `npm run check`

Expected: PASS; Astro accepts the config and collection schema.

- [ ] **Step 7: Commit the foundation**

```powershell
git add package.json package-lock.json astro.config.mjs tsconfig.json src/lib/site.ts src/content.config.ts public/favicon.svg public/robots.txt tests/content.test.ts
git commit -m "feat: scaffold Astro blog foundation"
```

### Task 2: Content Utilities and Curated Project Data

**Files:**
- Create: `src/lib/content.ts`
- Create: `src/data/projects.ts`
- Modify: `tests/content.test.ts`
- Create: `tests/projects.test.ts`

**Interfaces:**
- Produces: `isPublished(entry, now): boolean`, `sortPosts(entries): entries`, `uniqueTags(entries): Facet[]`, `uniqueCategories(entries): Facet[]`.
- Produces: `PROJECTS: Project[]`, where `Project` contains `name`, `description`, `url`, `tags`, and `featured`.

- [ ] **Step 1: Write failing tests for publish filtering, ordering, facets, and projects**

```ts
it('filters drafts and sorts newest first', () => {
  const posts = [fakePost('old', '2026-01-01'), fakePost('new', '2026-03-01')];
  expect(sortPosts(posts).map((post) => post.id)).toEqual(['new', 'old']);
});

it('has unique HTTPS repository links', () => {
  expect(new Set(PROJECTS.map((project) => project.url)).size).toBe(PROJECTS.length);
  expect(PROJECTS.every((project) => project.url.startsWith('https://github.com/yangzhen-23/'))).toBe(true);
});
```

- [ ] **Step 2: Run tests and confirm missing exports**

Run: `npm test -- tests/content.test.ts tests/projects.test.ts`

Expected: FAIL because content utilities and project data do not exist.

- [ ] **Step 3: Implement pure content helpers and six conservative project records**

Use normalized lower-case facet slugs via `encodeURIComponent(label.toLocaleLowerCase('zh-CN'))`. Curate `MoireDet`, `Academic-Detective`, `nature-skills`, `AutoEmailSender`, `Mineradio`, and `RL_SuperMario`; descriptions must state only what the repository name or public README confirms.

- [ ] **Step 4: Run focused tests**

Run: `npm test -- tests/content.test.ts tests/projects.test.ts`

Expected: PASS with stable date ordering, facet counts, and valid project URLs.

- [ ] **Step 5: Commit data and helpers**

```powershell
git add src/lib/content.ts src/data/projects.ts tests/content.test.ts tests/projects.test.ts
git commit -m "feat: add content helpers and project data"
```

### Task 3: Shared Layout, Navigation, and Classic Dark Theme

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`

**Interfaces:**
- Consumes: `SITE` from `src/lib/site.ts`.
- Produces: `<BaseLayout title description image?>` with skip link, canonical metadata, Open Graph metadata, header, main content, and footer.

- [ ] **Step 1: Add the BaseLayout shell with semantic landmarks**

The document must include `<html lang="zh-CN">`, a visible-on-focus skip link, `<header>`, `<main id="main-content">`, and `<footer>`. External identity links use descriptive accessible labels.

- [ ] **Step 2: Implement responsive header behavior with progressive enhancement**

Use an HTML button with `aria-expanded`, a navigation list, and a small inline module that only toggles the mobile menu. Without JavaScript, the links remain visible in normal document flow.

- [ ] **Step 3: Implement the restrained visual system**

Define CSS custom properties for `--bg: #0b0f17`, `--surface: #111827`, `--surface-2: #172033`, `--text: #e6eaf2`, `--muted: #9aa6ba`, `--accent: #7186ff`, and `--accent-2: #8b6dd8`. Limit prose width to `72ch`, use 44px minimum interactive targets on touch layouts, and disable non-essential motion under `prefers-reduced-motion: reduce`.

- [ ] **Step 4: Run Astro check**

Run: `npm run check`

Expected: PASS with no invalid props, inaccessible image alt omissions, or TypeScript errors.

- [ ] **Step 5: Commit the global shell**

```powershell
git add src/styles/global.css src/layouts/BaseLayout.astro src/components/Header.astro src/components/Footer.astro
git commit -m "feat: add accessible dark site shell"
```

### Task 4: Home, Projects, About, and 404 Pages

**Files:**
- Create: `src/components/ProjectCard.astro`
- Create: `src/pages/index.astro`
- Create: `src/pages/projects.astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/404.astro`

**Interfaces:**
- Consumes: `SITE`, `PROJECTS`, and published blog entries.
- Produces: `/`, `/projects/`, `/about/`, and `/404.html`.

- [ ] **Step 1: Build the home hero and content sections**

Use the copy `探索、记录，也保持好奇。` and `这里收录我的项目、技术阅读与学习过程。` Include “开始阅读” and GitHub actions, the GitHub avatar with a local initials fallback, a short original reflection paragraph, featured projects, and latest posts.

- [ ] **Step 2: Build project cards and the projects page**

Each card shows the project name, conservative description, tags, and a “查看 GitHub” link. Do not display star counts that can become stale.

- [ ] **Step 3: Build the confirmed-identity about page**

Display only name, GitHub, public email, ORCID, and a short statement about recording technical exploration. Do not add school or major.

- [ ] **Step 4: Build a useful 404 page**

Include the text `这里暂时没有你要找的页面。`, plus links to `/` and `/blog/`.

- [ ] **Step 5: Run Astro check and production build**

Run: `npm run check` and `npm run build`

Expected: PASS; `dist/index.html`, `dist/projects/index.html`, `dist/about/index.html`, and `dist/404.html` exist.

- [ ] **Step 6: Commit the primary pages**

```powershell
git add src/components/ProjectCard.astro src/pages/index.astro src/pages/projects.astro src/pages/about.astro src/pages/404.astro
git commit -m "feat: build personal and project pages"
```

### Task 5: Blog Routes, Facets, Search, RSS, and Reading Layout

**Files:**
- Create: `src/components/ArticleCard.astro`
- Create: `src/components/SearchPanel.astro`
- Create: `src/components/TableOfContents.astro`
- Create: `src/layouts/BlogPostLayout.astro`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[...id].astro`
- Create: `src/pages/tags/index.astro`
- Create: `src/pages/tags/[tag].astro`
- Create: `src/pages/categories/index.astro`
- Create: `src/pages/categories/[category].astro`
- Create: `src/pages/archive.astro`
- Create: `src/pages/search.astro`
- Create: `src/pages/search-index.json.ts`
- Create: `src/pages/rss.xml.ts`

**Interfaces:**
- Consumes: collection entries plus `sortPosts`, `uniqueTags`, and `uniqueCategories`.
- Produces: article list/detail routes, facet routes, archive, a JSON search index, RSS, post navigation, and table of contents.

- [ ] **Step 1: Implement article cards and list routes**

Cards show title, description, formatted date, category, tags, and estimated reading minutes. Category, tag, and archive pages use the same card component and published-entry filter.

- [ ] **Step 2: Implement static article routes and reading layout**

Use `getStaticPaths()` with `getCollection('blog', isPublished)` and `render(entry)`. Pass `headings` to the table of contents and compute adjacent posts from the globally sorted published list.

- [ ] **Step 3: Implement progressive search**

`search-index.json.ts` returns only title, description, URL, category, tags, and ISO date. `SearchPanel.astro` provides a normal link list before JavaScript loads, then filters entries using normalized lower-case substring matching over title, description, category, and tags.

- [ ] **Step 4: Implement RSS and sitemap outputs**

Use `@astrojs/rss` with the configured site URL and published collection entries. The sitemap integration must discover all pre-rendered routes.

- [ ] **Step 5: Run check and build**

Run: `npm run check` and `npm run build`

Expected: PASS; blog, tag, category, archive, search, `rss.xml`, and sitemap files appear in `dist/`.

- [ ] **Step 6: Commit the blog system**

```powershell
git add src/components/ArticleCard.astro src/components/SearchPanel.astro src/components/TableOfContents.astro src/layouts/BlogPostLayout.astro src/pages/blog src/pages/tags src/pages/categories src/pages/archive.astro src/pages/search.astro src/pages/search-index.json.ts src/pages/rss.xml.ts
git commit -m "feat: add complete static blog experience"
```

### Task 6: Rewrite and Publish the HUGE-Bench Article

**Files:**
- Create: `src/content/blog/huge-bench-high-level-uav-vla.md`
- Create: `public/images/huge-bench/fig01-overview.png`
- Create: `public/images/huge-bench/fig02-pipeline.png`
- Create: `public/images/huge-bench/fig03-vln-vs-hlvla.png`
- Create: `public/images/huge-bench/table02-main-results.png`
- Create: `public/images/huge-bench/fig07-collision-cases.png`
- Create: `public/images/huge-bench/fig13-failure-cases.png`

**Interfaces:**
- Consumes: the user-provided `paper.md` and six matching local assets.
- Produces: a complete published blog entry with valid collection metadata and source attribution.

- [ ] **Step 1: Copy the six exact source figures into the public article directory**

Use `Copy-Item -LiteralPath` for each explicitly named source file. Do not move, delete, recompress, or alter the originals.

- [ ] **Step 2: Draft the article around a human reading narrative**

Use the title `HUGE-Bench：从“听懂指令”到“安全完成任务”`. Open with the practical mismatch between “巡检左侧建筑” and detailed route following. Explain the task, digital-twin pipeline, metrics, experiment, and limitations in that order. Avoid generic openings such as “随着人工智能的快速发展” and avoid repetitive summary phrases.

- [ ] **Step 3: Preserve exact evidence and interpretation boundaries**

Include: 4 scenes, 8 tasks, 2.56M meters, 5,330/593/294 train/seen/unseen trajectories, and the table values for OpenVLA, MemoryVLA, FastVLM, `pi_0`, depth-aware `pi_0.5`, and `pi_0.5`. State that low collision from little movement is not meaningful safety, and that real/synthetic comparison remains evaluated in simulation.

- [ ] **Step 4: Add first-person analysis grounded in the user's notes**

Use language such as `我更倾向于把这类系统拆成高层规划、技能执行和独立安全约束三层` and `在我看来，四个场景带来的最大问题不是轨迹总量，而是外观与几何多样性仍然有限`. Present these as analysis, not as paper claims.

- [ ] **Step 5: Run collection validation and build**

Run: `npm run check`, `npm test`, and `npm run build`.

Expected: PASS; `/blog/huge-bench-high-level-uav-vla/` renders all six images, equations, result table, headings, and links.

- [ ] **Step 6: Commit the first article**

```powershell
git add src/content/blog/huge-bench-high-level-uav-vla.md public/images/huge-bench
git commit -m "content: publish HUGE-Bench reading notes"
```

### Task 7: Beginner Documentation, Deployment, and Final Verification

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `tests/verify-build.mjs`
- Create: `README.md`
- Modify: `package.json`

**Interfaces:**
- Produces: repeatable local validation, GitHub Pages workflow, and beginner writing instructions.

- [ ] **Step 1: Write the failing build-output verifier**

The verifier must assert the existence of `dist/index.html`, `dist/projects/index.html`, `dist/blog/index.html`, the HUGE-Bench article, `dist/about/index.html`, `dist/archive/index.html`, `dist/search/index.html`, `dist/rss.xml`, and `dist/404.html`. It must scan generated HTML for accidental `href="undefined"`, `src="undefined"`, and unresolved `localhost` URLs.

- [ ] **Step 2: Run the verifier before a build**

Run: `npm run verify`

Expected: FAIL if `dist/` is absent or incomplete, proving the verifier detects missing output.

- [ ] **Step 3: Add the official GitHub Pages workflow**

Use `actions/checkout@v6`, `withastro/action@v6`, and `actions/deploy-pages@v4`; set `contents: read`, `pages: write`, and `id-token: write`, and deploy only from pushes to `main` or manual dispatch. Pin the Astro action input to Node 24.

- [ ] **Step 4: Write a beginner README**

Document Node 24, `npm install`, `npm run dev`, `npm run validate`, the exact blog frontmatter template, where to place images, how draft mode works, and the one-time GitHub Pages setting `Settings → Pages → Source: GitHub Actions`.

- [ ] **Step 5: Build and run the verifier**

Run: `npm run validate`

Expected: check PASS, all Vitest tests PASS, production build PASS, and output verifier PASS.

- [ ] **Step 6: Inspect the site at desktop and mobile widths**

Run the local preview and inspect at 1440×900, 768×1024, and 390×844. Verify no horizontal scroll, visible keyboard focus, usable mobile navigation, readable article width, working table of contents, search, and image captions.

- [ ] **Step 7: Commit deployment and documentation**

```powershell
git add .github/workflows/deploy.yml tests/verify-build.mjs README.md package.json package-lock.json
git commit -m "chore: add Pages deployment and verification"
```

- [ ] **Step 8: Perform final repository checks before any remote mutation**

Run: `git status --short`, `git log --oneline --decorate -8`, and `npm run validate`.

Expected: clean working tree and a fresh successful validation. Inspect the remote repository state before creating or pushing `yangzhen-23/yangzhen-23.github.io`.
