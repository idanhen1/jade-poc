import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function CoverageChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <XAxis 
          dataKey="date" 
          tickFormatter={(value) => {
            const date = new Date(value);
            return `${date.toLocaleString('default', { month: 'short' })}`;
          }}
        />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="coverage" 
          stroke="#2563eb" 
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}