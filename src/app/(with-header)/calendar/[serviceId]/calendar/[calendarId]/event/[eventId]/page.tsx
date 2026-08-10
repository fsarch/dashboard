import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { calendarService } from '@/services/calendar/calendar.service';
import { toIsoString, toDatetimeLocalValue, loadOrNotFound } from '@/services/calendar/calendar.utils';
import { TEventDto, TEventSeriesDto } from '@/services/calendar/calendar.type';
import EventForm, { TEventFormValues } from '@/components/apps/calendar/EventForm.component';
import SeriesForm, { TSeriesFormValues } from '@/components/apps/calendar/SeriesForm.component';
import DangerZoneDelete from '@/components/apps/calendar/DangerZoneDelete.component';
import SeriesList from './_components/SeriesList.component';

export const generateMetadata = createAutomaticMetadata();

type EventDetailPageProps = {
  params: Promise<{ serviceId: string; calendarId: string; eventId: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string }>;
};

export default async function EventDetailPage({
  params,
  searchParams,
}: EventDetailPageProps) {
  const { serviceId, calendarId, eventId } = await params;
  const { page = '1', pageSize = '25' } = await searchParams;

  const accessToken = await getAccessToken();

  if (!accessToken) {
    const callbackUrl = (await headers()).get('X-Original-URL') || '/';
    return redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const service = await getServiceConfigurationById(serviceId);
  if (!service) {
    return notFound();
  }

  const canAccessService = await uacUtils.hasAppPermission(
    EServiceType.CALENDAR,
    serviceId,
    accessToken
  );
  if (!canAccessService) {
    return notFound();
  }

  const event = await loadOrNotFound(calendarService.getEventById(calendarId, eventId, serviceId));

  const series = await calendarService.listSeries(
    calendarId,
    eventId,
    { page: parseInt(page), pageSize: parseInt(pageSize) },
    serviceId
  );

  async function handleUpdateEvent(values: TEventFormValues): Promise<TEventDto> {
    'use server';

    if (!values.startAt) {
      throw new Error('Start ist erforderlich');
    }

    return calendarService.updateEvent(calendarId, eventId, {
      title: values.title || undefined,
      description: values.description || undefined,
      externalId: values.externalId || undefined,
      timezone: values.timezone || undefined,
      startAt: toIsoString(values.startAt) as string,
      endAt: toIsoString(values.endAt),
    }, serviceId);
  }

  async function handleDeleteEvent() {
    'use server';

    await calendarService.deleteEvent(calendarId, eventId, serviceId);
  }

  async function handleCreateSeries(values: TSeriesFormValues): Promise<TEventSeriesDto> {
    'use server';

    if (!values.timezone || !values.rrule || !values.validFrom) {
      throw new Error('Zeitzone, RRULE und Gültig-ab sind erforderlich');
    }

    return calendarService.createSeries(calendarId, eventId, {
      externalId: values.externalId || undefined,
      timezone: values.timezone,
      rrule: values.rrule,
      validFrom: toIsoString(values.validFrom) as string,
      validTo: toIsoString(values.validTo),
    }, serviceId);
  }

  const eventFormInitialValues: TEventFormValues = {
    title: event.title ?? '',
    description: event.description ?? '',
    externalId: event.externalId ?? '',
    timezone: event.timezone ?? '',
    startAt: toDatetimeLocalValue(event.startAt),
    endAt: toDatetimeLocalValue(event.endAt),
  };

  return (
    <DefaultPage>
      <Section name={`Event: ${event.title || '(ohne Titel)'}`}>
        <EventForm
          initialValues={eventFormInitialValues}
          onSubmit={handleUpdateEvent}
          submitLabel="Aktualisieren"
        />
      </Section>

      <Section name="Serien">
        <SeriesList
          series={series}
          serviceId={serviceId}
          calendarId={calendarId}
          eventId={eventId}
          page={parseInt(page)}
          pageSize={parseInt(pageSize)}
        />
      </Section>

      <Section name="Serie erstellen">
        <SeriesForm
          initialValues={{
            externalId: '',
            timezone: event.timezone ?? '',
            rrule: '',
            validFrom: '',
            validTo: '',
          }}
          onSubmit={handleCreateSeries}
          submitLabel="Serie erstellen"
          redirectToBasePath={`/calendar/${serviceId}/calendar/${calendarId}/event/${eventId}/series`}
        />
      </Section>

      <DangerZoneDelete
        confirmText={`Möchtest du das Event "${event.title || eventId}" wirklich löschen?`}
        buttonText="Event löschen"
        redirectUrl={`/calendar/${serviceId}/calendar/${calendarId}`}
        onDelete={handleDeleteEvent}
      />
    </DefaultPage>
  );
}
