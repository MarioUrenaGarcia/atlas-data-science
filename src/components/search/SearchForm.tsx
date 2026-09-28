import { Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import styles from './SearchForm.module.css';

interface SearchFormProps {
  initialQuery?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onSubmit?: (query: string) => void;
}

/** Full-width search field that leads to the results page. */
export function SearchForm({
  initialQuery = '',
  placeholder,
  autoFocus,
  onSubmit,
}: SearchFormProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (onSubmit) onSubmit(trimmed);
    else navigate(trimmed ? `/buscar?q=${encodeURIComponent(trimmed)}` : '/buscar');
  };

  return (
    <form role="search" className={styles.form} onSubmit={submit}>
      <Search size={20} aria-hidden="true" className={styles.icon} />
      <input
        type="search"
        className={styles.input}
        placeholder={placeholder ?? strings.search.placeholder}
        aria-label={strings.search.placeholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        // Focus is requested only where the field is the main purpose of the page.
        autoFocus={autoFocus}
      />
      <button type="submit" className={styles.submit}>
        {strings.search.label}
      </button>
    </form>
  );
}
