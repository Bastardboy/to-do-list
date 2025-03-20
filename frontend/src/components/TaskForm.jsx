import React, { useState } from 'react'; // Importar librería React y el hook useState
import axios from 'axios'; // Para hacer peticiones HTTP

const TaskForm = ({ fetchTasks }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', { title, completed: false });
      setTitle('');
      fetchTasks(); 
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nueva tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <button type="submit">Agregar</button>
    </form>
  );
};

export default TaskForm;