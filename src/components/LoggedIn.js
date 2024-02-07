import React from 'react';
import GameArea from './GameArea';
import AvailableRooms from './AvailableRooms';
import CreateRoomForm from './CreateRoomForm';
import Chat from './Chat';
import { WrapperData } from '../Wrapper';
import InfoPanel from './InfoPanel';


function LoggedIn(props) {

  const { isInRoom, login } = WrapperData();

  return (
    <>
    
    {isInRoom ?
        <>
            <GameArea />
            <div className='chat-area'>
            <InfoPanel 
            timer={props.timer}
            setTimer={props.setTimer}
            isTimerActive={props.isTimerActive}
            setIsTimerActive={props.setIsTimerActive}
            />
            <Chat />
            </div>
        </>
        
        :
        <>
        <div className='loggedIn'>
        <h2>Jesteś zalogowany jako {login}</h2>
        <AvailableRooms />
        <CreateRoomForm/>
        </div>
        </>
        }
            </>
            
            
  )
}

export default LoggedIn