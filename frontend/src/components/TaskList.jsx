import React from 'react';
import TaskDelete from './TaskDelete';

const TaskList = ({ tasks, fetchDelete, fetchTasks }) => {
  return (
    <section id="TaskList" className="p-4 md:p-6 w-full max-w-7xl mx-auto min-h-[70vh]">
      <div className="flex flex-wrap gap-6 px-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="p-6 bg-white rounded-xl shadow-lg dark:bg-slate-800 dark:text-white flex flex-col justify-between transition-all duration-300"
          >
            <h5 className="text-sky-400/100">
              {task.title}
            </h5>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{task.description}</p>
            <div className="mt-4 flex justify-end">
              <TaskDelete _id={task._id} fetchDelete={fetchDelete} fetchTasks={fetchTasks} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TaskList;