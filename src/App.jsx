// src/App.jsx
import { useState } from "react";
import GameBoard from "./components/GameBoard/GameBoard.jsx";
import "./App.css";

function App() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const restartGame = () => {
    setScore(0);
    setLives(3);
    window.location.reload(); // quick reset for now
  };

  return (
    <div className="app">
      <h1 className="title">⚡ Neon Pac-Man ⚡</h1>
      <div className="hud">
        <div className="score">Score: {score}</div>
        <div className="lives">Lives: {lives}</div>
      </div>
      <GameBoard score={score} setScore={setScore} lives={lives} setLives={setLives} />
      <button className="restart" onClick={restartGame}>
        Restart
      </button>
    </div>
  );
}

export default App;
