import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleNotifications = async () => {
    setLoading(true);
    try {
      const newStatus = !notifyEnabled;
      if (newStatus) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          setError('Permiso no concedido');
          return;
        }
      }
      const response = await axios.patch('/api/notify', { enabled: newStatus });
      setNotifyEnabled(newStatus);
      setError(null);
    } catch (err) {
      setError('Error al actualizar');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifyEnabled, loading, error, toggleNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
