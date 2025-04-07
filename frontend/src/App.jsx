import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList/TaskList';
import TaskForm from './components/TaskForm/TaskForm';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [notifyEnabled, setNotifyEnabled] = useState(false);

  useEffect(() => {
    fetchTasks();
    requestNotificationPermission();
    axios
      .get('api/notify', { withCredentials: true })
      .then(r => setNotifyEnabled(r.data.notify))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!notifyEnabled) return;
    tasks.forEach(task => {
      if (!task.deadline) return;
      const d = new Date(task.deadline);
      const diff = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < 10) {
        sendNotification(
          `Quedan ${diff} día${diff !== 1 ? 's' : ''} para "${task.title}"`,
          diff === 0
            ? '¡Es hoy la fecha límite!'
            : `Tienes ${diff} día${diff > 1 ? 's' : ''} restantes`
        );
      }
    });
  }, [tasks, notifyEnabled]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks', { withCredentials: true });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchDelete = async (taskId) => {
    try {
      await axios.delete(`/api/delete/${taskId}`, { withCredentials: true });
      fetchTasks();
    } catch (error) {
      console.error('Error fetching delete:', error);
    }
  };

  function requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Permiso de notificación concedido');
        }
      });
    } else {
      console.log('Notificaciones no soportadas');
    }
  }

  function sendNotification(title, message) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body: message, icon: '/icon.png' });
    }
  }

  const updateTaskDeadline = async (taskId, date) => {
    try {
      await axios.patch(`/api/deadline/${taskId}`, { deadline: date }, { withCredentials: true });
      fetchTasks();
      sendNotification(
        'Nueva fecha límite establecida',
        `La nueva fecha límite es: ${date.toLocaleDateString()}`
      );
    } catch (error) {
      console.error('Error actualizando la fecha:', error);
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
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-animated bg-noisy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          📌 Organizador de Tareas
        </h1>


        <TaskForm fetchTasks={fetchTasks} />

        {tasks.length > 0 ? (
          <TaskList
            tasks={tasks}
            fetchDelete={fetchDelete}
            fetchTasks={fetchTasks}
            updateTaskDeadline={updateTaskDeadline}
            fetchTaskOrder={fetchTaskOrder}
          />
        ) : (
          <div className="text-center py-12 text-slate-700">
            <p className="text-xl">🎉 ¡No hay tareas! Crea tu primera tarea</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
