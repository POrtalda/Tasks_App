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
  const [role, setRole] = useState('');

  useEffect(() => {
    fetch(`${VITE_API_URL}/tasks/me/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setRole(data.role);
      });
  }, []);

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

  function onEditTask(e) {
    if (e) e.preventDefault();
    // ** SIAMO ARRIVATI QUI!!! **
    // bisogna capire che tipo di utente sei
    // se i admin metti tutti i campi
    // se sei user metti solo completed_perc e notes
    let bodyRequestFields;
    if (role === 'admin') {
      bodyRequestFields = {
        title: title,
        descriptions: descriptions,
        expirationDate: expirationDate,
        assigned_to: assignedTo,
        completed_perc: completedPerc,
        notes: notes
      }
    } else {
      bodyRequestFields = {
        completed_perc: completedPerc,
        notes: notes
      }
    }

    fetch(`${VITE_API_URL}/tasks/${taskID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bodyRequestFields)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        location.reload();
      });
  }

  function onDeleteTask() {

    fetch(`${VITE_API_URL}/tasks/${taskID}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
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
      {/* **questo blocco in base al ruolo mostra qualcosa **
      {/* {role === 'admin' ? (
        <p>Sei un admin, puoi modificare tutti i campi</p>
      ) : (
        <p>Sei un user, puoi modificare solo completato e note</p>
      )} */}

      <form
        onsubmit={onEditTask}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label>Titolo:</label>
        <input
          disabled={role === 'admin' ? false : true} // se sei admin puoi modificare il titolo, altrimenti no
          style={{ width: '50%' }}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Descrizione:</label>
        <input
          disabled={role === 'admin' ? false : true} // se sei admin puoi modificare la descrizione, altrimenti no
          style={{ width: '50%' }}
          type="text"
          value={descriptions}
          onChange={(e) => setDescriptions(e.target.value)}
        />

        <label>Scadenza:</label>
        <input
          disabled={role === 'admin' ? false : true} // se sei admin puoi modificare la scadenza, altrimenti no
          style={{ width: '50%' }}
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />

        <label>Assegnato a:</label>
        <input
          disabled={role === 'admin' ? false : true} // se sei admin puoi modificare l'assegnato a, altrimenti no
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

        <Button taskID={taskID} onClickButton={onEditTask} text="Modifica" />
        {role === 'admin' && completedPerc === 100 && (
          <Button taskID={taskID} onClickButton={onDeleteTask} text="Elimina" />

        )}



      </form>
    </div>
  );
}