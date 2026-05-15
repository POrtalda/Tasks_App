export default function Button({ taskID, onClickButton, text }) {

    function handleClick() {
        onClickButton();
    }

  return (
    <>
      <button onClick={handleClick}>{text}</button>
    </>
  )
}
