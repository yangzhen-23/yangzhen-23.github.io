export interface PostLike {
  id: string;
  data: {
    publishedAt: Date;
    draft?: boolean;
    category: string;
    tags: string[];
  };
}

export interface Facet {
  label: string;
  slug: string;
  count: number;
}

export function isPublished<T extends PostLike>(entry: T, now = new Date()): boolean {
  return entry.data.draft !== true && entry.data.publishedAt.getTime() <= now.getTime();
}

export function sortPosts<T extends PostLike>(entries: readonly T[]): T[] {
  return [...entries].sort(
    (left, right) => right.data.publishedAt.getTime() - left.data.publishedAt.getTime(),
  );
}

function buildFacets(labels: string[]): Facet[] {
  const counts = new Map<string, number>();

  for (const label of labels) {
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([label, count]) => ({
      label,
      slug: encodeURIComponent(label.toLocaleLowerCase('zh-CN')),
      count,
    }))
    .sort((left, right) => (left.label < right.label ? -1 : left.label > right.label ? 1 : 0));
}

export function uniqueTags<T extends PostLike>(entries: readonly T[]): Facet[] {
  return buildFacets(entries.flatMap((entry) => entry.data.tags));
}

export function uniqueCategories<T extends PostLike>(entries: readonly T[]): Facet[] {
  return buildFacets(entries.map((entry) => entry.data.category));
}

