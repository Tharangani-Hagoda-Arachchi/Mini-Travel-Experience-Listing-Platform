import React,{ useEffect } from "react";
import { useState } from "react";
import { logoutUser } from "../services/api.js";

export const authContext = React.createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("accessToken") || null);

    const [user, setUser] = useState({
        _id: null,
        firstName: null,
        lastName: null,
        role: null
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem("accessToken");
        if (savedToken) {
            setToken(savedToken);
            decodeUser(savedToken);
        }
        setLoading(false);
    }, []);

    //decode access token to get user details
    const decodeUser = (accessToken) => {
        try {
            const decoded = jwtDecode(accessToken);

            setUser({
                _id: decoded.id || null,
                firstName: decoded.firstName || null,
                lastName: decoded.lastName || null,
                role: decoded.role || null
            });
        } catch (err) {
            console.error("Invalid token", err);

            //reset full user object
            setUser({
                _id: null,
                firstName: null,
                lastName: null,
                role: null
            });
        }
    };

    const login = (accessToken) => {
        localStorage.setItem("accessToken", accessToken);
        setToken(accessToken);
        decodeUser(accessToken);
    };

    const logout = async () => {
        try {
            await logoutUser(); // calling backend
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            localStorage.removeItem("accessToken");
            setToken(null);
            setUser({
                _id: null,
                firstName: null,
                lastName: null,
                role: null
            });
        }
    };

    const isLoggedIn = !!token;

    return (
        <authContext.Provider value={{ token, user, login, logout, isLoggedIn, loading }}>
            {children}
        </authContext.Provider>
    );
};
