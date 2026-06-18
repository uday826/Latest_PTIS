import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const mockData = [
  { month: 'Jan', collected: 8.5, pending: 1.2 },
  { month: 'Feb', collected: 9.0, pending: 0.9 },
  { month: 'Mar', collected: 9.8, pending: 0.6 },
  { month: 'Apr', collected: 8.8, pending: 1.1 },
  { month: 'May', collected: 10.0, pending: 0.8 },
  { month: 'Jun', collected: 10.5, pending: 0.7 },
  { month: 'Jul', collected: 9.8, pending: 0.5 },
  { month: 'Aug', collected: 10.0, pending: 0.7 },
  { month: 'Sep', collected: 10.5, pending: 0.6 },
  { month: 'Oct', collected: 10.2, pending: 0.7 },
  { month: 'Nov', collected: 10.8, pending: 0.6 },
  { month: 'Dec', collected: 8.8, pending: 2.5 },
];

const MonthlyRevenueTrendScreen: React.FC = () => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{payload[0].payload.month}</p>
          <p className="text-blue-600 text-sm">
            Collected: ₹{payload[0].value}L
          </p>
          <p className="text-red-600 text-sm">
            Pending: ₹{payload[1].value}L
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Monthly Revenue Collection Trend
      </h2>

      <div className="w-full" style={{ height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={mockData}
            margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `₹${value}L`}
              domain={[0, 12]}
              ticks={[0, 3, 6, 9, 12]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-sm font-medium text-gray-600 ml-2">
                  {value}
                </span>
              )}
            />

            <Bar
              dataKey="collected"
              name="Collected"
              fill="url(#colorCollected)"
              radius={[8, 8, 0, 0]}
              barSize={40}
            />

            <Line
              type="monotone"
              dataKey="pending"
              name="Pending"
              stroke="#dc2626"
              strokeWidth={3}
              dot={{ fill: '#dc2626', r: 5, strokeWidth: 0 }}
              activeDot={{ r: 7, strokeWidth: 0 }}
            />

            <defs>
              <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={1} />
              </linearGradient>
            </defs>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyRevenueTrendScreen;