import './Main.css';
import { useEffect, useState } from "react";
import AllTasks from "../AllTasks/AllTasks";
import TaskDetails from "../TaskDetails/TaskDetails";
import NewTask from "../NewTask/NewTask";
const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function Main({ token }) {

  const [selectedTaskID, setSelectedTaskId] = useState(null);
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

  return (
    <>
      <div className="main-section">

        <AllTasks token={token} onselectedTask={(id) => setSelectedTaskId(id)} />
        {role === 'admin' && selectedTaskID !== null && (
          <button onClick={() => setSelectedTaskId(null)}>Crea Nuovo Task</button>
        )}
        {selectedTaskID !== null ? (
          <TaskDetails token={token} taskID={selectedTaskID} />
        ) : (
          role === 'admin' && (
            <NewTask token={token} taskID={selectedTaskID} />
          )
        )}
      </div>
    </>
  )
}