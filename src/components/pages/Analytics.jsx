import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useTheme } from '../ui/ThemeContext';
import { DatePicker } from '../ui/DatePicker';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const Analitycs = () => {
  const { theme } = useTheme();
  const [salesData, setSalesData] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: new Date(), endDate: new Date() });

  useEffect(() => {
    fetchSalesData();
  }, [dateRange]);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/analytics', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }
      });
      setSalesData(response.data);
    } catch (error) {
      console.error('Error fetching sales data', error);
    }
  };

  const processData = () => {
    const orgs = [...new Set(salesData.map(sale => sale.org))];
    const data = orgs.map(org => {
      const orgSales = salesData.filter(sale => sale.org === org);
      return orgSales.reduce((acc, sale) => acc + parseFloat(sale.grand_total), 0);
    });

    return {
      labels: orgs,
      datasets: [
        {
          label: 'Total de las ventas',
          data,
          backgroundColor: orgs.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`),
          borderColor: orgs.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`),
          borderWidth: 1,
        }
      ]
    };
  };

  const data = processData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ventas por organización',
      },
    },
  };

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const handleRefresh = () => {
    fetchSalesData();
  };

  return (
    <>
      <DatePicker onDateChange={handleDateChange} onRefresh={handleRefresh} />
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 p-4" data-theme={theme}>
          <div className="rounded-lg shadow-2xl p-4 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-50">Grafico de barras</h2>
            <div className="relative h-64">
              <Bar data={data} options={options} />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-4" data-theme={theme}>
          <div className="rounded-lg shadow-2xl p-4 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-50">Grafico de pastel</h2>
            <div className="relative h-64">
              <Pie data={data} options={options} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analitycs;
