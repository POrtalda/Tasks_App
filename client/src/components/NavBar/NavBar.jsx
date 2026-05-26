import './NavBar.css';

export default function NavBar() {
  return (
    <>

      <header>
        <div className='logo-title'>
          <span className="material-symbols-outlined">
            check_box
          </span>
          <h1>TASK-APP</h1>
        </div>
        <div className='sub-title'>
          <h2 ><i>Gestisci i tuoi task nel tuo team di lavoro</i></h2>
        </div>
      </header>
    </>
  )
}
