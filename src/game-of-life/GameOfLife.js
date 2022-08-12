import { useState } from "react";
import produce from "immer";

const numRows = 10;
const numCols = 10;

function GameOfLife(){

    const [grid, setGrid] = useState((grid) => {
        const rows = [];

        for (let i = 0; i<numRows; i++) {
            rows.push(Array.from(Array(numCols), () => 0));
        }

        return rows;
        
    });

    return (
        <div className="w-60 flex flex-wrap">
            {grid.map((rows, i) => 
            rows.map((cols, k) => 
            <div id={`${i}-${k}`} 
            onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                    gridCopy[i][k] = 1;
                });

                setGrid(newGrid);

                // 
            }}
            className={`w-6 h-6 ${grid[i][k] === 1 ? "bg-red-400" : "bg-red-200"} border border-white`}></div>))}
        </div>
    );
}

export default GameOfLife;