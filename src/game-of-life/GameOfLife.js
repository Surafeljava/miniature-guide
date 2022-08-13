import { useState, useRef, useCallback } from "react";
import produce from "immer";

const numRows = 70;
const numCols = 70;

const operations = [
    [0,1],
    [0,-1],
    [1,0],
    [-1,0],
    [-1,1],
    [-1,-1],
    [1,1],
    [1,-1]
]

function GameOfLife(){

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

    const [running, setRunning] = useState(false);

    const runningRef = useRef(running);
    runningRef.current = running;

    const runSimulation = useCallback(() => {
        if(!runningRef.current){
            return;
        }
        //Simulate here

        setGrid((g) => {
            return produce(g, gridCopy => {
                for (let i=0; i<numRows; i++){
                    for (let k=0; k<numCols; k++){
                        let neighbors = 0;

                        operations.forEach(([x,y]) => {
                            const newI = i + x;
                            const newK = k + y;
                            if(newI>=0 && newI<numRows && newK>=0 && newK<numCols){
                                neighbors += g[newI][newK];
                            }
                        });

                        if (neighbors < 2 || neighbors > 3){
                            gridCopy[i][k] = 0;
                        }else if(g[i][k]===0 && neighbors===3){
                            gridCopy[i][k] = 1;
                        }

                    }
                }
            })
        })

        setTimeout(runSimulation, 100);
    }, []);
    

    return (
        <div className="flex flex-col gap-4">
            <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${numCols}, 10px)`
            }}>
                {grid.map((rows, i) => 
                rows.map((cols, k) => 
                <div id={`${i}-${k}`} 
                onClick={() => {
                    const newGrid = produce(grid, gridCopy => {
                        gridCopy[i][k] = grid[i][k]===0 ? 1 : 0;
                    });

                    setGrid(newGrid);

                    // 
                }}
                style={{width:"10px", height: "10px"}}
                className={`${grid[i][k] === 1 ? "bg-red-400" : "bg-red-200"} border border-white`}></div>))}
            </div>
            <div className="flex justify-center gap-6">
                <button onClick={() => {
                    setRunning(!running);
                    if(!running){
                        runningRef.current = true;
                        runSimulation();
                    }
                }} className="px-4 py-2 rounded-lg bg-red-300">
                    {running ? "Stop" : "Start"}
                </button>

                <button onClick={() => {
                    const rows = generateNewGrid();
                    setGrid(rows);
                }} className="px-4 py-2 rounded-lg bg-slate-300">
                    Clean
                </button>

                <button onClick={() => {
                    const rows = [];

                    for (let i = 0; i<numRows; i++) {
                        rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
                    }

                    setGrid(rows);

                }} className="px-4 py-2 rounded-lg bg-slate-300">
                    Randomize
                </button>
            </div>
        </div>
    );
}

export default GameOfLife;