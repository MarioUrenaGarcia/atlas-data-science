import { Download, Maximize, Minimize, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { strings } from '../../app/strings.ts';
import { Button } from '../../components/ui/Button.tsx';
import { SegmentedControl } from '../../components/ui/SegmentedControl.tsx';
import { slugify } from '../../lib/format/text.ts';
import { DataTable, type DataTableData } from './DataTable.tsx';
import { downloadPng, downloadSvg } from './exportImage.ts';
import { LegendList, type LegendItem } from './LegendList.tsx';
import { ParameterControls } from './ParameterControls.tsx';
import type { ParameterDefinition } from './parameters.ts';
import { PlaybackBar } from './PlaybackBar.tsx';
import { Readouts, type Readout } from './Readouts.tsx';
import { SeedControl } from './SeedControl.tsx';
import { useAnimationLoop } from './useAnimationLoop.ts';
import type { Playback } from './usePlayback.ts';
import type { SeedState } from './useSeededRandom.ts';
import { useThrottledValue } from './useThrottledValue.ts';
import styles from './VizFrame.module.css';

export interface ViewTab<V extends string = string> {
  value: V;
  label: string;
}

interface VizFrameProps {
  title: string;
  children: ReactNode;
  playback?: Playback;
  seed?: SeedState;
  parameters?: {
    definitions: readonly ParameterDefinition[];
    values: Record<string, unknown>;
    set: (key: string, value: number | string | boolean) => void;
    reset: () => void;
    disabled?: readonly string[];
  };
  /** Extra controls specific to the visualization, placed after the parameters. */
  controls?: ReactNode;
  readouts?: readonly Readout[];
  legend?: readonly LegendItem[];
  /** Text alternative describing the current state; announced politely. */
  description: string;
  dataTable?: DataTableData;
  views?: { options: readonly ViewTab[]; value: string; onChange: (value: string) => void };
  /** Progress of a background computation in [0, 1], shown while it runs. */
  progress?: number | null;
  /** How the chart is drawn; decides which downloads are offered (HTML charts have none). */
  graphic?: 'svg' | 'canvas' | 'html';
}

const DESCRIPTION_INTERVAL_MS = 1500;

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(target.tagName) || target.isContentEditable
  );
}

/**
 * Standard container for every visualization: playback, speed, seed,
 * generated parameter controls, live readouts, legend, full screen, export
 * and an accessible text description.
 */
export function VizFrame({
  title,
  children,
  playback,
  seed,
  parameters,
  controls,
  readouts = [],
  legend = [],
  description,
  dataTable,
  views,
  progress = null,
  graphic: graphicKind = 'svg',
}: VizFrameProps) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const liveDescription = useThrottledValue(description, DESCRIPTION_INTERVAL_MS);

  useAnimationLoop((seconds) => playback?.advance(seconds), {
    running: Boolean(playback?.playing),
    speed: playback?.speed ?? 1,
    target: rootRef,
  });

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void rootRef.current?.requestFullscreen();
  };

  const graphic = () =>
    stageRef.current?.querySelector<SVGSVGElement | HTMLCanvasElement>(
      'svg[data-viz], canvas[data-viz]',
    ) ?? null;
  const fileName = slugify(title) || 'visualizacion';

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!playback || isEditable(event.target)) return;
    if (event.key === ' ') {
      event.preventDefault();
      playback.toggle();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      playback.stepOnce();
    } else if (event.key === 'End' && playback.skipToEnd) {
      event.preventDefault();
      playback.skipToEnd();
    } else if (event.key === 'r' || event.key === 'R') {
      event.preventDefault();
      playback.restart();
    }
  };

  const panel = (
    <>
      {playback && <PlaybackBar playback={playback} />}
      {parameters && parameters.definitions.length > 0 && (
        <section className={styles.section} aria-label={strings.viz.parameters}>
          <h3 className={styles.sectionTitle}>{strings.viz.parameters}</h3>
          <ParameterControls
            definitions={parameters.definitions}
            values={parameters.values}
            onChange={parameters.set}
            disabled={parameters.disabled}
          />
        </section>
      )}
      {controls && <div className={styles.section}>{controls}</div>}
      {seed && <SeedControl seed={seed} />}
      <Readouts items={readouts} />
      <div className={styles.actions}>
        {parameters && (
          <Button size="small" variant="ghost" onClick={parameters.reset}>
            <RotateCcw size={14} aria-hidden="true" />
            {strings.viz.resetParameters}
          </Button>
        )}
        {graphicKind === 'svg' && (
          <Button
            size="small"
            variant="ghost"
            onClick={() => {
              const element = graphic();
              if (element instanceof SVGSVGElement) downloadSvg(element, `${fileName}.svg`);
            }}
          >
            <Download size={14} aria-hidden="true" />
            {strings.viz.downloadSvg}
          </Button>
        )}
        {graphicKind !== 'html' && (
          <Button
            size="small"
            variant="ghost"
            onClick={() => {
              const element = graphic();
              if (element) void downloadPng(element, `${fileName}.png`);
            }}
          >
            <Download size={14} aria-hidden="true" />
            {strings.viz.downloadPng}
          </Button>
        )}
        <Button size="small" variant="ghost" onClick={toggleFullscreen}>
          {fullscreen ? (
            <Minimize size={14} aria-hidden="true" />
          ) : (
            <Maximize size={14} aria-hidden="true" />
          )}
          {fullscreen ? strings.viz.exitFullscreen : strings.viz.fullscreen}
        </Button>
      </div>
    </>
  );

  return (
    <figure
      ref={rootRef}
      className={fullscreen ? `${styles.frame} ${styles.fullscreen}` : styles.frame}
      aria-label={strings.viz.frameLabel(title)}
      aria-describedby={playback ? `${fileName}-atajos` : undefined}
      tabIndex={playback ? 0 : undefined}
      onKeyDown={onKeyDown}
    >
      {views && (
        <div className={styles.views}>
          <SegmentedControl
            label={strings.viz.views}
            value={views.value}
            options={views.options}
            onChange={views.onChange}
          />
        </div>
      )}
      <div className={styles.body}>
        <div className={styles.main}>
          <div ref={stageRef} className={styles.stage}>
            {children}
            {progress !== null && progress < 1 && (
              <div className={styles.progress} role="status">
                {strings.viz.computing(Math.round(progress * 100))}
              </div>
            )}
          </div>
          <LegendList items={legend} />
        </div>
        <aside className={styles.panel} aria-label={strings.viz.controls}>
          <details className={styles.panelDetails} open>
            <summary className={styles.panelSummary}>
              <SlidersHorizontal size={16} aria-hidden="true" />
              {strings.viz.controls}
            </summary>
            <div className={styles.panelContent}>{panel}</div>
          </details>
        </aside>
      </div>
      <p className="visually-hidden" aria-live="polite">
        {liveDescription}
      </p>
      {playback && (
        <p id={`${fileName}-atajos`} className="visually-hidden">
          {strings.viz.keyboardHint}
        </p>
      )}
      {dataTable && <DataTable data={dataTable} />}
    </figure>
  );
}
