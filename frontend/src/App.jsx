import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList/TaskList';
import TaskForm from './components/TaskForm/TaskForm';

const App = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchDelete = async (taskId) => {
    try {
      await axios.delete(`/api/delete/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error fetching delete:', error);
    }
  };

  const updateTaskDeadline = async (taskId, date) => {
    try {
      await axios.patch(`/api/deadline/${taskId}`, { deadline: date });
      fetchTasks(); // Actualiza la lista de tareas después de cambiar la fecha
    } catch (error) {
      console.error('Error actualizando la fecha:', error);
    }
  };

  const fetchTaskOrder = async (sortConfig = { sortBy: 'createdAt', order: 'desc' }) => {
    try {
      const response = await axios.get('/api/tasks/ordenar', {
        params: sortConfig, // Pasar los parámetros de ordenamiento
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-animated bg-noisy">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
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
