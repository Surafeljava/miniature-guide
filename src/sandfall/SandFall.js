import React, {useEffect, useState} from 'react';
import produce from "immer";

const numRows = 70;
const numCols = 70;

function SandFall() {
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


    useEffect(() => {
        const runSimulation = () => {
            setGrid((g) => {
                return produce(g, gridCopy => {
                    for (let i=0; i<numRows; i++){
                        for (let k=0; k<numCols; k++){

                            if(gridCopy[i][k] === 1 && i<numRows-1){
                                if(gridCopy[i+1][k]===0){
                                    gridCopy[i+1][k] = 1;
                                    gridCopy[i][k] = 0;
                                }
                            }
                        }
                    }
                })
            })
        }

        const timeout_id = setInterval(runSimulation, 100);

        return () => clearTimeout(timeout_id);
    }, [])


    return (
        <div className="flex flex-col gap-4">
            <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${numCols}, 10px)`
            }}>
                {grid.map((rows, i) => 
                rows.map((cols, k) => 
                <div key={`${i}-${k}`} 
                
                style={{width:"10px", height: "10px"}}
                onMouseOver={() => {
                    const newGrid = produce(grid, gridCopy => {
                        gridCopy[i][k] = grid[i][k]===0 ? 1 : 0;
                    });

                    setGrid(newGrid);
                }}
                className={`${grid[i][k] === 1 ? "bg-red-400" : "bg-red-100"}`}></div>))}
            </div>
        </div>
    );
}

export default SandFall;