import React, { useState } from 'react';
import axios from 'axios';

const TaskDelete = ({ _id, fetchDelete, fetchTasks, className, index }) => {
  const [showModal, setShowModal] = useState(false);

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
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Fondo semitransparente */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            onClick={() => setShowModal(false)}
          />
          
          {/* Contenedor del modal */}
          <div className={`relative mx-4 p-5 bg-gradient-to-br ${gradientClass} text-white rounded-xl shadow-xl max-w-xs w-full z-50 border-2 border-white/30`}>
            
            {/* Texto mejorado */}
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2 text-white drop-shadow-md">
                ¿CONFIRMAR ELIMINACIÓN?
              </h3>
              <p className="text-sm font-medium text-white/95">
                Esta acción no se puede deshacer
              </p>
            </div>
            
            {/* Botones */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 text-sm font-semibold bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 text-sm font-semibold bg-red-500/90 hover:bg-red-600 rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskDelete;