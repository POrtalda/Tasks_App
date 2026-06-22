import './Button.css';

export default function Button({ taskID, onClickButton, text }) {

    function handleClick() {
        onClickButton();
    }

  return (
    <>
      <button className="btn-edit-delete" onClick={handleClick}>{text}</button>
    </>
  )
}
