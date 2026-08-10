import { getCollection } from 'astro:content';
import { isPublished, sortPosts } from '../lib/content';

export async function GET() {
  const posts = sortPosts((await getCollection('blog')).filter((entry) => isPublished(entry)));
  const index = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    url: `/blog/${post.id}/`,
    category: post.data.category,
    tags: post.data.tags,
    publishedAt: post.data.publishedAt.toISOString(),
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

