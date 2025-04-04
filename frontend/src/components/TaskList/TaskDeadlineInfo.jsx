import React from 'react';

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

const TaskDeadlineInfo = ({ deadline }) => {
  const daysInfo = getDaysLeftInfo(deadline);

  return (
    <div className={`mb-4 p-3 rounded-lg ${daysInfo.bg} backdrop-blur-sm border border-white/10`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{daysInfo.icon}</span>
        <span className={`text-sm font-medium ${daysInfo.color} font-mono tracking-tight`}>
          {daysInfo.text}
        </span>
      </div>
      {deadline ? (
        <p className="text-xs text-cyan-100 font-medium tracking-wide mt-1">
          Fecha límite: {new Date(deadline).toLocaleDateString('es-CL', {
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
  );
};

export default TaskDeadlineInfo;