import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';

const DeadlineSelector = ({ taskId, onDeadlineSet, triggerButton, isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [error, setError] = useState(null);
  const [deadlineColor, setDeadlineColor] = useState('');
  const popoverRef = useRef();

  // Obtiene la fecha inicial al abrir
  useEffect(() => {
    if (isOpen && taskId) {
      axios.get(`/api/date/${taskId}`)
        .then(response => {
          const { deadline } = response.data;
          if (deadline) {
            const deadlineDate = new Date(deadline);
            setSelectedDate(deadlineDate);
            calculateDaysLeft(deadlineDate);
          }
        })
        .catch(error => {
          console.error('Error obteniendo fecha:', error);
          setError('Aún no hay fecha límite');
        });
    }
  }, [isOpen, taskId]);

  // Detecta clic fuera del popover para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    calculateDaysLeft(date);

    try {
      const response = await axios.patch(`/api/deadline/${taskId}`, {
        deadline: date.toISOString(),
      });

      console.log('Respuesta servidor:', response.data);

      if (typeof onDeadlineSet === 'function') {
        onDeadlineSet(date);
      }
      onClose();
    } catch (error) {
      console.error('Error actualizando fecha:', error);
      setError(error.response?.data?.message || 'Error al guardar fecha');
    }
  };

  const calculateDaysLeft = (deadlineDate) => {
    if (!deadlineDate) return;
    const today = new Date();
    const timeDiff = deadlineDate.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    setDaysLeft(days);

    if (days > 10) {
      setDeadlineColor('text-green-500');
    } else if (days > 5) {
      setDeadlineColor('text-yellow-500');
    } else if (days >= 0) {
      setDeadlineColor('text-red-500');
    }
  };

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
              className="[&_button]:text-white [&_abbr]:text-cyan-200 [&_.react-calendar__navigation__label]:text-white [&_.react-calendar__tile]:rounded-lg [&_.react-calendar__tile--active]:bg-blue-500 [&_.react-calendar__tile--now]:bg-blue-500/20 [&_.react-calendar__tile]:transition-colors duration-300"
            />

            {error && <p className="text-red-400">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeadlineSelector;
