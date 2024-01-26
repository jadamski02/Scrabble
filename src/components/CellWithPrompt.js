import React, { useState } from 'react';
import { WrapperData } from '../Wrapper';

function CellWithPrompt(props) {

    const { turnLetters } = WrapperData();
    const [chosenLetter, setChosenLetter] = useState("");

    let isMyLetter = false;
    if(turnLetters.includes(props.tileId)) {
        isMyLetter = true;
    };

    const handleChange = (e) => {
        setChosenLetter(e.target.value.toUpperCase());
    }

    const handleConformLetter = (e) => {
        if(e.keyCode === 13) {
            props.confirmCellWithPrompt(props.tileId, chosenLetter);
        }
    }

    if(isMyLetter) {
        return (
            <div
            draggable={props.isDraggable ? "true" : "false"}
                className="cellWithPrompt"
                >
                <input type="text" 
                value={chosenLetter} 
                onChange={(e) => handleChange(e)}
                maxLength="1"
                onKeyUp={(e) => {handleConformLetter(e)}}
                ></input>
                <div className='value'>
                  {props.value}
                </div>
            </div>
          )
    } else {
        return (
            <div
            draggable={props.isDraggable ? "true" : "false"}
                className={props.cellStyle}
                onDrop={e => props.handleDropOnCell(e, props.rowIndex, props.colIndex)}
                onDragOver={e => props.allowDropOnCell(e)}
                onDragStart={e => props.handleDragStartFromCell(e, props.cell, props.isDraggable)}
                >
                <div className='premia'>{props.cell.value === "" ? props.bonusPlaceholder : ""}</div>
                {props.rowIndex === 7 && props.colIndex === 7 && props.cell.value === '' ? <span>&#10040;</span> : ""}
                <div className='letter'>{props.cell.letter}</div>
                <div className='value'>
                  {props.cell.value}
                </div>
            </div>
          )
        }
  
}

export default CellWithPrompt