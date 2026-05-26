import { useState } from "react";
import './Login.css'
const VITE_API_URL = import.meta.env.VITE_API_URL

export default function Login({ onLogin }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin(e) {
        e.preventDefault();  // impedisce alla pagina di aggiornarsi dopo il click sul submit

        fetch(`${VITE_API_URL}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email, password
            })
        })
            .then(res => res.json())
            .then(data => {
                onLogin(data.data);
                if (!data.success) {
                    // se il login non è andato a buon fine, mostro un alert con il messaggio di errore
                    alert(data.message);
                }
            }).catch(err => console.error(err))
    }

    return (
        <>
            <div className="form-container">
                <form onSubmit={handleLogin} className="form-login">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">
                        <span>
                            Login
                        </span>
                        <span class="material-symbols-outlined">
                            login
                        </span>
                    </button>
                </form>
            </div>



        </>
    )
}
