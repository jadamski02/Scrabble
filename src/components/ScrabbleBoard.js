import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import { WrapperData } from '../Wrapper';

const createEmptyBoard = (rows, cols) => {
  const board = [];
  for (let i = 0; i < rows * cols; i++) {
    board.push({
      row: Math.floor(i / cols),
      col: i % cols,
      letter: '',
      value: ''
    });
  }
  return board;
};

const ScrabbleBoard = () => {
  const { updateRack } = WrapperData();
  const [board, setBoard] = useState([]);

  const allowDropOnCell = (event) => {
    const isCell = event.target.classList.contains('cell') || event.target.classList.contains('middleCell');
    if(isCell) {
      event.preventDefault();
    }
  };
  
  const handleDropOnCell = (event, rowIndex, colIndex) => {
    event.preventDefault();
  
    const letter = event.dataTransfer.getData("letter");
    const value = event.dataTransfer.getData("value");
    const tileId = event.dataTransfer.getData("tileId");
    const tileEvent = event.dataTransfer.getData("tileEvent");
    console.log(tileId)

    const updatedBoard = board.map((cell) => {
      if(cell.row === rowIndex && cell.col === colIndex) {
        return {...cell, letter, value};
      }
      return cell;
      });

      setBoard(updatedBoard);
      updateRack(tileEvent, tileId);
      
    };

  useEffect(() => {
    setBoard(createEmptyBoard(15, 15));
    console.log(board)
  }, []);

  return (
    <div className="scrabble-board">
      {board.map((cell, index) => (
        <Cell
          key={index}
          cell={cell}
          colIndex={cell.col}
          rowIndex={cell.row}
          letter={cell.letter}
          value={cell.value}
          handleDropOnCell={(event) => handleDropOnCell(event, cell.row, cell.col)}
          allowDropOnCell={(event) => allowDropOnCell(event)}
        />
      ))}
    </div>
  );
};

export default ScrabbleBoard;
