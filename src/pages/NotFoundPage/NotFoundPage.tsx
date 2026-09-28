import { strings } from '../../app/strings.ts';
import { useDocumentTitle } from '../../app/useDocumentTitle.ts';
import { SearchForm } from '../../components/search/SearchForm.tsx';
import { ButtonLink } from '../../components/ui/ButtonLink.tsx';
import { PageHeader } from '../../components/ui/PageHeader.tsx';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage({ message }: { message?: string }) {
  useDocumentTitle(strings.notFound.title);
  return (
    <div className={styles.page}>
      <PageHeader title={strings.notFound.title} intro={message ?? strings.notFound.body} />
      <SearchForm />
      <ButtonLink to="/" variant="ghost" className={styles.home}>
        {strings.notFound.home}
      </ButtonLink>
    </div>
  );
}
