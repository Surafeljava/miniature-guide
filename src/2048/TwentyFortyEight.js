import { useEffect, useState } from "react";
import produce from "immer";
import Cookies from "js-cookie";

const numRows = 4;
const numCols = 4;
const gridSize = 60;

const bgColors = {
    0: 'bg-slate-200',
    2: 'bg-red-200',
    4: 'bg-red-300',
    8: 'bg-red-400',
    16: 'bg-orange-200',
    32: 'bg-orange-200',
    64: 'bg-orange-300',
    128: 'bg-green-200',
    256: 'bg-green-300',
    512: 'bg-blue-200',
    1024: 'bg-blue-300',
    2048: 'bg-yellow-300',
    4096: 'bg-amber-400',

}

function TwentyFortyEight() {

    const [currentScore, setCurrentScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [newHighScore, setNewHighScore] = useState(false);

    const [previousGrid, setPreviousGrid] = useState(null);

    useEffect(() => {
        const score = Cookies.get('highscore');
        if(score === undefined){
            setHighScore(0);
        }else{
            setHighScore(score);
        }

        console.log(score);
    },[]);

    
    const resetGrid = () => {
        const rows = [];

        const rn = Math.round(Math.random()*(numRows-1));
        const cn = Math.round(Math.random()*(numCols-1));

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

    useEffect(() => {
        grid.forEach(row => {
            row.forEach(col => {
                if(col > currentScore){
                    setCurrentScore(col);
                }

                const sc = Cookies.get('highscore');
                if(sc !== undefined){
                    if(col > sc){
                        setHighScore(col);
                        Cookies.set('highscore', col);
                        setNewHighScore(true);
                    }
                }else{
                    if(col > currentScore){
                        setHighScore(col);
                        Cookies.set('highscore', col);
                        setNewHighScore(true);
                    }
                }

            });
        });
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[grid]);

    const addNewRandomNumber = () => {
        //Generate random number
        //Needs correction - check if the random number is zero, if not repeat
        
        setGrid(gr => produce(gr, gridCopy => {
            const allAvailable = [];

            for (let i=0; i<numRows; i++){
                for (let j=0; j<numCols; j++){
                    if(gridCopy[i][j]===0){
                        allAvailable.push({row:i, col:j});
                    }
                }
            }
            
            const r = Math.round(Math.random()*(allAvailable.length-1));
            const randomPos = allAvailable[r];

            const rn = Math.random();
            if(rn > 0.85){
                gridCopy[randomPos.row][randomPos.col] = 4;
            }else{
                gridCopy[randomPos.row][randomPos.col] = 2;
            }
        }));

    }

    // useEffect(() => {
    //     addNewRandomNumber();
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [grid]);


    const moveRight = () => {

        setGrid(gr => produce(gr, gridCopy => {
            gr.forEach((row,idx) => {
                var rNew = [];
                for (let k=row.length-1; k>=0; k--){
                    const col = row[k];
                    if(col > 0){
                        if(rNew.length>0){
                            const first = rNew[0];
                            if(first === col){
                                rNew[0] = first+col;
                                rNew = [0,...rNew];
                            }else{
                                rNew = [col, ...rNew];
                            }
                        }else{
                            rNew = [col, ...rNew];
                        }
                    }
                }

                rNew = rNew.filter(r => r>0);

                //Add zero at the end of the new list
                const rNew2 = [...Array.from(Array(numRows - rNew.length), () => 0), ...rNew];
                gridCopy[idx] = rNew2;
                
            });

            // setPreviousGrid(gr);

            addNewRandomNumber();
            

        }));
    }

    const moveLeft = () => {
        setGrid(gr => produce(gr, gridCopy => {
            gr.forEach((row,idx) => {
                var rNew = [];
                row.forEach(col => {
                    if(col > 0){
                        if(rNew.length>0){
                            const last = rNew[rNew.length-1];
                            if(last === col){
                                rNew[rNew.length-1] = last+col;
                                rNew.push(0);
                            }else{
                                rNew.push(col);
                            }
                        }else{
                            rNew.push(col);
                        }
                    }
                });

                rNew = rNew.filter(r => r>0);

                //Add zero at the end of the new list
                const rNew2 = [...rNew, ...Array.from(Array(numRows - rNew.length), () => 0)];
                gridCopy[idx] = rNew2;
            });

            

            addNewRandomNumber();

        }));
    }

    const transposeMatrix = () => {
        setGrid(gr => {
            const rows = [];

            for(let i=0; i<numCols; i++){
                const cols = [];
                for(let j=0; j<numRows; j++){
                    cols.push(gr[j][i]);
                }
                rows.push(cols);
            }

            return rows;
        });
    }

    const keyPressedHandler = (event) => {

        //Move left
        if(event.key === 'ArrowLeft'){
            setPreviousGrid(grid);
            moveLeft();
        }

        
        //Move Right
        if(event.key === 'ArrowRight'){
            setPreviousGrid(grid);
            moveRight();
        }

        //Move Down
        if(event.key === 'ArrowDown'){
            setPreviousGrid(grid);
            transposeMatrix();
            moveRight();
            transposeMatrix();
        }

        //Move Up
        if(event.key === 'ArrowUp'){
            setPreviousGrid(grid);
            transposeMatrix();
            moveLeft();
            transposeMatrix();
        }

    };


    useEffect(() => {
        //Listen to key stroke UP, DOWN, LEFT, RIGHT
        window.addEventListener("keydown", keyPressedHandler);

        return () => {
            window.removeEventListener("keydown", keyPressedHandler);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col justify-center items-center gap-6">
            {/* <Input onKeyDown={ this.handleKeyDown }/> */}

            <div className="flex flex-col gap-2">
                {(currentScore===2048) && (
                    <div className="flex justify-center text-2xl text-red-500">
                        You Won!
                    </div>
                )}

                {newHighScore && (
                    <div className="flex justify-center text-lg text-slate-500">
                        New High Score!
                    </div>
                )}
            </div>

            <div className="flex justify-center gap-10">
                <div className={`flex flex-col items-center px-4 py-2 ${bgColors[currentScore]} rounded-xl`}>
                    <div className="text-black font-bold text-2xl">
                        {currentScore}
                    </div>
                    <div className="text-black font-normal text-sm">
                    Current Score
                    </div>
                </div>

                <div className={`flex flex-col items-center px-4 py-2 ${bgColors[highScore]} rounded-xl`}>
                    <div className="text-black font-bold text-2xl">
                        {highScore}
                    </div>
                    <div className="text-black font-normal text-sm">
                    High Score
                    </div>
                </div>
            </div>
            

            <div style={{display: "grid", gridTemplateColumns: `repeat(${numCols}, ${gridSize}px)`}} className="gap-2">
                {grid.map((row, i) => (
                    row.map((col, j) => {
                        const bgcolor = bgColors[col];
                        return (
                            <div id={`r${i}-c${j}`} className={`${bgcolor} hover:border hover:border-slate-700 duration-150 hover:cursor-pointer rounded-md flex justify-center items-center`} 
                            style={{width: gridSize, height: gridSize}} > 
                                <div className="text-black font-medium text-lg">
                                    {col}
                                </div>
                            </div>
                        )
                    })
                ))}
            </div>

            <div className="flex justify-center gap-4">
                <button className="px-4 py-2 rounded-lg bg-red-200 hover:bg-red-300" 
                onClick={() => {
                    const rows = resetGrid();
                    setGrid(rows);
                    setCurrentScore(0);
                    setNewHighScore(false);
                }}>
                    Restart
                </button>
                {previousGrid!==null && (
                    <button className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300" 
                    onClick={() => {
                        setGrid(previousGrid);
                    }}>
                        Undo
                    </button>
                )}
            </div>
        </div>
    );
}

export default TwentyFortyEight;