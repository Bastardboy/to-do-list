import React from 'react';
import TaskDelete from './TaskDelete';

const TaskList = ({ tasks, fetchDelete, fetchTasks }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="task-card p-6 mb-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <h5 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            {task.title}
          </h5>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{task.description}</p>
          <div className="mt-4 flex justify-end">
            <TaskDelete _id={task._id} fetchDelete={fetchDelete} fetchTasks={fetchTasks} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
