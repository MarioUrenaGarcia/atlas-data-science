import { useCallback, useEffect, useRef, useState } from 'react';

export type WorkerMessage<TOut> =
  | { id: number; type: 'progress'; value: number }
  | { id: number; type: 'result'; value: TOut }
  | { id: number; type: 'error'; message: string };

export interface WorkerState<TIn, TOut> {
  run: (input: TIn) => Promise<TOut>;
  cancel: () => void;
  running: boolean;
  /** Fraction completed in [0, 1], as reported by the worker. */
  progress: number;
}

/**
 * Runs heavy simulations in a Web Worker. Starting a new run or calling
 * `cancel` terminates the current worker, which is the only reliable way to
 * stop a long synchronous computation; a fresh worker is created lazily.
 */
export function useWorker<TIn, TOut>(createWorker: () => Worker): WorkerState<TIn, TOut> {
  const workerRef = useRef<Worker | null>(null);
  const pending = useRef<{ id: number; reject: (reason: Error) => void } | null>(null);
  const nextId = useRef(0);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const stop = useCallback(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
    pending.current?.reject(new Error('cancelled'));
    pending.current = null;
    setRunning(false);
  }, []);

  useEffect(() => stop, [stop]);

  const run = useCallback(
    (input: TIn) => {
      stop();
      const worker = createWorker();
      workerRef.current = worker;
      nextId.current += 1;
      const id = nextId.current;
      setRunning(true);
      setProgress(0);
      return new Promise<TOut>((resolve, reject) => {
        pending.current = { id, reject };
        worker.onmessage = (event: MessageEvent<WorkerMessage<TOut>>) => {
          const message = event.data;
          if (message.id !== id) return;
          if (message.type === 'progress') {
            setProgress(message.value);
            return;
          }
          pending.current = null;
          setRunning(false);
          setProgress(1);
          if (message.type === 'result') resolve(message.value);
          else reject(new Error(message.message));
        };
        worker.onerror = (event) => {
          pending.current = null;
          setRunning(false);
          reject(new Error(event.message));
        };
        worker.postMessage({ id, input });
      });
    },
    [createWorker, stop],
  );

  return { run, cancel: stop, running, progress };
}

/**
 * Helper for worker entry files: wires message handling so the handler only
 * computes a result and optionally reports progress.
 */
export function exposeWorker<TIn, TOut>(
  handler: (input: TIn, reportProgress: (fraction: number) => void) => TOut | Promise<TOut>,
): void {
  const scope = self as unknown as {
    onmessage: ((event: MessageEvent<{ id: number; input: TIn }>) => void) | null;
    postMessage: (message: WorkerMessage<TOut>) => void;
  };
  scope.onmessage = (event) => {
    const { id, input } = event.data;
    const report = (value: number) => scope.postMessage({ id, type: 'progress', value });
    Promise.resolve()
      .then(() => handler(input, report))
      .then(
        (value) => scope.postMessage({ id, type: 'result', value }),
        (error: unknown) =>
          scope.postMessage({
            id,
            type: 'error',
            message: error instanceof Error ? error.message : String(error),
          }),
      );
  };
}
