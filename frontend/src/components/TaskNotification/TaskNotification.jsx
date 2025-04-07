import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationToggle = ({ cookieId }) => { // Recibe cookieId como prop
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener estado inicial de las notificaciones
  useEffect(() => {
    const fetchInitialStatus = async () => {
      try {
        const status = await fetchNotificationStatus();
        setNotifyEnabled(status);
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
      // Se pasa el cookieId en la URL
      const response = await axios.get(`/notify/${cookieId}`);
      console.log('Respuesta recibida:', response);
      return response.data.notify;
    } catch (error) {
      console.error('Error en la petición:', error.response || error);
      throw error;
    }
  };

  // Función para actualizar el estado
  const updateNotificationStatus = async (enabled) => {
    try {
      // Se pasa el cookieId en la URL y el estado en el cuerpo de la solicitud
      const response = await axios.patch(`/api/notify/${cookieId}`, { enabled });
      console.log('Estado actualizado:', response.data);
      setNotifyEnabled('Estado actualizado:', response.data.notify);
      return response.data;
    } catch (error) {
      console.error('Error actualizando estado:', error);
      throw error;
    }
  };

  // Función para alternar el estado
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

  if (loading) {
    return (
      <div className="flex items-center gap-2 mb-6">
        <span className="text-gray-300 text-sm font-medium">Cargando estado de notificaciones...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 mb-6">
        <span className="text-red-500 text-sm font-medium">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mb-6">
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
  );
};

export default NotificationToggle;
