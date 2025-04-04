import React, { useState } from 'react';
import TaskCard from './TaskCard';
import TaskOrder from '../TaskOrder/TaskOrder';

const TaskList = ({ 
  tasks, 
  fetchDelete, 
  fetchTasks, 
  updateTaskDeadline,
  fetchTaskOrder 
}) => {
  // Estados para manejar la UI
  const [expandedTasks, setExpandedTasks] = useState({});
  const [openDeadlineID, setOpenDeadlineID] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  // Configuración inicial de ordenamiento
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'createdAt',
    order: 'desc'
  });

  // Maneja la expansión/colapso de tareas
  const toggleExpand = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Animación al eliminar tarea
  const handleRemoveAnimation = (id) => {
    const card = document.getElementById(`task-${id}`);
    if (card) {
      card.style.transform = 'translateY(-20px) rotate(3deg) scale(0.95)';
      card.style.opacity = '0';
      setTimeout(() => {
        fetchDelete(id);
        fetchTaskOrder(sortConfig); // Usamos fetchTaskOrder aquí
      }, 500);
    }
  };

  // Maneja la apertura/cierre del selector de fecha
  const handleToggleDeadline = (taskId) => {
    setOpenDeadlineID(prev => prev === taskId ? null : taskId);
  };

  // Inicia la edición de una tarea
  const handleEdit = (taskId) => {
    setEditingId(taskId);
  };

  // Cancela la edición
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Maneja el cambio de ordenamiento
  const handleSortChange = (newSortConfig) => {
    setSortConfig(newSortConfig);
    fetchTaskOrder(newSortConfig); // Usamos fetchTaskOrder para ordenar
  };

  return (
    <div className="container mx-auto">
      {/* Componente de ordenamiento */}
      <TaskOrder 
        sortConfig={sortConfig}
        onSortChange={handleSortChange} 
      />
      
      {/* Grid de tareas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 items-start">
        {tasks.map((task, index) => (
          <TaskCard
            key={task._id}
            task={task}
            index={index}
            expanded={expandedTasks[task._id]}
            onToggleExpand={() => toggleExpand(task._id)}
            fetchTasks={() => fetchTaskOrder(sortConfig)} // Usamos fetchTaskOrder
            onRemove={() => handleRemoveAnimation(task._id)}
            updateTaskDeadline={updateTaskDeadline}
            isDeadlineOpen={openDeadlineID === task._id}
            onToggleDeadline={() => handleToggleDeadline(task._id)}
            isEditing={editingId === task._id}
            onEdit={() => handleEdit(task._id)}
            onCancelEdit={handleCancelEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;