export type TypewriterPhase = 'typing' | 'holding' | 'deleting';

export interface TypewriterFrame {
  phrases: readonly string[];
  phraseIndex: number;
  visibleCharacters: number;
  phase: TypewriterPhase;
}

export const TYPEWRITER_TIMING = {
  typing: 78,
  deleting: 42,
  hold: 2400,
  between: 320,
  jitter: 34,
} as const;

export function shuffleWithoutImmediateRepeat<T>(
  items: readonly T[],
  previous?: T,
  random: () => number = Math.random,
): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }

  if (shuffled.length > 1 && previous !== undefined && Object.is(shuffled[0], previous)) {
    const replacement = shuffled.findIndex((item) => !Object.is(item, previous));
    [shuffled[0], shuffled[replacement]] = [shuffled[replacement], shuffled[0]];
  }

  return shuffled;
}

export function createTypewriterFrame(phrases: readonly string[]): TypewriterFrame {
  if (phrases.length === 0) throw new Error('Typewriter requires at least one phrase.');

  return { phrases, phraseIndex: 0, visibleCharacters: 0, phase: 'typing' };
}

export function nextTypewriterFrame(frame: TypewriterFrame): TypewriterFrame {
  const phraseLength = Array.from(frame.phrases[frame.phraseIndex]).length;

  if (frame.phase === 'typing') {
    const visibleCharacters = Math.min(frame.visibleCharacters + 1, phraseLength);
    return {
      ...frame,
      visibleCharacters,
      phase: visibleCharacters === phraseLength ? 'holding' : 'typing',
    };
  }

  if (frame.phase === 'holding') return { ...frame, phase: 'deleting' };

  if (frame.visibleCharacters > 0) {
    return { ...frame, visibleCharacters: frame.visibleCharacters - 1 };
  }

  return {
    ...frame,
    phraseIndex: (frame.phraseIndex + 1) % frame.phrases.length,
    phase: 'typing',
  };
}
