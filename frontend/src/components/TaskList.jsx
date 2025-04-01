import React, { useState } from 'react';
import TaskDelete from './TaskDelete';
import TaskComplete from './TaskComplete';
import TaskUpdate from './TaskUpdate';
import DeadlineSelector from './DeadLine'; // Importa el componente de deadline

const TaskList = ({ tasks, fetchDelete, fetchTasks }) => {
  const [mountedTasks, setMountedTasks] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [openDeadlineID, setOpenDeadlineID] = useState(null);

  const handleRemoveAnimation = (id) => {
    const card = document.getElementById(`task-${id}`);
    if (card) {
      card.style.transform = 'translateY(-20px) rotate(3deg) scale(0.95)';
      card.style.opacity = '0';

      setTimeout(() => {
        fetchDelete(id);
        fetchTasks();
      }, 500);
    }
  };

  const handleAnimationEnd = (id) => {
    setMountedTasks((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const toggleCalendarVisibility = (taskId) => {
    setCalendarVisible((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],  // Alterna la visibilidad del calendario de esta tarea
    }));
  };

  // Estilo común para los botones
  const buttonStyle = "px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
      {tasks.map((task, index) => (
        <div
          id={`task-${task._id}`}
          key={task._id}
          className={`relative p-6 bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-2xl shadow-2xl flex flex-col justify-between
                   transform transition-all duration-500 hover:scale-[1.03] hover:shadow-3xl
                   ${!mountedTasks.has(task._id) ? 'animate-card-in opacity-0' : ''}`}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationFillMode: 'forwards',
          }}
          onAnimationEnd={() => handleAnimationEnd(task._id)}
        >
          {editingId === task._id ? (
            <TaskUpdate
              _id={task._id}
              title={task.title}
              description={task.description}
              fetchTasks={fetchTasks}
              onClose={() => setEditingId(null)}
            />
          ) : (
            <>
              {/* Capas de fondo no interactivas */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-2xl pointer-events-none" />
              <div className="absolute inset-0 border-2 border-white/10 rounded-2xl group-hover:border-white/30 transition-all duration-500 pointer-events-none" />

              {/* Contenido principal */}
              <div className="flex flex-col h-full">
                {/* Encabezado con botones */}
                <div className="flex justify-between items-center relative z-20 mb-4">
                  <h5 className="text-2xl font-semibold" style={{ fontFamily: 'Arial, sans-serif' }}>
                    <span className="text-white">
                      {task.title}
                    </span>
                  </h5>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingId(task._id)}
                      className={`bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-md z-30 ${buttonStyle}`}
                    >
                      ✏️
                    </button>
                    <TaskComplete
                      _id={task._id}
                      fetchTasks={fetchTasks}
                    />
                  </div>
                </div>

                {/* Descripción */}
                <p className="mb-6 text-cyan-100/90 relative z-20 flex-grow">
                  {task.description}
                </p>

                {/* Botón Eliminar y Establecer Plazo */}
                <div className="task-buttons-container flex justify-end relative z-20 mt-4">
                  <DeadlineSelector
                    onDeadlineSet={(date) => {
                      console.log('Fecha seleccionada para:', task._id,date);
                    }}
                    triggerButton={
                      <button
                        className={`deadline-button bg-gradient-to-r from-blue-400 to-blue-500 text-white ${buttonStyle}`}  // Estilo unificado
                        onClick={() => setOpenDeadlineID(openDeadlineID === task._id ? null : task._id)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span className="text-sm">{task.deadline ? 'Cambiar Fecha' : 'Fecha Límite'}</span>
                      </button>
                    }
                    isOpen={openDeadlineID === task._id}
                    onClose={() => setOpenDeadlineID(null)}
                  />
                  <TaskDelete
                    _id={task._id}
                    fetchDelete={() => handleRemoveAnimation(task._id)}
                    fetchTasks={fetchTasks}
                    className={`delete-button bg-gradient-to-r from-red-400 to-red-500 text-white ${buttonStyle}`}  // Estilo unificado
                  />
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
