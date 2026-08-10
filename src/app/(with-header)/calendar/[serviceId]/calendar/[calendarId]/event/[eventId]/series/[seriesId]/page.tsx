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
import { toIsoString, toDatetimeLocalValue, loadOrNotFound } from '@/services/calendar/calendar.utils';
import { EXCEPTION_CREATE_FORM } from '@/services/calendar/calendar.forms';
import { TEventSeriesDto } from '@/services/calendar/calendar.type';
import SeriesForm, { TSeriesFormValues } from '@/components/apps/calendar/SeriesForm.component';
import DangerZoneDelete from '@/components/apps/calendar/DangerZoneDelete.component';
import ExceptionsList from './_components/ExceptionsList.component';

export const generateMetadata = createAutomaticMetadata();

type SeriesDetailPageProps = {
  params: Promise<{ serviceId: string; calendarId: string; eventId: string; seriesId: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string }>;
};

export default async function SeriesDetailPage({
  params,
  searchParams,
}: SeriesDetailPageProps) {
  const { serviceId, calendarId, eventId, seriesId } = await params;
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

  const series = await loadOrNotFound(calendarService.getSeriesById(calendarId, eventId, seriesId, serviceId));

  const exceptions = await calendarService.listExceptions(
    calendarId,
    eventId,
    seriesId,
    { page: parseInt(page), pageSize: parseInt(pageSize) },
    serviceId
  );

  async function handleUpdateSeries(values: TSeriesFormValues): Promise<TEventSeriesDto> {
    'use server';

    if (!values.timezone || !values.rrule || !values.validFrom) {
      throw new Error('Zeitzone, RRULE und Gültig-ab sind erforderlich');
    }

    return calendarService.updateSeries(calendarId, eventId, seriesId, {
      externalId: values.externalId || undefined,
      timezone: values.timezone,
      rrule: values.rrule,
      validFrom: toIsoString(values.validFrom) as string,
      validTo: toIsoString(values.validTo),
    }, serviceId);
  }

  async function handleDeleteSeries() {
    'use server';

    await calendarService.deleteSeries(calendarId, eventId, seriesId, serviceId);
  }

  return (
    <DefaultPage>
      <Section name="Serie">
        <SeriesForm
          initialValues={{
            externalId: series.externalId ?? '',
            timezone: series.timezone,
            rrule: series.rrule,
            validFrom: toDatetimeLocalValue(series.validFrom),
            validTo: toDatetimeLocalValue(series.validTo),
          }}
          onSubmit={handleUpdateSeries}
          submitLabel="Aktualisieren"
        />
      </Section>

      <Section name="Exceptions">
        <ExceptionsList
          exceptions={exceptions}
          serviceId={serviceId}
          calendarId={calendarId}
          eventId={eventId}
          seriesId={seriesId}
          page={parseInt(page)}
          pageSize={parseInt(pageSize)}
        />
      </Section>

      <Section name="Exception erstellen">
        <GeneratedForm
          definition={EXCEPTION_CREATE_FORM}
          args={{ calendarId, eventId, seriesId }}
        />
      </Section>

      <DangerZoneDelete
        confirmText="Möchtest du diese Serie wirklich löschen?"
        buttonText="Serie löschen"
        redirectUrl={`/calendar/${serviceId}/calendar/${calendarId}/event/${eventId}`}
        onDelete={handleDeleteSeries}
      />
    </DefaultPage>
  );
}
