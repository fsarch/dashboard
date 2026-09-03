import { notFound } from 'next/navigation';
import { TPaginationParams, TPaginationResultDto } from './calendar.type';
import { CalendarApiError } from './calendar.errors';

// Awaits a single-entity fetch (getCalendarById/getEventById/...). Converts a 404
// (CalendarApiError with status 404) into Next.js' notFound(), instead of letting callers
// silently proceed with an empty/garbage object. Any other error is rethrown so it surfaces as
// a visible error instead of a blank page.
export async function loadOrNotFound<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof CalendarApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

// Some responses wrap the actual payload in an extra `{ data: <payload> }` envelope
// (e.g. a global NestJS response interceptor). This unwraps that one level, but leaves an
// already-correct paginated result (`{ data: [...], metadata: {...} }`) untouched, since that
// shape has a `data` key by design.
export const unwrapEnvelope = <T>(body: unknown): T => {
  if (isPlainObject(body) && 'data' in body && !('metadata' in body)) {
    return body.data as T;
  }

  return body as T;
};

// Normalizes a paginated list response. Guards against the endpoint returning a bare array
// (e.g. an empty result set), an extra envelope wrapper, or a malformed/partial body instead of
// the documented { data, metadata } wrapper, so list components can always rely on both being
// present.
export const normalizePaginationResult = <T>(
  rawBody: unknown,
  params: TPaginationParams
): TPaginationResultDto<T> => {
  const body = unwrapEnvelope<unknown>(rawBody);

  if (Array.isArray(body)) {
    return {
      data: body as T[],
      metadata: {
        currentPage: params.page,
        pageSize: params.pageSize,
        totalItems: body.length,
        totalPages: 1,
      },
    };
  }

  const candidate = body as Partial<TPaginationResultDto<T>> | null | undefined;

  return {
    data: Array.isArray(candidate?.data) ? candidate.data : [],
    metadata: candidate?.metadata ?? {
      currentPage: params.page,
      pageSize: params.pageSize,
      totalItems: 0,
      totalPages: 1,
    },
  };
};

// Converts a <input type="datetime-local"> value ("2026-08-08T10:00") to an ISO 8601 string.
// Returns undefined for empty input.
export const toIsoString = (value: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
};

// Converts an ISO 8601 string (or null/undefined) to a value usable by <input type="datetime-local">.
// datetime-local values are interpreted by the browser as local time (this mirrors toIsoString's
// `new Date(value)` interpretation), so the ISO string - which is UTC - must be converted to local
// time here rather than just truncated, or the displayed value drifts by the UTC offset.
export const toDatetimeLocalValue = (value: string | null | undefined): string => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// Converts an event's metadata object (or null/undefined) to the pretty-printed JSON text shown
// in the metadata textarea. Returns '' for no metadata, mirroring toDatetimeLocalValue's '' for
// no date.
export const toMetadataJsonValue = (metadata: Record<string, unknown> | null | undefined): string => {
  if (!metadata) {
    return '';
  }

  return JSON.stringify(metadata, null, 2);
};

// Parses the metadata textarea's raw text back into an object for the API request. Returns
// undefined for empty/whitespace-only input (mirrors toIsoString's undefined for ''), which -
// like the other optional TCreateEventDto fields - omits the key from the request body rather
// than clearing existing metadata on update. Throws a user-facing error for invalid JSON or a
// non-object value (arrays/strings/numbers), matching the backend's @IsObject() validation.
export const parseMetadataJson = (value: string): Record<string, unknown> | undefined => {
  if (!value.trim()) {
    return undefined;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error('Metadaten müssen gültiges JSON sein');
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('Metadaten müssen ein JSON-Objekt sein (z.B. { "key": "value" })');
  }

  return parsed as Record<string, unknown>;
};

// Month helpers (all in the server's local time - same simplification the rest of the calendar
// app already makes for datetime-local fields).

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export const toMonthInputValue = (date: Date): string => `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;

// First/last instant of the given month ("YYYY-MM"). Returns null for an invalid/empty string.
export const monthToRange = (month: string): { from: Date; to: Date } | null => {
  const match = month.match(/^(\d{4})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const year = parseInt(match[1], 10);
  const monthIndex = parseInt(match[2], 10) - 1;

  return {
    from: new Date(year, monthIndex, 1, 0, 0, 0),
    to: new Date(year, monthIndex + 1, 0, 23, 59, 59),
  };
};

export const currentMonthRange = (): { from: Date; to: Date } => {
  const now = new Date();
  return {
    from: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0),
    to: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
  };
};

// Adds `delta` months to a "YYYY-MM" string, e.g. shiftMonth('2026-01', -1) -> '2025-12'.
export const shiftMonth = (month: string, delta: number): string => {
  const range = monthToRange(month) ?? currentMonthRange();
  return toMonthInputValue(new Date(range.from.getFullYear(), range.from.getMonth() + delta, 1));
};

export const startOfWeekMonday = (date: Date): Date => {
  const day = date.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + diff, 0, 0, 0, 0);
};

export const endOfWeekSunday = (date: Date): Date => {
  const start = startOfWeekMonday(date);
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6, 23, 59, 59, 999);
};

// "YYYY-MM-DD" key for grouping events by day. Also usable as an <input type="date"> value.
export const dayKey = (date: Date): string => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// Parses an <input type="date"> value ("2026-08-08") into a local Date at midnight.
// Returns null for an invalid/empty string.
export const parseDateInputValue = (value: string | undefined | null): Date | null => {
  if (!value) {
    return null;
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const year = parseInt(match[1], 10);
  const monthIndex = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);

  const date = new Date(year, monthIndex, day, 0, 0, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
};

// First/last instant of the day containing `date`.
export const dayRange = (date: Date): { from: Date; to: Date } => ({
  from: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
  to: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999),
});

// Adds `delta` days to a "YYYY-MM-DD" string, e.g. shiftDate('2026-08-08', -1) -> '2026-08-07'.
export const shiftDate = (date: string, delta: number): string => {
  const parsed = parseDateInputValue(date) ?? new Date();
  return dayKey(new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate() + delta));
};
