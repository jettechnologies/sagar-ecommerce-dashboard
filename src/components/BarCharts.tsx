import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { useMemo, useCallback } from "react";

// Define a generic type for DataPoint
type Props<T> = {
    data: T[];
    filter: "month" | "year";
    dateKey: keyof T;
    valueKey: keyof T;
  };
  
  const BarCharts = <T,>({
    data,
    filter,
    dateKey,
    valueKey,
  }: Props<T>) => {
    
    const filterData = useCallback(
        (data: T[], filter: 'month' | 'year', dateKey: keyof T) => {
            return data.filter(point => {
              const date = parseISO(point[dateKey] as unknown as string);
              if (filter === 'month') {
                return format(date, 'yyyy-MM') === format(new Date(), 'yyyy-MM');
              } else {
                return format(date, 'yyyy') === format(new Date(), 'yyyy');
              }
            });
    }, []);
  
    const filteredData = useMemo(() => filterData(data, filter, dateKey), [data, filter, dateKey, filterData]);
  
    return (
      <div className='w-full'>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dateKey as string} tickFormatter={dateStr => format(parseISO(dateStr as string), 'yyyy-MM-dd')} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={valueKey as string} fill="#377dff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default BarCharts;