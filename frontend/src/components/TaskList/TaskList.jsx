import React, { useState } from 'react';
import TaskCard from './TaskCard';
import TaskOrder from '../TaskOrder/TaskOrder';

const TaskList = ({ 
  tasks, 
  fetchDelete, 
  fetchTasks, 
  updateTaskDeadline,
  fetchTaskOrder,
  notifyEnabled,
  onToggleNotifications,
  notificationLoading,
  notificationError,
  cookieId
}) => {
  const [expandedTasks, setExpandedTasks] = useState({});
  const [openDeadlineID, setOpenDeadlineID] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'createdAt',
    order: 'desc'
  });

  const toggleExpand = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleRemoveAnimation = (taskId) => {
    const card = document.getElementById(`task-${taskId}`);
    if (card) {
      card.style.animation = 'none';
      void card.offsetHeight;
      card.classList.add('animate-card-out');
      setTimeout(() => {
        fetchDelete(taskId);
        fetchTaskOrder(sortConfig);
      }, 600);
    }
  };
  
  const handleToggleDeadline = (taskId) => {
    setOpenDeadlineID(prev => prev === taskId ? null : taskId);
  };

  const handleEdit = (taskId) => {
    setEditingId(taskId);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSortChange = (newSortConfig) => {
    setSortConfig(newSortConfig);
    fetchTaskOrder(newSortConfig);
  };

  return (
    <div className="container mx-auto">
      <TaskOrder 
        cookieId={cookieId}
        sortConfig={sortConfig}
        onSortChange={handleSortChange}
        notifyEnabled={notifyEnabled}
        onToggleNotifications={onToggleNotifications}
        notificationLoading={notificationLoading}
        notificationError={notificationError}
        
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 items-start">
        {tasks.map((task, index) => (
          <TaskCard
            key={task._id}
            task={task}
            index={index}
            expanded={expandedTasks[task._id]}
            onToggleExpand={() => toggleExpand(task._id)}
            fetchTasks={() => fetchTaskOrder(sortConfig)}
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