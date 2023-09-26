import React, { useState } from 'react';
import { useTask } from './context';

const TaskForm = () => {
    const { setTask } = useTask();
  const [formData, setFormData] = useState({
    label: '',
    description: '',
    start_date: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { label, description, start_date } = formData;

    try {
      const formattedStartDate = new Date(start_date).toISOString();

      const response = await fetch('http://localhost:9000/v1/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label,
          description,
          start_date: formattedStartDate,
        }),
      });

      if (response.status === 201) {
        setFormData({
          label: '',
          description: '',
          start_date: '',
        });

        setTask({
          label,
          description,
          start_date: formattedStartDate,
        });
      } else {
        console.error('Erreur lors de la création de la tâche');
      }
    } catch (error) {
      console.error('Erreur de réseau:', error);
    }
  };

  const { label, description, start_date } = formData;

  return (
    <div>
      <h1>Commencez par créer une tâche</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
            <div className="input-group">
            <label>Titre</label>
            <input
                type="text"
                name="label"
                value={label}
                onChange={handleInputChange}
                />
            </div>
            <div className="input-group">
            <label>Description</label>
            <input
                type="text"
                name="description"
                value={description}
                onChange={handleInputChange}
            />
            </div>
            <div className="input-group">
            <label>Date de début</label>
            <input
                type="datetime-local"
                name="start_date"
                value={start_date}
                onChange={handleInputChange}
                />
            </div>
            <button type="submit">Ajouter</button>
        </form>
        </div>
    </div>
  );
};

export default TaskForm;
