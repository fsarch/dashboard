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
  monthToRange,
  currentMonthRange,
  toMonthInputValue,
  shiftMonth,
  startOfWeekMonday,
  endOfWeekSunday,
  dayKey,
} from '@/services/calendar/calendar.utils';
import { TExpandedEventDto } from '@/services/calendar/calendar.type';
import styles from './MonthView.module.scss';

export const generateMetadata = createAutomaticMetadata();

const WEEKDAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const MAX_VISIBLE_EVENTS_PER_DAY = 3;

type MonthViewPageProps = {
  params: Promise<{ serviceId: string; calendarId: string }>;
  searchParams: Promise<{ month?: string }>;
};

export default async function MonthViewPage({
  params,
  searchParams,
}: MonthViewPageProps) {
  const { serviceId, calendarId } = await params;
  const { month: monthParam } = await searchParams;

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

  const monthRange = (monthParam && monthToRange(monthParam)) || currentMonthRange();
  const month = monthParam && monthToRange(monthParam) ? monthParam : toMonthInputValue(monthRange.from);

  const gridStart = startOfWeekMonday(monthRange.from);
  const gridEnd = endOfWeekSunday(monthRange.to);

  const instances = await calendarService.listEventInstances(
    calendarId,
    gridStart.toISOString(),
    gridEnd.toISOString(),
    serviceId
  );

  const instancesByDay = new Map<string, TExpandedEventDto[]>();
  for (const instance of instances) {
    const key = dayKey(new Date(instance.startAt));
    const dayInstances = instancesByDay.get(key) ?? [];
    dayInstances.push(instance);
    instancesByDay.set(key, dayInstances);
  }
  for (const dayInstances of instancesByDay.values()) {
    dayInstances.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  }

  const days: Date[] = [];
  for (let cursor = new Date(gridStart); cursor <= gridEnd; cursor.setDate(cursor.getDate() + 1)) {
    days.push(new Date(cursor));
  }
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const today = dayKey(new Date());
  const monthLabel = monthRange.from.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

  return (
    <DefaultPage>
      <Section name={`Kalenderansicht: ${calendar.name}`}>
        <div className={styles.header}>
          <div className={styles.nav}>
            <Link href={`/calendar/${serviceId}/calendar/${calendarId}/month?month=${shiftMonth(month, -1)}`}>
              « Vorheriger Monat
            </Link>
            <Link href={`/calendar/${serviceId}/calendar/${calendarId}/month?month=${toMonthInputValue(new Date())}`}>
              Heute
            </Link>
            <Link href={`/calendar/${serviceId}/calendar/${calendarId}/month?month=${shiftMonth(month, 1)}`}>
              Nächster Monat »
            </Link>
          </div>
          <div className={styles.title}>{monthLabel}</div>
          <Link href={`/calendar/${serviceId}/calendar/${calendarId}/instances?month=${month}`}>
            Listenansicht
          </Link>
        </div>

        <div className={styles.weekdays}>
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className={styles.weekday}>{label}</div>
          ))}
        </div>

        <div className={styles.grid}>
          {weeks.flatMap((week) => week.map((day) => {
            const key = dayKey(day);
            const isCurrentMonth = day.getMonth() === monthRange.from.getMonth();
            const isToday = key === today;
            const dayInstances = instancesByDay.get(key) ?? [];
            const visibleInstances = dayInstances.slice(0, MAX_VISIBLE_EVENTS_PER_DAY);
            const hiddenCount = dayInstances.length - visibleInstances.length;

            const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0);
            const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59);

            return (
              <div
                key={key}
                className={clsx(styles.day, !isCurrentMonth && styles.dayOutside, isToday && styles.dayToday)}
              >
                <div className={styles.dayNumber}>
                  {isToday ? (
                    <span className={styles.dayTodayNumber}>{day.getDate()}</span>
                  ) : (
                    day.getDate()
                  )}
                </div>
                <div className={styles.events}>
                  {visibleInstances.map((instance) => (
                    <Link
                      key={instance.id}
                      href={`/calendar/${serviceId}/calendar/${calendarId}/event/${instance.recurringInstanceOf ?? instance.id}`}
                      className={clsx(
                        styles.event,
                        instance.isException && instance.exceptionType === 'cancelled' && styles.eventCancelled
                      )}
                      title={instance.title ?? undefined}
                    >
                      {new Date(instance.startAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                      {' '}
                      {instance.title || '(ohne Titel)'}
                    </Link>
                  ))}
                  {hiddenCount > 0 && (
                    <Link
                      href={`/calendar/${serviceId}/calendar/${calendarId}/instances?from=${encodeURIComponent(dayStart.toISOString())}&to=${encodeURIComponent(dayEnd.toISOString())}`}
                      className={styles.more}
                    >
                      +{hiddenCount} weitere
                    </Link>
                  )}
                </div>
              </div>
            );
          }))}
        </div>
      </Section>
    </DefaultPage>
  );
}
