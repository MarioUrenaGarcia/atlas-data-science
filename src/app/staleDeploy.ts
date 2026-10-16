import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/**
 * Every build gives its chunks and data files new hashed names, and a deploy
 * removes the old ones. A tab opened before the deploy still asks for the old
 * names the first time it needs a lazy module, and that request fails. A full
 * reload fetches the new index.html and with it the new names.
 *
 * The reload happens at most once per RETRY_AFTER_MS in a tab: if the module is
 * still missing after reloading, the failure is real (or the network is down)
 * and reloading again would only start a loop, so the error is shown instead.
 */
export const RELOAD_STAMP_KEY = 'atlas:recarga-por-version';
export const RETRY_AFTER_MS = 5 * 60 * 1000;

export class StaleDeployError extends Error {
  override name = 'StaleDeployError';
}

// Messages used by Chromium, Firefox and Safari when a dynamic import or a
// module preload fails, plus the errors raised by Vite and by the data loader.
const CHUNK_ERROR_PATTERNS = [
  /failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /importing a module script failed/i,
  /unable to preload css/i,
  /failed to load module script/i,
];

export function isStaleDeployError(error: unknown): boolean {
  if (error instanceof StaleDeployError) return true;
  if (!(error instanceof Error)) return false;
  if (error.name === 'ChunkLoadError') return true;
  return CHUNK_ERROR_PATTERNS.some((pattern) => pattern.test(error.message));
}

export interface ReloadEnvironment {
  storage: Pick<Storage, 'getItem' | 'setItem'> | null;
  reload: () => void;
  now: () => number;
  /** Set once a reload has started; the page is about to be replaced. */
  reloading: boolean;
}

// Reading sessionStorage throws when the browser blocks site data.
function sessionStorageOrNull(): ReloadEnvironment['storage'] {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

let browser: ReloadEnvironment | null = null;

function browserEnvironment(): ReloadEnvironment {
  browser ??= {
    storage: sessionStorageOrNull(),
    reload: () => window.location.reload(),
    now: () => Date.now(),
    reloading: false,
  };
  return browser;
}

/**
 * Reloads the page unless it was already reloaded for this reason recently.
 * Returns whether a reload was started. Without session storage there is no
 * way to remember the previous attempt, so it never reloads.
 */
export function reloadOnce(environment: ReloadEnvironment = browserEnvironment()): boolean {
  if (environment.reloading) return true;
  const { storage, reload, now } = environment;
  if (!storage) return false;
  try {
    const previous = Number(storage.getItem(RELOAD_STAMP_KEY));
    if (Number.isFinite(previous) && previous > 0 && now() - previous < RETRY_AFTER_MS) {
      return false;
    }
    storage.setItem(RELOAD_STAMP_KEY, String(now()));
  } catch {
    return false;
  }
  environment.reloading = true;
  reload();
  return true;
}

const pending = <T>() => new Promise<T>(() => undefined);

/**
 * Runs a lazy loader and, when it fails because of a new deploy, reloads the
 * page. While the reload is under way the returned promise never settles, so
 * Suspense keeps the loading state instead of flashing an error. This also
 * covers the case where the vite:preloadError listener already started the
 * reload and Vite resolved the import with nothing.
 */
export function recoverStaleDeploy<T>(
  loader: () => Promise<T>,
  environment: ReloadEnvironment = browserEnvironment(),
): Promise<T> {
  return loader().then(
    (value) => (environment.reloading ? pending<T>() : value),
    (error: unknown) => {
      if (environment.reloading) return pending<T>();
      if (isStaleDeployError(error) && reloadOnce(environment)) return pending<T>();
      throw error;
    },
  );
}

/** React.lazy with recovery from chunks removed by a new deploy. */
export function lazyWithRecovery<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
): LazyExoticComponent<ComponentType<P>> {
  return lazy(() => recoverStaleDeploy(loader));
}

/**
 * Vite fires vite:preloadError when it cannot preload the dependencies of a
 * lazy chunk. Cancelling the event keeps Vite from throwing while the page
 * reloads.
 */
export function installStaleDeployRecovery(target: Window = window): void {
  target.addEventListener('vite:preloadError', (event) => {
    if (reloadOnce()) event.preventDefault();
  });
}
