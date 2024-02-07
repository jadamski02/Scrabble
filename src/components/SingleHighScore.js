import React from 'react'

function SingleHighScore(props) {
    switch(props.score.period) {
        case "week":
            return (
                <div className='singleHighScoreWeek'>Słowo tygodnia: {props.score.word} 
                <br/>Gracz: {props.score.player}
                <br/>Punkty: {props.score.points}</div>
            )
        case "month":
            return (
                <div className='singleHighScoreMonth'>Słowo miesiąca: {props.score.word} 
                <br/>Gracz: {props.score.player}
                <br/>Punkty: {props.score.points}</div>
            )
        case "year":
            return (
                <div className='singleHighScoreYear'>Słowo roku: {props.score.word}
                <br/>Gracz: {props.score.player}
                <br/>Punkty: {props.score.points}</div>
            )
    }
}   

export default SingleHighScore