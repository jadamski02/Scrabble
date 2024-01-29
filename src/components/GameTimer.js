import React, { useEffect } from 'react';
import { WrapperData } from '../Wrapper';

const GameTimer = (props) => {

  const { socket, restartTurnLetters, login, room, isMyTurn } = WrapperData(); 

  useEffect(() => {
    let timerId;

    if (props.isTimerActive && props.timer > 0) {
      timerId = setTimeout(() => {
        props.setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (props.timer === 0) {
      restartTurnLetters();
      if(isMyTurn) {
        socket.emit("skipTurn", { room: room, login: login, cause: "endOfTime"});
      }
        // props.setIsTimerActive(false);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [props.isTimerActive, props.timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div>
        {props.timer < 30 ? 
        <p style={{color: "red"}}>{formatTime(props.timer)}</p> :
        <p>{formatTime(props.timer)}</p>
        }
    </div>
  );
};

export default GameTimer;
