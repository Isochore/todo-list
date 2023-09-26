import React, { useState, useEffect } from 'react';
import { useTask } from './context';
import TaskCard from './TaskCard';

const TaskList = () => {
  const { task } = useTask();
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTasks();
    if (task) {
      setTasks((prevTasks) => [...prevTasks, task]);
    }
  }, [task]);

  const formatDate = (dateString) => {
    if (dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
    return '';
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:9000/v1/tasks');
      if (response.status === 200) {
        const data = await response.json();
        const formattedTasks = data.map((task) => ({
          ...task,
          start_date: formatDate(task.start_date),
          end_date: formatDate(task.end_date),
          isEditing: false,
          updatedEndDate: task.end_date,
        }));

        setTasks(formattedTasks);
      } else if (response.status === 204) {

      } else {
        console.error('Erreur lors de la récupération des tâches');
      }
    } catch (error) {
      console.error('Erreur de réseau:', error);
    }
  };

  const handleDelete = async (label) => {
    try {
      const response = await fetch(`http://localhost:9000/v1/tasks/${label}`, {
        method: 'DELETE',
      });

      if (response.status === 200) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.label !== label));
      } else if (response.status === 404) {
        
      } else {
        console.error('Erreur lors de la suppression de la tâche');
      }
    } catch (error) {
      console.error('Erreur de réseau:', error);
    }
  };

  const handleEnd = (label) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.label === label ? { ...task, isEditing: !task.isEditing } : task
      )
    );
  };

  const handleDateChange = async (label, newEndDate) => {
    try {
      const formattedEndDate = new Date(newEndDate).toISOString();
      const response = await fetch(`http://localhost:9000/v1/tasks/${label}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ end_date: formattedEndDate }),
      });

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.label === label
              ? { ...task, isEditing: false, end_date: formatDate(newEndDate) }
              : task
          )
        );
      } else if (response.status === 404) {
      } else {
        console.error('Erreur lors de la mise à jour de la tâche');
      }
    } catch (error) {
      console.error('Erreur de réseau:', error);
    }
  };

  const filterTasks = () => {
    return tasks.filter((task) =>
      task.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="task-list-container">
      <input
        className="search"
        type="text"
        placeholder="Rechercher des tâches..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm ? (
        filterTasks().length > 0 ? (
          <div className="task-card-container">
            {filterTasks().map((task) => (
              <TaskCard
                key={task.label}
                task={task}
                handleEnd={handleEnd}
                handleDateChange={handleDateChange}
                handleDelete={handleDelete}
                formatDate={formatDate}
              />
            ))}
          </div>
        ) : (
          <p className="no-result">Aucune tâche n'a été trouvée pour la recherche "{searchTerm}".</p>
        )
      ) : (
        tasks.length > 0 ? (
          <div className="task-card-container">
            {tasks.map((task) => (
              <TaskCard
                key={task.label}
                task={task}
                handleEnd={handleEnd}
                handleDateChange={handleDateChange}
                handleDelete={handleDelete}
                formatDate={formatDate}
              />
            ))}
          </div>
        ) : (
          <p className="no-result">Aucune tâche n'a été trouvée.</p>
        )
      )}
    </div>
  );
};

export default TaskList;
