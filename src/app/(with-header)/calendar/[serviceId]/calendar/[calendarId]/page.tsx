import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { calendarService } from '@/services/calendar/calendar.service';
import { CALENDAR_EDIT_FORM } from '@/services/calendar/calendar.forms';
import { toIsoString, loadOrNotFound } from '@/services/calendar/calendar.utils';
import { TEventDto } from '@/services/calendar/calendar.type';
import EventForm, { TEventFormValues } from '@/components/apps/calendar/EventForm.component';
import DangerZoneDelete from '@/components/apps/calendar/DangerZoneDelete.component';
import EventsList from './_components/EventsList.component';

export const generateMetadata = createAutomaticMetadata();

type CalendarDetailPageProps = {
  params: Promise<{ serviceId: string; calendarId: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string }>;
};

export default async function CalendarDetailPage({
  params,
  searchParams,
}: CalendarDetailPageProps) {
  const { serviceId, calendarId } = await params;
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

  const calendar = await loadOrNotFound(calendarService.getCalendarById(calendarId, serviceId));

  const events = await calendarService.listEvents(
    calendarId,
    { page: parseInt(page), pageSize: parseInt(pageSize) },
    serviceId
  );

  async function handleDeleteCalendar() {
    'use server';

    await calendarService.deleteCalendar(calendarId, serviceId);
  }

  async function handleCreateEvent(values: TEventFormValues): Promise<TEventDto> {
    'use server';

    if (!values.startAt) {
      throw new Error('Start ist erforderlich');
    }

    return calendarService.createEvent(calendarId, {
      title: values.title || undefined,
      description: values.description || undefined,
      externalId: values.externalId || undefined,
      timezone: values.timezone || undefined,
      startAt: toIsoString(values.startAt) as string,
      endAt: toIsoString(values.endAt),
    }, serviceId);
  }

  return (
    <DefaultPage>
      <Section name="Kalender">
        <GeneratedForm definition={CALENDAR_EDIT_FORM} args={{ calendar }} />
      </Section>

      <Section name="Events">
        <EventsList
          events={events}
          serviceId={serviceId}
          calendarId={calendarId}
          page={parseInt(page)}
          pageSize={parseInt(pageSize)}
        />
      </Section>

      <Section name="Event erstellen">
        <EventForm
          initialValues={{
            title: '',
            description: '',
            externalId: '',
            timezone: '',
            startAt: '',
            endAt: '',
          }}
          onSubmit={handleCreateEvent}
          submitLabel="Event erstellen"
          redirectToBasePath={`/calendar/${serviceId}/calendar/${calendarId}/event`}
        />
      </Section>

      <DangerZoneDelete
        confirmText={`Möchtest du den Kalender "${calendar.name}" wirklich löschen?`}
        buttonText="Kalender löschen"
        redirectUrl={`/calendar/${serviceId}`}
        onDelete={handleDeleteCalendar}
      />
    </DefaultPage>
  );
}
