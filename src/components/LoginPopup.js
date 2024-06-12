import React, { useContext, useState } from "react"
import { baseUrl } from '../config';
import AuthContext from "../App"

export default function LoginPopup() {
    const authed = useContext(AuthContext)

    console.log(authed)
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    //const isAuthenticated = useIsAuthenticated()
    //const authenticated = isAuthenticated();

    async function submitCreds(e) {
        e.preventDefault();
        fetch(`${baseUrl}/login?email=${email}&password=${password}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json()).then((x) => {
            localStorage.setItem("userInfo", JSON.stringify(x))
        })
    }

    return (
        <>
            {!authed &&
                <div className="login-container">
                    <div className="login-box">
                        <label>Email</label><input type="text" value={email} onChange={(e) => setEmail(e.target.value)} name="email" />
                        <label>Password</label><input type="text" value={password} onChange={(e) => setPassword(e.target.value)} name="password" />
                        <button onClick={submitCreds} type="submit">Submit</button>
                    </div>
                </div>
            }
        </>
    )
}