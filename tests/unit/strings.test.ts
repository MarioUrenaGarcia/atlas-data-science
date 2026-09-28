import { describe, expect, it } from 'vitest';
import { strings } from '../../src/app/strings.ts';

describe('strings', () => {
  it('exposes the application name', () => {
    expect(strings.appName).toBe('Atlas de Data Science');
  });
});
