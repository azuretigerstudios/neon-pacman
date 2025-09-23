import { useEffect, useState } from "react";
import "../../App.css";

const initialBoard = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,0,0,0,0,0,0,0,0,0,0,0,2,1],
  [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
  [1,0,0,0,0,0,2,0,2,0,0,0,0,0,1],
  [1,0,1,0,1,1,0,0,0,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,2,0,0,0,0,0,0,1],
  [1,0,1,0,1,1,0,0,0,1,1,0,1,0,1],
  [1,0,0,0,0,0,2,0,2,0,0,0,0,0,1],
  [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
  [1,2,0,0,0,0,0,0,0,0,0,0,0,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

export default function GameBoard({ score, setScore }) {
  const [board, setBoard] = useState(initialBoard);
  const [pacman, setPacman] = useState({ x: 1, y: 1 });

  useEffect(() => {
    function handleKey(e) {
      let { x, y } = pacman;
      if (e.key === "ArrowUp") y--;
      if (e.key === "ArrowDown") y++;
      if (e.key === "ArrowLeft") x--;
      if (e.key === "ArrowRight") x++;

      if (board[y] && board[y][x] !== 1) {
        // eat pellet
        if (board[y][x] === 2) {
          setScore(score + 10);
          const newBoard = board.map((row, yi) =>
            row.map((cell, xi) =>
              xi === x && yi === y ? 0 : cell
            )
          );
          setBoard(newBoard);
        }
        setPacman({ x, y });
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [pacman, board, score, setScore]);

  return (
    <div className="board">
      {board.map((row, y) =>
        row.map((cell, x) => {
          const isPacman = pacman.x === x && pacman.y === y;
          return (
            <div key={`${x}-${y}`} className="cell">
              {cell === 1 && <div className="wall" />}
              {cell === 2 && <div className="pellet" />}
              {isPacman && <div className="pacman" />}
            </div>
          );
        })
      )}
    </div>
  );
}
