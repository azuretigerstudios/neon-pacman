import { useState, useEffect, useRef } from "react";
import "./GameBoard.css";

function GameBoard({ setScore }) {
  const [pacman, setPacman] = useState({ x: 7, y: 7 });
  const pacmanRef = useRef(pacman); // Ref to always track latest Pac-Man
  const [ghosts, setGhosts] = useState([
    { x: 1, y: 1, color: "red" },
    { x: 13, y: 1, color: "pink" },
    { x: 1, y: 13, color: "cyan" },
    { x: 13, y: 13, color: "orange" }
  ]);
  const [gameOver, setGameOver] = useState(false);

  const initialBoard = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,2,1,1,1,2,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,2,1,1,1,2,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ];

  const [board, setBoard] = useState(initialBoard);

  // Keep ref updated
  useEffect(() => {
    pacmanRef.current = pacman;
  }, [pacman]);

  // Pac-Man movement
  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver) return;

      setPacman((prev) => {
        let { x, y } = prev;
        if (e.key === "ArrowUp" && board[y - 1][x] !== 1) y--;
        if (e.key === "ArrowDown" && board[y + 1][x] !== 1) y++;
        if (e.key === "ArrowLeft" && board[y][x - 1] !== 1) x--;
        if (e.key === "ArrowRight" && board[y][x + 1] !== 1) x++;

        if (board[y][x] === 2) {
          const newBoard = board.map((row, r) =>
            row.map((cell, c) => (r === y && c === x ? 0 : cell))
          );
          setBoard(newBoard);
          setScore((s) => s + 10);
        }

        return { x, y };
      });
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [board, setScore, gameOver]);

  // Ghost movement chasing Pac-Man & avoiding collisions
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setGhosts((prevGhosts) => {
        const newPositions = [];

        return prevGhosts.map((g) => {
          const directions = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 }
          ];

          const currentPacman = pacmanRef.current; // always latest

          const sorted = directions
            .map(d => ({ x: g.x + d.x, y: g.y + d.y }))
            .filter(pos => board[pos.y] && board[pos.y][pos.x] !== 1)
            .sort((a, b) => {
              const distA = Math.abs(a.x - currentPacman.x) + Math.abs(a.y - currentPacman.y);
              const distB = Math.abs(b.x - currentPacman.x) + Math.abs(b.y - currentPacman.y);
              return distA - distB;
            });

          let newPos = sorted.find(pos =>
            !newPositions.some(p => p.x === pos.x && p.y === pos.y)
          );

          if (!newPos) newPos = { x: g.x, y: g.y };

          newPositions.push(newPos);
          return { ...g, x: newPos.x, y: newPos.y };
        });
      });
    }, 500);

    return () => clearInterval(interval);
  }, [board, gameOver]); // pacman removed from deps

  // Collision detection
  useEffect(() => {
    if (ghosts.some((g) => g.x === pacman.x && g.y === pacman.y)) {
      setGameOver(true);
    }
  }, [pacman, ghosts]);

  return (
    <div className="board">
      {board.map((row, r) =>
        row.map((cell, c) => {
          const isPacman = pacman.x === c && pacman.y === r;
          const ghostHere = ghosts.find((g) => g.x === c && g.y === r);

          return (
            <div key={`${r}-${c}`} className="cell">
              {cell === 1 && <div className="wall"></div>}
              {cell === 2 && <div className="pellet"></div>}
              {isPacman && <div className="pacman"></div>}
              {ghostHere && <div className={`ghost ${ghostHere.color}`}></div>}
            </div>
          );
        })
      )}

      {gameOver && (
        <div className="game-over-card">
          <h2>💀 GAME OVER 💀</h2>
          <p>Press F5 to restart</p>
        </div>
      )}
    </div>
  );
}

export default GameBoard;
