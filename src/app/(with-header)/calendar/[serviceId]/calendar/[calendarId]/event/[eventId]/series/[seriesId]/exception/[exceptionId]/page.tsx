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
import { EXCEPTION_EDIT_FORM } from '@/services/calendar/calendar.forms';
import { loadOrNotFound } from '@/services/calendar/calendar.utils';
import DangerZoneDelete from '@/components/apps/calendar/DangerZoneDelete.component';

export const generateMetadata = createAutomaticMetadata();

type ExceptionDetailPageProps = {
  params: Promise<{
    serviceId: string;
    calendarId: string;
    eventId: string;
    seriesId: string;
    exceptionId: string;
  }>;
};

export default async function ExceptionDetailPage({
  params,
}: ExceptionDetailPageProps) {
  const { serviceId, calendarId, eventId, seriesId, exceptionId } = await params;

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

  const exception = await loadOrNotFound(calendarService.getExceptionById(
    calendarId,
    eventId,
    seriesId,
    exceptionId,
    serviceId
  ));

  async function handleDeleteException() {
    'use server';

    await calendarService.deleteException(calendarId, eventId, seriesId, exceptionId, serviceId);
  }

  return (
    <DefaultPage>
      <Section name="Exception">
        <GeneratedForm
          definition={EXCEPTION_EDIT_FORM}
          args={{ calendarId, eventId, seriesId, exception }}
        />
      </Section>

      <DangerZoneDelete
        confirmText="Möchtest du diese Exception wirklich löschen?"
        buttonText="Exception löschen"
        redirectUrl={`/calendar/${serviceId}/calendar/${calendarId}/event/${eventId}/series/${seriesId}`}
        onDelete={handleDeleteException}
      />
    </DefaultPage>
  );
}
