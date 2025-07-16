import {useEffect,createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>
{
    const [token,setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  });
    const [isLoading,setIsLoading] = useState(true);

    const API = import.meta.env.VITE_APP_URI;

    const storeTokenInLS = (token)=>
    {
        setToken(token);
        return localStorage.setItem("token",token);
    };

    const logout = () =>
    {
        setToken(null);
        setUser(null);
        localStorage.clear();
    };

    const userAuthentication = async()=>
    {
        try
        {
            setIsLoading(true);
            const authorizationToken = `Bearer ${token}`;
            const response = await fetch(`${API}/api/auth/user`,{
                method:"GET",
                headers:
                {
                    Authorization:authorizationToken
                }
            });
            if(response.ok)
            {
                const data = await response.json();
                setUser(data.userData);
                setIsLoading(false);
            }
            else
            {
                console.warn("User auth failed. Status: ",response.status);
                setIsLoading(false);
            }
        }
        catch(err)
        {
            console.error("Error fetching user data: ", err.message);
        }
        finally
        {
            setIsLoading(false);
        }
    };

    const login = (token, userData) =>
    {
        setToken(token);
        setUser(userData);
        localStorage.setItem("token",token);
        localStorage.setItem("user",userData);
    };

    useEffect(()=>
    {
        userAuthentication();
    },[token]);

    return(
        <AuthContext.Provider value={{
            storeTokenInLS,
            login,
            logout,
            user,
            isLoading,
            token,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () =>
{
    const authContextValue = useContext(AuthContext);
    if(!authContextValue)
    {
        throw new Error("useAuth used outside of Provider");
    }
    return authContextValue;
}