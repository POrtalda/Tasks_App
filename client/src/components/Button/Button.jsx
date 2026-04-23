export default function Button({ taskID, onEditTask }) {

    function handleClick() {
        onEditTask();
    }

  return (
    <>
      <button onClick={handleClick}>Modifica</button>
    </>
  )
}
