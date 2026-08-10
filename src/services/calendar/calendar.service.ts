import { fetchService } from "@/utils/fetchService";
import {
  TCalendarDto,
  TCreateCalendarDto,
  TEventDto,
  TCreateEventDto,
  TEventSeriesDto,
  TCreateEventSeriesDto,
  TEventExceptionDto,
  TCreateEventExceptionDto,
  TExpandedEventDto,
  TPaginationResultDto,
  TPaginationParams,
} from "./calendar.type";
import { normalizePaginationResult, unwrapEnvelope } from "./calendar.utils";
import { CalendarApiError } from "./calendar.errors";

// Reads a single-entity JSON response. Throws CalendarApiError instead of silently returning
// the (non-DTO-shaped) error body on a non-2xx response - callers can catch this and e.g. call
// notFound() for a 404, rather than rendering a form full of empty fields.
async function readEntity<T>(response: Response, resourceName: string): Promise<T> {
  if (!response.ok) {
    throw new CalendarApiError(
      `${resourceName} request failed with ${response.status} ${response.statusText}`,
      response.status
    );
  }

  return unwrapEnvelope<T>(await response.json());
}

// Calendars

export const listCalendars = async (
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TCalendarDto>> => {
  const response = await fetchService(
    `/calendars?page=${params.page}&pageSize=${params.pageSize}`,
    undefined,
    { serviceId }
  );
  if (!response.ok) {
    throw new CalendarApiError(
      `Calendars request failed with ${response.status} ${response.statusText}`,
      response.status
    );
  }
  return normalizePaginationResult<TCalendarDto>(await response.json(), params);
};

export const getCalendarById = async (
  id: string,
  serviceId: string
): Promise<TCalendarDto> => {
  const response = await fetchService(`/calendars/${id}`, undefined, {
    serviceId,
  });
  return readEntity<TCalendarDto>(response, `Calendar ${id}`);
};

export const createCalendar = async (
  dto: TCreateCalendarDto,
  serviceId: string
): Promise<TCalendarDto> => {
  const response = await fetchService(
    '/calendars',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    },
    { serviceId }
  );
  return readEntity<TCalendarDto>(response, 'Create calendar');
};

export const updateCalendar = async (
  id: string,
  dto: Partial<TCreateCalendarDto>,
  serviceId: string
): Promise<TCalendarDto> => {
  const response = await fetchService(
    `/calendars/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    },
    { serviceId }
  );
  return readEntity<TCalendarDto>(response, `Update calendar ${id}`);
};

export const deleteCalendar = async (
  id: string,
  serviceId: string
): Promise<void> => {
  await fetchService(`/calendars/${id}`, { method: 'DELETE' }, { serviceId });
};

// Events

export const listEvents = async (
  calendarId: string,
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TEventDto>> => {
  const response = await fetchService(
    `/calendars/${calendarId}/events?page=${params.page}&pageSize=${params.pageSize}`,
    undefined,
    { serviceId }
  );
  if (!response.ok) {
    throw new CalendarApiError(
      `Events request failed with ${response.status} ${response.statusText}`,
      response.status
    );
  }
  return normalizePaginationResult<TEventDto>(await response.json(), params);
};

export const getEventById = async (
  calendarId: string,
  id: string,
  serviceId: string
): Promise<TEventDto> => {
  const response = await fetchService(
    `/calendars/${calendarId}/events/${id}`,
    undefined,
    { serviceId }
  );
  return readEntity<TEventDto>(response, `Event ${id}`);
};

export const createEvent = async (
  calendarId: string,
  dto: TCreateEventDto,
  serviceId: string
): Promise<TEventDto> => {
  const response = await fetchService(
    `/calendars/${calendarId}/events`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    },
    { serviceId }
  );
  return readEntity<TEventDto>(response, 'Create event');
};

export const updateEvent = async (
  calendarId: string,
  id: string,
  dto: Partial<TCreateEventDto>,
  serviceId: string
): Promise<TEventDto> => {
  const response = await fetchService(
    `/calendars/${calendarId}/events/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    },
    { serviceId }
  );
  return readEntity<TEventDto>(response, `Update event ${id}`);
};

export const deleteEvent = async (
  calendarId: string,
  id: string,
  serviceId: string
): Promise<void> => {
  await fetchService(
    `/calendars/${calendarId}/events/${id}`,
    { method: 'DELETE' },
    { serviceId }
  );
};

