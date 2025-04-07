import React from 'react';

const NotificationToggle = ({ 
  notifyEnabled, 
  loading, 
  error, 
  toggleNotifications 
}) => {
  return (
    <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4 w-full sm:w-auto">
      <span className="text-white font-medium text-base">
        Notificaciones
      </span>
      
      <button
        onClick={toggleNotifications}
        disabled={loading}
        className={`
          px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg 
          ${notifyEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} 
          text-white transition-colors duration-200 
          ${loading ? 'opacity-50 cursor-not-allowed' : ''} 
          w-full xs:w-auto text-xs sm:text-sm
        `}
      >
        {loading ? 'Procesando...' : notifyEnabled ? 'Habilitadas' : 'Deshabilitadas'}
      </button>

      {error && (
        <span className="text-red-500 text-sm">
          {error}
        </span>
      )}
    </div>
  );
};

export default NotificationToggle;
