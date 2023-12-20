import React from 'react';
import GameArea from './GameArea';
import AvailableRooms from './AvailableRooms';
import JoinForm from './JoinForm';
import Chat from './Chat';
import { WrapperData } from '../Wrapper';


function LoggedIn() {

  const { isInRoom, handleLogOut, login } = WrapperData();

  return (
    <>
    
    {isInRoom ?
        <>
            <GameArea />
            <div className='chat-area'>
            <Chat />
            </div>
        </>
        
        :
        <>
        <div className='loggedIn'>
        <h1>Jesteś zalogowany jako {login}</h1>
        <AvailableRooms />
        <JoinForm />
        <div className='logOutBtn'>
          <button onClick={handleLogOut}>Wyloguj się</button>
        </div>
        </div>
        </>
        }


            </>
            
            
  )
}

export default LoggedIn