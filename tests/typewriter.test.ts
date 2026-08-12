import { describe, expect, it } from 'vitest';
import {
  createTypewriterFrame,
  nextTypewriterFrame,
  shuffleWithoutImmediateRepeat,
} from '../src/lib/typewriter';

describe('typewriter phrase order', () => {
  it('keeps every phrase while avoiding the phrase that just played', () => {
    const shuffled = shuffleWithoutImmediateRepeat(['甲', '乙', '丙'], '甲', () => 0);

    expect(shuffled).toHaveLength(3);
    expect(new Set(shuffled)).toEqual(new Set(['甲', '乙', '丙']));
    expect(shuffled[0]).not.toBe('甲');
  });

  it('keeps a single-item phrase pool usable', () => {
    expect(shuffleWithoutImmediateRepeat(['唯一一句'], '唯一一句', () => 0.5)).toEqual(['唯一一句']);
  });
});

describe('typewriter state machine', () => {
  it('types, holds, deletes, then advances to the next phrase', () => {
    let frame = createTypewriterFrame(['求真', '记录']);

    expect(frame).toMatchObject({ phase: 'typing', phraseIndex: 0, visibleCharacters: 0 });
    frame = nextTypewriterFrame(frame);
    expect(frame).toMatchObject({ phase: 'typing', phraseIndex: 0, visibleCharacters: 1 });
    frame = nextTypewriterFrame(frame);
    expect(frame).toMatchObject({ phase: 'holding', phraseIndex: 0, visibleCharacters: 2 });
    frame = nextTypewriterFrame(frame);
    expect(frame).toMatchObject({ phase: 'deleting', phraseIndex: 0, visibleCharacters: 2 });
    frame = nextTypewriterFrame(frame);
    frame = nextTypewriterFrame(frame);
    expect(frame).toMatchObject({ phase: 'deleting', phraseIndex: 0, visibleCharacters: 0 });
    frame = nextTypewriterFrame(frame);
    expect(frame).toMatchObject({ phase: 'typing', phraseIndex: 1, visibleCharacters: 0 });
  });
});
