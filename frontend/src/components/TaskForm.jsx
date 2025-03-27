import React, { useState } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';

const TaskForm = ({ fetchTasks }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Obtener el id_user desde la cookie
  const cookies = parseCookies();
  const id_user = cookies.id_user;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Crear el cuerpo con el id_user y los demás campos
      await axios.post('/api/tasks', { 
        title, 
        description, 
        completed: false, 
        id_user 
      });
      setTitle('');
      setDescription('');
      fetchTasks(); // Actualizar la lista de tareas
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg space-y-6">
      <h2 className="text-3xl font-semibold text-white text-center">Crear Nueva Tarea</h2>
      <input
        type="text"
        placeholder="Título de la tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
      <textarea
        placeholder="Descripción de la tarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
      <button 
        type="submit" 
        className="w-full p-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300"
      >
        Agregar Tarea
      </button>
    </form>
  );
};

export default TaskForm;
