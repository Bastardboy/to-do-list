import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Función mejorada para obtener cookies
const getCookie = (name) => {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  } catch (error) {
    console.error('Error reading cookie:', error);
    return null;
  }
};

const TaskNotification = () => {
  const [userId, setUserId] = useState(null);
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener userId de las cookies al montar el componente
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        // Intenta obtener el ID de usuario de la cookie
        const cookieValue = getCookie('id_user');
        
        if (!cookieValue) {
          throw new Error('No se encontró el ID de usuario en cookies');
        }

        setUserId(cookieValue);
        console.log('ID de usuario obtenido:', cookieValue);
      } catch (err) {
        console.error('Error obteniendo ID de usuario:', err.message);
        setError('No se pudo identificar al usuario');
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  // Obtener estado de notificaciones cuando userId esté disponible
  useEffect(() => {
    if (!userId) return;

    const fetchNotificationStatus = async () => {
      try {
        const response = await axios.get('/api/notify', {
          withCredentials: true, // Importante para enviar cookies
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        setNotifyEnabled(response.data.notify);
      } catch (err) {
        console.error('Error al obtener estado:', err);
        setError('Error al cargar configuración de notificaciones');
        setNotifyEnabled(false); // Valor por defecto
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationStatus();
  }, [userId]);

  const toggleNotifications = async () => {
    if (!userId) {
      setError('Usuario no identificado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newStatus = !notifyEnabled;

      // Verificar permisos solo al activar
      if (newStatus) {
        if (!('Notification' in window)) {
          throw new Error('Tu navegador no soporta notificaciones');
        }

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          throw new Error('Permisos no concedidos para notificaciones');
        }

        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registrado:', reg);
        } catch (swError) {
          console.warn('Error registrando Service Worker:', swError);
          // No bloqueamos la operación por este error
        }
      }

      // Actualizar en backend
      await axios.patch('/api/notify', 
        { enabled: newStatus },
        {
          withCredentials: true, // Envía cookies automáticamente
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Actualizar estado local
      setNotifyEnabled(newStatus);
      
    } catch (err) {
      setError(err.message);
      console.error('Error al cambiar notificaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notification-toggle">
      <button
        onClick={toggleNotifications}
        disabled={loading}
        className={`toggle-btn ${notifyEnabled ? 'enabled' : 'disabled'}`}
      >
        {loading ? 'Procesando...' : 
         notifyEnabled ? 'Desactivar Notificaciones' : 'Activar Notificaciones'}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default TaskNotification;