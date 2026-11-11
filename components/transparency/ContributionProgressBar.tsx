import { cn } from '@/lib/utils';
import { CONTRIBUTION_COLOR, ContributionType } from './config';

export type ProgressSegment = {
  type: ContributionType;
  label: string;
  value: number;
  /** Shown on hover, e.g. "Office chair · 1 200 €". */
  title?: string;
};

type ContributionProgressBarProps = {
  segments: ProgressSegment[];
  projectGoal: number;
  /** Summary read by screen readers, e.g. "27% of the goal raised". */
  label: string;
  className?: string;
};

/**
 * A stacked progress bar: one coloured segment per contribution type, each as wide as
 * its share of the goal. Pure markup (the old bar measured `window.innerWidth`, so it
 * could only render client-side and was sized to the window, not its container).
 */
const ContributionProgressBar = ({
  segments,
  projectGoal,
  label,
  className,
}: ContributionProgressBarProps) => {
  const total = segments.reduce((sum, { value }) => sum + value, 0);
  const goal = Math.max(projectGoal, total, 1);

  return (
    <div
      role='meter'
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={projectGoal}
      aria-valuenow={total}
      className={cn('bg-bege-dark flex h-5 w-full overflow-hidden rounded-full', className)}
    >
      {segments
        .filter(({ value }) => value > 0)
        .map(({ type, label: segmentLabel, value, title }) => (
          <span
            key={type}
            title={title ?? segmentLabel}
            className={cn(
              'h-full min-w-1 border-r-2 border-white/70 transition-[width] duration-700 last:border-r-0',
              CONTRIBUTION_COLOR[type]
            )}
            style={{ width: `${(value / goal) * 100}%` }}
          />
        ))}
    </div>
  );
};

export default ContributionProgressBar;
