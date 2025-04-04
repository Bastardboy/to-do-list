import React, { useState } from 'react';
import axios from 'axios';

const TaskDelete = ({ _id, fetchDelete, fetchTasks, className, index }) => {
  const [showModal, setShowModal] = useState(false);

  // Gradientes consistentes con TaskCard
  const cardGradients = [
    'from-indigo-600 to-blue-700',
    'from-purple-600 to-indigo-700',
    'from-cyan-600 to-blue-700',
    'from-sky-600 to-cyan-700'
  ];
  const gradientClass = cardGradients[index % cardGradients.length];

  const handleConfirmDelete = async () => {
    try {
      await axios.delete('/api/delete', {
        data: { taskId: _id },
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      localStorage.removeItem(`task-${_id}-completed`);
      fetchDelete(_id);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={className}
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className={`relative p-6 bg-gradient-to-br ${gradientClass} text-white rounded-2xl shadow-2xl w-full max-w-md`}>
            {/* Efectos visuales como en TaskCard */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-20 rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 border-2 border-white/10 rounded-2xl pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4">Confirmar eliminación</h3>
              <p className="mb-6 text-white/90">¿Estás seguro que deseas eliminar esta tarea? Esta acción no se puede deshacer.</p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all border border-white/20"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all flex items-center gap-2"
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
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskDelete;