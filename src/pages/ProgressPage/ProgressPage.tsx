import { Download, Trash2, Upload } from 'lucide-react';
import { useRef, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { strings } from '../../app/strings.ts';
import { useDocumentTitle } from '../../app/useDocumentTitle.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Dialog } from '../../components/ui/Dialog.tsx';
import { moduleColor } from '../../components/ui/moduleColor.ts';
import { PageHeader } from '../../components/ui/PageHeader.tsx';
import { ProgressBar } from '../../components/ui/ProgressBar.tsx';
import { useAtlas } from '../../content/loader.ts';
import { useProgress } from '../../store/progress.ts';
import { exportProgress, parseProgressFile } from '../../store/progressFile.ts';
import styles from './ProgressPage.module.css';

export default function ProgressPage() {
  const atlas = useAtlas();
  const conceptos = useProgress((state) => state.conceptos);
  const rutaActiva = useProgress((state) => state.rutaActiva);
  const replaceAll = useProgress((state) => state.replaceAll);
  const clear = useProgress((state) => state.clear);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  useDocumentTitle(strings.progress.title);

  const known = atlas.nodes.filter((node) => conceptos[node.id] !== undefined);
  const mastered = known.filter((node) => conceptos[node.id] === 'dominado').length;
  const seen = known.length - mastered;

  const download = () => {
    const data = exportProgress({ conceptos, rutaActiva });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = strings.progress.exportFileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const parsed = parseProgressFile(await file.text());
    if (!parsed) {
      setMessage({ text: strings.progress.importError, error: true });
      return;
    }
    replaceAll(parsed);
    setMessage({
      text: strings.progress.imported(Object.keys(parsed.conceptos).length),
      error: false,
    });
  };

  return (
    <>
      <PageHeader title={strings.progress.title} intro={strings.progress.intro} />

      <p className={styles.summary}>
        {strings.progress.summary(mastered, seen, atlas.nodes.length)}
      </p>
      <ProgressBar value={mastered} max={atlas.nodes.length} label={strings.progress.title} />

      <div className={styles.actions}>
        <Button onClick={download}>
          <Download size={16} aria-hidden="true" />
          {strings.progress.export}
        </Button>
        <Button onClick={() => fileInput.current?.click()}>
          <Upload size={16} aria-hidden="true" />
          {strings.progress.import}
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="visually-hidden"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(event) => void upload(event)}
        />
        <Button variant="ghost" onClick={() => setConfirming(true)}>
          <Trash2 size={16} aria-hidden="true" />
          {strings.progress.clear}
        </Button>
      </div>
      <p role="status" className={message?.error ? styles.error : styles.message}>
        {message?.text ?? ''}
      </p>

      <section aria-labelledby="progreso-modulos">
        <h2 id="progreso-modulos" className={styles.heading}>
          {strings.progress.byModule}
        </h2>
        <ul className={styles.modules}>
          {atlas.modules.map((module) => {
            const ids = module.submodulos.flatMap((submodule) => submodule.conceptos);
            if (ids.length === 0) return null;
            const done = ids.filter((id) => conceptos[id] === 'dominado').length;
            return (
              <li key={module.numero} className={styles.module}>
                <div className={styles.moduleHeader}>
                  <Link to={`/modulo/${module.numero}`}>
                    <span
                      className={styles.dot}
                      style={{ background: moduleColor(module.numero) }}
                      aria-hidden="true"
                    />
                    {module.titulo}
                  </Link>
                  <span className={styles.moduleCount}>
                    {done} / {ids.length}
                  </span>
                </div>
                <ProgressBar
                  value={done}
                  max={ids.length}
                  label={module.titulo}
                  color={moduleColor(module.numero)}
                />
              </li>
            );
          })}
        </ul>
      </section>

      <Dialog
        open={confirming}
        onClose={() => setConfirming(false)}
        title={strings.progress.clearConfirmTitle}
        closeLabel={strings.progress.cancel}
        footer={
          <>
            <Button onClick={() => setConfirming(false)}>{strings.progress.cancel}</Button>
            <Button
              variant="danger"
              onClick={() => {
                clear();
                setConfirming(false);
                setMessage({ text: strings.progress.cleared, error: false });
              }}
            >
              {strings.progress.clearConfirmAction}
            </Button>
          </>
        }
      >
        <p>{strings.progress.clearConfirmBody}</p>
      </Dialog>
    </>
  );
}
