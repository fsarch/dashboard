import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { TTimeGridBlock, GRID_HEIGHT_PX } from './timeGrid.utils';
import styles from './TimeGrid.module.scss';

type TimeGridColumnProps = {
  blocks: TTimeGridBlock[];
  nowTopPercent: number | null;
  eventHref: (instanceId: string) => string;
  // Total column height in px. All internal positioning (hour gridlines, blocks, now-line) is
  // percentage-based, so this is the only thing callers need to vary to resize the whole grid -
  // e.g. TimeGridBody measures the viewport and overrides this for the week view.
  heightPx?: number;
};

// One day's column in the time-grid views: a heightPx-tall track with hour gridlines drawn via a
// repeating background, plus one absolutely-positioned, proportionally-sized block per instance
// (columnIndex/columnCount split time-overlapping instances side by side).
const TimeGridColumn: React.FunctionComponent<TimeGridColumnProps> = ({
  blocks,
  nowTopPercent,
  eventHref,
  heightPx = GRID_HEIGHT_PX,
}) => (
  <div
    className={styles.column}
    style={{
      height: heightPx,
      backgroundImage:
        'repeating-linear-gradient(to bottom, var(--hour-line-color) 0, var(--hour-line-color) 1px, transparent 1px, transparent calc(100% / 24))',
    }}
  >
    {nowTopPercent !== null && <div className={styles.nowLine} style={{ top: `${nowTopPercent}%` }} />}
    {blocks.map((block) => {
      const cancelled = block.instance.isException && block.instance.exceptionType === 'cancelled';
      const widthPercent = 100 / block.columnCount;

      return (
        <Link
          key={block.instance.id}
          href={eventHref(block.instance.recurringInstanceOf ?? block.instance.id)}
          className={clsx(styles.block, cancelled && styles.blockCancelled)}
          style={{
            top: `${block.topPercent}%`,
            height: `${block.heightPercent}%`,
            left: `calc(${block.columnIndex * widthPercent}% + 1px)`,
            width: `calc(${widthPercent}% - 2px)`,
          }}
          title={block.instance.title ?? undefined}
        >
          <span className={styles.blockTime}>
            {new Date(block.instance.startAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {' '}
          <span>{block.instance.title || '(ohne Titel)'}</span>
        </Link>
      );
    })}
  </div>
);

export default TimeGridColumn;
