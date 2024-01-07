import React from 'react';
import GameArea from './GameArea';
import AvailableRooms from './AvailableRooms';
import CreateRoomForm from './CreateRoomForm';
import Chat from './Chat';
import { WrapperData } from '../Wrapper';
import InfoPanel from './InfoPanel';


function LoggedIn() {

  const { isInRoom, handleLogOut, login } = WrapperData();

  return (
    <>
    
    {isInRoom ?
        <>
            <GameArea />
            <div className='chat-area'>
            <InfoPanel />
            <Chat />
            </div>
        </>
        
        :
        <>
        <div className='loggedIn'>
        <h1>Jesteś zalogowany jako {login}</h1>
        <AvailableRooms />
        <CreateRoomForm />
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