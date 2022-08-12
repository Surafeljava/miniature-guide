import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import GameOfLife from "./game-of-life/GameOfLife";

function App() {
  return (
    <div className="flex w-full min-h-screen justify-center items-center">

      <Router>
        <div>
          <Routes>
            <Route path="/" element={<div> Home </div>}/>
            <Route path="/game" element={<GameOfLife/>}/>
          </Routes>

          <div className="w-full fixed top-6 left-0 flex justify-center gap-4 px-4">
            <Link to="/" className="px-4 py-2 rounded-lg bg-slate-300">Home</Link>
            <Link to="/game" className="px-4 py-2 rounded-lg bg-slate-300">Game</Link>
          </div>
        </div>
      </Router>


    </div>
  );
}

export default App;
