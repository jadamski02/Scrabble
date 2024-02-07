import React from 'react'
import { WrapperData } from '../Wrapper'
import SingleHighScore from './SingleHighScore';

function HighScores() {

    const { highScores } = WrapperData();

  return (
    <div className='highScore'>
        {highScores.map((score, index) => {
            return <SingleHighScore key={index} score={score}/>
        })}
    </div>
  )
}

export default HighScores