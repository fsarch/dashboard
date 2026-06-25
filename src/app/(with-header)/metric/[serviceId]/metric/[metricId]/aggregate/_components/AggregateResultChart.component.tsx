'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TAggregateResult, TAggregatedMeasurementDto } from '@/services/metric/metric.type';

type AggregateResultChartProps = {
  result: TAggregateResult;
  aggregationType: string;
  interval: string;
};

// Konvertiere die Aggregationsergebnisse in ein für recharts kompatibles Format
const formatChartData = (result: TAggregateResult): Array<{ 
  time: string; 
  value: number; 
  startTime: string; 
  endTime: string 
}> => {
  if (Array.isArray(result)) {
    return result.map((item: TAggregatedMeasurementDto) => ({
      time: formatTimeLabel(item.startTime, item.endTime),
      startTime: item.startTime,
      endTime: item.endTime,
      value: item.value,
    }));
  }
  return [];
};

// Hilfsfunktion zum Formatieren der Zeitbeschriftung
const formatTimeLabel = (startTime: string, endTime: string): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  
  if (diffHours <= 24) {
    return start.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
};

// Gemeinsame Tooltip-Komponente
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        backgroundColor: 'var(--color-background-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: '0.5rem',
        color: 'var(--color-text)',
      }}>
        <p style={{ margin: 0 }}><strong>{label}</strong></p>
        <p style={{ margin: '0.25rem 0' }}>Value: {data.value}</p>
        <p style={{ margin: '0.25rem 0' }}>Start: {new Date(data.startTime).toLocaleString()}</p>
        <p style={{ margin: '0.25rem 0' }}>End: {new Date(data.endTime).toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const AggregateResultChart: React.FunctionComponent<AggregateResultChartProps> = ({
  result,
  aggregationType,
  interval,
}) => {
  const chartData = formatChartData(result);

  if (chartData.length === 0) {
    return <p>Keine Diagrammdaten verfügbar.</p>;
  }

  const isCountAggregation = aggregationType === 'count';

  return (
    <div style={{ width: '100%', height: 400, marginTop: '1rem' }}>
      <h4>Aggregationsergebnis als Diagramm ({aggregationType} per {interval})</h4>
      <ResponsiveContainer width="100%" height="100%">
        {isCountAggregation ? (
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="time"
              stroke="var(--color-text)"
              tick={{ fill: 'var(--color-text)', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <YAxis
              stroke="var(--color-text)"
              tick={{ fill: 'var(--color-text)', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: 'var(--color-text)' }} />
            <Bar dataKey="value" fill="#8884d8" name="Count" />
          </BarChart>
        ) : (
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="time"
              stroke="var(--color-text)"
              tick={{ fill: 'var(--color-text)', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <YAxis
              stroke="var(--color-text)"
              tick={{ fill: 'var(--color-text)', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: 'var(--color-text)' }} />
            <Line
              type="monotone"
              dataKey="value"
              name={aggregationType.toUpperCase()}
              stroke="#8884d8"
              strokeWidth={2}
              activeDot={{ r: 8, fill: '#8884d8' }}
              dot={{ r: 4, fill: '#8884d8' }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default AggregateResultChart;
