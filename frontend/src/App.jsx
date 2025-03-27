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

  const fetchDelete = async () =>{
    try {
      await axios.delete('/api/delete');
      fetchTasks();
    } catch (error){
      console.error('Error fetching delete:', error);
    }
  };

  return (
    <div>
      <div className="App">
        <TaskForm fetchTasks={fetchTasks} /> 
        <TaskList tasks={tasks} fetchDelete={fetchDelete} fetchTasks={fetchTasks}/>
      </div>
    </div>
  );
};

export default App;