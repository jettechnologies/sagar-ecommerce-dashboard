import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

type DataPoint = {
  date: string;
  totalRevenue: string;
};

type Props = {
  data: DataPoint[];
  filter?: "month" | "year";
};

const RechartsComponent: React.FC<Props> = ({ data, filter = "month" }) => {
  // const [filter, setFilter] = useState<'month' | 'year'>('month');

  // const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
  //   const value = e.target.value as "month" | "year";
  //   if (value === "month" || value === "year") {
  //     setFilter(value);
  //   }
  // };

  const filterData = (data: DataPoint[], filter: 'month' | 'year') => {
    return data.filter(point => {
      const date = parseISO(point.date);
      if (filter === 'month') {
        return format(date, 'yyyy-MM') === format(new Date(), 'yyyy-MM');
      } else {
        return format(date, 'yyyy') === format(new Date(), 'yyyy');
      }
    });
  };

  const filteredData = filterData(data, filter).map(point => ({
    date: format(parseISO(point.date), 'yyyy-MM-dd'),
    totalRevenue: parseFloat(point.totalRevenue),
  }));

  return (
    <div>
      {/* <div>
        <select onChange={handleInputChange}>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div> */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RechartsComponent;
