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
    onDateChange(newValue);
  } 

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-2 dark:text-gray-50">
      <div className="mb-4 sm:mb-0 dark:text-gray-50">
        <Datepicker
          containerClassName="w-full sm:w-72 dark:text-gray-50"
          i18n={"es"} // configura el idioma
          showFooter={true} // si es true muestra el footer con boton de aplicar
          // placeholder={"My Placeholder"} // deberia mostrar el placeholder por defecto
          useRange={true} // si es true muestra dos calendarios
          value={dateValue}
          theme={"light"}
          configs={{ 
            footer: {   
              cancel: "Cancelar", 
              apply: "Aplicar" 
              }
           }}
          inputClassName="input input-bordered w-full sm:w-72 dark:text-gray-50"
          popoverDirection={"down"}
          toggleClassName="invisible"
          onChange={handleDatePickerValueChange}
          // showShortcuts={true} // si es true muestra los atajos a la izquierda
          primaryColor={"white"} />
      </div>
      <div className="text-right">
        <button  className="btn btn-ghost btn-sm normal-case" onClick={onRefresh} >
          <ArrowPathIcon className="w-4 mr-2" />Refrescar
        </button>
      </div>
    </div>
  );
};

export default DatePicker;
