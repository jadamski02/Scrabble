import React from 'react';

const doubleLetterScores = [
  {x: 0, y: 3}, 
  {x: 0, y: 11}, 
  {x: 2, y: 6},
  {x: 2, y: 8},
  {x: 3, y: 0},
  {x: 3, y: 7},
  {x: 3, y: 14},
  {x: 6, y: 2}, 
  {x: 6, y: 6}, 
  {x: 6, y: 8},
  {x: 6, y: 12},
  {x: 7, y: 3},
  {x: 7, y: 11},
  {x: 8, y: 2},
  {x: 8, y: 6},
  {x: 8, y: 8},
  {x: 8, y: 12},
  {x: 11, y: 0},
  {x: 11, y: 7},
  {x: 12, y: 6},
  {x: 12, y: 8},
  {x: 11, y: 14},
  {x: 14, y: 3},
  {x: 14, y: 11}
]

const tripleLetterScores = [
  {x: 1, y: 5}, 
  {x: 1, y: 9}, 
  {x: 5, y: 5},
  {x: 5, y: 9},
  {x: 9, y: 5},
  {x: 9, y: 9},
  {x: 5, y: 1},
  {x: 5, y: 13}, 
  {x: 9, y: 1}, 
  {x: 9, y: 13},
  {x: 13, y: 5},
  {x: 13, y: 9},
]



function Cell(props) {

  let cellStyle = "cell";
  let placeHolder = "";
  if(([0,7,14].indexOf(props.rowIndex) != -1 && [0,7,14].indexOf(props.colIndex) != -1 )
      &&
      !(props.rowIndex === 7 && props.colIndex === 7)
    ) {
    cellStyle = "tripleWordScore";
    placeHolder = "3S"

  }

  if(((props.rowIndex >= 1 && props.rowIndex <= 4) || (props.rowIndex >= 10 && props.rowIndex <= 13)) 
    &&
    (props.rowIndex === props.colIndex || 14 - props.rowIndex === props.colIndex)) 
    {
      cellStyle = "doubleWordScore";
      placeHolder = "2S"
    }

  const isDoubleLetterScore = doubleLetterScores.find(el => el.x === props.rowIndex && el.y === props.colIndex);
  if(isDoubleLetterScore) {
    cellStyle = "doubleLetterScore";
    placeHolder = "2L"
  }

  const isTripleLetterScore = tripleLetterScores.find(el => el.x === props.rowIndex && el.y === props.colIndex);
  if(isTripleLetterScore) {
    cellStyle = "tripleLetterScore";
    placeHolder = "3L";
  }


  if(props.rowIndex === 7 && props.colIndex === 7) cellStyle = "middleCell";
  
  if(props.value !== '') cellStyle="tile";

  return (
    <div
    draggable
        className={cellStyle}
        onDrop={e => props.handleDropOnCell(e, props.rowIndex, props.colIndex)}
        onDragOver={e => props.allowDropOnCell(e)}
        onDragStart={e => props.handleDragStartFromCell(e, props.cell)}
        >
        <div className='premia'>{props.cell.value === "" ? placeHolder : ""}</div>
        {props.rowIndex === 7 && props.colIndex === 7 && props.cell.value === '' ? <span>&#10040;</span> : ""}
        <div className='letter'>{props.cell.letter}</div>
        <div className='value'>
          {props.cell.value}
        </div>
    </div>
  )
}

export default Cell