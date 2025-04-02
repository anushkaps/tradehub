import React from 'react';

interface StatsProps {
  items: {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
  }[];
}

export function Stats({ items }: StatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            {item.icon && <div className="mr-3 text-[#105298]">{item.icon}</div>}
            <div>
              <div className="text-2xl font-bold text-[#105298]">{item.value}</div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}