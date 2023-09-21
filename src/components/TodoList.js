import React, { useState, useEffect } from 'react';
import './TodoList.css';

function TodoList() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return savedTasks;
  });

  const [inputTask, setInputTask] = useState('');
  const [taskId, setTaskId] = useState(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (savedTasks.length > 0) {
      const maxId = Math.max(...savedTasks.map((task) => task.id));
      return maxId + 1;
    }
    return 0;
  });

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (inputTask.trim() !== '') {
      const newTask = {
        id: taskId,
        text: inputTask,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setInputTask('');
      setTaskId(taskId + 1);
    }
  };

  const toggleTaskCompletion = (taskIdToToggle) => {
    const updatedTasks = tasks.map((task) => (task.id === taskIdToToggle
      ? { ...task, completed: !task.completed }
      : task));
    setTasks(updatedTasks);
  };

  const handleEditTask = (taskIdToEdit) => {
    setEditingTaskId(taskIdToEdit);
    const taskToEdit = tasks.find((task) => task.id === taskIdToEdit);
    setEditedTaskText(taskToEdit
      ? taskToEdit.text : '');
  };

  const handleSaveEditedTask = (taskIdToSave) => {
    const updatedTasks = tasks.map((task) => (task.id === taskIdToSave
      ? { ...task, text: editedTaskText }
      : task));
    setTasks(updatedTasks);
    setEditingTaskId(null);
  };

  const handleKeyDown = (e, taskIdToSave) => {
    if (e.key === 'Enter') {
      handleSaveEditedTask(taskIdToSave);
    }
  };

  const deleteTask = (taskIdToDelete) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskIdToDelete);
    setTasks(updatedTasks);
  };

  return (
    <div className="todo-list">
      <div className="header">
        <h1>To-Do List</h1>
      </div>
      <div className="task-input-container">
        <input
          type="text"
          className="task-input"
          placeholder="Enter a task"
          value={inputTask}
          onChange={(e) => setInputTask(e.target.value)}
        />
        <button type="button" className="add-button" onClick={addTask}>
          Add
        </button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <input
              type="checkbox"
              className="task-checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            {editingTaskId === task.id ? (
              <input
                type="text"
                className="task-edit-input"
                value={editedTaskText}
                onChange={(e) => setEditedTaskText(e.target.value)}
                onBlur={() => handleSaveEditedTask(task.id)}
                onKeyDown={(e) => handleKeyDown(e, task.id)}
              />
            ) : (
              <span
                className={`task-text ${task.completed ? 'completed' : ''}`}
                onClick={() => handleEditTask(task.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEditTask(task.id);
                  }
                }}
                role="button" // Add a role to indicate interactivity
                tabIndex={0}
              >
                {task.text}
              </span>

            )}
            <button
              type="button"
              className="edit-button"
              onClick={() => handleEditTask(task.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEditTask(task.id);
                }
              }}
              tabIndex={0}
            >
              Edit
            </button>
            <button
              type="button"
              className="delete-button"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
