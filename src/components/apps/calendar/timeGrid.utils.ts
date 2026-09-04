import { TExpandedEventDto } from '@/services/calendar/calendar.type';

// Shared layout engine for the day/week time-grid views: turns a list of event instances into
// percentage-positioned blocks against a 0-24h vertical scale, splitting time-overlapping
// instances into side-by-side columns so none of them hide another. Percentages (rather than
// pixels) let the grid's actual rendered height vary freely - a fixed default for the day view, a
// viewport-measured height for the week view (see TimeGridBody.component.tsx) - without this
// module needing to know which.

// Default/fallback total grid height in px, used whenever nothing measures the viewport (day view,
// and the week view's very first paint before its client-side measurement effect runs).
export const HOUR_HEIGHT_PX = 48;
export const GRID_HEIGHT_PX = HOUR_HEIGHT_PX * 24;

const DEFAULT_DURATION_MINUTES = 30; // instances without an endAt are point-in-time (e.g. reminders); this only affects block height, the rendered label still only shows the start time

const MINUTES_PER_DAY = 1440;

export type TTimeGridBlock = {
  instance: TExpandedEventDto;
  topPercent: number; // 0-100, position within the 24h day
  heightPercent: number; // 0-100
  columnIndex: number;
  columnCount: number;
};

type TClippedEntry = {
  instance: TExpandedEventDto;
  start: number; // minutes after dayStart's midnight, clamped to [0, 1440]
  end: number; // minutes after dayStart's midnight, clamped to [0, 1440], always > start
};

// Lays out one day's worth of instances (already the caller's responsibility to pick the right
// day's instances - see the per-day bucketing in the week view) into top/height/column positions.
export function layoutDayInstances(instances: TExpandedEventDto[], dayStart: Date): TTimeGridBlock[] {
  const midnight = new Date(dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate()).getTime();

  const clipped: TClippedEntry[] = instances
    .map((instance) => {
      const startMs = new Date(instance.startAt).getTime();
      const endMs = instance.endAt ? new Date(instance.endAt).getTime() : startMs + DEFAULT_DURATION_MINUTES * 60_000;

      return {
        instance,
        rawStart: (startMs - midnight) / 60_000,
        rawEnd: (endMs - midnight) / 60_000,
      };
    })
    // Drop instances that don't actually intersect this day (e.g. a multi-day event bucketed here
    // by its start day but the caller still passed leftovers, or a bad/negative duration).
    .filter(({ rawStart, rawEnd }) => rawEnd > 0 && rawStart < MINUTES_PER_DAY && rawEnd > rawStart)
    .map(({ instance, rawStart, rawEnd }) => {
      const start = Math.min(Math.max(rawStart, 0), MINUTES_PER_DAY);
      const end = Math.min(Math.max(rawEnd, 0), MINUTES_PER_DAY);
      return { instance, start, end: Math.max(end, start + 1) };
    })
    .sort((a, b) => a.start - b.start || a.end - b.end);

  const blocks: TTimeGridBlock[] = [];

  // Sweep the (start-sorted) entries into clusters of mutually overlapping instances, then assign
  // each cluster's instances to the fewest side-by-side columns needed (standard greedy interval
  // column assignment), so unrelated events elsewhere in the day don't shrink each other's width.
  let cluster: TClippedEntry[] = [];
  let clusterEnd = -Infinity;

  const flushCluster = () => {
    if (cluster.length === 0) {
      return;
    }

    const columnEnds: number[] = [];
    for (const entry of cluster) {
      let columnIndex = columnEnds.findIndex((end) => end <= entry.start);
      if (columnIndex === -1) {
        columnIndex = columnEnds.length;
        columnEnds.push(entry.end);
      } else {
        columnEnds[columnIndex] = entry.end;
      }

      blocks.push({
        instance: entry.instance,
        topPercent: (entry.start / MINUTES_PER_DAY) * 100,
        heightPercent: ((entry.end - entry.start) / MINUTES_PER_DAY) * 100,
        columnIndex,
        columnCount: 0, // filled in below, once the cluster's final column count is known
      });
    }

    const columnCount = columnEnds.length;
    for (let i = blocks.length - cluster.length; i < blocks.length; i += 1) {
      blocks[i].columnCount = columnCount;
    }

    cluster = [];
    clusterEnd = -Infinity;
  };

  for (const entry of clipped) {
    if (cluster.length > 0 && entry.start >= clusterEnd) {
      flushCluster();
    }
    cluster.push(entry);
    clusterEnd = Math.max(clusterEnd, entry.end);
  }
  flushCluster();

  return blocks;
}

// Vertical position (0-100, percent of the 24h grid) of "now" for the day containing `dayStart`,
// or null if that day isn't today.
export function nowLinePercent(dayStart: Date): number | null {
  const now = new Date();
  const midnight = new Date(dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate());
  const diffMinutes = (now.getTime() - midnight.getTime()) / 60_000;

  if (diffMinutes < 0 || diffMinutes >= MINUTES_PER_DAY) {
    return null;
  }

  return (diffMinutes / MINUTES_PER_DAY) * 100;
}

export const HOUR_LABELS = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`);
