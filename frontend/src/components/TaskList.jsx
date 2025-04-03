import React, { useState, useEffect } from 'react';
import TaskDelete from './TaskDelete';
import TaskComplete from './TaskComplete';
import TaskUpdate from './TaskUpdate';
import DeadlineSelector from './DeadLineSelector';

// Constantes configurables
const MAX_LINES = 1; // Número máximo de líneas visibles inicialmente
const CHARS_PER_LINE = 30; // Caracteres aproximados por línea visual

const TaskList = ({ tasks, fetchDelete, fetchTasks, updateTaskDeadline }) => {
  const [mountedTasks, setMountedTasks] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [openDeadlineID, setOpenDeadlineID] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState({});

  const cardGradients = [
    'from-indigo-600 to-blue-700',
    'from-purple-600 to-indigo-700',
    'from-cyan-600 to-blue-700',
    'from-sky-600 to-cyan-700'
  ];

  // Función para calcular líneas efectivas
  const calculateLines = (text) => {
    if (!text) return 0;
    const explicitLines = (text.match(/\n/g) || []).length + 1;
    const overflowLines = Math.ceil(text.length / CHARS_PER_LINE);
    return Math.max(explicitLines, overflowLines);
  };

  // Determina si se debe mostrar el toggle
  const shouldShowToggle = (description) => {
    return calculateLines(description) > MAX_LINES;
  };

  const toggleExpand = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

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
    setMountedTasks(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const getDaysLeftInfo = (deadline) => {
    if (!deadline) return { 
      text: 'Sin fecha límite', 
      color: 'text-gray-300',
      bg: 'bg-gray-500/10', 
      icon: '⏳',
      status: 'empty' 
    };
    
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const timeDiff = deadlineDate - today;
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (days > 14) return { 
      text: `${days} días restantes`, 
      color: 'text-emerald-300',
      bg: 'bg-emerald-500/10',
      icon: '🟢',
      status: 'active'
    };
    if (days > 7) return { 
      text: `${days} días restantes`, 
      color: 'text-amber-300',
      bg: 'bg-amber-500/10',
      icon: '🟡',
      status: 'active'
    };
    if (days >= 0) return { 
      text: `${days} días restantes`, 
      color: 'text-rose-300',
      bg: 'bg-rose-500/10',
      icon: '🔴',
      status: 'urgent'
    };
    return { 
      text: '¡Fecha vencida!', 
      color: 'text-rose-400',
      bg: 'bg-rose-600/10',
      icon: '⚠️',
      status: 'expired'
    };
  };

  // Componente para el icono de Chevron
  const ChevronIcon = ({ expanded }) => (
    <svg 
      className="w-4 h-4 mr-1" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d={expanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
      />
    </svg>
  );

  const buttonStyle = "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 items-start">
      {tasks.map((task, index) => {
        const daysInfo = getDaysLeftInfo(task.deadline);
        const cardColor = cardGradients[index % cardGradients.length];
        const needsToggle = shouldShowToggle(task.description);
        const isExpanded = expandedTasks[task._id];
        
        return (
          <div
            id={`task-${task._id}`}
            key={task._id}
            className={`relative p-6 bg-gradient-to-br ${cardColor} text-white rounded-2xl shadow-2xl flex flex-col
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
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                <div className="absolute inset-0 border-2 border-white/10 rounded-2xl group-hover:border-white/30 transition-all duration-500 pointer-events-none" />

                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center relative z-20 mb-4">
                    <h5 className="text-2xl font-display font-semibold tracking-tight">
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
                  
                  <div className="mb-4 relative">
                    <p 
                      className={`text-white/80 font-sans text-base leading-relaxed tracking-wide break-words 
                                  ${!isExpanded && needsToggle ? 'line-clamp-3' : ''}`}
                    >
                      {task.description}
                    </p>

                    {needsToggle && (
                      <button
                        onClick={() => toggleExpand(task._id)}
                        className="text-cyan-300 hover:text-cyan-100 text-sm font-medium mt-1 flex items-center"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronIcon expanded />
                            Mostrar menos
                          </>
                        ) : (
                          <>
                            <ChevronIcon expanded={false} />
                            Mostrar más
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className={`mb-4 p-3 rounded-lg ${daysInfo.bg} backdrop-blur-sm border border-white/10`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{daysInfo.icon}</span>
                      <span className={`text-sm font-medium ${daysInfo.color} font-mono tracking-tight`}>
                        {daysInfo.text}
                      </span>
                    </div>
                    {task.deadline ? (
                      <p className="text-xs text-cyan-100 font-medium tracking-wide mt-1">
                        Fecha límite: {new Date(task.deadline).toLocaleDateString('es-CL', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-300 font-medium tracking-wide mt-1">
                        Presiona el botón para establecer fecha
                      </p>
                    )}
                  </div>

                  <div className="task-buttons-container flex justify-end relative z-20 mt-4">
                    <DeadlineSelector
                      triggerButton={
                        <button
                          className="deadline-button bg-gradient-to-r from-blue-400 to-blue-500 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition-all"
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
                      taskId={task._id}
                      onDeadlineSet={(date) => {
                        if (typeof updateTaskDeadline === 'function') {
                          updateTaskDeadline(task._id, date);
                        }
                      }}
                    />
                    <TaskDelete
                      _id={task._id}
                      fetchDelete={() => handleRemoveAnimation(task._id)}
                      fetchTasks={fetchTasks}
                      className="delete-button bg-gradient-to-r from-red-400 to-red-500 text-white px-3 py-2 rounded-lg hover:scale-105 transition-all"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;