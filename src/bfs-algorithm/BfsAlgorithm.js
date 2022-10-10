import { useState } from "react";
import produce from "immer";

const numRows = 60;
const numCols = 60;

// const operations = [
//     [0,1],
//     [0,-1],
//     [1,0],
//     [-1,0],
//     [-1,1],
//     [-1,-1],
//     [1,1],
//     [1,-1]
// ]

function BfsAlgorithm() {
    const generateNewGrid = () => {
        const rows = [];

        for (let i = 0; i<numRows; i++) {
            rows.push(Array.from(Array(numCols), () => 0));
        }

        return rows;
    }

    const [grid, setGrid] = useState((grid) => {
        const rows = generateNewGrid();
        return rows;
    });

    // const [visitedGrid, setVisitedGrid] = useState(grid);

    // const bfs = () => {
    //     let q = [];

    // }+

    return (
        <div className="flex flex-col gap-4">
            <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${numCols}, 12px)`
            }}>
                {grid.map((rows, i) => 
                rows.map((cols, k) => 
                <div key={`${i}-${k}`} 
                onClick={() => {
                    const generatedGrid = generateNewGrid();
                    const newGrid = produce(generatedGrid, gridCopy => {
                        gridCopy[i][k] = grid[i][k]===0 ? 1 : 0;
                    });
                    setGrid(newGrid);
                }}
                style={{width:"12px", height: "12px"}}
                className={`${grid[i][k] === 1 ? "bg-blue-600" : "bg-blue-100"} border border-white`}></div>))}
            </div>
        </div>
    );
}

export default BfsAlgorithm;