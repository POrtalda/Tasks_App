import React, { useEffect, useState } from 'react'
const VITE_API_URL = import.meta.env.VITE_API_URL;



export default function AllTasks({ token, onselectedTask }) {

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
            <div style={{ backgroundColor: 'darkgray' }}>
                <h2>
                    {role === 'admin' ? 'Tutti i Tasks' : 'I tuoi Tasks'}
                </h2>
                {/* qua dobbiamo mappare tutti i tasks */}
                {tasks.map(t => (
                    <div key={t._id}>
                        <p onClick={() => onselectedTask(t._id)}>
                            {t.title} *** {t.completed_perc}%
                        </p>
                    </div>
                ))}

            </div>

        </>
    )
}
