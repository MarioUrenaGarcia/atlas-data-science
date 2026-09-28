import { useEffect } from 'react';
import { strings } from './strings.ts';

export function useDocumentTitle(title: string | null): void {
  useEffect(() => {
    document.title = title ? `${title} | ${strings.appName}` : strings.appName;
  }, [title]);
}
