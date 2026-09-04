import React from 'react';
import { HOUR_LABELS, GRID_HEIGHT_PX } from './timeGrid.utils';
import styles from './TimeGrid.module.scss';

type TimeScaleProps = {
  // Must match the heightPx passed to the row's TimeGridColumn(s) so labels stay aligned with the
  // hour gridlines - each label is one 24th of this height (see .scaleLabel).
  heightPx?: number;
};

// Left-hand "00:00".."23:00" column shared by the day and week time-grid views.
const TimeScale: React.FunctionComponent<TimeScaleProps> = ({ heightPx = GRID_HEIGHT_PX }) => (
  <div className={styles.scale} style={{ height: heightPx }}>
    {HOUR_LABELS.map((label) => (
      <div key={label} className={styles.scaleLabel}>
        {label}
      </div>
    ))}
  </div>
);

export default TimeScale;
