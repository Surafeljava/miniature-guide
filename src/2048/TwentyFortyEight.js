import { useEffect, useState } from "react";

const numRows = 4;
const numCols = 4;
const gridSize = 60;

// const bgColors = [
//     'bg-red-200',
//     'bg-red-300',
//     'bg-red-400',
//     'bg-red-500',
// ]

function TwentyFortyEight() {

    const resetGrid = () => {
        const rows = [];

        const rn = Math.round(Math.random()*numRows);
        const cn = Math.round(Math.random()*numCols);

        for (let i = 0; i<numRows; i++) {
            const tempArr = [];
            for (let j = 0; j<numCols; j++){
                if(i===rn && j===cn){
                    tempArr.push(2);
                }else{
                    tempArr.push(0);
                }
            }
            rows.push(tempArr);
        }

        return rows
    }

    const [grid, setGrid] = useState(g => {
        const rows = resetGrid();
        return rows;
    });


    const keyPressedHandler = (event) => {
        console.log(event.key);
        //Move the grid here

    };


    useEffect(() => {
        //Listen to key stroke UP, DOWN, LEFT, RIGHT
        window.addEventListener("keydown", keyPressedHandler);

        return () => {
            window.removeEventListener("keydown", keyPressedHandler);
        };
    }, []);

    return (
        <div className="flex flex-col justify-center items-center gap-6">
            {/* <Input onKeyDown={ this.handleKeyDown }/> */}


            <div className="flex justify-center gap-10">
                <div className="flex flex-col items-center px-4 py-2 bg-slate-100 rounded-xl">
                    <div className="text-black font-bold text-xl">
                        256
                    </div>
                    <div className="text-slate-500 font-normal text-sm">
                    Current Score
                    </div>
                </div>

                <div className="flex flex-col items-center px-4 py-2 bg-red-100 rounded-xl">
                    <div className="text-black font-bold text-xl">
                        512
                    </div>
                    <div className="text-slate-700 font-normal text-sm">
                    High Score
                    </div>
                </div>
            </div>
            

            <div style={{display: "grid", gridTemplateColumns: `repeat(${numCols}, ${gridSize}px)`}} className="gap-2">
                {grid.map((row, i) => (
                    row.map((col, j) => (
                        <div id={`r${i}-c${j}`} className="bg-slate-300 hover:border hover:border-slate-700 duration-150 hover:cursor-pointer rounded-md flex justify-center items-center" 
                        style={{width: gridSize, height: gridSize}} > 
                            <div className="text-black font-medium text-lg">
                                {col}
                            </div>
                        </div>
                    ))
                ))}
            </div>

            <div className="flex justify-center gap-4">
                <button className="px-4 py-2 rounded-lg bg-red-200 hover:bg-red-300" 
                onClick={() => {
                    const rows = resetGrid();
                    setGrid(rows);
                }}>
                    Restart
                </button>
                {/* <button className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300" onClick={() => console.log("Cleaning")}>
                    Save Score
                </button> */}
            </div>
        </div>
    );
}

export default TwentyFortyEight;