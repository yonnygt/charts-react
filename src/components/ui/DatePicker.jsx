// src/ui/DatePicker.jsx
import Datepicker from "react-tailwindcss-datepicker"; 
import React, { useState } from 'react';
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon';

export const DatePicker = ({ onDateChange, onRefresh }) => {
  const [dateValue, setDateValue] = useState({ 
    startDate: new Date(), 
    endDate: new Date() 
  }); 

  const handleDatePickerValueChange = (newValue) => {
    // console.log("newValue:", newValue); 
    setDateValue(newValue);
    onDateChange(newValue);  // Llamar a la función de callback pasada desde el componente padre
  } 

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-2">
      <div className="mb-4 sm:mb-0">
        <Datepicker
          containerClassName="w-full sm:w-72"
          value={dateValue}
          theme={"light"}
          inputClassName="input input-bordered w-full sm:w-72"
          popoverDirection={"down"}
          toggleClassName="invisible"
          onChange={handleDatePickerValueChange}
          showShortcuts={true}
          primaryColor={"white"} />
      </div>
      <div className="text-right">
        <button 
          className="btn btn-ghost btn-sm normal-case"
          onClick={onRefresh} // Llamar a la función de callback pasada desde el componente padre
        >
          <ArrowPathIcon className="w-4 mr-2" />Refresh Data
        </button>
      </div>
    </div>
  );
};

export default DatePicker;
