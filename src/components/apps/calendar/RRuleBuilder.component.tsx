'use client';

import React, { useState } from 'react';
import Button from '@/components/universals/forms/Button';

type TFreq = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
type TEndType = 'never' | 'count' | 'until';

type RRuleBuilderProps = {
  value: string;
  onChange: (rrule: string) => void;
};

const WEEKDAYS: Array<{ value: string; label: string }> = [
  { value: 'MO', label: 'Mo' },
  { value: 'TU', label: 'Di' },
  { value: 'WE', label: 'Mi' },
  { value: 'TH', label: 'Do' },
  { value: 'FR', label: 'Fr' },
  { value: 'SA', label: 'Sa' },
  { value: 'SU', label: 'So' },
];

type TParsedRRule = {
  freq: TFreq;
  interval: number;
  byDay: string[];
  count?: number;
  until?: string;
};

function parseRRule(rrule: string): TParsedRRule {
  const parts: Record<string, string> = {};
  rrule.split(';').filter(Boolean).forEach((part) => {
    const [key, value] = part.split('=');
    if (key && value !== undefined) {
      parts[key] = value;
    }
  });

  const freq = parts.FREQ as TFreq;

  return {
    freq: freq === 'DAILY' || freq === 'WEEKLY' || freq === 'MONTHLY' || freq === 'YEARLY' ? freq : 'WEEKLY',
    interval: parts.INTERVAL ? parseInt(parts.INTERVAL, 10) || 1 : 1,
    byDay: parts.BYDAY ? parts.BYDAY.split(',') : [],
    count: parts.COUNT ? parseInt(parts.COUNT, 10) : undefined,
    until: parts.UNTIL,
  };
}

// RFC 5545 UNTIL is written in the compact UTC form "YYYYMMDDTHHMMSSZ".
function untilToDateInputValue(until?: string): string {
  const match = until?.match(/^(\d{4})(\d{2})(\d{2})/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : '';
}

function dateInputValueToUntil(dateValue: string): string | undefined {
  if (!dateValue) {
    return undefined;
  }

  const date = new Date(`${dateValue}T23:59:59`);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

type TBuilderState = {
  freq: TFreq;
  interval: number;
  byDay: string[];
  endType: TEndType;
  count: number;
  until: string;
};

function buildRRule(state: TBuilderState): string {
  const segments = [`FREQ=${state.freq}`];

  if (state.interval > 1) {
    segments.push(`INTERVAL=${state.interval}`);
  }

  if (state.byDay.length > 0 && (state.freq === 'WEEKLY' || state.freq === 'MONTHLY')) {
    segments.push(`BYDAY=${state.byDay.join(',')}`);
  }

  if (state.endType === 'count' && state.count > 0) {
    segments.push(`COUNT=${state.count}`);
  } else if (state.endType === 'until') {
    const until = dateInputValueToUntil(state.until);
    if (until) {
      segments.push(`UNTIL=${until}`);
    }
  }

  return segments.join(';');
}

// Small helper UI next to the raw RRULE text field: lets the user compose a valid RRULE
// (RFC 5545) by picking frequency/interval/weekdays/end-condition instead of writing it by
// hand. One-directional ("Übernehmen" writes into the text field) - the text field stays the
// source of truth and can always be edited directly.
const RRuleBuilder: React.FunctionComponent<RRuleBuilderProps> = ({ value, onChange }) => {
  const initial = parseRRule(value);
  const [freq, setFreq] = useState<TFreq>(initial.freq);
  const [interval, setIntervalValue] = useState<number>(initial.interval);
  const [byDay, setByDay] = useState<string[]>(initial.byDay);
  const [endType, setEndType] = useState<TEndType>(
    initial.count ? 'count' : initial.until ? 'until' : 'never'
  );
  const [count, setCount] = useState<number>(initial.count ?? 10);
  const [until, setUntil] = useState<string>(untilToDateInputValue(initial.until));

  const toggleDay = (day: string) => {
    setByDay((current) => (
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day]
    ));
  };

  const handleApply = () => {
    onChange(buildRRule({ freq, interval, byDay, endType, count, until }));
  };

  return (
    <div
      style={{
        border: '1px dashed var(--color-border)',
        borderRadius: '8px',
        padding: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
      }}
    >
      <strong>RRULE-Ausfüllassistent</strong>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <label htmlFor="rrule-interval">Wiederholt sich alle</label>
        <input
          id="rrule-interval"
          type="number"
          min={1}
          value={interval}
          onChange={(event) => setIntervalValue(Math.max(1, parseInt(event.target.value, 10) || 1))}
          style={{ width: '4rem' }}
        />
        <select value={freq} onChange={(event) => setFreq(event.target.value as TFreq)}>
          <option value="DAILY">Tag(e)</option>
          <option value="WEEKLY">Woche(n)</option>
          <option value="MONTHLY">Monat(e)</option>
          <option value="YEARLY">Jahr(e)</option>
        </select>
      </div>

      {(freq === 'WEEKLY' || freq === 'MONTHLY') && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {WEEKDAYS.map((day) => (
            <label key={day.value} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <input
                type="checkbox"
                checked={byDay.includes(day.value)}
                onChange={() => toggleDay(day.value)}
              />
              {day.label}
            </label>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <input
            type="radio"
            name="rrule-end"
            checked={endType === 'never'}
            onChange={() => setEndType('never')}
          />
          Kein Ende
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <input
            type="radio"
            name="rrule-end"
            checked={endType === 'count'}
            onChange={() => setEndType('count')}
          />
          Nach
          <input
            type="number"
            min={1}
            value={count}
            disabled={endType !== 'count'}
            onChange={(event) => setCount(Math.max(1, parseInt(event.target.value, 10) || 1))}
            style={{ width: '4rem' }}
          />
          Terminen
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <input
            type="radio"
            name="rrule-end"
            checked={endType === 'until'}
            onChange={() => setEndType('until')}
          />
          Bis
          <input
            type="date"
            disabled={endType !== 'until'}
            value={until}
            onChange={(event) => setUntil(event.target.value)}
          />
        </label>
      </div>

      <div>
        <Button type="button" onClick={handleApply}>
          RRULE übernehmen
        </Button>
      </div>
    </div>
  );
};

export default RRuleBuilder;
