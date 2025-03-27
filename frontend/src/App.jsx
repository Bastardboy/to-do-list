import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';


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

  const fetchDelete = async () => {
    try {
      await axios.delete('/api/delete');
      fetchTasks();
    } catch (error) {
      console.error('Error fetching delete:', error);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-100 to-indigo-50 dark:from-slate-900 dark:to-indigo-900/20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          📌 Organizador de Tareas
        </h1>
        
        <TaskForm fetchTasks={fetchTasks} />
        
        {tasks.length > 0 ? (
          <TaskList tasks={tasks} fetchDelete={fetchDelete} fetchTasks={fetchTasks} />
        ) : (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p className="text-xl">🎉 ¡No hay tareas! Crea tu primera tarea</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;