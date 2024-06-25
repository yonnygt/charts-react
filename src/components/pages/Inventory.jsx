// src/pages/Inventory.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DatePicker } from '../ui/DatePicker';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from '../ui/ThemeContext';
import dayjs from 'dayjs';

const Inventory = () => {
  const { theme } = useTheme();
  const [inventoryData, setInventoryData] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: new Date(), endDate: new Date() });

  useEffect(() => {
    fetchInventoryData();
  }, [dateRange]);

  const fetchInventoryData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/inventory', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        params: {
          endDate: dateRange.endDate
        }
      });
      setInventoryData(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error('Error fetching inventory data', error);
    }
  };

  const handleRefresh = () => {
    fetchInventoryData();
  };

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  // Columnas de la DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 100, headerClassName: 'super-app-theme--header' },
    { field: 'org', headerName: 'Organizacion', width: 200, headerClassName: 'super-app-theme--header' },
    { field: 'name', headerName: 'Nombre', width: 300, headerClassName: 'super-app-theme--header' },
    { field: 'qtyavailable', headerName: 'Cant Disponible', width: 200, headerClassName: 'super-app-theme--header' },
    { field: 'reception_date', headerName: 'Fecha Recepcion', width: 300, headerClassName: 'super-app-theme--header'}
  ];

  const getThemeStyles = (theme) => ({
    backgroundColor: theme === 'dark' ? '#1d232a' : '#fff',
    color: theme === 'dark' ? '#fff' : '#000',
    '& .MuiDataGrid-root': {
      border: '1px solid #1f2937', // Adding border color to the DataGrid
    },
    '& .MuiDataGrid-cell': {
      borderBottom: theme === 'dark' ? '1px solid #555' : '1px solid #e0e0e0',
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: theme === 'dark' ? '#444' : '#f5f5f5',
      borderBottom: theme === 'dark' ? '1px solid #555' : '1px solid #e0e0e0',
    },
    '& .MuiDataGrid-border': {
      borderColor: theme === 'dark' ? '#1d232a' : '#f5f5f5',
      // borderBottom: theme === 'dark' ? '1px solid #555' : '1px solid #e0e0e0',
    },
    '& .MuiDataGrid-footerContainer': {
      backgroundColor: theme === 'dark' ? '#1d232a' : '#f5f5f5',
      borderTop: theme === 'dark' ? '1px solid #555' : '1px solid #e0e0e0',
    },
    '& .MuiButtonBase-root': {
      color: theme === 'dark' ? '#fff' : '#000',
    },
    '& .super-app-theme--header': {
          backgroundColor: theme === 'dark' ? '#1d232a' : '#fff',

    },
  });

  return (
    <>
      <DatePicker onDateChange={handleDateChange} onRefresh={handleRefresh} />
      <div style={{ height:500, width: '90%' }}>
        <DataGrid
          rows={inventoryData}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          pageSize={5}
          rowsPerPageOptions={[10]}
          disableColumnSelector
          disableDensitySelector
          disableSelectionOnClick
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={getThemeStyles(theme) }
        />
      </div>
    </>
  );
};

export default Inventory;