// Expands single events and recurring series (RRULE, with exceptions applied) into concrete
// instances within [from, to]. Not paginated by the API.
export const listEventInstances = async (
  calendarId: string,
  from: string,
  to: string,
  serviceId: string
): Promise<TExpandedEventDto[]> => {
  const response = await fetchService(
    `/calendars/${calendarId}/events/instances?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    undefined,
    { serviceId }
  );
  if (!response.ok) {
    throw new CalendarApiError(
      `Event instances request failed with ${response.status} ${response.statusText}`,
      response.status
    );
  }
  const body = unwrapEnvelope<unknown>(await response.json());
  return Array.isArray(body) ? (body as TExpandedEventDto[]) : [];
};

// Event Series

export const listSeries = async (
  calendarId: string,
  eventId: string,
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TEventSeriesDto>> => {
  const response = await fetchService(
    `/calendars/${calendarId}/events/${eventId}/series?page=${params.page}&pageSize=${params.pageSize}`,
    undefined,
    { serviceId }
  );
  if (!response.ok) {
    throw new CalendarApiError(
      `Series request failed with ${response.status} ${response.statusText}`,
      response.status
    );
  }
  return normalizePaginationResult<TEventSeriesDto>(await response.json(), params);
};

export const getSeriesById = async (
  calendarId: string,
  eventId: string,
  id: string,
  serviceId: string
): Promise<TEventSeriesDto> => {
  const response = await fetchService(
    `/calendars/${calendarId}/events/${eventId}/series/${id}`,
    undefined,
    { serviceId }
  );
  return readEntity<TEventSeriesDto>(response, `Series ${id}`);
};

export const createSeries = async (
  calendarId: string,
  eventId: string,
  dto: TCreateEventSeriesDto,
  serviceId: string
): Promise<TEventSeriesDto> => {
  const response = await fetchService(
    `/calendars/${calendarId}/events/${eventId}/series`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    },
    { serviceId }
  );
  return readEntity<TEventSeriesDto>(response, 'Create series');
};

export const updateSeries = async (
  calendarId: string,
  eventId: string,
  id: string,
  dto: Partial<TCreateEventSeriesDto>,
  serviceId: string
): Promise<TEventSeriesDto> => {
  const response = await fetchService(
    `/calendars/${calendarId}/events/${eventId}/series/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    },
    { serviceId }
  );
  return readEntity<TEventSeriesDto>(response, `Update series ${id}`);
};

export const deleteSeries = async (
  calendarId: string,
  eventId: string,
  id: string,
  serviceId: string
): Promise<void> => {
  await fetchService(
    `/calendars/${calendarId}/events/${eventId}/series/${id}`,
    { method: 'DELETE' },
    { serviceId }
  );
};

// Event Exceptions

export const listExceptions = async (
  calendarId: string,
  eventId: string,
  seriesId: string,
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TEventExceptionDto>> => {
  const response = await fetchService(
    `/calendars/${calendarId}/events/${eventId}/series/${seriesId}/exceptions?page=${params.page}&pageSize=${params.pageSize}`,
    undefined,
    { serviceId }
  );
  if (!response.ok) {
    throw new CalendarApiError(
      `Exceptions request failed with ${response.status} ${response.statusText}`,
      response.status
    );
  }
  return normalizePaginationResult<TEventExceptionDto>(await response.json(), params);
};

export const getExceptionById = async (
  calendarId: string,
  eventId: string,
  seriesId: string,
  id: string,
  serviceId: string
): Promise<TEventExceptionDto> => {
  const response = await fetchService(
    `/calendars/${calendarId}/events/${eventId}/series/${seriesId}/exceptions/${id}`,
    undefined,
    { serviceId }
  );
  return readEntity<TEventExceptionDto>(response, `Exception ${id}`);
};

export const createException = async (
  calendarId: string,
  eventId: string,
  seriesId: string,
  dto: TCreateEventExceptionDto,
  serviceId: string
): Promise<TEventExceptionDto> => {
  const response = await fetchService(
    `/calendars/${calendarId}/events/${eventId}/series/${seriesId}/exceptions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    },
    { serviceId }
  );
  return readEntity<TEventExceptionDto>(response, 'Create exception');
};

export const updateException = async (
  calendarId: string,
  eventId: string,
  seriesId: string,
  id: string,
  dto: Partial<TCreateEventExceptionDto>,
  serviceId: string
): Promise<TEventExceptionDto> => {
  const response = await fetchService(
    `/calendars/${calendarId}/events/${eventId}/series/${seriesId}/exceptions/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    },
    { serviceId }
  );
  return readEntity<TEventExceptionDto>(response, `Update exception ${id}`);
};

export const deleteException = async (
  calendarId: string,
  eventId: string,
  seriesId: string,
  id: string,
  serviceId: string
): Promise<void> => {
  await fetchService(
    `/calendars/${calendarId}/events/${eventId}/series/${seriesId}/exceptions/${id}`,
    { method: 'DELETE' },
    { serviceId }
  );
};

export const calendarService = {
  // Calendars
  listCalendars,
  getCalendarById,
  createCalendar,
  updateCalendar,
  deleteCalendar,
  // Events
  listEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  listEventInstances,
  // Event Series
  listSeries,
  getSeriesById,
  createSeries,
  updateSeries,
  deleteSeries,
  // Event Exceptions
  listExceptions,
  getExceptionById,
  createException,
  updateException,
  deleteException,
};
