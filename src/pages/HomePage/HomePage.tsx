import { ArrowRight, Layers, Network, Route } from 'lucide-react';
import { Link } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import { ConceptCard } from '../../components/concept/ConceptCard.tsx';
import { SearchForm } from '../../components/search/SearchForm.tsx';
import { ActiveRouteCard } from '../../components/roadmap/ActiveRouteCard.tsx';
import { moduleColor } from '../../components/ui/moduleColor.ts';
import { useAtlas } from '../../content/loader.ts';
import { useProgress } from '../../store/progress.ts';
import styles from './HomePage.module.css';

const EXPLORE = [
  {
    to: '/modulos',
    title: strings.home.modulesCard,
    text: strings.home.modulesCardText,
    Icon: Layers,
  },
  { to: '/rutas', title: strings.home.routesCard, text: strings.home.routesCardText, Icon: Route },
  { to: '/mapa', title: strings.home.mapCard, text: strings.home.mapCardText, Icon: Network },
] as const;

export default function HomePage() {
  const atlas = useAtlas();
  const activeRoute = useProgress((state) => state.rutaActiva);
  const featured = atlas.modules
    .map((module) => (module.portada ? atlas.byId.get(module.portada) : undefined))
    .filter((concept) => concept !== undefined);

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="titulo-inicio">
        <h1 id="titulo-inicio" className={styles.title}>
          {strings.home.heading}
        </h1>
        <p className={styles.intro}>{strings.home.intro}</p>
        <div className={styles.search}>
          <SearchForm placeholder={strings.home.searchPlaceholder} />
        </div>
        <p className={styles.stats}>
          {strings.home.stats(atlas.nodes.length, atlas.modules.length)}
        </p>
      </section>

      {activeRoute && <ActiveRouteCard active={activeRoute} />}

      <section aria-labelledby="titulo-explorar" className={styles.section}>
        <h2 id="titulo-explorar" className="visually-hidden">
          {strings.home.explore}
        </h2>
        <div className={styles.explore}>
          {EXPLORE.map(({ to, title, text, Icon }) => (
            <Link key={to} to={to} className={styles.exploreCard}>
              <Icon size={22} aria-hidden="true" className={styles.exploreIcon} />
              <span className={styles.exploreTitle}>{title}</span>
              <span className={styles.exploreText}>{text}</span>
              <ArrowRight size={18} aria-hidden="true" className={styles.exploreArrow} />
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="titulo-modulos" className={styles.section}>
        <h2 id="titulo-modulos">{strings.modules.title}</h2>
        <ol className={styles.moduleList}>
          {atlas.modules.map((module) => {
            const count = module.submodulos.reduce(
              (total, submodule) => total + submodule.conceptos.length,
              0,
            );
            return (
              <li key={module.numero}>
                <Link
                  to={`/modulo/${module.numero}`}
                  className={styles.moduleLink}
                  style={{ borderLeftColor: moduleColor(module.numero) }}
                >
                  <span className={styles.moduleNumber}>{module.numero}</span>
                  <span className={styles.moduleTitle}>{module.titulo}</span>
                  <span className={styles.moduleCount}>{strings.modules.conceptCount(count)}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {featured.length > 0 && (
        <section aria-labelledby="titulo-destacados" className={styles.section}>
          <h2 id="titulo-destacados">{strings.home.featured}</h2>
          <div className={styles.featured}>
            {featured.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
