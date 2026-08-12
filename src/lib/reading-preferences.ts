export type ReadingSize = 'small' | 'medium' | 'large';
export type ReadingWidth = 'narrow' | 'wide';
export type TocVisibility = 'visible' | 'hidden';

export interface ReadingPreferences {
  size: ReadingSize;
  width: ReadingWidth;
  toc: TocVisibility;
  toolbarOpen: boolean;
}

export const DEFAULT_READING_PREFERENCES: ReadingPreferences = {
  size: 'medium',
  width: 'narrow',
  toc: 'visible',
  toolbarOpen: false,
};

const sizes: readonly ReadingSize[] = ['small', 'medium', 'large'];
const widths: readonly ReadingWidth[] = ['narrow', 'wide'];
const tocOptions: readonly TocVisibility[] = ['visible', 'hidden'];

export function parseReadingPreferences(value: string | null): ReadingPreferences {
  if (!value) return { ...DEFAULT_READING_PREFERENCES };

  try {
    const parsed = JSON.parse(value) as Partial<ReadingPreferences>;
    if (
      !sizes.includes(parsed.size as ReadingSize)
      || !widths.includes(parsed.width as ReadingWidth)
      || !tocOptions.includes(parsed.toc as TocVisibility)
      || typeof parsed.toolbarOpen !== 'boolean'
    ) return { ...DEFAULT_READING_PREFERENCES };

    return parsed as ReadingPreferences;
  } catch {
    return { ...DEFAULT_READING_PREFERENCES };
  }
}

export function applyReadingPreferenceChange(
  current: ReadingPreferences,
  change: Partial<ReadingPreferences>,
): ReadingPreferences {
  return { ...current, ...change };
}
