import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskOrder = ({ cookieId, sortConfig, onSortChange }) => {
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener estado inicial de las notificaciones
  useEffect(() => {
    const fetchInitialStatus = async () => {
      try {
        // Intentamos obtener el estado de las notificaciones desde localStorage
        const savedStatus = localStorage.getItem(`notifyStatus-${cookieId}`);
        if (savedStatus !== null) {
          setNotifyEnabled(JSON.parse(savedStatus)); // Recuperar estado guardado
        } else {
          const status = await fetchNotificationStatus();
          setNotifyEnabled(status);
        }
      } catch (err) {
        setError('Error al cargar el estado de notificaciones');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialStatus();
  }, [cookieId]); // Dependencia en cookieId para actualizar cuando cambie

  const fetchNotificationStatus = async () => {
    try {
      const response = await axios.get(`/notify/${cookieId}`);
      return response.data.notify;
    } catch (error) {
      console.error('Error en la petición:', error.response || error);
      throw error;
    }
  };

  // Función para actualizar el estado de las notificaciones
  const updateNotificationStatus = async (enabled) => {
    try {
      const response = await axios.patch(`/api/notify/${cookieId}`, { enabled });
      setNotifyEnabled(response.data.notify);
      // Guardar el estado actualizado en localStorage
      localStorage.setItem(`notifyStatus-${cookieId}`, JSON.stringify(response.data.notify));
    } catch (error) {
      console.error('Error actualizando estado:', error);
      throw error;
    }
  };

  // Función para alternar el estado de las notificaciones
  const toggleNotifications = async () => {
    setLoading(true);
    try {
      const newStatus = !notifyEnabled;
      await updateNotificationStatus(newStatus);
      setNotifyEnabled(newStatus);
      setError(null);
    } catch (err) {
      setError('Error al actualizar las notificaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Manejo de cambio de orden
  const handleSortChange = (sortBy) => {
    if (sortConfig.sortBy === sortBy) {
      onSortChange({
        sortBy,
        order: sortConfig.order === 'asc' ? 'desc' : 'asc'
      });
    } else {
      onSortChange({
        sortBy,
        order: 'desc'
      });
    }
  };

  const getButtonClass = (buttonSortBy) => {
    const baseClass = "px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm font-medium border";
    const activeClass = "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md border-transparent font-semibold";
    const inactiveClass = "bg-gray-800/50 text-gray-200 hover:bg-gray-700/60 border-gray-600";
    
    return `${baseClass} ${sortConfig.sortBy === buttonSortBy ? activeClass : inactiveClass}`;
  };

  const getSortIcon = (sortBy) => {
    const icons = {
      createdAt: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      ),
      deadline: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      title: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
      )
    };
    return icons[sortBy];
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-6 px-4 bg-gray-900/30 p-3 rounded-xl backdrop-blur-sm border border-gray-700/50">
      {/* Ordenar por */}
      <div className="flex items-center gap-3">
        <span className="text-gray-300 text-sm font-medium">Ordenar por:</span>
        <div className="flex gap-2 flex-wrap">
          {['createdAt', 'deadline', 'title'].map((sortBy) => (
            <button
              key={sortBy}
              onClick={() => handleSortChange(sortBy)}
              className={getButtonClass(sortBy)}
            >
              {getSortIcon(sortBy)}
              {sortBy === 'createdAt' && 'Creación'}
              {sortBy === 'deadline' && 'Fecha límite'}
              {sortBy === 'title' && 'Título'}
              {sortConfig.sortBy === sortBy && (
                <span className="ml-1 font-bold">
                  {sortConfig.order === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Separador */}
      <span className="text-gray-400 text-xl">|</span>

      {/* Notificaciones */}
      <div className="flex items-center gap-4">
        <span className="text-gray-300 text-sm font-medium">Notificaciones</span>
        <button
          onClick={toggleNotifications}
          disabled={loading}
          className={`px-4 py-2 rounded-lg ${
            notifyEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
          } text-white transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Procesando...' : notifyEnabled ? 'Habilitadas' : 'Deshabilitadas'}
        </button>
      </div>
    </div>
  );
};

export default TaskOrder;
