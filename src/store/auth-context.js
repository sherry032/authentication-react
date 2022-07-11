import React, { useEffect, useState } from "react"

const AuthContext = React.createContext({
    token: "",
    isLoggedIn: false,
    login: (token)=>{},
    logout: ()=>{}
})
const retriveStoredToken = ()=>{
    const storedToken = localStorage.getItem("auth")
    const storedExpirationDate= localStorage.getItem("expirationTime")
    const remainingTime = calculateRemainingTime(storedExpirationDate)
    if(remainingTime <= 60000) {
        localStorage.removeItem("auth")
        localStorage.removeItem("expirationTime")
        return null
    }
    return{
        token: storedToken,
        duration: remainingTime
    }
}
const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime()
    const adjExpirationTime = new Date(expirationTime).getTime()
    const remainingDuration = adjExpirationTime - currentTime
    return remainingDuration
}
let timer
export const AuthContextProvider=(props)=>{
    const tokenData = retriveStoredToken();
  
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
    const [token, setToken] = useState(initialToken)
    const userIsLoggedIn = !!token
    const logoutHandler=()=>{
        setToken(null)
        localStorage.removeItem("auth")
        localStorage.removeItem("expirationTime")
        if(timer){
            clearTimeout(timer)
        }
    }
    const loginHandler = (token, expirationTime)=>{
        setToken(token)
        localStorage.setItem("auth", token)
        localStorage.setItem("expirationTime", expirationTime)
        const remainingTime = calculateRemainingTime(expirationTime)
        timer = setTimeout(logoutHandler, remainingTime)
    }
    useEffect(()=>{
        
        if(tokenData){
            console.log(tokenData.duration);
            timer = setTimeout(logoutHandler, tokenData.duration)
        }
    },[tokenData])
    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }
    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}

export default AuthContext