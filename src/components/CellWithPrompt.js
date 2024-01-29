import React, { useState, useEffect } from 'react';
import { WrapperData } from '../Wrapper';

function CellWithPrompt(props) {
    const { turnLetters } = WrapperData();
    const [chosenLetter, setChosenLetter] = useState("");

    let isMyLetter = false;
    if (turnLetters.find(tl => tl.tileId === props.tileId)) {
        isMyLetter = true;
    };

    const handleChange = (e) => {
        setChosenLetter(e.target.value.toUpperCase());
    };

    const handleReset = () => {
        setChosenLetter("");
    }

    useEffect(() => {
      if(isMyLetter) {
        props.updateCellWithPrompt(props.tileId, chosenLetter);
      }
    }, [chosenLetter]);

    if (isMyLetter) {
        return (
            <div
                draggable={props.isDraggable ? "true" : "false"}
                className="cellWithPrompt"
                onDragStart={e => props.handleDragStartFromCell(e, props.cell, props.isDraggable)}
            >
                <input
                    type="text"
                    value={chosenLetter}
                    onChange={(e) => handleChange(e)}
                    maxLength="1"
                    placeholder='?'
                ></input>
                {chosenLetter !== "" ? (
                    <div className='acceptLetter'>
                        &#9989;
                    </div>
                ) : (
                    <div className='acceptLetter'>
                        &#10060;
                    </div>
                )}
                <div className='value'>
                    {props.value}
                </div>
            </div>
        )
    } else {
        return (
            <div
                className={props.cellStyle}
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

export default CellWithPrompt;
