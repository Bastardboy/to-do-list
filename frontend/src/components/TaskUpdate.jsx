import React, { useState } from 'react';
import axios from 'axios';

const TaskUpdate = ({ _id, title, description, fetchTasks, onClose }) => {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);

  const handleUpdate = async () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      alert('Por favor, completa todos los campos antes de guardar.');
      return;
    }

    try {
      const response = await axios.patch(
        '/api/update',
        {
          taskId: _id,
          title: newTitle,
          description: newDescription,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        await fetchTasks();
        onClose(); // Cierra el formulario de edición
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="space-y-4">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full p-2 bg-white/10 border-2 border-cyan-300/50 rounded-lg text-white text-xl font-bold focus:outline-none focus:border-cyan-400 placeholder-white/50"
          placeholder="Título de la tarea"
          autoFocus
          required
        />
        
        <input
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="w-full p-2 bg-white/10 border-2 border-cyan-300/50 rounded-lg text-cyan-100 focus:outline-none focus:border-cyan-400 resize-none placeholder-white/50"
          placeholder="Descripción de la tarea"
          rows="3"
          required
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={handleUpdate}
          className="px-5 py-2.5 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl hover:scale-105 transition-transform duration-300 shadow-md flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Guardar
        </button>
        <button
          onClick={onClose}
          className="px-5 py-2.5 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-xl hover:scale-105 transition-transform duration-300 shadow-md"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default TaskUpdate;
