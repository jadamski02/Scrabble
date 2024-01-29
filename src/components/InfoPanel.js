import React, { useEffect } from 'react';
import { WrapperData } from '../Wrapper';
import GameTimer from './GameTimer';

function InfoPanel(props) {

  const { winner, room, hostUser, isGameStarted, gameEnded, setIsGameStarted, timer, socket, isMyTurn, whoseTurn, connectedUsers, turnPoints, setIsInRoom, numberOfTilesLeft } = WrapperData();

  const handleRoomQuit = () => {
    setIsInRoom(false);
    socket.emit("leave_room", room);
  }

  const handleGameStart = () => {
    if (liczbaGraczy < 2) {
      alert("Do rozpoczęcia gry potrzeba minimum 2 graczy");
    } else {
      setIsGameStarted(true);
      socket.emit("start_game", room);
    }
  }

  let odmianaPozostalo = "Pozostało"
  let odmianaPlytek = "płytek";
  let liczbaGraczy = connectedUsers.length;
  const liczba = numberOfTilesLeft;

  if (liczba % 10 === 2 || liczba % 10 === 3 || liczba % 10 === 4) {
    odmianaPozostalo = "Pozostały"
    odmianaPlytek = "płytki";
  }
  if (liczba == 1) {
    odmianaPozostalo = "Pozostała";
    odmianaPlytek = "Płytka";
  }

  return (
    <div className='infoPanel'>
      <div className='infoPanelBox'>
        <h3>Pokój {room} <br />
          {liczbaGraczy === 1 ? liczbaGraczy + " gracz" : liczbaGraczy + " graczy"}
        </h3>
        <div className="userList">
          {connectedUsers.map((user) => (
            <div className='user' key={user.socketId}>
              {hostUser.socketId == user.socketId ?
                (
                  <>
                    {user.login} {user.gamePoints} gospodarz
                  </>
                )
                :
                (
                  <>
                    {user.login} {user.gamePoints}
                  </>
                )
              }

            </div>
          ))}
        </div>
      </div>

      <div className='infoPanelBox'>
        {gameEnded ? (
          <>
            <p>Gra zakończona</p>
            <p>Zwycięzca: {winner.login}</p>
            <p>Liczba punktów: {winner.gamePoints}</p>
          </>
        )
        :
        ( <>
          {isGameStarted ? (
            <>
              <p>{odmianaPozostalo} <span style={{ color: "#ff8503" }}>{liczba}</span> {odmianaPlytek}</p>
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
            </>) : (
            <>
              <p>Liczba graczy {liczbaGraczy}/4</p>
              {hostUser.socketId === socket.id ?
                <>              
                  <div className='startBtn'>
                    <button disabled={liczbaGraczy > 1 ? false : true}onClick={handleGameStart}>Rozpocznij grę</button>
                  </div>
                </>
                :
                <>
                  <p>Oczekiwanie na rozpoczęcie gry przez gospodarza</p>
                </>
              }
            </>
          )
          }
          </>
        )
        
        }
        
        <div className='quitBtn'>
          <button onClick={handleRoomQuit}>Opuść pokój</button>
        </div>

      </div>

      <div className='infoPanelBox'>
        <p>Czas na wykonanie ruchu</p>
        <GameTimer
          timer={props.timer}
          setTimer={props.setTimer}
          isTimerActive={props.isTimerActive}
          setIsTimerActive={props.setIsTimerActive}
        />
      </div>
    </div>
  )
}

export default InfoPanel