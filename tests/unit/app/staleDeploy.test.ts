import { describe, expect, it, vi } from 'vitest';
import {
  isStaleDeployError,
  recoverStaleDeploy,
  RELOAD_STAMP_KEY,
  reloadOnce,
  RETRY_AFTER_MS,
  StaleDeployError,
  type ReloadEnvironment,
} from '../../../src/app/staleDeploy.ts';

function environment(start = 1_000_000) {
  const values = new Map<string, string>();
  let clock = start;
  const reload = vi.fn();
  const env: ReloadEnvironment = {
    storage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => void values.set(key, value),
    },
    reload,
    now: () => clock,
    reloading: false,
  };
  return {
    env,
    reload,
    values,
    advance: (ms: number) => {
      clock += ms;
    },
  };
}

describe('isStaleDeployError', () => {
  it('recognizes the dynamic import errors of each browser engine', () => {
    for (const message of [
      'Failed to fetch dynamically imported module: https://sitio/assets/MapPage-abc.js',
      'error loading dynamically imported module: https://sitio/assets/MapPage-abc.js',
      'Importing a module script failed.',
      'Unable to preload CSS for /assets/MapPage-abc.css',
    ]) {
      expect(isStaleDeployError(new TypeError(message))).toBe(true);
    }
    expect(isStaleDeployError(new StaleDeployError('HTTP 404'))).toBe(true);
  });

  it('ignores unrelated errors', () => {
    expect(isStaleDeployError(new Error('Cannot read properties of undefined'))).toBe(false);
    expect(isStaleDeployError('Failed to fetch dynamically imported module')).toBe(false);
    expect(isStaleDeployError(null)).toBe(false);
  });
});

describe('reloadOnce', () => {
  it('reloads the first time and remembers it', () => {
    const { env, reload, values } = environment();
    expect(reloadOnce(env)).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(values.get(RELOAD_STAMP_KEY)).toBe('1000000');
  });

  it('does not reload again inside the retry window, so there is no loop', () => {
    const { env, reload, advance } = environment();
    reloadOnce(env);
    // The second page load starts with a fresh environment and the stored stamp.
    env.reloading = false;
    advance(RETRY_AFTER_MS - 1);
    expect(reloadOnce(env)).toBe(false);
    expect(reloadOnce(env)).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('allows a new reload for a later deploy', () => {
    const { env, reload, advance } = environment();
    reloadOnce(env);
    env.reloading = false;
    advance(RETRY_AFTER_MS);
    expect(reloadOnce(env)).toBe(true);
    expect(reload).toHaveBeenCalledTimes(2);
  });

  it('never reloads without storage or when storage fails', () => {
    const reload = vi.fn();
    expect(reloadOnce({ storage: null, reload, now: () => 1, reloading: false })).toBe(false);
    const failing: ReloadEnvironment = {
      storage: {
        getItem: () => null,
        setItem: () => {
          throw new Error('QuotaExceededError');
        },
      },
      reload,
      now: () => 1,
      reloading: false,
    };
    expect(reloadOnce(failing)).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });
});

describe('recoverStaleDeploy', () => {
  it('returns the module when the loader succeeds', async () => {
    const { env, reload } = environment();
    await expect(recoverStaleDeploy(() => Promise.resolve('modulo'), env)).resolves.toBe('modulo');
    expect(reload).not.toHaveBeenCalled();
  });

  it('reloads on a missing chunk and keeps the promise pending', async () => {
    const { env, reload } = environment();
    const failure = new TypeError('Failed to fetch dynamically imported module: /assets/x.js');
    const settled = vi.fn();
    void recoverStaleDeploy(() => Promise.reject(failure), env).then(settled, settled);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(reload).toHaveBeenCalledTimes(1);
    expect(settled).not.toHaveBeenCalled();
  });

  it('rethrows the error when the page was already reloaded', async () => {
    const { env, reload } = environment();
    const failure = new TypeError('Failed to fetch dynamically imported module: /assets/x.js');
    reloadOnce(env);
    env.reloading = false;
    await expect(recoverStaleDeploy(() => Promise.reject(failure), env)).rejects.toBe(failure);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('rethrows unrelated errors without reloading', async () => {
    const { env, reload } = environment();
    const failure = new Error('JSON inválido');
    await expect(recoverStaleDeploy(() => Promise.reject(failure), env)).rejects.toBe(failure);
    expect(reload).not.toHaveBeenCalled();
  });

  it('stays pending when the preload listener already started the reload', async () => {
    const { env, reload } = environment();
    reloadOnce(env);
    const settled = vi.fn();
    // Vite resolves the import with undefined once the preload error is cancelled.
    void recoverStaleDeploy(() => Promise.resolve(undefined), env).then(settled, settled);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(settled).not.toHaveBeenCalled();
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
