import { useState } from "react";
import GameBoard from "./components/GameBoard/GameBoard.jsx";
import "./App.css";

function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="app">
      <h1 className="title">Neon Pac-Man</h1>
      <div className="score">Score: {score}</div>
      <GameBoard score={score} setScore={setScore} />
    </div>
  );
}

export default App;
