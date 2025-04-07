import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskOrder = ({ cookieId, sortConfig, onSortChange }) => {
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialStatus = async () => {
      try {
        console.log('Fetching initial notify status...');
        const response = await axios.get('/api/notify');
        console.log('Response from /api/notify:', response.data);
        setNotifyEnabled(response.data.notify);
        localStorage.setItem(`notifyStatus-${cookieId}`, response.data.notify);
      } catch (err) {
        setError('Error al cargar estado');
        console.error('Error while fetching notify status:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialStatus();
  }, [cookieId]);

  const toggleNotifications = async () => {
    console.log('Toggling notifications...');
    setLoading(true);
    try {
      const newStatus = !notifyEnabled;
      console.log('New notify status:', newStatus);

      if (newStatus) {
        if (!('Notification' in window)) {
          setError('Tu navegador no soporta notificaciones');
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          setError('Permisos no concedidos');
          return;
        }

        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registrado', reg);
        } catch (err) {
          console.error('Error registrando SW:', err);
        }
      }

      if (Notification.permission === 'denied') {
        setError('Permiso denegado previamente');
        return;
      }

      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          setError('Permiso no concedido');
          return;
        }
      }

      const response = await axios.patch('/api/notify', { enabled: newStatus });
      console.log('Response from /api/notify update:', response.data);
      setNotifyEnabled(newStatus);
      localStorage.setItem(`notifyStatus-${cookieId}`, newStatus);
      setError(null);
    } catch (err) {
      setError('Error al actualizar');
      console.error('Error while toggling notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (sortBy) => {
    console.log('Sorting by:', sortBy);
    if (sortConfig.sortBy === sortBy) {
      const newOrder = sortConfig.order === 'asc' ? 'desc' : 'asc';
      console.log('Changing order to:', newOrder);
      onSortChange({ sortBy, order: newOrder });
    } else {
      console.log('Setting order to desc');
      onSortChange({ sortBy, order: 'desc' });
    }
  };

  const getButtonClass = (buttonSortBy) => {
    const baseClass = "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-all text-xs sm:text-sm font-medium border";
    const activeClass = "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md border-transparent font-semibold";
    const inactiveClass = "bg-gray-800/50 text-gray-200 hover:bg-gray-700/60 border-gray-600";
    return `${baseClass} ${sortConfig.sortBy === buttonSortBy ? activeClass : inactiveClass}`;
  };

  const getSortIcon = (sortBy) => {
    const icons = {
      createdAt: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      ),
      deadline: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      title: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
      )
    };
    return icons[sortBy];
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 px-3 sm:px-4 bg-gray-900/30 p-3 rounded-xl backdrop-blur-sm border border-gray-700/50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <span className="text-white font-medium text-base">Ordenar por:</span>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {['createdAt', 'deadline', 'title'].map((sortBy) => (
            <button
              key={sortBy}
              onClick={() => handleSortChange(sortBy)}
              className={getButtonClass(sortBy)}
            >
              {getSortIcon(sortBy)}
              <span className="hidden xs:inline">
                {sortBy === 'createdAt' && 'Creación'}
                {sortBy === 'deadline' && 'Fecha lím.'}
                {sortBy === 'title' && 'Título'}
              </span>
              <span className="xs:hidden">
                {sortBy === 'createdAt' && 'Crear'}
                {sortBy === 'deadline' && 'Fecha'}
                {sortBy === 'title' && 'Título'}
              </span>
              {sortConfig.sortBy === sortBy && (
                <span className="ml-0.5 sm:ml-1 font-bold">
                  {sortConfig.order === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskOrder;