import React, { useState } from 'react';
import TaskDelete from './TaskDelete';
import TaskComplete from './TaskComplete';
import TaskUpdate from './TaskUpdate';

const TaskList = ({ tasks, fetchDelete, fetchTasks }) => {
  const [mountedTasks, setMountedTasks] = useState(new Set());
  const [editingId, setEditingId] = useState(null);

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
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-2xl" />
              <div className="absolute inset-0 border-2 border-white/10 rounded-2xl group-hover:border-white/30 transition-all duration-500" />
              
              <div className="flex justify-between items-center">
                <h5 className="text-2xl font-semibold mb-3 relative z-10" style={{ fontFamily: 'Arial, sans-serif' }}>
                  <span style={{ color: 'white' }}>
                    {task.title}
                  </span>
                </h5>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingId(task._id)}
                    className="px-2 py-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-md"
                  >
                    ✏️
                  </button>

                  <TaskComplete
                    _id={task._id}
                    fetchTasks={fetchTasks}
                  />
                </div>
              </div>

              <p className="mb-6 text-cyan-100/90 relative z-10">{task.description}</p>

              <div className="flex justify-end gap-2 mt-4">
                <TaskDelete
                  _id={task._id}
                  fetchDelete={() => handleRemoveAnimation(task._id)}
                  fetchTasks={fetchTasks}
                />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
