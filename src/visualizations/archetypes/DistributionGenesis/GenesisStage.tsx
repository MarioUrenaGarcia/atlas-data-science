import { BinsStage } from './BinsStage.tsx';
import { CoinStage } from './CoinStage.tsx';
import { DieStage } from './DieStage.tsx';
import { processSpec } from './processes.ts';
import { RankStage } from './RankStage.tsx';
import { SignsStage } from './SignsStage.tsx';
import { SpinnerStage } from './SpinnerStage.tsx';
import type { StageProps } from './stage.ts';
import { TimelineStage } from './TimelineStage.tsx';
import { UrnStage } from './UrnStage.tsx';

/** Picks the drawing of the random experiment that generates the distribution. */
export function GenesisStage(props: StageProps) {
  switch (processSpec(props.settings.process).stage) {
    case 'die':
      return <DieStage {...props} />;
    case 'coins':
      return <CoinStage {...props} />;
    case 'signs':
      return <SignsStage {...props} />;
    case 'urn':
      return <UrnStage {...props} />;
    case 'timeline':
      return <TimelineStage {...props} />;
    case 'spinner':
      return <SpinnerStage {...props} />;
    case 'bins':
      return <BinsStage {...props} />;
    case 'ranking':
      return <RankStage {...props} />;
  }
}
