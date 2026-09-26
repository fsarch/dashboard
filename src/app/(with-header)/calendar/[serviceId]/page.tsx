import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { CALENDAR_CREATE_FORM } from '@/services/calendar/calendar.forms';
import { calendarService } from '@/services/calendar/calendar.service';
import { EServiceType } from '@/utils/configuration.type';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { uacUtils } from '@/utils/uac.utils';
import CalendarsList from './_components/CalendarsList.component';

export const generateMetadata = createAutomaticMetadata();

type CalendarsPageProps = {
  params: Promise<{ serviceId: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string }>;
};

export default async function CalendarsPage({
  params,
  searchParams,
}: CalendarsPageProps) {
  const { serviceId } = await params;
  const { page = '1', pageSize = '25' } = await searchParams;

  const accessToken = await getAccessToken();

  if (!accessToken) {
    const callbackUrl = (await headers()).get('X-Original-URL') || '/';
    return redirect(
      `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
    );
  }

  const service = await getServiceConfigurationById(serviceId);
  if (!service) {
    return notFound();
  }

  const canAccessService = await uacUtils.hasAppPermission(
    EServiceType.CALENDAR,
    serviceId,
    accessToken,
  );
  if (!canAccessService) {
    return notFound();
  }

  const calendars = await calendarService.listCalendars(
    { page: parseInt(page), pageSize: parseInt(pageSize) },
    serviceId,
  );

  return (
    <DefaultPage>
      <Section name="Kalender">
        <CalendarsList
          calendars={calendars}
          serviceId={serviceId}
          page={parseInt(page)}
          pageSize={parseInt(pageSize)}
        />
      </Section>

      <Section name="Kalender erstellen">
        <GeneratedForm definition={CALENDAR_CREATE_FORM} />
      </Section>
    </DefaultPage>
  );
}
