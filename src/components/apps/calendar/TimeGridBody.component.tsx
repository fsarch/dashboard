'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import TimeScale from './TimeScale.component';
import TimeGridColumn from './TimeGridColumn.component';
import { TTimeGridBlock, GRID_HEIGHT_PX } from './timeGrid.utils';
import styles from './TimeGridBody.module.scss';

export type TTimeGridBodyColumn = {
  key: string;
  blocks: TTimeGridBlock[];
  nowTopPercent: number | null;
};

type TimeGridBodyProps = {
  columns: TTimeGridBodyColumn[];
  // Prefix an instance id is appended to for its event link (e.g.
  // `/calendar/<serviceId>/calendar/<calendarId>/event/`). A plain string rather than a callback
  // because this is a Client Component - a Server Component caller can't pass it a function prop.
  eventHrefBase: string;
  // When set, the grid measures the remaining viewport space below itself on mount/resize and
  // sizes itself to fit exactly that (so the week view needs no page scroll to see the whole day).
  // Omitted (the default), it just uses the fixed GRID_HEIGHT_PX default, e.g. for the day view.
  fillViewport?: boolean;
};

// Floor so a very short viewport still gets a usable, legible grid instead of compressing hours
// into illegibly thin strips - the grid switches to its own internal scrolling below this point.
const MIN_GRID_HEIGHT_PX = 480;
// Small breathing room below the grid, mirroring the bottom padding pattern used elsewhere
// (DefaultPage's .main: `calc(var(--bottom-spacing, 0px) + 8px)`).
const BOTTOM_SPACING_PX = 16;

// Shared "scale + one column per day" renderer for the day/week time-grid views. Pulled out of
// both pages so the viewport-fill measurement (a client-only concern) doesn't force the whole
// page - which needs to stay a Server Component to fetch data - into client-side rendering.
const TimeGridBody: React.FunctionComponent<TimeGridBodyProps> = ({ columns, eventHrefBase, fillViewport = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [heightPx, setHeightPx] = useState(GRID_HEIGHT_PX);

  useLayoutEffect(() => {
    if (!fillViewport) {
      return undefined;
    }

    const element = containerRef.current;
    if (!element) {
      return undefined;
    }

    const recalculate = () => {
      const available = window.innerHeight - element.getBoundingClientRect().top - BOTTOM_SPACING_PX;
      setHeightPx(Math.max(available, MIN_GRID_HEIGHT_PX));
    };

    recalculate();
    window.addEventListener('resize', recalculate);
    // Catches layout shifts elsewhere on the page (e.g. the sidebar navigation wrapping at a
    // responsive breakpoint) that a plain window resize listener wouldn't - anything that moves
    // this element's own top offset without necessarily firing a window resize event.
    const observer = new ResizeObserver(recalculate);
    observer.observe(document.body);

    return () => {
      window.removeEventListener('resize', recalculate);
      observer.disconnect();
    };
  }, [fillViewport]);

  return (
    <div
      ref={containerRef}
      className={styles.body}
      style={fillViewport ? { overflowY: 'auto' } : undefined}
    >
      <TimeScale heightPx={heightPx} />
      <div className={styles.columns}>
        {columns.map((column) => (
          <TimeGridColumn
            key={column.key}
            blocks={column.blocks}
            nowTopPercent={column.nowTopPercent}
            eventHref={(id) => `${eventHrefBase}${id}`}
            heightPx={heightPx}
          />
        ))}
      </div>
    </div>
  );
};

export default TimeGridBody;
