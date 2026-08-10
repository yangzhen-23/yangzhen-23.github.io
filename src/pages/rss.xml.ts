import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { isPublished, sortPosts } from '../lib/content';
import { SITE } from '../lib/site';

export async function GET(context: { site: URL }) {
  const posts = sortPosts((await getCollection('blog')).filter((entry) => isPublished(entry)));

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: `/blog/${post.id}/`,
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: '<language>zh-CN</language>',
  });
}
