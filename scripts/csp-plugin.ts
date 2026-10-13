import { createHash } from 'node:crypto';
import type { Plugin } from 'vite';

const CHARSET = /<meta charset="UTF-8"\s*\/?>/i;
const INLINE_SCRIPT = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g;

function sha256(source: string): string {
  return `'sha256-${createHash('sha256').update(source, 'utf8').digest('base64')}'`;
}

/**
 * Content Security Policy for the production build. GitHub Pages cannot send
 * response headers, so the policy travels in a meta tag; frame-ancestors and
 * report-uri are ignored there by design. Inline scripts are allowed only by
 * hash, computed on the final HTML so the policy always matches what ships.
 * Styles keep 'unsafe-inline' because KaTeX positions glyphs with inline
 * style attributes inside its generated markup.
 */
export function cspPlugin(): Plugin {
  return {
    name: 'atlas-csp',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const hashes = [...html.matchAll(INLINE_SCRIPT)].map((match) => sha256(match[1] ?? ''));
        const policy = [
          "default-src 'self'",
          `script-src 'self' ${hashes.join(' ')}`.trim(),
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob:",
          "font-src 'self' data:",
          "connect-src 'self'",
          "worker-src 'self' blob:",
          "manifest-src 'self'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'none'",
        ].join('; ');
        const tags = [
          `<meta http-equiv="Content-Security-Policy" content="${policy}" />`,
          '<meta name="referrer" content="strict-origin-when-cross-origin" />',
        ].join('\n    ');
        // The charset declaration must stay within the first 1024 bytes and the
        // policy must precede every script, so it goes right after the charset.
        return html.replace(CHARSET, (charset) => `${charset}\n    ${tags}`);
      },
    },
  };
}
