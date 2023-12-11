import React, { useState, useEffect } from 'react';
import Cell from './Cell';

const createEmptyBoard = (rows, cols) => {
  const board = [];
  for (let i = 0; i < rows * cols; i++) {
    board.push({
      row: Math.floor(i / cols),
      col: i % cols,
      letter: '',
    });
  }
  return board;
};

const ScrabbleBoard = () => {
  const [board, setBoard] = useState([]);

  const allowDrop = (event) => {
    const isCell = event.target.classList.contains('cell');
    if(isCell) {
      event.preventDefault();
    }
    console.log("allow drop");
  };
  
  const handleDrop = (event, rowIndex, colIndex) => {
    event.preventDefault();
    console.log("handle drop");
  
    const letter = event.dataTransfer.getData("text");

    const updatedBoard = board.map((cell) => {
      if(cell.row === rowIndex && cell.col === colIndex) {
        return {...cell, letter};
      }
      return cell;
      });

      setBoard(updatedBoard);
      
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
          handleDrop={(event) => handleDrop(event, cell.row, cell.col)}
          allowDrop={(event) => allowDrop(event)}
        />
      ))}
    </div>
  );
};

export default ScrabbleBoard;
