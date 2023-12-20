import React, { useState } from 'react';
import { WrapperData } from '../Wrapper';

function Login() {
    const { doLogin, loginMessage, setLoginMessage } = WrapperData();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
      if(login === "") {
        setLoginMessage("Login nie może być pusty.");
        return;
      }
      if(password === "") {
        setLoginMessage("Hasło nie może być puste.");
        return;
      }
        setLoginMessage("");
        await doLogin(login, password);
    };

  return (
    <div className='login'>
        <h1>Logowanie</h1>
        <br/>

        <input 
        value={login} 
        placeholder='Login...' 
        onChange={(event) => {
          setLogin(event.target.value);
        }}
        />

        <br/>

        <input 
        type="password"
        value={password} 
        placeholder='Hasło...' 
        onChange={(event) => {
          setPassword(event.target.value);
        }}
        />

        <br/>

        <button onClick={handleLogin}>Zaloguj</button>

        <div className='loginMessage'>{loginMessage}</div>
    </div>
  )
}

export default Login