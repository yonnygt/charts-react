// src/pages/Inventory.jsx
import React, { useState }  from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useTheme } from '../ui/ThemeContext';
import {DatePicker} from '../ui/DatePicker';
import ArrowDownTrayIcon  from '@heroicons/react/24/outline/ArrowDownTrayIcon'
import ShareIcon  from '@heroicons/react/24/outline/ShareIcon'
import EnvelopeIcon  from '@heroicons/react/24/outline/EnvelopeIcon'
import EllipsisVerticalIcon  from '@heroicons/react/24/outline/EllipsisVerticalIcon'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

// const data1 = {
//   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//   datasets: [
//     {
//       label: 'Monthly Active Users (in K)',
//       data: [500, 520, 510, 530, 550, 570, 560],
//       borderColor: 'rgba(54, 162, 235, 1)',
//       backgroundColor: 'rgba(54, 162, 235, 0.2)',
//       fill: true,
//     },
//   ],
// };
const labels =   ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const data2 = {
 labels,
  datasets: [
    {
      label: 'Store 1',
      data: labels.map(() => { return Math.random() * 1000 + 500 }),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
    {
      label: 'Store 2',
      data: labels.map(() => { return Math.random() * 1000 + 500 }),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart Title',
    },
  },
};

const Inventory = () => {
  return (
    <>
    <DatePicker/>
    <div className="flex flex-wrap -mx-4">
      <div className="w-full md:w-1/2 p-4 " data-theme = {useTheme}>
        <div className="rounded-lg shadow-2xl p-4 dark:bg-gray-800 ">
          <h2 className="text-xl font-semibold mb-4">Gráfico 1</h2>
          <div className="relative h-64">
          <Bar data={data2} options={{ ...options, plugins: { ...options.plugins, title: { text: 'Revenue' } } }} />
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 p-4" data-theme = {useTheme}>
        <div className="rounded-lg shadow-2xl p-4 dark:bg-gray-800" >
          <h2 className="text-xl font-semibold mb-4">Gráfico 2</h2>
          <div className="relative h-64">
            <Pie 
              data={data2} 
              options={options} 
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Inventory;
