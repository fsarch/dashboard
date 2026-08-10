import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import Link from 'next/link';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import List from '@/components/universals/list/List';
import LinkListItem from '@/components/universals/list/LinkListItem';
import Button from '@/components/universals/forms/Button';
import { calendarService } from '@/services/calendar/calendar.service';
import {
  loadOrNotFound,
  toDatetimeLocalValue,
  toMonthInputValue,
  monthToRange,
  currentMonthRange,
} from '@/services/calendar/calendar.utils';
import { TExpandedEventDto } from '@/services/calendar/calendar.type';

export const generateMetadata = createAutomaticMetadata();

type EventInstancesPageProps = {
  params: Promise<{ serviceId: string; calendarId: string }>;
  searchParams: Promise<{ month?: string; from?: string; to?: string }>;
};

export default async function EventInstancesPage({
  params,
  searchParams,
}: EventInstancesPageProps) {
  const { serviceId, calendarId } = await params;
  const { month, from: fromParam, to: toParam } = await searchParams;

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

  let from: Date;
  let to: Date;
  let activeMonth = '';

  if (fromParam && toParam) {
    from = new Date(fromParam);
    to = new Date(toParam);
  } else {
    const range = (month && monthToRange(month)) || currentMonthRange();
    from = range.from;
    to = range.to;
    activeMonth = month && monthToRange(month) ? month : toMonthInputValue(from);
  }

  const hasValidRange = !Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime()) && from <= to;

  const instances = hasValidRange
    ? await calendarService.listEventInstances(calendarId, from.toISOString(), to.toISOString(), serviceId)
    : [];

  const sortedInstances = [...instances].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );

  return (
    <DefaultPage>
      <Section name={`Termine: ${calendar.name}`}>
        <div style={{ marginBottom: '1rem' }}>
          <Link href={`/calendar/${serviceId}/calendar/${calendarId}/month?month=${activeMonth || toMonthInputValue(from)}`}>
            Kalenderansicht anzeigen
          </Link>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          <form
            method="GET"
            style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}
          >
            <div>
              <label htmlFor="month">Monat</label>
              <br />
              <input id="month" name="month" type="month" defaultValue={activeMonth} />
            </div>
            <Button type="submit">Anzeigen</Button>
          </form>

          <form
            method="GET"
            style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}
          >
            <div>
              <label htmlFor="from">Von</label>
              <br />
              <input
                id="from"
                name="from"
                type="datetime-local"
                defaultValue={toDatetimeLocalValue(hasValidRange ? from.toISOString() : undefined)}
                required
              />
            </div>
            <div>
              <label htmlFor="to">Bis</label>
              <br />
              <input
                id="to"
                name="to"
                type="datetime-local"
                defaultValue={toDatetimeLocalValue(hasValidRange ? to.toISOString() : undefined)}
                required
              />
            </div>
            <Button type="submit">Anzeigen</Button>
          </form>
        </div>
      </Section>

      <Section name="Termine">
        {!hasValidRange ? (
          <p>Ungültiger Zeitraum.</p>
        ) : sortedInstances.length > 0 ? (
          <List>
            {sortedInstances.map((instance: TExpandedEventDto) => (
              <LinkListItem
                key={instance.id}
                href={`/calendar/${serviceId}/calendar/${calendarId}/event/${instance.recurringInstanceOf ?? instance.id}`}
              >
                <strong>{instance.title || '(ohne Titel)'}</strong>
                {instance.isRecurring ? ' · wiederkehrend' : ''}
                {instance.isException
                  ? instance.exceptionType === 'cancelled'
                    ? ' · storniert'
                    : ' · verschoben'
                  : ''}
                <br />
                <small>
                  {new Date(instance.startAt).toLocaleString()}
                  {instance.endAt ? ` – ${new Date(instance.endAt).toLocaleString()}` : ''}
                  {instance.timezone ? ` (${instance.timezone})` : ''}
                </small>
                {instance.description ? (
                  <>
                    <br />
                    <small>{instance.description}</small>
                  </>
                ) : null}
              </LinkListItem>
            ))}
          </List>
        ) : (
          <p>Keine Termine im gewählten Zeitraum gefunden.</p>
        )}
      </Section>
    </DefaultPage>
  );
}
