import { useEffect, useState } from 'react';

export default function NavBar() {

    let [authed, setAuthed] = useState(false)

    useEffect(() => {
        function handleChange() {
            let stored = JSON.parse(localStorage.getItem("userInfo"))
            if (stored) {
                setAuthed(true)
            } else {
                setAuthed(false)
            }
        }

        handleChange()
        window.addEventListener('storage', handleChange)
    }, [])

    return (
        <div className="nav-container">
            <a href="/">Home</a>
            <a href="/about">About</a>
            {authed ?
                <>
                    <p>Logged in as theresajyhe@gmail.com</p>
                    <button onClick={() => {
                        localStorage.removeItem("userInfo")
                        window.dispatchEvent(new Event('storage'))
                    }}>Log Out</button>
                </> : <a href='/login'>Login</a>}
        </div>
    )
}