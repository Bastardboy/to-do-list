import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import '../../dist/index.css'


const DeadlineSelector = ({ onDeadlineSet, triggerButton, isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const popoverRef = useRef();

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDeadlineSet(date);
    onClose();
  };

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={popoverRef}>
      <div onClick={() => isOpen ? onClose() : null}>
        {triggerButton}
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[999]">
          <div className="bg-gradient-to-br from-sky-600 to-blue-700 rounded-2xl shadow-2xl p-6 animate-fade-in border border-white/10 mx-4 w-full max-w-[340px]">
            <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            minDate={new Date()}
            className="[&_button]:text-white [&_abbr]:text-cyan-200 [&_.react-calendar__navigation__label]:text-white [&_.react-calendar__tile]:rounded-lg [&_.react-calendar__tile--active]:bg-blue-500 [&_.react-calendar__tile--now]:bg-blue-500/20 [&_.react-calendar__tile]:transition-colors"
            prevLabel={
                <span className="text-white hover:text-blue-300">◄</span>
            }
            nextLabel={
                <span className="text-white hover:text-blue-300">►</span>
            }
            prev2Label={null}
            next2Label={null}
            formatShortWeekday={(locale, date) => 
                ['D', 'L', 'M', 'M', 'J', 'V', 'S'][date.getDay()]
            }
            tileDisabled={({ date }) => date < new Date()}
            tileClassName={({ date }) => 
                date.getDay() === 0 ? '!text-red-300' : '' // Domingos en rojo
            }
            />
          
          <div className="mt-3 flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm bg-red-500/20 text-red-100 rounded-lg hover:bg-red-500/30"
            >
              Cancelar
            </button>
            <span className="text-sm text-cyan-200">
              {selectedDate?.toLocaleDateString('es-CL') || 'Sin fecha'}
            </span>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default DeadlineSelector;