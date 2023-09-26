import React from 'react';

const TaskCard = ({ task, handleEnd, handleDateChange, handleDelete }) => {
  const cardClass = `task-card ${task.end_date ? 'validated' : ''}`;

  return (
    <div className={cardClass} key={task.label}>
      <div className="task-header">
        <p className="title">{task.label}</p>
      </div>
      <p className="description">{task.description}</p>
      <div className="date-container">
        <p className="start-date">{task.start_date}</p>
        {task.end_date && <p className="end-date">{task.end_date}</p>}
      </div>
      {task.isEditing && (
        <input
          type="datetime-local"
          value={task.updatedEndDate}
          min={task.start_date}
          onChange={(e) => handleDateChange(task.label, e.target.value)}
        />
      )}
      <div className="buttons-container">
        {task.isEditing ? (
          <>
            <button
              className="primary-button"
              onClick={() => handleDateChange(task.label, task.updatedEndDate)}
            >
              Enregistrer
            </button>
            <button
              className="secondary-button"
              onClick={() => handleEnd(task.label)}
            >
              Annuler
            </button>
          </>
        ) : (
          <>
            {!task.end_date && (
              <button
                className="primary-button"
                onClick={() => handleEnd(task.label)}
              >
                Terminer
              </button>
            )}
            <button
              className="delete-button"
              onClick={() => handleDelete(task.label)}
            >
              Supprimer
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
