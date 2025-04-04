import React from 'react';
import TaskDelete from '../TaskDelete/TaskDelete';
import DeadlineSelector from '../DeadlineSelector/DeadLineSelector';

const TaskButtons = ({ 
  task, 
  onRemove, 
  fetchTasks, 
  isDeadlineOpen, 
  onToggleDeadline,
  updateTaskDeadline
}) => {
  return (
    <div className="task-buttons-container flex justify-end relative z-20 mt-4">
      <DeadlineSelector
        triggerButton={
          <button
            className="deadline-button bg-gradient-to-r from-blue-400 to-blue-500 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition-all"
            onClick={onToggleDeadline}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span className="text-sm">{task.deadline ? 'Cambiar Fecha' : 'Fecha Límite'}</span>
          </button>
        }
        isOpen={isDeadlineOpen}
        onClose={onToggleDeadline}
        taskId={task._id}
        onDeadlineSet={(date) => {
          if (typeof updateTaskDeadline === 'function') {
            updateTaskDeadline(task._id, date);
          }
        }}
      />
      <TaskDelete
        _id={task._id}
        fetchDelete={onRemove}
        fetchTasks={fetchTasks}
        className="delete-button bg-gradient-to-r from-red-400 to-red-500 text-white px-3 py-2 rounded-lg hover:scale-105 transition-all flex items-center gap-2"
      />
    </div>
  );
};

export default TaskButtons;