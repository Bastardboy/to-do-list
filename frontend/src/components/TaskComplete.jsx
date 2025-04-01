import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskComplete = ({ _id, fetchTasks }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  // Cargar el estado inicial desde localStorage
  useEffect(() => {
    const storedStatus = localStorage.getItem(`task-${_id}-completed`);
    if (storedStatus !== null) {
      setIsCompleted(JSON.parse(storedStatus)); // Recuperamos el estado almacenado
    } else {
      // Si no está en localStorage, consultamos la base de datos
      const fetchTaskStatus = async () => {
        try {
          const response = await axios.get(`/api/task/${_id}`);
          if (response.status === 200) {
            setIsCompleted(response.data.completed);
          }
        } catch (error) {
          console.error('Error fetching task status:', error);
        }
      };

      fetchTaskStatus();
    }
  }, [_id]); // Solo se ejecuta cuando el _id cambia

  const handleComplete = async () => {
    try {
      // Marca la tarea como completada
      const response = await axios.patch('/api/complete', {
        taskId: _id,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Si usas autenticación por cookies
      });

      if (response.status === 200) {
        // Almacenar el estado localmente para persistencia
        localStorage.setItem(`task-${_id}-completed`, JSON.stringify(true));
        setIsCompleted(true); // Actualizamos el estado local

        fetchTasks(); // Vuelve a obtener la lista de tareas actualizada
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleUndoComplete = async () => {
    try {
      // Marca la tarea como incompleta
      const response = await axios.patch('/api/complete', {
        taskId: _id,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        // Almacenar el estado localmente para persistencia
        localStorage.setItem(`task-${_id}-completed`, JSON.stringify(false));
        setIsCompleted(false); // Actualizamos el estado local

        fetchTasks(); // Vuelve a obtener la lista de tareas actualizada
      }
    } catch (error) {
      console.error('Error undoing task completion:', error);
    }
  };

  return (
    <button
      onClick={isCompleted ? handleUndoComplete : handleComplete}
      className={`px-5 py-2.5 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2
        ${isCompleted ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        {isCompleted ? (
          <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z" />
        ) : (
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        )}
      </svg>
    </button>
  );
};

export default TaskComplete;
