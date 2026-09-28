import { Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { strings } from '../../app/strings.ts';
import { Button } from '../../components/ui/Button.tsx';
import styles from './VizFrame.module.css';
import { SPEEDS, type Playback, type Speed } from './usePlayback.ts';

export function PlaybackBar({ playback }: { playback: Playback }) {
  return (
    <div className={styles.playback} role="group" aria-label={strings.viz.playback}>
      <Button
        size="small"
        variant="primary"
        iconOnly
        onClick={playback.toggle}
        disabled={playback.done}
        aria-label={playback.playing ? strings.viz.pause : strings.viz.play}
        title={playback.playing ? strings.viz.pause : strings.viz.play}
      >
        {playback.playing ? (
          <Pause size={16} aria-hidden="true" />
        ) : (
          <Play size={16} aria-hidden="true" />
        )}
      </Button>
      <Button
        size="small"
        iconOnly
        onClick={playback.stepOnce}
        disabled={playback.done}
        aria-label={strings.viz.step}
        title={strings.viz.step}
      >
        <StepForward size={16} aria-hidden="true" />
      </Button>
      <Button
        size="small"
        iconOnly
        onClick={playback.restart}
        aria-label={strings.viz.restart}
        title={strings.viz.restart}
      >
        <RotateCcw size={16} aria-hidden="true" />
      </Button>
      <label className={styles.speed}>
        <span className="visually-hidden">{strings.viz.speed}</span>
        <select
          value={playback.speed}
          onChange={(event) => playback.setSpeed(Number(event.target.value) as Speed)}
          aria-label={strings.viz.speed}
        >
          {SPEEDS.map((speed) => (
            <option key={speed} value={speed}>
              {speed}x
            </option>
          ))}
        </select>
      </label>
      {playback.done && <span className={styles.finished}>{strings.viz.finished}</span>}
    </div>
  );
}
