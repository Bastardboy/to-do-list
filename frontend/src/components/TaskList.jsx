import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
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

  return (
    <div>
      <h2>Lista de Tareas</h2>
      {tasks.map(task => (
        <div key={task._id}>
          <h3>{task.title}</h3>
          <p>{task.completed ? 'Completada' : 'Pendiente'}</p>
        </div>
      ))}
    </div>
  );
};

export default TaskList;