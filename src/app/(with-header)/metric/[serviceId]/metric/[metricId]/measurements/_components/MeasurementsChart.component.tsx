'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TMeasurementDto } from '@/services/metric/metric.type';

type MeasurementsChartProps = {
  data: TMeasurementDto[];
};

// Konvertiere die Measurement-Daten für recharts
const formatChartData = (measurements: TMeasurementDto[]) => {
  return measurements.map((measurement, index) => ({
    name: new Date(measurement.logTime).toLocaleString(),
    time: new Date(measurement.logTime).getTime(),
    value: measurement.value,
    isWarmTier: measurement.isWarmTier ? 'Warm' : 'Cold',
    index,
  }));
};

const MeasurementsChart: React.FunctionComponent<MeasurementsChartProps> = ({ data }) => {
  const chartData = formatChartData(data);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="name"
            stroke="var(--color-text)"
            tick={{ fill: 'var(--color-text)', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: 'var(--color-border)' }}
          />
          <YAxis
            dataKey="value"
            stroke="var(--color-text)"
            tick={{ fill: 'var(--color-text)', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: 'var(--color-border)' }}
            domain={[(dataMin: number) => Math.min(0, dataMin - 1), (dataMax: number) => dataMax + 1]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-background-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              color: 'var(--color-text)',
            }}
            labelStyle={{ color: 'var(--color-text)' }}
          />
          <Legend
            wrapperStyle={{ color: 'var(--color-text)' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            name="Value"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 8, fill: '#8884d8' }}
            dot={{ r: 4, fill: '#8884d8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MeasurementsChart;
