import './AllTasks.css';
import React, { useEffect, useState } from 'react'
const VITE_API_URL = import.meta.env.VITE_API_URL;



export default function AllTasks({ token, onselectedTask, children }) {

    const [tasks, setTasks] = useState([]);
    // questo stato va a mappare il ruolo dell'utenete, se è admin o user, in modo da mostrare i tasks in base al ruolo
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
        fetch(`${VITE_API_URL}/tasks`, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.success) setTasks(data.data);
                else setTasks([]);
            });
    }, []);

    return (
        <>
            <div className='card-all-tasks'>
                <h2>
                    {role === 'admin' ? 'Tutti i Tasks' : 'I tuoi Tasks'}
                    {children}
                </h2>
                {/* qua dobbiamo mappare tutti i tasks */}
                {tasks.map(t => (
                    <div key={t._id} className='card-preview-task' onClick={() => onselectedTask(t._id)}
                        style={{ backgroundColor: t.completed_perc === 100 ? '#DEEFD8' : t.completed_perc === 0 ? 'white' : '#FBDA06' }}>
                        <p> {t.title}  </p>
                        <p> {t.assigned_to} </p>
                        <div className='percentage-btn'>
                            <p > {t.completed_perc}% </p>
                        </div>

                    </div>
                ))}

            </div>

        </>
    )
}
