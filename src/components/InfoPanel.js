import React, { useEffect } from 'react';
import { WrapperData } from '../Wrapper';

function InfoPanel() {

    const { hostUser, setHostUser, isGameStarted, setIsGameStarted, resetTimer, timer, socket, gamePoints, setGamePoints, isMyTurn, whoseTurn, connectedUsers, turnLetters, turnPoints, setTurnPoints, setIsInRoom, numberOfTilesLeft, room  } = WrapperData();

    const handleRoomQuit = () => {
        setIsInRoom(false);
        socket.emit("leave_room", room);
      }

    let odmianaPozostalo = "Pozostało"
    let odmianaPlytek = "płytek";
    const liczba = numberOfTilesLeft;

    if(liczba % 10 === 2 || liczba % 10 === 3 || liczba % 10 === 4) {
        odmianaPozostalo = "Pozostały"
        odmianaPlytek = "płytki";
    }
    if(liczba == 1) {
        odmianaPozostalo = "Pozostała";
        odmianaPlytek = "Płytka";
    } 



  return (
    <div className='infoPanel'>
      <div className='infoPanelBox'>
        <h3>Pokój {room}</h3>
        <div className="userList">
          {connectedUsers.map((user) => (
            <div className='user' key={user.socketId}>
              {hostUser.socketId == user.socketId ? 
                (
                  <>
                    { user.login } { user.gamePoints} gospodarz
                  </>
                ) 
                :  
                (
                  <>
                  { user.login } { user.gamePoints }
                  </>
                )
              }
            
            </div>
          ))}
        </div>
      </div>

      <div className='infoPanelBox'>
        <p>{odmianaPozostalo} <span style={{color: "#ff8503"}}>{liczba}</span> {odmianaPlytek}</p>
        {isMyTurn ? 
          (
            <>
              <p>Twoja kolej</p>
              <p>Potencjalne punkty {turnPoints}</p>
            </>
          )
          :
          <>
           <p>Kolej użytkownika {whoseTurn}</p>
           <p><span>&nbsp;&nbsp;</span></p>
          </>

        } 
          <div className='quitBtn'>
            <button onClick={handleRoomQuit}>Opuść pokój</button>
          </div>
      </div>
      <div className='infoPanelBox'>
        <p>Czas na wykonanie ruchu</p>
        <p>{timer}</p>
        <button onClick={resetTimer}>reset timer</button>
      </div>
    </div>
  )
}

export default InfoPanel