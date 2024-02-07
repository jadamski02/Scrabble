import React from 'react'
import HighScores from './HighScores';
import { Link } from 'react-router-dom';

function HeaderBar(props) {
  return (
    <>
    <div className='headerBar'>
        <h1>Internetowa gra w Scrabble</h1>
        {props.isAuth? (
        <div className='logOutBtnBox'>
            <button onClick={props.handleLogOut}>Wyloguj się</button>
        </div>): null}
    </div>
    <HighScores />
    <div className='highScoreLinkContainer'>
      <Link to={'/wyniki'} className='highScoreLink'>
        Przejdź do tabeli wyników
      </Link>
    </div>

    </>
  )
}

export default HeaderBar