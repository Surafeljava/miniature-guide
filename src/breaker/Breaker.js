import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';

function Breaker() {

    const WINDOW_WIDTH = 1000;
    const WINDOW_HEIGHT = 600;
    const BALLSIZE = 15;
    const BOXSIZE = 40;
    const PADDLE_WIDTH = 150;
    const BOX_NUMBERS = 100;

    const [ballPosition, setBallPosition] = useState({x: 0, y: 0});
    const [ballVelocity, setBallVelocity] = useState({x: 6, y: 6});
    // eslint-disable-next-line
    const [ballAcceleration, setBallAcceleration] = useState({x: 0, y: 0});

    const [pauseVelocity, setPauseVelocity] = useState({x:0, y:0});
    const [paused, setPaused] = useState(false);

    // const [ballSize, setBallSize] = useState(20);

    const [prevPositions, setPrevPositions] = useState([]);

    const [blocks, setBlocks] = useState([]);

    const [paddlePosition, setPaddlePosition] = useState({x: 0, y: 0});

    const handleGamePausePlay = () => {
        if(paused){
            setPaused(false);
            setBallVelocity({...pauseVelocity});
        }else{
            setPaused(true);
            setPauseVelocity({...ballVelocity});
            setBallVelocity({x:0, y:0});
        }
    }

    const movePaddleOnArrowKeys = () => {
        window.addEventListener('keydown', (e) => {
            if(e.key === 'ArrowLeft') {
                setPaddlePosition((pos) => {
                    const new_pos = {x: pos.x - 20, y: pos.y}
                    if(new_pos.x <= 0) new_pos.x = 0;
                    return new_pos;
                });
            }

            if(e.key === 'ArrowRight') {
                setPaddlePosition((pos) => {
                    const new_pos = {x: pos.x + 20, y: pos.y}
                    if(new_pos.x >= (WINDOW_WIDTH-150)) new_pos.x = (WINDOW_WIDTH-150);
                    return new_pos;
                });
            }
        })
    }


    useEffect(() => {
        movePaddleOnArrowKeys();
        // eslint-disable-next-line
    }, [])


    const generateRandomBlocks = () => {
        const blocks = [];
        const half_height = WINDOW_HEIGHT/2;
        while(blocks.length <= BOX_NUMBERS) {
            const x = Math.floor(Math.random() * (WINDOW_WIDTH/BOXSIZE)) * BOXSIZE; // 1000 / 50 = 20
            const y = Math.floor(Math.random() * (half_height/BOXSIZE) + (half_height/BOXSIZE)) * BOXSIZE; // Generates a number between 300 (6*50) and 600 (12*50)
            if(blocks.some(block => block.x === x && block.y === y)) continue;
            const backgroundColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
            blocks.push({x, y, backgroundColor});
        }
        setBlocks(blocks);
    }

    useEffect(() => {
        generateRandomBlocks();
        // eslint-disable-next-line
    }, [])

    const checkCollisionAndUpdateVelocity = () => {
        blocks.forEach((block, index) => {
            // Check if the ball's current position intersects with any of the blocks
            if (
                ballPosition.x < block.x + BOXSIZE &&
                ballPosition.x + BALLSIZE > block.x &&
                ballPosition.y < block.y + BOXSIZE &&
                ballPosition.y + BALLSIZE > block.y
            ) {
                // Remove the block that was hit
                const newBlocks = [...blocks];
                newBlocks.splice(index, 1);
                setBlocks(newBlocks);

                const hitFromLeftOrRight = ballPosition.x + BALLSIZE / 2 === block.x || ballPosition.x + BALLSIZE / 2 === block.x + BOXSIZE;
                // const hitFromTopOrBottom = ballPosition.y + BALLSIZE / 2 === block.y || ballPosition.y + BALLSIZE / 2 === block.y + 50;

                // console.log(hitFromLeftOrRight, !hitFromLeftOrRight);

                // Update the ball's velocity to simulate a bounce
                setBallVelocity((vel) => {
                    // Determine the side of the block the ball hit

                    return {
                        x: hitFromLeftOrRight ? -vel.x : vel.x,
                        y: !hitFromLeftOrRight ? -vel.y : vel.y
                    };
                });
            }
        });
    };

    useEffect(() => {
        const collisionCheckInterval = setInterval(() => {
            checkCollisionAndUpdateVelocity();
        }, 1000 / 60);

        return () => clearInterval(collisionCheckInterval);
        // eslint-disable-next-line
    }, [ballPosition, blocks]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setBallVelocity((vel) => ({x: vel.x + ballAcceleration.x, y: vel.y + ballAcceleration.y}));
            if(ballPosition.x + ballVelocity.x < 0 || ballPosition.x + ballVelocity.x > (WINDOW_WIDTH - BALLSIZE)) {
                setBallVelocity((vel) => ({x: -vel.x, y: vel.y}));
            }
            if(ballPosition.y + ballVelocity.y < 0 || ballPosition.y + ballVelocity.y > (WINDOW_HEIGHT - BALLSIZE)) {
                setBallVelocity((vel) => ({x: vel.x, y: -vel.y}));
            }
            const x_pos = ballPosition.x + ballVelocity.x;
            const y_pos = ballPosition.y + ballVelocity.y;
            setPrevPositions([...prevPositions, {x: x_pos, y: y_pos}]);
            setBallPosition((ball) => ({x: x_pos, y: y_pos}));
        }, 1000 / 60);

        return () => clearInterval(intervalId);
        // eslint-disable-next-line
    }, [ballPosition, ballVelocity]);

    return (
        <div className='flex flex-col justify-center items-center h-screen w-full'>
            
            <div className='bg-slate-100 relative rounded-lg overflow-hidden' style={{width:WINDOW_WIDTH, height:WINDOW_HEIGHT}}>

                {blocks.map((block, index) => (
                    <div
                        key={index}
                        className="absolute"
                        style={{
                            left: `${block.x}px`,
                            bottom: `${block.y}px`,
                            backgroundColor: block.backgroundColor,
                            width:BOXSIZE,
                            height:BOXSIZE
                        }}
                    ></div>
                ))}

                <div className={`rounded-full bg-red-500 absolute z-20 border-2 border-red-700`} 
                style={{left: `${ballPosition.x}px`, bottom: `${ballPosition.y}px`, width: `${BALLSIZE}px`, height: `${BALLSIZE}px`}}></div>


                <div className='h-[10px] bg-slate-800 absolute rounded-full z-30' 
                style={{left: `${paddlePosition.x}px`, bottom: `${paddlePosition.y}px`, width:PADDLE_WIDTH}}></div>

                {paused && (
                    <div className='w-full h-full absolute top-0 left-0 bg-slate-500 z-40 bg-opacity-20 flex justify-center items-center'>
                        <div className='px-10 py-5 rounded-md bg-white'>
                            <p className='font-[400] uppercase tracking-wide text-xl'>Game Paused</p>
                        </div>
                    </div>
                )}
                
            </div>

            <div className='flex flex-row items-center justify-center' style={{width:WINDOW_WIDTH}}>
                <button onClick={handleGamePausePlay} className='px-8 py-2 bg-slate-200 mt-4 rounded-md uppercase tracking-wider'>
                    {paused ? 'Play' : 'Pause'}
                </button>
            </div>
        </div>
    );
}

export default Breaker;