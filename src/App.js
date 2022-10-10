import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import GameOfLife from "./game-of-life/GameOfLife";
import Beeclust from "./beeclust/Beeclust";
import TetrisGame from "./tetris-game/TetrisGame";
import TwentyFortyEight from "./2048/TwentyFortyEight";
import SnakeGame from "./snake-game/SnakeGame";
import BfsAlgorithm from "./bfs-algorithm/BfsAlgorithm";
import { HomeMenu } from "./shared";

function App() {
  return (
    <div className="flex w-full min-h-screen justify-center items-center">

      <Router>
        <div className="w-full h-full flex justify-center">
          <Routes>
            <Route path="/" element={<HomeMenu/>}/>
            <Route path="/gameoflife" element={<GameOfLife/>}/>
            <Route path="/beeclust" element={<Beeclust/>}/>
            <Route path="/tetris" element={<TetrisGame/>}/>
            <Route path="/2048" element={<TwentyFortyEight/>}/>
            <Route path="/snakegame" element={<SnakeGame/>}/>
            <Route path="/bfsalgorithm" element={<BfsAlgorithm/>}/>
          </Routes>

          <div className="w-full fixed top-6 left-0 flex justify-start gap-4 pl-20">
            <Link to="/" className="px-4 py-2 rounded-lg bg-slate-300">Home</Link>
          </div>
        </div>
      </Router>


    </div>
  );
}

export default App;
