import React from 'react';
import TaskComplete from '../TaskComplete/TaskComplete';

const TaskHeader = ({ task, onEdit, fetchTasks }) => {
  return (
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1 min-w-0">
        <h5 className="text-2xl font-display font-semibold tracking-tight text-white break-words">
          {task.title}
        </h5>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onEdit}
          className="bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-md px-4 py-2 text-sm font-medium"
        >
          ✏️
        </button>
        <TaskComplete _id={task._id} fetchTasks={fetchTasks} />
      </div>
    </div>
  );
};

export default TaskHeader;