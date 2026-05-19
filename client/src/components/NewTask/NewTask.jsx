import { useState } from "react";
import Button from "../Button/Button";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function NewTask({ token, taskID }) {
  const [title, setTitle] = useState('');
  const [descriptions, setDescriptions] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [completedPerc, setCompletedPerc] = useState(0);
  const [notes, setNotes] = useState('');

  function onCreateTask(e) {
    e.preventDefault();

    fetch(`${VITE_API_URL}/tasks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: title,
        descriptions: descriptions,
        expirationDate: expirationDate,
        assigned_to: assignedTo,
        completed_perc: completedPerc,
        notes: notes
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        location.reload();
      });
  }

  return (
    <>
      <div style={{ backgroundColor: 'lightblue' }}>
        <h2>Nuovo Task</h2>

        <form
          onSubmit={onCreateTask}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <label>Titolo:</label>
          <input
            style={{ width: '50%' }}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Descrizione:</label>
          <input
            style={{ width: '50%' }}
            type="text"
            value={descriptions}
            onChange={(e) => setDescriptions(e.target.value)}
          />

          <label>Scadenza:</label>
          <input
            style={{ width: '50%' }}
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
          />

          <label>Assegnato a:</label>
          <input
            style={{ width: '50%' }}
            type="text"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />

          <label>Completato:</label>
          <input
            style={{ width: '50%' }}
            type="number"
            value={completedPerc}
            min={0}
            max={100}
            step={10}
            onChange={(e) => setCompletedPerc(Number(e.target.value))}
          />
          <span>%</span>

          <label>Note Utente</label>
          <input
            style={{ width: '50%' }}
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button taskID={taskID} onClickButton={onCreateTask} text="Crea" />
        </form>
      </div>
    </>
  );
}