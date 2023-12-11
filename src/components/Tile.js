import React from 'react'
import { WrapperData } from '../Wrapper'

function Tile(props) {

    // const { handleDragStart, handleDragEnd } = WrapperData()

    const handleDragStart = (e) => {
      console.log("drag start");
      const letter = props.letter;
      e.dataTransfer.setData("text", letter);
   };

    const handleDragEnd = (e) => {
      const element = e.target;
      console.log(element);
        console.log("drag end");
        props.updateRack(e);
    };

    let tileClass = "tile";
    let isDraggable = "true";
    if(props.value === null) {
      tileClass = "placeForTile";
      isDraggable = "false";
    }
      

  return (
    <div className={tileClass}
         draggable={isDraggable} 
         onDragStart={handleDragStart}
         onDragEnd={handleDragEnd}
         key={props.id}
          >
          <div className='letter'>{props.letter}</div>
          <div className='value'>{props.value}</div>
    </div>
  )
}

export default Tile