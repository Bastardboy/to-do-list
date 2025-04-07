import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList/TaskList';
import TaskForm from './components/TaskForm/TaskForm';
import { NotificationProvider } from './components/TaskNotification/NotificationContext';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationError, setNotificationError] = useState(null);

  useEffect(() => {
    if (!notifyEnabled) return;
    
    // Verificar si es localhost o HTTPS
    const isSecure = window.location.protocol === 'https:' || 
                     window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
  
    if (!isSecure) {
      console.warn('Notificaciones requieren HTTPS en móviles');
      return;
    }
  
    checkTaskDeadlines();
  }, [tasks, notifyEnabled]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks', { withCredentials: true });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchNotificationStatus = async () => {
    try {
      const response = await axios.get('/api/notify', { withCredentials: true });
      setNotifyEnabled(response.data.notify);
    } catch (error) {
      console.error('Error fetching notification status:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchNotificationStatus();
  
    // 🔧 Registrar el Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] Service Worker registrado:', registration);
        })
        .catch((error) => {
          console.error('[SW] Error al registrar el Service Worker:', error);
        });
    }
  }, []);
  

  const checkTaskDeadlines = () => {
    tasks.forEach(task => {
      if (!task.deadline) return;
      const deadlineDate = new Date(task.deadline);
      const daysLeft = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));

      if (daysLeft >= 0 && daysLeft < 10) {
        sendNotification(
          `Quedan ${daysLeft} día${daysLeft !== 1 ? 's' : ''} para "${task.title}"`,
          daysLeft === 0
            ? '¡Es hoy la fecha límite!'
            : `Te quedan ${daysLeft} día${daysLeft > 1 ? 's' : ''} para realizar tu tarea.`
        );
      }
    });
  };

  const shouldSendNotification = () => {
    const lastNotificationDate = localStorage.getItem('lastNotificationDate');
    const currentDate = new Date();

    if (!lastNotificationDate) {
      return true;
    }

    const lastNotificationTime = new Date(lastNotificationDate);
    const hoursDifference = (currentDate - lastNotificationTime) / (1000 * 60 * 60);
    return hoursDifference >= 24;
  };

  const updateLastNotificationDate = () => {
    const currentDate = new Date();
    localStorage.setItem('lastNotificationDate', currentDate.toISOString());
  };

  const toggleNotifications = async () => {
    setNotificationLoading(true);
    try {
      const newStatus = !notifyEnabled;

      if (newStatus && shouldSendNotification()) {
        if (!('Notification' in window)) {
          setNotificationError('Navegador no compatible');
          return;
        }

        if (Notification.permission === 'denied') {
          setNotificationError('Permiso denegado previamente');
          return;
        }

        if (Notification.permission !== 'granted') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            setNotificationError('Permiso no concedido');
            return;
          }
        }

        updateLastNotificationDate();
      }

      const response = await axios.patch('/api/notify', { enabled: newStatus }, { withCredentials: true });
      setNotifyEnabled(newStatus);
      setNotificationError(null);
    } catch (err) {
      setNotificationError('Error al actualizar');
      console.error('Error toggling notifications:', err);
    } finally {
      setNotificationLoading(false);
    }
  };

  const fetchDelete = async (taskId) => {
    try {
      await axios.delete(`/api/delete/${taskId}`, { withCredentials: true });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateTaskDeadline = async (taskId, date) => {
    try {
      await axios.patch(
        `/api/deadline/${taskId}`, 
        { deadline: date }, 
        { withCredentials: true }
      );
      fetchTasks();
    } catch (error) {
      console.error('Error updating deadline:', error);
    }
  };

  const fetchTaskOrder = async (sortConfig = { sortBy: 'createdAt', order: 'desc' }) => {
    try {
      const response = await axios.get('/api/tasks/ordenar', {
        params: sortConfig,
        withCredentials: true
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching ordered tasks:', error);
    }
  };

  const sendNotification = (title, message) => {
    console.log("ENVIANDO NOTIFICACION", title, message);
    if (Notification.permission === 'granted') {
      new Notification(title, { 
        body: message, 
        icon: '/icon.png' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-animated bg-noisy flex flex-col">
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              TaskMaster Pro
            </span>
          </div>
          <button 
            onClick={toggleNotifications}
            disabled={notificationLoading}
            className={`
              px-4 py-2 rounded-lg flex items-center gap-2 
              text-sm font-medium transition-colors
              ${notifyEnabled 
                ? 'bg-green-600/90 hover:bg-green-700 text-white' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-200'}
              ${notificationLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {notificationLoading ? (
              <>
                <svg 
                  className="animate-spin h-4 w-4 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Procesando...
              </>
            ) : (
              notifyEnabled ? '🔔 Notificaciones' : '🔕 Notificaciones'
            )}
          </button>
        </div>
      </header>

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4">
              <span className="relative inline-block">
                <span className="absolute -inset-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg blur-xl opacity-75 animate-pulse" />
                <span className="relative bg-gray-900 px-6 py-3 rounded-lg text-transparent bg-clip-text bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300">
                  ¡Domina Tus Tareas!
                </span>
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              La herramienta definitiva para organizar tu vida. Nunca más olvides una tarea importante.
            </p>
          </div>

          <TaskForm fetchTasks={fetchTasks} />

          {tasks.length > 0 ? (
            <TaskList
              tasks={tasks}
              fetchDelete={fetchDelete}
              fetchTasks={fetchTasks}
              updateTaskDeadline={updateTaskDeadline}
              fetchTaskOrder={fetchTaskOrder}
              notifyEnabled={notifyEnabled}
              onToggleNotifications={toggleNotifications}
              notificationLoading={notificationLoading}
              notificationError={notificationError}
            />
          ) : (
            <p className="text-center text-lg text-gray-500">No tienes tareas aún.</p>
          )}
        </div>
      </main>
      
      <footer className="bg-gray-900/80 backdrop-blur-md border-t border-gray-700/50 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <svg 
              className="w-6 h-6 text-purple-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="text-sm font-medium text-gray-400">
              TaskMaster Pro © {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors text-sm">
              Términos
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors text-sm">
              Privacidad
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors text-sm">
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;