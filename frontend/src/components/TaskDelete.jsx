import React from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';

const TaskDelete = ({ _id, fetchTasks }) => {
  const handleDelete = async () => { // No necesita parámetro, usa _id del prop
    try {
      const cookies = parseCookies();
      const id_user = cookies.id_user;

      await axios.delete('/api/delete', { // Ruta sin parámetro en URL
        data: { taskId: _id },
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true // Opcional, para enviar cookies automáticamente
      });

      fetchTasks(); // Actualizar lista
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      className="p-2 bg-red-500 text-white rounded"
    >
      Eliminar
    </button>
  );
};

export default TaskDelete;