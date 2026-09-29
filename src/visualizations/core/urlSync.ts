import { createContext } from 'react';

/**
 * Whether visualizations mirror their parameters in the page URL. Only the
 * main visualization of a page does; figures embedded in the text share the
 * page with it and would overwrite each other's state.
 */
export const UrlSyncContext = createContext(true);
