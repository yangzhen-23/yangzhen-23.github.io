import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'dist');
const requiredFiles = [
  'index.html',
  'projects/index.html',
  'blog/index.html',
  'blog/graduate-study-expectations/index.html',
  'blog/huge-bench-high-level-uav-vla/index.html',
  'about/index.html',
  'archive/index.html',
  'search/index.html',
  'rss.xml',
  '404.html',
  'sitemap-index.xml',
];

const errors = [];

for (const relativePath of requiredFiles) {
  if (!existsSync(resolve(root, relativePath))) {
    errors.push(`missing: ${relativePath}`);
  }
}

function collectHtml(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((name) => {
    const path = resolve(directory, name);
    return statSync(path).isDirectory() ? collectHtml(path) : path.endsWith('.html') ? [path] : [];
  });
}

for (const htmlPath of collectHtml(root)) {
  const html = readFileSync(htmlPath, 'utf8');
  const relativePath = htmlPath.slice(root.length + 1);

  if (/\b(?:href|src)=["']undefined["']/.test(html)) errors.push(`undefined URL: ${relativePath}`);
  if (/https?:\/\/localhost(?::\d+)?/.test(html)) errors.push(`localhost URL: ${relativePath}`);
  if (!html.includes('data-particle-background')) errors.push(`missing particle background: ${relativePath}`);
}

const homepagePath = resolve(root, 'index.html');
if (existsSync(homepagePath)) {
  const homepage = readFileSync(homepagePath, 'utf8');
  const navLinks = ['href="/"', 'href="/blog/"', 'href="/projects/"', 'href="/archive/"', 'href="/about/"', 'href="/search/"'];
  const navPositions = navLinks.map((link) => homepage.indexOf(link));
  if (navPositions.some((position) => position < 0) || navPositions.some((position, index) => index > 0 && position <= navPositions[index - 1])) {
    errors.push('homepage navigation order is incorrect');
  }
  if ((homepage.match(/data-typewriter/g) ?? []).length < 2) errors.push('homepage requires two typewriter regions');
  const homepageTitle = homepage.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';
  if (homepageTitle.includes('也保持好奇。')) errors.push('homepage title still has terminal punctuation');
  if (homepage.indexOf('data-home-section="writing"') > homepage.indexOf('data-home-section="projects"')) {
    errors.push('latest writing must appear before selected projects');
  }
}

const articlePath = resolve(root, 'blog/graduate-study-expectations/index.html');
if (existsSync(articlePath)) {
  const article = readFileSync(articlePath, 'utf8');
  if (!article.includes('data-reading-toolbar')) errors.push('article is missing reading toolbar');
  if (!article.includes('data-reading-size="medium"')) errors.push('article is missing default reading size');
  if (!article.includes('data-reading-width="narrow"')) errors.push('article is missing default reading width');
  if (!article.includes('data-reading-toc="visible"')) errors.push('article is missing default TOC visibility');
}

if (errors.length > 0) {
  console.error(`Build verification failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`Build verification passed: ${requiredFiles.length} required outputs and ${collectHtml(root).length} HTML files checked.`);
