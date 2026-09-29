import { describe, expect, it } from 'vitest';
import {
  checkFunction,
  classifyFunction,
  compose,
  image,
  inverse,
} from '../../../src/lib/sets/functions.ts';

describe('finite functions', () => {
  it('detects relations that are not functions', () => {
    expect(
      checkFunction(3, [
        [0, 0],
        [1, 1],
        [2, 1],
      ]).isFunction,
    ).toBe(true);
    const missing = checkFunction(3, [
      [0, 0],
      [1, 1],
    ]);
    expect(missing.withoutImage).toEqual([2]);
    const several = checkFunction(2, [
      [0, 0],
      [0, 1],
      [1, 1],
    ]);
    expect(several.withSeveralImages).toEqual([0]);
  });

  it('classifies injective, surjective and bijective functions', () => {
    const notInjective = classifyFunction(2, [
      [0, 0],
      [1, 0],
      [2, 1],
    ]);
    expect(notInjective).toMatchObject({ injective: false, surjective: true, collision: [0, 1] });
    const notSurjective = classifyFunction(3, [
      [0, 0],
      [1, 2],
    ]);
    expect(notSurjective).toMatchObject({ injective: true, surjective: false, unreached: [1] });
    expect(
      classifyFunction(2, [
        [0, 1],
        [1, 0],
      ]).bijective,
    ).toBe(true);
    expect(
      image([
        [0, 2],
        [1, 0],
        [2, 2],
      ]),
    ).toEqual([0, 2]);
  });

  it('composes and inverts', () => {
    expect(compose([1, 0, 1], [2, 0])).toEqual([0, 2, 0]);
    expect(inverse([2, 0, 1], 3)).toEqual([1, 2, 0]);
    expect(inverse([0, 0, 1], 3)).toBeNull();
  });
});
