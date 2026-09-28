import { Link } from 'react-router-dom';
import { strings } from '../strings.ts';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.text}>{strings.footer.licenses}</p>
        <nav aria-label={strings.footer.about}>
          <ul className={styles.links}>
            <li>
              <Link to="/acerca">{strings.nav.about}</Link>
            </li>
            <li>
              <Link to="/notacion">{strings.nav.notation}</Link>
            </li>
            <li>
              <Link to="/glosario">{strings.nav.glossary}</Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
