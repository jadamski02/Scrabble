import React, { useState } from 'react'
import { WrapperData } from '../Wrapper';

export const SignUp = () => {

    const { doSignUp } = WrapperData();
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');

    const registerSubmit = async () => {
        
        await doSignUp(login, email, password);

    };

    return (
        <div className='signUp'>

        <h1>Rejestracja</h1>

            
        <input
        placeholder='E-mail...' 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        ></input>

        <br/>

        <input
        placeholder='Login...' 
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        ></input>

        <br/>

        <input
        placeholder='Hasło...' 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        ></input>
        
        <br/>

        <input
        placeholder='Potwierdź hasło...' 
        type="password"
        value={retypePassword}
        onChange={(e) => setRetypePassword(e.target.value)}
        ></input>

        <br/>

        <button onClick={registerSubmit}>Zarejestruj się</button>

        </div>

    )
}