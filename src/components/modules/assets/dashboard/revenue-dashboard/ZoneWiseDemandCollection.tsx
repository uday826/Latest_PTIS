import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const mockData = [
  {
    name: 'A - क्षेत्रीय कार्यालय पूर्व',
    shortName: 'A',
    collected: 2.5,
    pending: 0.7,
    total: 3.1,
    percentage: 28.0,
    color: '#8B5CF6', // Purple
  },
  {
    name: 'B - क्षेत्रीय कार्यालय पश्चिम',
    shortName: 'B',
    collected: 2.3,
    pending: 0.6,
    total: 2.9,
    percentage: 26.0,
    color: '#EC4899', // Pink
  },
  {
    name: 'C - क्षेत्रीय कार्यालय उत्तर',
    shortName: 'C',
    collected: 2.1,
    pending: 0.6,
    total: 2.7,
    percentage: 24.0,
    color: '#F97316', // Orange
  },
  {
    name: 'D - क्षेत्रीय कार्यालय दक्षिण',
    shortName: 'D',
    collected: 1.9,
    pending: 0.5,
    total: 2.5,
    percentage: 22.0,
    color: '#14B8A6', // Teal
  },
];

const ZoneWiseDemandCollection: React.FC = () => {
  const totalDemand = mockData.reduce((sum, item) => sum + item.total, 0);

  const CustomLegend = () => {
    return (
      <div className="flex flex-col gap-4 ml-8">
        {mockData.map((item, index) => (
          <div key={index} className="flex items-center justify-between min-w-[280px]">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div>
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-600">
                  <span className="text-green-600">₹{item.collected}L</span>
                  <span className="mx-1">/</span>
                  <span className="text-red-600">₹{item.pending}L</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">
                {item.percentage.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">₹{item.total}L</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Zone-wise Demand & Collection
      </h2>

      <div className="flex items-center justify-between">
        <div className="relative w-[360px] h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockData}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={100}
                outerRadius={160}
                paddingAngle={2}
                dataKey="total"
                stroke="none"
              >
                {mockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-8">
            <p className="text-2xl font-bold text-gray-800">
              ₹{totalDemand.toFixed(2)}Cr
            </p>
            <p className="text-sm text-gray-500">Total Demand</p>
          </div>
        </div>

        <CustomLegend />
      </div>
    </div>
  );
};

export default ZoneWiseDemandCollection;