import React from 'react'

function Cell(props) {

    let cellStyle = "cell";
    if(props.rowIndex === 7 && props.colIndex === 7) cellStyle = "middleCell";
    if(props.letter !== '') cellStyle="tile";

    const handleDrop = (event) => {
      props.handleDrop(event, props.rowIndex, props.colIndex);
    };
  
    const allowDrop = (event) => {
      props.allowDrop(event);
    };

  return (
    <div
        className={cellStyle}
        onDrop={handleDrop}
        onDragOver={allowDrop}
        >
        {props.rowIndex === 7 && props.colIndex === 7 && props.cell.letter === '' ? <span>&#10040;</span> : ""}
        {props.cell.letter}
    </div>
  )
}

export default Cell