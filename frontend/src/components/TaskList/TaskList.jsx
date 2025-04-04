import React, { useState } from 'react';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, fetchDelete, fetchTasks, updateTaskDeadline }) => {
  const [expandedTasks, setExpandedTasks] = useState({});
  const [openDeadlineID, setOpenDeadlineID] = useState(null);
  const [editingId, setEditingId] = useState(null);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 items-start">
      {tasks.map((task, index) => (
        <TaskCard
          key={task._id}
          task={task}
          index={index}
          expanded={expandedTasks[task._id]}
          onToggleExpand={() => toggleExpand(task._id)}
          fetchTasks={fetchTasks}
          onRemove={() => handleRemoveAnimation(task._id)}
          updateTaskDeadline={updateTaskDeadline}
          isDeadlineOpen={openDeadlineID === task._id}
          onToggleDeadline={() => setOpenDeadlineID(openDeadlineID === task._id ? null : task._id)}
          isEditing={editingId === task._id}
          onEdit={() => setEditingId(task._id)}
          onCancelEdit={() => setEditingId(null)}
        />
      ))}
    </div>
  );
};

export default TaskList;