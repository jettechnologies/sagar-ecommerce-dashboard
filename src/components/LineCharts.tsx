// import React, from 'react';
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

const LineCharts: React.FC<Props> = ({ data, filter = "month" }) => {

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
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalRevenue" stroke="#377dff" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineCharts;
