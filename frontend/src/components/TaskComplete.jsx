import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskComplete = ({ _id, fetchTasks }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  // Cargar el estado inicial desde la base de datos
  useEffect(() => {
    const fetchTaskStatus = async () => {
      try {
        const response = await axios.get(`/api/tasks/${_id}`);
        if (response.status === 200) {
          setIsCompleted(response.data.completed);
        }
      } catch (error) {
        console.error('Error fetching task status:', error);
      }
    };

    fetchTaskStatus();
  }, [_id]);

  const handleComplete = async () => {
    try {
      // Actualización optimista: se cambia el estado local inmediatamente
      setIsCompleted(true);
      const response = await axios.patch(`/api/tasks/complete/${_id}`, {
        taskId: _id,
        completed: true,
      });
      if (response.status === 200) {
        fetchTasks(); // Actualiza la lista de tareas
      }
    } catch (error) {
      console.error('Error completing task:', error);
      setIsCompleted(false); // Revertir el cambio en caso de error
    }
  };

  const handleUndoComplete = async () => {
    try {
      const response = await axios.patch(`/api/tasks/complete/${_id}`, {
        taskId: _id,
        completed: false,
      });
      if (response.status === 200) {
        setIsCompleted(false);
        fetchTasks();
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
