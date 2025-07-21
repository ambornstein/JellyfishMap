import { useAuth } from "../hooks/AuthProvider";

export default function NavBar() {
    const auth = useAuth();
    
    return (
        <div className="nav-container wave">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li id="login">
                    {auth.authed ?
                        <>
                            <label>Logged in as theresajyhe@gmail.com</label>
                            <button onClick={() => {
                                auth.logOut()
                            }}>Log Out</button>
                        </>
                        : <a href='/login'>Login</a>}
                </li>
            </ul>

        </div>
    )
}