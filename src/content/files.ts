/** Folder, relative to the site base, that serves one JSON file per concept body. */
export const CONCEPT_FILES_FOLDER = 'contenido';

/**
 * Size limits for generated content, in bytes of UTF-8 JSON. A concept page
 * downloads only its own body, so that file sets the cost of opening a page;
 * the shared indexes are loaded once and may be larger.
 */
export const MAX_CONCEPT_FILE_BYTES = 512 * 1024;
export const MAX_INDEX_FILE_BYTES = 3 * 1024 * 1024;
