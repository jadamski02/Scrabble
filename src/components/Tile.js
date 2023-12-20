import React from 'react'


function Tile(props) {

    const handleDragStartFromTile = (e) => {
      console.log(props.id)
      const letter = props.letter;
      e.dataTransfer.setData("letter", letter);
      e.dataTransfer.setData("value", props.value);
      e.dataTransfer.setData("placeId", props.id);
      e.dataTransfer.setData("tileEvent", e);
   };

    const handleDragEndFromTile = (e) => {
      ///
    };

    const handleDragOverOnTile = (e) => {
     ///
    };

    const handleDropOnTile = (e) => {
      ///
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
         onDrop={handleDropOnTile}
         onDragOver={handleDragOverOnTile}
         onDragStart={handleDragStartFromTile}
         onDragEnd={handleDragEndFromTile}
         key={props.id}
          >
          <div className='letter'>{props.letter}</div>
          <div className='value'>{props.value}</div>
    </div>
  )
}

export default Tile