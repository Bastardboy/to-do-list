import React, { useState } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';

const TaskForm = ({ fetchTasks }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const cookies = parseCookies();
  const id_user = cookies.id_user;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim()) {
      setError('El título es requerido');
      return;
    }
    
    if (!description.trim()) {
      setError('La descripción es requerida');
      return;
    }

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
      setError('Error al crear la tarea. Intenta nuevamente.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="gradient-form max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl space-y-6 mb-12 bg-gradient-to-tr from-indigo-500/90 via-purple-500/90 to-pink-500/90 relative"
    >
      {/* Título con Poppins */}
      <h2 className="font-display text-4xl font-bold text-white text-center drop-shadow-md">
        ✨ Nueva Tarea
      </h2>
      
      {/* Mensaje de error con Montserrat */}
      {error && (
        <div className="font-alert bg-red-500/90 text-white p-4 rounded-xl border-l-4 border-red-300 shadow-lg flex items-start gap-3 animate-fade-in">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 flex-shrink-0" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <div>
            <p className="font-medium">¡Atención!</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Título *"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError('');
            }}
            className={`font-alert w-full p-4 rounded-xl bg-white/20 backdrop-blur-sm border ${
              error && !title.trim() ? 'border-red-400' : 'border-white/30'
            } text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg transition-all duration-300`}
          />
        </div>
        
        <div className="relative">
          <textarea
            placeholder="Descripción *"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError('');
            }}
            rows="4"
            className={`font-alert w-full p-4 rounded-xl bg-white/20 border ${
              error && !description.trim() ? 'border-red-400' : 'border-white/30'
            } text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg transition-all duration-300`}
          />
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-100 shadow-2xl flex items-center justify-center gap-2"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
          />
        </svg>
        Crear Tarea
      </button>
    </form>
  );
};

export default TaskForm;
