// Analytics.jsx
import React, {useState} from 'react';
import ArrowDownTrayIcon  from '@heroicons/react/24/outline/ArrowDownTrayIcon'
import ShareIcon  from '@heroicons/react/24/outline/ShareIcon'
import EnvelopeIcon  from '@heroicons/react/24/outline/EnvelopeIcon'
import EllipsisVerticalIcon  from '@heroicons/react/24/outline/EllipsisVerticalIcon'
import ArrowPathIcon  from '@heroicons/react/24/outline/ArrowPathIcon'
import {DatePicker} from '../ui/DatePicker';
import { Pie } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../ui/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);
// const { theme, changeTheme } = useTheme();
// console.log(theme);
export const data1 = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 32, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 3,
    },
  ],
};

export const data2 = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [10, 20, 30, 40, 50, 60],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 3,
    },
  ],
};

const Analytics = () => {
  const [dateValue, setDateValue] = useState({ 
    startDate: new Date(), 
    endDate: new Date() 
}); 

const handleDatePickerValueChange = (newValue) => {
    console.log("newValue:", newValue); 
    setDateValue(newValue); 
    updateDashboardPeriod(newValue)
} 


  return (
 
    <>
    <DatePicker/>
    <div className="flex flex-wrap -mx-4  md:max-w-4xl" >
        <div className="w-full md:w-1/2 p-4" >
          <div className="rounded-lg shadow-xl p-4">
            <h2 className="text-xl font-semibold mb-4">Gráfico 1</h2>
            <div className="relative h-64">
              <Pie
                data={data1}
                options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-4" >
          <div className="rounded-lg shadow-xl p-4">
            <h2 className="text-xl font-semibold mb-4">Gráfico 2</h2>
            <div className="relative h-64">
              <Pie
                data={data2}
                options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div></>
);
};

export default Analytics;
