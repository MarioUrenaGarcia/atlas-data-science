import { describe, expect, it } from 'vitest';
import {
  queueSkipSteps,
  SKIP_CHUNK,
  SKIP_STEPS_PER_FRAME,
} from '../../../src/visualizations/core/skipToEnd.ts';

describe('skip to end', () => {
  it('queues a whole frame of steps in chunks when stepMany exists', () => {
    const calls: number[] = [];
    const queued = queueSkipSteps({
      step: () => undefined,
      stepMany: (count) => calls.push(count),
      now: () => 0,
    });
    expect(queued).toBe(SKIP_STEPS_PER_FRAME);
    expect(calls.every((count) => count <= SKIP_CHUNK)).toBe(true);
    expect(calls.reduce((a, b) => a + b, 0)).toBe(SKIP_STEPS_PER_FRAME);
  });

  it('falls back to single steps', () => {
    let steps = 0;
    const queued = queueSkipSteps({ step: () => (steps += 1), now: () => 0, maxSteps: 450 });
    expect(queued).toBe(450);
    expect(steps).toBe(450);
  });

  it('stops early when the time budget is spent', () => {
    let clock = 0;
    let steps = 0;
    const queued = queueSkipSteps({
      step: () => undefined,
      stepMany: (count) => {
        steps += count;
        clock += 20;
      },
      now: () => clock,
      budgetMs: 30,
    });
    // Two chunks take 40 ms, past the 30 ms budget.
    expect(queued).toBe(2 * SKIP_CHUNK);
    expect(steps).toBe(2 * SKIP_CHUNK);
  });

  it('reaches the final state of a clamped counter', () => {
    const horizon = 1234;
    let value = 0;
    queueSkipSteps({ step: () => (value = Math.min(horizon, value + 1)), now: () => 0 });
    expect(value).toBe(horizon);
  });
});
