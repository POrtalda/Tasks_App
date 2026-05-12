import { useState } from "react";
import AllTasks from "../AllTasks/AllTasks";
import TaskDetails from "../TaskDetails/TaskDetails";

export default function Main({ token }) {

  const [selectedTaskID, setSelectedTaskId] = useState(null);
  
  return (
    <>
      <AllTasks token = {token} onselectedTask={(id)=> setSelectedTaskId(id)}/>
      
      {selectedTaskID !== null && (
        <TaskDetails token = {token} taskID = {selectedTaskID}/>
      )}
    </>
  )
}