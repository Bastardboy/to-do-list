import React from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';

const TaskDelete = ({ _id, fetchTasks }) => {
  const handleDelete = async () => {
    try {
      const cookies = parseCookies();

      await axios.delete('/api/delete', {
        data: { taskId: _id },
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      Eliminar
    </button>
  );
  
};

export default TaskDelete;
