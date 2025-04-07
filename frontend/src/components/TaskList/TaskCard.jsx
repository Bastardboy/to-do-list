import React from 'react';
import TaskHeader from './TaskHeader';
import TaskDescription from './TaskDescription';
import TaskDeadlineInfo from './TaskDeadlineInfo';
import TaskButtons from './TaskButtons';
import TaskUpdate from '../TaskUpdate/TaskUpdate';

const cardGradients = [
  'from-indigo-600 to-blue-700',
  'from-purple-600 to-indigo-700',
  'from-cyan-600 to-blue-700',
  'from-sky-600 to-cyan-700'
];

const TaskCard = ({
  task,
  index,
  expanded,
  onToggleExpand,
  fetchTasks,
  onRemove,
  updateTaskDeadline,
  isDeadlineOpen,
  onToggleDeadline,
  isEditing,
  onEdit,
  onCancelEdit
}) => {
  const gradientClass = cardGradients[index % cardGradients.length];

  return (
      <div
        id={`task-${task._id}`}
        className={`relative p-6 bg-gradient-to-br ${gradientClass} text-white rounded-2xl shadow-2xl flex flex-col
                transform transition-all duration-500 hover:scale-[1.03] hover:shadow-3xl
                animate-card-in preserve-3d`} // Agregar preserve-3d aquí
        style={{ animationDelay: `${index * 0.1}s` }}
      >
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-2xl pointer-events-none" />
      <div className="absolute inset-0 border-2 border-white/10 rounded-2xl group-hover:border-white/30 transition-all duration-500 pointer-events-none" />

      <div className="flex flex-col h-full">
        {isEditing ? (
          <TaskUpdate 
            _id={task._id}
            title={task.title}
            description={task.description}
            fetchTasks={fetchTasks}
            onClose={onCancelEdit}
          />
        ) : (
          <>
            <TaskHeader 
              task={task} 
              onEdit={onEdit} 
              fetchTasks={fetchTasks} 
            />
            
            <TaskDescription
              description={task.description}
              expanded={expanded}
              onToggleExpand={onToggleExpand}
            />

            <TaskDeadlineInfo deadline={task.deadline} />

            <TaskButtons
              task={task}
              onRemove={onRemove}
              fetchTasks={fetchTasks}
              isDeadlineOpen={isDeadlineOpen}
              onToggleDeadline={onToggleDeadline}
              updateTaskDeadline={updateTaskDeadline}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;