import React from 'react'

function Cell(props) {

    let cellStyle = "cell";
    if(props.rowIndex === 7 && props.colIndex === 7) cellStyle = "middleCell";
    if(props.value !== '') cellStyle="tile";

    const handleDropOnCell = (event) => {
      props.handleDropOnCell(event, props.rowIndex, props.colIndex);
    };
  
    const handleDragOverOnCell = (event) => {
      props.allowDropOnCell(event);
    };

    const handleDragStartFromCell = (e) => {
      ///
    };

    const handleDragEndFromCell = (event) => {
      ///
    };

  return (
    <div
    draggable
        className={cellStyle}
        onDrop={handleDropOnCell}
        onDragOver={handleDragOverOnCell}
        onDragStart={handleDragStartFromCell}
        onDragEnd={handleDragEndFromCell}
        >
        {props.rowIndex === 7 && props.colIndex === 7 && props.cell.letter === '' ? <span>&#10040;</span> : ""}
        <div className='letter'>{props.cell.letter}</div>
        <div className='value'>{props.cell.value}</div>
    </div>
  )
}

export default Cell