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
  startOfWeekMonday,
  endOfWeekSunday,
  dayKey,
  shiftDate,
} from '@/services/calendar/calendar.utils';
import { layoutDayInstances, nowLinePercent } from '@/components/apps/calendar/timeGrid.utils';
import TimeGridBody, { TTimeGridBodyColumn } from '@/components/apps/calendar/TimeGridBody.component';
import { TExpandedEventDto } from '@/services/calendar/calendar.type';
import styles from './WeekView.module.scss';

export const generateMetadata = createAutomaticMetadata();

type WeekViewPageProps = {
  params: Promise<{ serviceId: string; calendarId: string }>;
  searchParams: Promise<{ date?: string }>;
};

export default async function WeekViewPage({
  params,
  searchParams,
}: WeekViewPageProps) {
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

  const weekStart = startOfWeekMonday(selectedDate);
  const weekEnd = endOfWeekSunday(selectedDate);

  const instances = await calendarService.listEventInstances(
    calendarId,
    weekStart.toISOString(),
    weekEnd.toISOString(),
    serviceId
  );

  const instancesByDay = new Map<string, TExpandedEventDto[]>();
  for (const instance of instances) {
    const key = dayKey(new Date(instance.startAt));
    const dayInstances = instancesByDay.get(key) ?? [];
    dayInstances.push(instance);
    instancesByDay.set(key, dayInstances);
  }

  const days: Date[] = [];
  for (let cursor = new Date(weekStart); cursor <= weekEnd; cursor.setDate(cursor.getDate() + 1)) {
    days.push(new Date(cursor));
  }

  const today = dayKey(new Date());
  const weekLabel = `${weekStart.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} – ${weekEnd.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;

  const columns: TTimeGridBodyColumn[] = days.map((day) => {
    const key = dayKey(day);
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    return {
      key,
      blocks: layoutDayInstances(instancesByDay.get(key) ?? [], dayStart),
      nowTopPercent: nowLinePercent(dayStart),
    };
  });

  return (
    <DefaultPage>
      <Section name={`Wochenansicht: ${calendar.name}`}>
        <div className={styles.header}>
          <div className={styles.nav}>
            <Link href={`/calendar/${serviceId}/calendar/${calendarId}/week?date=${shiftDate(date, -7)}`}>
              « Vorige Woche
            </Link>
            <Link href={`/calendar/${serviceId}/calendar/${calendarId}/week?date=${dayKey(new Date())}`}>
              Diese Woche
            </Link>
            <Link href={`/calendar/${serviceId}/calendar/${calendarId}/week?date=${shiftDate(date, 7)}`}>
              Nächste Woche »
            </Link>
          </div>
          <div className={styles.title}>{weekLabel}</div>
          <div className={styles.viewLinks}>
            <Link href={`/calendar/${serviceId}/calendar/${calendarId}/day?date=${date}`}>
              Tagesansicht
            </Link>
            <Link href={`/calendar/${serviceId}/calendar/${calendarId}/month?month=${date.slice(0, 7)}`}>
              Monatsansicht
            </Link>
          </div>
        </div>

        <div className={styles.gridWrapper}>
          <div className={styles.scrollArea}>
            <div className={styles.headerRow}>
              <div className={styles.headerSpacer} />
              {days.map((day) => {
                const key = dayKey(day);
                const isToday = key === today;
                return (
                  <Link
                    key={key}
                    href={`/calendar/${serviceId}/calendar/${calendarId}/day?date=${key}`}
                    className={clsx(styles.dayHeader, isToday && styles.dayHeaderToday)}
                  >
                    <span className={styles.dayHeaderName}>{day.toLocaleDateString('de-DE', { weekday: 'short' })}</span>
                    {' '}
                    {day.getDate()}.{day.getMonth() + 1}.
                  </Link>
                );
              })}
            </div>

            <TimeGridBody
              columns={columns}
              fillViewport
              eventHrefBase={`/calendar/${serviceId}/calendar/${calendarId}/event/`}
            />
          </div>
        </div>
      </Section>
    </DefaultPage>
  );
}
