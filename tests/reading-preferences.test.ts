import { describe, expect, it } from 'vitest';
import {
  DEFAULT_READING_PREFERENCES,
  applyReadingPreferenceChange,
  parseReadingPreferences,
} from '../src/lib/reading-preferences';

describe('reading preferences', () => {
  it('uses stable defaults when storage is absent or corrupted', () => {
    expect(parseReadingPreferences(null)).toEqual(DEFAULT_READING_PREFERENCES);
    expect(parseReadingPreferences('{broken')).toEqual(DEFAULT_READING_PREFERENCES);
  });

  it('accepts valid saved values and rejects invalid choices independently', () => {
    expect(parseReadingPreferences(JSON.stringify({
      size: 'large',
      width: 'wide',
      toc: 'hidden',
      toolbarOpen: true,
    }))).toEqual({ size: 'large', width: 'wide', toc: 'hidden', toolbarOpen: true });

    expect(parseReadingPreferences(JSON.stringify({
      size: 'huge',
      width: 'edge-to-edge',
      toc: false,
      toolbarOpen: 'yes',
    }))).toEqual(DEFAULT_READING_PREFERENCES);
  });

  it('updates one setting without mutating the prior preferences', () => {
    const current = DEFAULT_READING_PREFERENCES;
    const updated = applyReadingPreferenceChange(current, { size: 'small' });

    expect(updated).toEqual({ ...DEFAULT_READING_PREFERENCES, size: 'small' });
    expect(current).toEqual(DEFAULT_READING_PREFERENCES);
  });
});
