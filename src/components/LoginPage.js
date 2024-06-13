import React, { useState } from "react"
import { baseUrl } from '../config';
import { Navigate, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate()
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    async function submitCreds(e) {
        e.preventDefault();
        fetch(`${baseUrl}/login?email=${email}&password=${password}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json()).then((x) => {
            localStorage.setItem("userInfo", JSON.stringify(x))
            window.dispatchEvent(new Event('storage'))
            navigate(-1)
        })
    }

    return (
        <>
            <div className="login-container">
                <div className="login-box">
                    <label>Email</label><input type="text" value={email} onChange={(e) => setEmail(e.target.value)} name="email" />
                    <label>Password</label><input type="text" value={password} onChange={(e) => setPassword(e.target.value)} name="password" />
                    <button onClick={submitCreds} type="submit">Submit</button>
                </div>
            </div>
        </>
    )
}