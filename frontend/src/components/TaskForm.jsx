import React, { useState } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';

const TaskForm = ({ fetchTasks }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const cookies = parseCookies();
  const id_user = cookies.id_user;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', {
        title,
        description,
        completed: false,
        id_user
      });
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="gradient-form max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl space-y-6 mb-12 bg-gradient-to-tr from-indigo-500/90 via-purple-500/90 to-pink-500/90 backdrop-blur-sm"
    >
      <h2 className="text-4xl font-bold text-white text-center drop-shadow-md">
        ✨ Nueva Tarea
      </h2>
      
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg transform hover:scale-105 transition-all duration-300"
      />
      
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg transform hover:scale-105 transition-all duration-300"
      />
      
      <button
        type="submit"
        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-2xl"
      >
        Crear Tarea
      </button>
    </form>

  );
};

export default TaskForm;
  