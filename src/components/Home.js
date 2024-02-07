import React from 'react'

import LoggedIn from '../components/LoggedIn';
import Login from '../components/Login';
import { SignUp } from '../components/SignUp';
import HeaderBar from '../components/HeaderBar';

function Home(props) {

    const { handleLogOut, isAuth, isInRoom, timer, setTimer, isTimerActive, setIsTimerActive } = props;

  return (
    <>
    {!isInRoom ? (
     <HeaderBar handleLogOut={handleLogOut} isAuth={isAuth} />
    ) : null}
     <div className='app-container'>
         {isAuth ? (
         <LoggedIn
             timer={timer}
             setTimer={setTimer}
             isTimerActive={isTimerActive}
             setIsTimerActive={setIsTimerActive}
         />
         ) : (
         <>
             <Login />
             <SignUp />
         </>
         )}
     </div>
     </>
  )
}

export default Home