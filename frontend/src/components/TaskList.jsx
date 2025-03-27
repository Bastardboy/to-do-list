import React from 'react';
import { Card } from 'flowbite-react';
import TaskDelete from './TaskDelete';

const TaskList = ({ tasks, fetchDelete, fetchTasks }) => {
  return (
    <div>
      {tasks.map((task) => (
        <Card key={task._id} className="max-w-sm mb-4">
          <h5 className="text-2xl font-bold">{task.title}</h5>
          <p>{task.description}</p>
          <TaskDelete _id={task._id} fetchDelete={fetchDelete} fetchTasks={fetchTasks} /> 
        </Card>
      ))}
    </div>
  );
};

export default TaskList;
