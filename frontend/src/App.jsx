import React, { useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

const App = () => {
  const [refresh, setRefresh] = useState(false);

  const fetchTasks = () => {
    setRefresh(!refresh); 
  };

  return (
    <div>
      <h1>To-Do App</h1>
      <TaskForm fetchTasks={fetchTasks} />
      <TaskList />
    </div>
  );
};

export default App;