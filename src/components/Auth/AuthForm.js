import { toBePartiallyChecked } from '@testing-library/jest-dom/dist/matchers';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const navigate = useNavigate()
  const authCtx = useContext(AuthContext)
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false)
  const emailInputRef = useRef()
  const passwordInputRef = useRef()
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler =(event)=>{
    event.preventDefault()
    const enteredEmail = emailInputRef.current.value
    const enteredPassword = passwordInputRef.current.value
    setIsLoading(true)
    const url = isLogin ? 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAaZeyrzWW7--E6CYrqGtzQy4LaVzcPWH0' : "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAaZeyrzWW7--E6CYrqGtzQy4LaVzcPWH0"

    fetch(url,{
    method:"POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        })
      }).then(res=>{
        setIsLoading(false)
        if(res.ok) return res.json()
        if(!res.ok) return res.json().then(data=>{
          const errorMessage = (data?.error?.message) ? data.error.message : "Authentication failed"
          throw new Error(errorMessage)
        })
     }).then(data=>{
       const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000))
      authCtx.login(data.idToken, expirationTime.toISOString())
      navigate('/')
     }).catch((err)=> alert(err.message))
      
    }
  

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' ref={passwordInputRef} required />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Loading</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
