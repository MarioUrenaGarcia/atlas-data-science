import { ArrivalStage } from './ArrivalStage.tsx';
import { CircleStage } from './CircleStage.tsx';
import { LighthouseStage } from './LighthouseStage.tsx';
import { PlaneStage } from './PlaneStage.tsx';
import { processSpec } from './processes.ts';
import { RowsStage } from './RowsStage.tsx';
import type { ContinuousStageProps } from './stage.ts';

/** Picks the drawing of the random construction behind the continuous distribution. */
export function ContinuousStage(props: ContinuousStageProps) {
  switch (processSpec(props.settings.process).stage) {
    case 'rows':
      return <RowsStage {...props} />;
    case 'timeline':
      return <ArrivalStage {...props} />;
    case 'plane':
      return <PlaneStage {...props} />;
    case 'lighthouse':
      return <LighthouseStage {...props} />;
    case 'circle':
      return <CircleStage {...props} />;
  }
}
