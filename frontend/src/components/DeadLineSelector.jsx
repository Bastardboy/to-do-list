import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios'; // Importar Axios

const DeadlineSelector = ({ taskId, onDeadlineSet, triggerButton, isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [error, setError] = useState(null);
  const popoverRef = useRef();

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

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    calculateDaysLeft(date);

    try {
      const response = await axios.patch(`/api/deadline/${taskId}`, {
        deadline: date.toISOString(),
      });

      console.log('Respuesta servidor:', response.data);

      if (typeof onDeadlineSet === 'function') {
        onDeadlineSet(date); // Aquí se pasa el cambio al componente principal
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
    setDaysLeft(Math.ceil(timeDiff / (1000 * 3600 * 24)));
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
              className="[&_button]:text-white [&_abbr]:text-cyan-200 [&_.react-calendar__navigation__label]:text-white [&_.react-calendar__tile]:rounded-lg [&_.react-calendar__tile--active]:bg-blue-500 [&_.react-calendar__tile--now]:bg-blue-500/20 [&_.react-calendar__tile]:transition-colors"
              prevLabel={<span className="text-white hover:text-blue-300">◄</span>}
              nextLabel={<span className="text-white hover:text-blue-300">►</span>}
              prev2Label={null}
              next2Label={null}
              formatShortWeekday={(locale, date) => ['D', 'L', 'M', 'M', 'J', 'V', 'S'][date.getDay()]}
              tileDisabled={({ date }) => date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)}
              tileClassName={({ date }) => date.getDay() === 0 ? '!text-red-300' : ''}
            />

            <div className="mt-3 flex justify-between items-center">
              <button onClick={onClose} className="px-3 py-1.5 text-sm bg-red-500/20 text-red-100 rounded-lg hover:bg-red-500/30">
                Cancelar
              </button>
              <span className="text-sm text-cyan-200">
                {selectedDate ? selectedDate.toLocaleDateString('es-CL') : 'Sin fecha'}
              </span>
            </div>

            {daysLeft !== null && (
              <div className="mt-2 text-sm text-white">
                {daysLeft > 0 ? `${daysLeft} días restantes` : '¡La fecha ya pasó!'}
              </div>
            )}

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeadlineSelector;
