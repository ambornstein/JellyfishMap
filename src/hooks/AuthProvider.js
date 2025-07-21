import { useState, useContext, createContext } from "react";
import { baseUrl } from "../config";
import { useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("")
    const [authed, setAuthed] = useState(false)

    async function handleChange() {
        let userInfo = localStorage.getItem("userInfo");

        if (userInfo) {
            fetch(`${baseUrl}/api/auth/verify/${userInfo}`).then((res) => setAuthed(res.ok))
        } else {
            setAuthed(false)
        }
    }
    
    function logOut() {
        localStorage.removeItem("userInfo")
        window.dispatchEvent(new Event('storage'))
    }

    useEffect(() => {
        handleChange()
    }, [])

    window.addEventListener('storage', handleChange)

    return <AuthContext.Provider value={{authed, logOut}}>{children}</AuthContext.Provider>
}

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
}