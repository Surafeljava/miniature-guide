import { useEffect, useState } from "react";
import produce from "immer";

const numRows = 30;
const numCols = 30;
const snakeSize = 20;

// const bgColors = {
//     0: 'bg-slate-200',
//     1: 'bg-red-300'
// }

const directionOperators = {
    'up':[-1,0],
    'left':[0,-1],
    'down':[1,0],
    'right':[0,1],
    'stop':[0,0]
}

function SnakeGame() {
    // const boxRef = useRef(null);    

    const [direction, setDirection] = useState('stop');

    const [pause, setPause] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const [grid, setGrid] = useState(gr => {
        const rows = [];
        for(let i=0; i<numRows; i++){
            rows.push(Array.from(Array(numCols), () => 0));
        }
        return rows;
    });

    const createNewSnake = () => {
        setSnake(sn => {
            const r = Math.round(Math.random()*(numRows-1));
            const c = Math.round(Math.random()*(numCols-1));
            const newSnake = [];

            newSnake.push({
                row: r,
                col: c
            });

            newSnake.push({
                row: r,
                col: c-1
            });

            return newSnake;
        });
    }

    const [snake, setSnake] = useState((sn) => {
        const r = Math.round(Math.random()*(numRows-1));
        const c = Math.round(Math.random()*(numCols-1));
        const newSnake = [];

        newSnake.push({
            row: r,
            col: c
        });

        newSnake.push({
            row: r,
            col: c-1
        });

        return newSnake;

    });

    const addNewFood = () => {
        const r = Math.round(Math.random()*(numRows-1));
        const c = Math.round(Math.random()*(numCols-1));
        const newFood = {
            row: r,
            col: c
        };

        setFood(newFood);
    }

    const [food, setFood] = useState((fd) => {
        const r = Math.round(Math.random()*(numRows-1));
        const c = Math.round(Math.random()*(numCols-1));
        const newFood = {
            row: r,
            col: c
        };

        return newFood;
    });

    const moveSnake = () => {
        setSnake(sn => produce(sn, snakeCopy => {
            for(let i=0; i<sn.length; i++){
                const dr = directionOperators[direction];
                if(i===sn.length-1){
                    let nRow = sn[i].row + dr[0];
                    let nCol = sn[i].col + dr[1];

                    if(nRow>numRows-1){
                        nRow=0;
                    }else if(nRow<0){
                        nRow=numRows-1;
                    }

                    if(nCol>numCols-1){
                        nCol=0;
                    }else if(nCol<0){
                        nCol=numCols-1;
                    }

                    snakeCopy[i] = {row: nRow, col: nCol};
                }else{
                    if((dr[0]+dr[1]) !== 0){
                        snakeCopy[i] = snakeCopy[i+1];
                    }
                }
                
                
            }
        }));

        setSnake(sn => {
            const first = sn[0];
            const snakeHead = sn[sn.length-1];
            
            if(snakeHead.row === food.row && snakeHead.col === food.col){
                //Add new tail for the snake
                sn = [first, ...sn];
            }

            return sn;
        });
    }

    useEffect(() => {
        const snakeHead = snake[snake.length-1];

        if(snakeHead.row === food.row && snakeHead.col === food.col){
            addNewFood();
            setScore(sc => sc + 1);
        }

        //Check if collide to own body
        setGameOver(gmv => {
            for(let m=0; m<snake.length-1; m++){
                // console.log(snake[m]);
                if(snakeHead.row===snake[m].row && snakeHead.col===snake[m].col){
                    gmv = true;
                    setPause(true);
                    // console.log("Game over");
                }
            }

            return gmv;
        });



    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[snake]);

    useEffect(() => {
        const interval = setInterval(() => {
            if(!pause){
                moveSnake();
            }
        }, 200);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [direction, pause]);


    const keyPressedHandler = (event) => {

        if(event.key === 'ArrowLeft'){
            if(direction!=='right'){
                setDirection('left');
            }
        }

        if(event.key === 'ArrowRight'){
            if(direction!=='left'){
                setDirection('right');
            }
        }

        if(event.key === 'ArrowDown'){
            if(direction!=='up'){
                setDirection('down');
            }
        }

        if(event.key === 'ArrowUp'){
            if(direction!=='down'){
                setDirection('up');
            }
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
        <div className="relative w-full min-h-screen flex flex-col gap-4 justify-center items-center">

            <div className="flex flex-col justify-center items-center rounded-xl bg-red-100 px-10 py-2 gap-1">
                <div className="text-slate-800 text-2xl font-bold">
                    {score}
                </div>
                <div className="text-slate-600 text-lg">
                    score
                </div>
            </div>

            {gameOver && (
                <div className="absolute px-8 py-6 bg-white rounded-xl flex flex-col justify-center items-center gap-4">
                    <div className="text-red-400 text-2xl">
                        Game Over!
                    </div>
                    <button onClick={() => {
                        // console.log('Restarting');
                        createNewSnake();
                        addNewFood();
                        setPause(false);
                        setGameOver(false);
                        setDirection('stop');
                    }} className="px-4 py-2 rounded-md bg-red-200">
                        Restart
                    </button>
                </div>
            )}

            <div className="gap-0.5 rounded-sm" style={{display: 'grid', gridTemplateColumns: `repeat(${numCols}, ${snakeSize}px)`}}>
                {grid.map((row, i) => 
                    row.map((col, k) => {
                        const filteredSnake = snake.filter((sn) => (sn.row===i && sn.col===k));
                        if(filteredSnake.length>0){
                            return <div key={`r:${i}-c:${k}`} className={`bg-red-300 rounded-sm`} style={{width: snakeSize, height: snakeSize}}></div>
                        }else{
                            if(food.row===i && food.col===k){
                                return <div key={`r:${i}-c:${k}`} className={`bg-green-300 rounded-sm`} style={{width: snakeSize, height: snakeSize}}></div>
                            }else{
                                return <div key={`r:${i}-c:${k}`} className={`bg-slate-100 rounded-sm`} style={{width: snakeSize, height: snakeSize}}></div>
                            }
                        }
                    })
                )}
            </div>

            {!gameOver && (
                <div className="flex gap-4">
                    <button onClick={() => setPause(!pause)} className="px-4 py-2 rounded-md bg-red-200">
                        {pause ? 'Resume' : 'Pause'}
                    </button>

                    <button onClick={() => {
                        setGrid(gr => {
                            const rows = [];
                            for(let i=0; i<numRows; i++){
                                rows.push(Array.from(Array(numCols), () => 0));
                            }
                            return rows;
                        })
                        createNewSnake();
                        addNewFood();
                        setPause(false);
                        setGameOver(false);
                        setDirection('stop');
                    }} className="px-4 py-2 rounded-md bg-slate-200">
                        Restart
                    </button>
                </div>
            )}
        </div>
    );
}

export default SnakeGame;