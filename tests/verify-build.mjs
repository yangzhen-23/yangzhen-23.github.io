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

if (errors.length > 0) {
  console.error(`Build verification failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`Build verification passed: ${requiredFiles.length} required outputs and ${collectHtml(root).length} HTML files checked.`);
