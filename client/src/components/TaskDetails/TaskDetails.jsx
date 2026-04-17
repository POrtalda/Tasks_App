import { useEffect, useState } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function TaskDetails({ token, taskID }) {
  const [title, setTitle] = useState('');
  const [descriptions, setDescriptions] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [completedPerc, setCompletedPerc] = useState(0);

  useEffect(() => {
    if (!taskID) {
      setTitle('');
      setDescriptions('');
      setExpirationDate('');
      setAssignedTo('');
      setCompletedPerc(0);
      return;
    }

    fetch(`${VITE_API_URL}/tasks/${taskID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const task = data.data;
        console.log('Task:', task);

        setTitle(task?.title ?? '');
        setDescriptions(task?.descriptions ?? '');
        setExpirationDate(task?.['expiration-date'] ?? '');
        setAssignedTo(task?.assigned_to ?? '');
        setCompletedPerc(task?.completed_perc ?? 0);
      })
      .catch((err) => {
        console.error('Errore nel recupero task:', err);
        setTitle('');
        setDescriptions('');
        setExpirationDate('');
        setAssignedTo('');
        setCompletedPerc(0);
      });
  }, [taskID, token]);

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
      </form>
    </div>
  );
}