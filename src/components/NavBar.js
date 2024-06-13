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
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li style={{"float":"right"}}>
                    {authed ?
                        <>
                            <label>Logged in as theresajyhe@gmail.com</label>
                            <button onClick={() => {
                                localStorage.removeItem("userInfo")
                                window.dispatchEvent(new Event('storage'))
                            }}>Log Out</button>
                        </> 
                    : <a href='/login'>Login</a>}
                </li>
            </ul>
        </div>
    )
}