import { useParams } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import { useAtlas } from '../../content/loader.ts';
import NotFoundPage from '../NotFoundPage/NotFoundPage.tsx';
import { ConceptView } from './ConceptView.tsx';

export default function ConceptPage() {
  const { id } = useParams();
  const atlas = useAtlas();
  const concept = id ? atlas.byId.get(id) : undefined;
  if (!concept) return <NotFoundPage message={strings.concept.notFound} />;
  return <ConceptView key={concept.id} concept={concept} />;
}
