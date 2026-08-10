// Pagination

export type TPaginationResultMetaDto = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type TPaginationResultDto<T> = {
  data: T[];
  metadata: TPaginationResultMetaDto;
};

export type TPaginationParams = {
  page: number;
  pageSize: number;
};

// Calendars

export type TCalendarDto = {
  id: string;
  name: string;
  defaultTimezone: string;
  externalId: string | null;
  creationTime: string;
  deletionTime: string | null;
};

export type TCreateCalendarDto = {
  name: string;
  defaultTimezone: string;
  externalId?: string;
};

// Events

export type TEventDto = {
  id: string;
  calendarId: string;
  title: string | null;
  description: string | null;
  externalId: string | null;
  timezone: string | null;
  startAt: string;
  endAt: string | null;
  creationTime: string;
  deletionTime: string | null;
};

export type TCreateEventDto = {
  title?: string;
  description?: string;
  externalId?: string;
  timezone?: string;
  startAt: string;
  endAt?: string;
};

// Expanded event instances (single events + expanded recurring series occurrences,
// exceptions applied) for a given time range.
export type TExpandedEventDto = {
  id: string;
  calendarId: string;
  title: string | null;
  description: string | null;
  externalId: string | null;
  timezone: string | null;
  startAt: string;
  endAt: string | null;
  isRecurring: boolean;
  recurringInstanceOf: string | null;
  isException: boolean;
  exceptionType: 'cancelled' | 'moved' | null;
};

// Event Series

export type TEventSeriesDto = {
  id: string;
  eventId: string;
  externalId: string | null;
  timezone: string;
  rrule: string;
  validFrom: string;
  validTo: string | null;
  creationTime: string;
  deletionTime: string | null;
};

export type TCreateEventSeriesDto = {
  externalId?: string;
  timezone: string;
  rrule: string;
  validFrom: string;
  validTo?: string;
};

// Event Exceptions

export type TEventExceptionDto = {
  id: string;
  externalId: string | null;
  eventSeriesId: string;
  originalStart: string;
  isMoved: boolean;
  isCancelled: boolean;
  newEventId: string | null;
  creationTime: string;
  deletionTime: string | null;
};

export type TCreateEventExceptionDto = {
  externalId?: string;
  isMoved: boolean;
  isCancelled: boolean;
  newEventId?: string;
};
