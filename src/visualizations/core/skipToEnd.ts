/** Upper bound of steps per call, the same chunk size used during normal playback. */
export const SKIP_CHUNK = 200;
/**
 * Steps queued per frame while skipping to the end. Simulations bound their
 * own state (they clamp counters and cap stored samples), so overshooting
 * the final step within a frame is harmless; the cap only keeps each frame
 * responsive while the end is reached in a handful of frames.
 */
export const SKIP_STEPS_PER_FRAME = 5000;
/** Time spent queuing steps in one frame, for simulations whose steps are expensive. */
export const SKIP_FRAME_BUDGET_MS = 30;

interface SkipOptions {
  step: () => void;
  stepMany?: (count: number) => void;
  /** Clock in milliseconds; injectable for tests. */
  now?: () => number;
  maxSteps?: number;
  budgetMs?: number;
}

/**
 * Queues one frame worth of steps for a fast-forward, in chunks, stopping
 * early when the time budget is spent. Returns the number of steps queued.
 */
export function queueSkipSteps({
  step,
  stepMany,
  now = () => performance.now(),
  maxSteps = SKIP_STEPS_PER_FRAME,
  budgetMs = SKIP_FRAME_BUDGET_MS,
}: SkipOptions): number {
  const start = now();
  let queued = 0;
  while (queued < maxSteps) {
    const count = Math.min(SKIP_CHUNK, maxSteps - queued);
    if (stepMany) stepMany(count);
    else for (let i = 0; i < count; i += 1) step();
    queued += count;
    if (now() - start > budgetMs) break;
  }
  return queued;
}
