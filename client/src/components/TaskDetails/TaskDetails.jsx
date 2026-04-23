import { useEffect, useState } from 'react';
import Button from '../Button/Button';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function TaskDetails({ token, taskID }) {
  const [title, setTitle] = useState('');
  const [descriptions, setDescriptions] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [completedPerc, setCompletedPerc] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (taskID) {
      fetch(`${VITE_API_URL}/tasks/${taskID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.json())
      .then((data) => {
        const task = data.data;
        setTitle(task.title);
        setDescriptions(task.descriptions);
        setExpirationDate(task.expirationDate);
        setAssignedTo(task.assigned_to);
        setCompletedPerc(task.completed_perc);
        setNotes(task.notes);
      })
    }

  }, [taskID]);

  function onEditTask() {
    // ** SIAMO ARRIVATI QUI!!! **
    // bisogna capire che tipo di utente sei
    // se i admin metti tutti i campi
    // se sei user metti solo completed_perc e notes

    fetch(`${VITE_API_URL}/tasks/${taskID}`, {
      method: 'PUT',
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
    <div style={{ backgroundColor: 'gold' }}>
      <h2>Dettagli Task</h2>

      <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
          onChange={(e) => setCompletedPerc(Number(e.target.value))}
        />

        <label>Note Utente</label>
        <input
          style={{ width: '50%' }}
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        
        <Button taskID={taskID} onEditTask={onEditTask}/>

      </form>
    </div>
  );
}