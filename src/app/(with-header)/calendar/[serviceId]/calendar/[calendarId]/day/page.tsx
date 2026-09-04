import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { calendarService } from '@/services/calendar/calendar.service';
import {
  loadOrNotFound,
  parseDateInputValue,
  dayRange,
  dayKey,
  shiftDate,
} from '@/services/calendar/calendar.utils';
import { layoutDayInstances, nowLinePercent } from '@/components/apps/calendar/timeGrid.utils';
import TimeGridBody from '@/components/apps/calendar/TimeGridBody.component';
import styles from './DayView.module.scss';

export const generateMetadata = createAutomaticMetadata();

type DayViewPageProps = {
  params: Promise<{ serviceId: string; calendarId: string }>;
  searchParams: Promise<{ date?: string }>;
};

export default async function DayViewPage({
  params,
  searchParams,
}: DayViewPageProps) {
  const { serviceId, calendarId } = await params;
  const { date: dateParam } = await searchParams;

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

  const selectedDate = parseDateInputValue(dateParam) ?? new Date();
  const date = dayKey(selectedDate);
  const { from, to } = dayRange(selectedDate);

  const instances = await calendarService.listEventInstances(
    calendarId,
    from.toISOString(),
    to.toISOString(),
    serviceId
  );

  const blocks = layoutDayInstances(instances, from);
  const nowTopPercent = nowLinePercent(from);

  const isToday = date === dayKey(new Date());
  const dateLabel = selectedDate.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <DefaultPage>
      <Section name={`Tagesansicht: ${calendar.name}`}>
        <div className={styles.header}>
          <div className={styles.nav}>
            <Link href={`/calendar/${serviceId}/calendar/${calendarId}/day?date=${shiftDate(date, -1)}`}>
              « Vorheriger Tag
            </Link>
            <Link href={`/calendar/${serviceId}/calendar/${calendarId}/day?date=${dayKey(new Date())}`}>
              Heute
            </Link>
            <Link href={`/calendar/${serviceId}/calendar/${calendarId}/day?date=${shiftDate(date, 1)}`}>
              Nächster Tag »
            </Link>
          </div>
          <div className={clsx(styles.title, isToday && styles.titleToday)}>{dateLabel}</div>
          <div className={styles.viewLinks}>
            <Link href={`/calendar/${serviceId}/calendar/${calendarId}/week?date=${date}`}>
              Wochenansicht
            </Link>
            <Link href={`/calendar/${serviceId}/calendar/${calendarId}/month?month=${date.slice(0, 7)}`}>
              Monatsansicht
            </Link>
          </div>
        </div>

        {instances.length === 0 ? <p className={styles.empty}>Keine Termine an diesem Tag.</p> : null}

        <div className={styles.gridWrapper}>
          <TimeGridBody
            columns={[{ key: date, blocks, nowTopPercent }]}
            eventHrefBase={`/calendar/${serviceId}/calendar/${calendarId}/event/`}
          />
        </div>
      </Section>
    </DefaultPage>
  );
}
