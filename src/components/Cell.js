import React from 'react';

function Cell(props) {

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

export default Cell